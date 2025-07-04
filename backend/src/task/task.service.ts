import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.interface';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { log } from 'console';
import { ProjectService } from '../project/project.service';
import { validateProjectId } from './task.helpers';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>,
    private readonly projectService: ProjectService
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    await validateProjectId(this.projectService, createTaskDto.project.toString());
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    return task;
  }

  async findByProject(projectId: string): Promise<Task[]> {
    await validateProjectId(this.projectService, projectId.toString());
    return this.taskModel.find({ project: projectId }).exec();
  }

  async findByAssignedUser(userId: string): Promise<Task[]> {
    return this.taskModel.find({ assigned_to: userId }).exec();
  }

  async findByReportToUser(userId: string): Promise<Task[]> {
    return this.taskModel.find({ report_to: userId }).exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    if (updateTaskDto.project) {
       await validateProjectId(this.projectService, updateTaskDto.project.toString());
    }
    const task = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
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
}
