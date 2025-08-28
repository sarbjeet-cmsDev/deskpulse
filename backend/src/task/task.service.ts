import { forwardRef, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Task, TaskStatusEnum } from "./task.interface";
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusUpdateDto,
} from "./task.dto";
import { ProjectService } from "../project/project.service";
import { validateProjectId } from "./task.helpers";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UserService } from "src/user/user.service";
import { log } from "node:console";
// import { Task } from 'src/task/task.schema';
// import { Project } from 'src/project/project.schema';
// import { User } from 'src/user/user.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel("Task") private readonly taskModel: Model<Task>,
    @Inject(forwardRef(() => ProjectService))

    private readonly projectService: ProjectService,   // <-- index [1]
    private readonly userservices: UserService,
    private eventEmitter: EventEmitter2
  ) { }
  async create(createTaskDto: CreateTaskDto): Promise<Task> {


    const { code: projectCode } = await this.projectService.findOne(
      createTaskDto.project.toString()
    );
    // if (createTaskDto.estimated_time) {
    //   createTaskDto.estimated_time = Number(createTaskDto.estimated_time) * 60;
    // }
    const tasks = await this.taskModel.find({
      code: new RegExp(`^${projectCode}-\\d{2,}$`),
    });
    const max = Math.max(
      0,
      ...tasks.map((t) => parseInt(t.code.split("-")[1]) || 0)
    );
    createTaskDto.code = `${projectCode}-${String(max + 1).padStart(2, "0")}`;

    const status = createTaskDto.status ?? TaskStatusEnum.BACKLOG;
    const maxSortTask = await this.taskModel
      .findOne({
        project: createTaskDto.project,
        status: status,
      })
      .sort({ sort_order: -1 })
      .select("sort_order")
      .lean();

    const newSortOrder = maxSortTask?.sort_order ?? -1;
    createTaskDto.sort_order = newSortOrder + 1;

    const createdTask = new this.taskModel(createTaskDto);
    this.eventEmitter.emit("task.created", { taskObj: createdTask });
    if (createTaskDto.assigned_to) {
      this.eventEmitter.emit("task.assigned", { taskObj: createdTask });
    }

    return createdTask.save();
  }

  async findAll(
    page: number,
    limit: number,
    keyword?: string,
    sortOrder: "asc" | "desc" = "asc"
  ): Promise<{ data: Task[]; total: number; page: number; limit: number; totalPages: number; }> {
    let safePage = Math.max(Number(page) || 1, 1);
    let safeLimit = Math.max(Number(limit) || 10, 1);
    const MAX_LIMIT = 200;
    if (safeLimit > MAX_LIMIT) safeLimit = MAX_LIMIT;


    const filter: Record<string, any> = {};
    if (keyword && keyword.trim()) {
      filter.$or = [
        { title: { $regex: keyword.trim(), $options: 'i' } },
        { code: { $regex: keyword.trim(), $options: 'i' } },
      ];
    }


    const total = await this.taskModel.countDocuments(filter).exec();
    const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);


    if (totalPages > 0 && safePage > totalPages) {
      safePage = totalPages;
    }

    const skip = (safePage - 1) * safeLimit;

    const data = await this.taskModel
      .find(filter)
      .sort({ createdAt: sortOrder === 'desc' ? 1 : -1 })
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



  async FetchDueTask(user_id: string): Promise<Task[]> {
    const endOfDay = new Date().setHours(23, 59, 59, 999);
    return this.taskModel
      .find({
        assigned_to: user_id,
        due_date: { $lte: new Date(endOfDay) },
      })
      .exec();
  }

  async fetchTasksByUserAndProjectIds(
    userIds: string[],
    projectId: string
  ): Promise<Task[]> {
    const filter: Record<string, any> = {
      isArchived: false,
      project: projectId,
    };

    if (userIds?.length) {
      filter.assigned_to = { $in: userIds };
    }

    return this.taskModel
      .find(filter)
      .populate('assigned_to')
      .sort({ sort_order: 1 }); // ascending order for kanban
  }


  async findByAssignedToUser(
    userIds: string[],
    page: number,
    limit: number,
    start?: string,
    end?: string
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { assigned_to: { $in: userIds }, isArchived: false };

    // ✅ Date Range Filter
    if (start && end) {
      filter.createdAt = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const [data, total] = await Promise.all([
      this.taskModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate('project')
        .populate('assigned_to')
        // .sort({ sort_order: -1 })
        .sort({ createdAt: -1 })

        .exec(),
      this.taskModel.countDocuments(filter),
    ]);

    return {
      data,
      page,
      limit,
      total,
    };
  }


  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    return task;
  }

  async findByProject(
    projectId: string,
    page: number,
    limit: number
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    await validateProjectId(this.projectService, projectId.toString());
    const [data, total] = await Promise.all([
      this.taskModel
        .find({ project: projectId, isArchived: false })
        .sort({ sort_order: -1 })
        .skip(skip)
        .populate('assigned_to')
        .limit(limit)
        .exec(),
      this.taskModel.countDocuments({ project: projectId }),
    ]);
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findByAssignedUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.taskModel
        .find({ assigned_to: userId, isArchived: false })
        .skip(skip)
        .limit(limit)
        .sort({ sort_order: -1 })
        .populate('assigned_to')
        .exec(),
      this.taskModel.countDocuments({ assigned_to: userId }),
    ]);
    return {
      data,
      page,
      limit,
      total,
    };
  }


  async findByCode(code: string): Promise<Task> {
    const project = await this.taskModel.findOne({ code }).exec();
    if (!project) {
      throw new NotFoundException(`Project with code ${code} not found.`);
    }
    return project;
  }

  async findByReportToUser(userId: string): Promise<Task[]> {
    return this.taskModel.find({ report_to: userId }).exec();
  }



  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    if (updateTaskDto.project) {
      await validateProjectId(
        this.projectService,
        updateTaskDto.project.toString()
      );
    }
    const task = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    if (updateTaskDto.assigned_to) {
      this.eventEmitter.emit("task.assigned", {
        taskObj: task,
      });
    }
    return task;
  }

  async remove(id: string): Promise<Task> {
    const task = await this.taskModel.findByIdAndDelete(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    return task;
  }

  async updateTaskStatus(
    id: string,
    updateTaskDto: UpdateTaskStatusUpdateDto,
  ): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    const oldTaskStatus = task.status;
    const newTaskStatus = updateTaskDto.status;

    let revisionIncrement = 0;
    if (newTaskStatus == "done") {
      revisionIncrement = 1;
    }

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id,
        {
          ...updateTaskDto,
          ...(revisionIncrement > 0 && { rivision: task.rivision + revisionIncrement })
        },
        { new: true })
      .exec();
    if (newTaskStatus == "done") {
      this.eventEmitter.emit("task.status.updated", {
        taskObj: updatedTask,
        oldTaskStatus: oldTaskStatus,
        updatedBy: updateTaskDto.updated_by,
      });
    }
    return updatedTask;
  }

  async incrementTimeSpent(taskId: string, timeSpent: number): Promise<void> {
    await this.taskModel.findByIdAndUpdate(taskId, {
      $inc: { total_timespent: timeSpent },
    });
  }

  async search(keyword: string, projectsList: any) {
    const regex = new RegExp(keyword, "i");
    const projectIds = projectsList.map(project => project._id);

    const filters: any = {
      $and: [
        { project: { $in: projectIds } },
        {
          $or: [
            { code: { $regex: regex } },
            { title: { $regex: regex } },
            { description: { $regex: regex } },
          ],
        },
      ],
    };

    return this.taskModel
      .find(filters)
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(10)
      .exec();
  }

  async reorderTasks(tasks: { _id: string; sort_order: number }[]) {
    for (const task of tasks) {
      await this.taskModel.findByIdAndUpdate(task._id, {
        sort_order: task.sort_order,
      });
    }
    return { message: "Tasks reordered successfully" };
  }



  // async getTaskDetails(
  //   page: number,
  //   limit: number,
  //   keyword?: string,
  //   sortOrder: "asc" | "desc" = "asc",
  //   start?: string,
  //   end?: string
  // ): Promise<{
  //   data: Task[];
  //   total: number;
  //   page: number;
  //   limit: number;
  //   totalPages: number;
  // }> {
  //   let safePage = Math.max(Number(page) || 1, 1);
  //   let safeLimit = Math.max(Number(limit) || 10, 1);
  //   const MAX_LIMIT = 200;
  //   if (safeLimit > MAX_LIMIT) safeLimit = MAX_LIMIT;

  //   const filter: Record<string, any> = {};
  //   filter.isArchived = false;

  //   if (keyword && keyword.trim()) {
  //     filter.$or = [
  //       { title: { $regex: keyword.trim(), $options: 'i' } },
  //       { code: { $regex: keyword.trim(), $options: 'i' } },

  //     ];
  //   }

  //   // ✅ Date Range Filter
  //   if (start && end) {
  //     filter.createdAt = {
  //       $gte: new Date(start),
  //       $lte: new Date(end),
  //     };
  //   }

  //   const total = await this.taskModel.countDocuments(filter).exec();
  //   const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);
  //   if (totalPages > 0 && safePage > totalPages) safePage = totalPages;

  //   const skip = (safePage - 1) * safeLimit;

  //   const data = await this.taskModel
  //     .find(filter)
  //     .sort({ createdAt: sortOrder === 'desc' ? 1 : -1 })
  //     // .sort({ sortOrder: -1 })
  //     .skip(skip)
  //     .limit(safeLimit)
  //     .populate('project')
  //     .populate('assigned_to')
  //     .exec();

  //   return {
  //     data,
  //     total,
  //     page: safePage,
  //     limit: safeLimit,
  //     totalPages,
  //   };
  // }

  async getTaskDetails(
    page: number,
    limit: number,
    keyword?: string,
    sortOrder: "asc" | "desc" = "asc",
    start?: string,
    end?: string
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let safePage = Math.max(Number(page) || 1, 1);
    let safeLimit = Math.max(Number(limit) || 10, 1);
    const MAX_LIMIT = 200;
    if (safeLimit > MAX_LIMIT) safeLimit = MAX_LIMIT;

    const filter: Record<string, any> = { isArchived: false };

    if (keyword && keyword.trim()) {
      filter.$or = [
        { title: { $regex: keyword.trim(), $options: 'i' } },
        { code: { $regex: keyword.trim(), $options: 'i' } },
      ];
    }

    if (start && end) {
      filter.createdAt = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    // Build aggregation pipeline
    const pipeline: any[] = [
      { $match: filter },

      // sort
      { $sort: { createdAt: sortOrder === "desc" ? -1 : 1 } },

      // pagination
      { $skip: (safePage - 1) * safeLimit },
      { $limit: safeLimit },

      // join project
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },

      // join assigned_to user
      {
        $lookup: {
          from: "users",
          localField: "assigned_to",
          foreignField: "_id",
          as: "assigned_to",
        },
      },
      { $unwind: { path: "$assigned_to", preserveNullAndEmptyArrays: true } },

      // join timelines
      {
        $lookup: {
          from: "timelines",
          localField: "_id",
          foreignField: "task",
          as: "timelines",
        },
      },
    ];

    // Run pipeline
    const data = await this.taskModel.aggregate(pipeline).exec();

    // Total count (for pagination)
    const total = await this.taskModel.countDocuments(filter).exec();
    const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);
    if (totalPages > 0 && safePage > totalPages) safePage = totalPages;

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  }


  async findById(id: string) {
    const column = await this.taskModel.findById(id);
    if (!column) {
      throw new NotFoundException(`Kanban column with ID ${id} not found`);
    }
    return column;
  }


}
