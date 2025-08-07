import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Project, ProjectDocument } from "./project.schema";
import { ProjectKanbanService } from "../project-kanban/project_kanban.service";
import { UserService } from "src/user/user.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CreateProjectDto, UpdateProjectDto } from "./project.dto";
import { log } from "console";

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private readonly kanbanService: ProjectKanbanService,
    private eventEmitter: EventEmitter2,
    private readonly userservices: UserService
  ) {}
  private sanitizeObjectIds(payload: any) {
    const keysToSanitize = [
      "team_leader",
      "project_manager",
      "project_coordinator",
      "created_by",
      "updated_by",
    ];
    keysToSanitize.forEach((key) => {
      if (payload[key] === "") {
        payload[key] = undefined;
      }
    });
    return payload;
  }

  private async generateUniqueCode(baseCode: string): Promise<string> {
    let code = baseCode;
    let counter = 0;

    while (await this.projectModel.exists({ code })) {
      counter++;
      code = `${baseCode}${counter}`;
    }

    return code;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const sanitized = this.sanitizeObjectIds(createProjectDto);
      const projectName = createProjectDto.title || "";
      const baseCode = projectName
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .substring(0, 3);

      const uniqueCode = await this.generateUniqueCode(baseCode);
      sanitized.code = uniqueCode;
      const createdProject = new this.projectModel(sanitized);
      const savedProject = await createdProject.save();
      // const savedProject = await createdProject.save();
      if (createProjectDto.users && createProjectDto.users.length > 0) {
        this.eventEmitter.emit("project.assigned", {
          projectObj: savedProject,
        });
      }
      await this.kanbanService.createDefaults(savedProject._id.toString());
      return savedProject;
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.code) {
        throw new ConflictException("Project code must be unique.");
      }
      throw new error();
    }
  }
  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).lean();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return project;
  }

  async findByCode(code: string): Promise<Project> {
    const project = await this.projectModel.findOne({ code }).exec();
    if (!project) {
      throw new NotFoundException(`Project with code ${code} not found.`);
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto
  ): Promise<Project> {
    const sanitized = this.sanitizeObjectIds(updateProjectDto);
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, sanitized, { new: true })
      .exec();
    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    if (updateProjectDto.users && updateProjectDto.users.length > 0) {
      this.eventEmitter.emit("project.assigned", {
        projectObj: updatedProject,
      });
    }
    return updatedProject;
  }

  async remove(id: string): Promise<boolean> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    await this.projectModel.findByIdAndDelete(id).exec();
    return true;
  }
  async findActiveProjects(): Promise<Project[]> {
    return this.projectModel.find({ is_active: true }).exec();
  }
  async addUser(projectId: string, userId: string): Promise<Project> {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(
        projectId,
        { $addToSet: { users: userId } }, // Avoid duplicates
        { new: true }
      )
      .exec();

    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    return updatedProject;
  }

  async removeUser(projectId: string, userId: string): Promise<Project> {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(projectId, { $pull: { users: userId } }, { new: true })
      .exec();

    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    return updatedProject;
  }

  async getAssignedUsers(projectId: string): Promise<Project> {
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }
    return project;
  }

  async findProjectsByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ data: Project[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.projectModel
        .find({ users: userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.projectModel.countDocuments({ users: userId }),
    ]);
    return {
      data,
      page,
      limit,
      total,
    };
  }

  async findAllPaginated(
    page: number,
    limit: number,
    keyword?: string,
    sortOrder: "asc" | "desc" = "asc"
  ): Promise<{
    data: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let safePage = Math.max(Number(page) || 1, 1);
    let safeLimit = Math.max(Number(limit) || 10, 1);
    const MAX_LIMIT = 200;
    if (safeLimit > MAX_LIMIT) safeLimit = MAX_LIMIT;

    const filter: Record<string, any> = {};
    if (keyword && keyword.trim()) {
      filter.$or = [
        { title: { $regex: keyword.trim(), $options: "i" } },
        { code: { $regex: keyword.trim(), $options: "i" } },
      ];
    }

    const total = await this.projectModel.countDocuments(filter).exec();
    const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);

    if (totalPages > 0 && safePage > totalPages) {
      safePage = totalPages;
    }

    const skip = (safePage - 1) * safeLimit;

    const data = await this.projectModel
      .find(filter)
      .sort({ createdAt: sortOrder === "desc" ? 1 : -1 })
      .skip(skip)
      .limit(safeLimit)
      .exec();

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  }

  async updateProjectAvatar(
    projectId: string,
    imageUrl: string
  ): Promise<ProjectDocument | null> {
    const updated = await this.projectModel.findByIdAndUpdate(
      projectId,
      { avatar: imageUrl },
      { new: true }
    );
    return updated;
  }
  async search(keyword: string, userId: string) {
    const regex = new RegExp(keyword, "i");
    const filters: any = {
      $and: [
        { users: userId }, 
        {
          $or: [
            { code: { $regex: regex } },
            { title: { $regex: regex } },
            { description: { $regex: regex } },
          ],
        },
      ],
    };
    return this.projectModel
      .find(filters)
      .sort({ createdAt: -1, updatedAt: -1 }) 
      .exec();
  }

  async findProjectUsers(projectId: string, keyword?: string): Promise<Project> {
    const project = await this.projectModel
      .findById(projectId)
       .populate({
      path: "users",
      select: "firstName lastName email",
      match: keyword
        ? {
            $or: [
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { email: { $regex: keyword, $options: "i" } },
            ],
          }
        : undefined,
    })
      .exec();

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return {
      _id: project._id,
    users: project.users,
    } as any;
  }
}
