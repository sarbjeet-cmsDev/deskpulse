import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) { }

  
  async create(createProjectDto: Partial<Project>): Promise<Project> {
    try {
      const createdProject = new this.projectModel(createProjectDto);
      return await createdProject.save();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.code) {
        throw new ConflictException('Project code must be unique.');
      }
      throw new InternalServerErrorException('Failed to create project.');
    }
  }


  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).exec();
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

  async update(id: string, updateProjectDto: Partial<Project>): Promise<Project> {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .exec();
    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }

    return updatedProject;
  }
  async remove(id: string): Promise<Project> {
    return this.projectModel.findByIdAndDelete(id).exec();
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
      .findByIdAndUpdate(
        projectId,
        { $pull: { users: userId } },
        { new: true }
      )
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


  async findProjectsByUserId(userId: string): Promise<Project[]> {
    return this.projectModel.find({ users: userId }).exec();
  }

  async findAllPaginated(
  page: number,
  limit: number,
  keyword?: string,
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<{ data: Project[]; total: number }> {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { code: { $regex: keyword, $options: 'i' } },
    ];
  }

  const [projects, total] = await Promise.all([
    this.projectModel
      .find(query)
      .sort({ createdAt: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    this.projectModel.countDocuments(query),
  ]);

  return {
    data: projects,
    total,
  };
}

}
