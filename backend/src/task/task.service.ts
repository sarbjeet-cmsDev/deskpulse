import { Injectable, Logger, NotFoundException } from "@nestjs/common";
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
// import { Task } from 'src/task/task.schema';
// import { Project } from 'src/project/project.schema';
// import { User } from 'src/user/user.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel("Task") private readonly taskModel: Model<Task>,
    private readonly projectService: ProjectService,
    private readonly userservices: UserService,
    private eventEmitter: EventEmitter2
  ) { }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { code: projectCode } = await this.projectService.findOne(
      createTaskDto.project.toString()
    );
     if (createTaskDto.estimated_time) {
    createTaskDto.estimated_time = Number(createTaskDto.estimated_time) * 60; 
  }
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

    console.log("Incoming status:", createTaskDto.status);
    console.log("Last task found:", maxSortTask);

    const newSortOrder = maxSortTask?.sort_order ?? -1;
    createTaskDto.sort_order = newSortOrder + 1;
   console.log("Final sort_order to save:", createTaskDto.sort_order);

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
  ): Promise<{data: Task[]; total: number; page: number; limit: number;totalPages: number;}> {
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
    return this.taskModel.find({
      assigned_to: { $in: userIds },
      project: projectId,
    })
    .populate('assigned_to')
    .sort({ sort_order: -1 })
  }

async findByAssignedToUser(
  userIds: string[],
  page: number,
  limit: number,
  start?: string,
  end?: string
): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = { assigned_to: { $in: userIds } };

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
        .find({ project: projectId })
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
        .find({ assigned_to: userId })
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
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    this.eventEmitter.emit("task.status.updated", {
      taskObj: updatedTask,
      oldTaskStatus: oldTaskStatus,
      updatedBy: updateTaskDto.updated_by,
    });

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

async reorderTask(taskId: string, targetTaskId: string, status: string) {
  const task = await this.taskModel.findById(taskId);
  const targetTask = await this.taskModel.findById(targetTaskId);

  if (!task || !targetTask) throw new NotFoundException("Task(s) not found");

  if (task.status !== status || targetTask.status !== status) return;

  const tasks = await this.taskModel
    .find({ project: task.project, status })
    .sort({ sort_order: 1 });

  const filtered = tasks.filter((t) => t._id.toString() !== taskId);

  const targetIndex = filtered.findIndex((t) => t._id.toString() === targetTaskId);
  if (targetIndex === -1) return;

  filtered.splice(targetIndex, 0, task);

  for (let i = 0; i < filtered.length; i++) {
    await this.taskModel.findByIdAndUpdate(filtered[i]._id, {
      sort_order: i,
    });
  }

  return { message: 'Task Reordered successfully' };
}

async getTaskDetails(
  page: number,
  limit: number,
  keyword?: string,
  sortOrder: "asc" | "desc" = "asc",
  start?: string,
  end?: string
): Promise<{
  data: Task[];
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
      { title: { $regex: keyword.trim(), $options: 'i' } },
      { code: { $regex: keyword.trim(), $options: 'i' } },
    ];
  }

  // ✅ Date Range Filter
  if (start && end) {
    filter.createdAt = {
      $gte: new Date(start),
      $lte: new Date(end),
    };
  }

  const total = await this.taskModel.countDocuments(filter).exec();
  const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);
  if (totalPages > 0 && safePage > totalPages) safePage = totalPages;

  const skip = (safePage - 1) * safeLimit;

  const data = await this.taskModel
    .find(filter)
    .sort({ createdAt: sortOrder === 'desc' ? 1 : -1 })
    // .sort({ sortOrder: -1 })
    .skip(skip)
    .limit(safeLimit)
    .populate('project')
    .populate('assigned_to')
    .exec();

  return {
    data,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
}

}
