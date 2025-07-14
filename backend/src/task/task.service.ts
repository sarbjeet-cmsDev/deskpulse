import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task } from "./task.interface";
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusUpdateDto,
} from "./task.dto";
import { ProjectService } from "../project/project.service";
import { validateProjectId } from "./task.helpers";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UserService } from "src/user/user.service";
import { log } from "console";

@Injectable()
export class TaskService {
  constructor(
    @InjectModel("Task") private readonly taskModel: Model<Task>,
    private readonly projectService: ProjectService,
    private readonly userservices: UserService,
    private eventEmitter: EventEmitter2
  ) { }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    await validateProjectId(
      this.projectService,
      createTaskDto.project.toString()
    );
    const createdTask = new this.taskModel(createTaskDto);
    if (createTaskDto.assigned_to) {
      this.eventEmitter.emit("task.assigned", {
        taskObj: createdTask,
      });
    }
    return createdTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
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
        .sort({ createdAt: -1 })
        .skip(skip)
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
        .sort({ createdAt: -1 })
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
    userData
  ): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    const oldTaskStatus = task.status; // ✅ correct old status
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    this.eventEmitter.emit("task.status.updated", {
      taskObj: updatedTask,
      oldTaskStatus: oldTaskStatus,
      updatedBy: userData.userId
    });

    return updatedTask;
  }
}
