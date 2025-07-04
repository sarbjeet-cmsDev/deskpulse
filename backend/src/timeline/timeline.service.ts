import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timeline } from './timeline.interface';
import { TaskService } from 'src/task/task.service';
import { validateTaskId } from './task.helpers';
import { UpdateTimelineDto } from './timeline.dto';

@Injectable()
export class TimelineService {
  constructor(
    @InjectModel('Timeline') private readonly timelineModel: Model<Timeline>,
    private readonly taskService: TaskService
  ) { }
  async create(createTimelineDto: any): Promise<Timeline> {
    await validateTaskId(this.taskService, createTimelineDto.task.toString());
    const createdTimeline = new this.timelineModel(createTimelineDto);
    return createdTimeline.save();
  }
  async findAll(): Promise<Timeline[]> {
    return this.timelineModel.find().exec();
  }


  async findOne(id: string): Promise<Timeline> {
    const timeline = await this.timelineModel.findById(id).exec();
    if (!timeline) {
      throw new NotFoundException(`Timeline with ID ${id} not found.`);
    }
    return timeline;
  }


   async update(id: string, updateTaskDto: UpdateTimelineDto): Promise<Timeline> {
    if (updateTaskDto.task) {
      await validateTaskId(this.taskService, updateTaskDto.task.toString());
    }
    return this.timelineModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
  }

   async remove(id: string): Promise<Timeline> {
      const timeline = await this.timelineModel.findByIdAndDelete(id).exec();
      if (!timeline) {
        throw new NotFoundException(`Timeline with ID ${id} not found.`);
      }
      return timeline;
    }


  // async findByTaskId(taskId: string): Promise<Timeline[]> {
  //     await validateTaskId(this.taskService, taskId);
  //     return this.timelineModel.find({ task: taskId }).exec();
  // }
  async findByTaskId(taskId: string, page: number, limit: number): Promise<{ data: Timeline[]; total: number; page: number; limit: number }> {
  await validateTaskId(this.taskService, taskId);

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.timelineModel.find({ task: taskId }).skip(skip).limit(limit).exec(),
    this.timelineModel.countDocuments({ task: taskId }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}

  async findByUserId(userId: string): Promise<Timeline[]> {
    return this.timelineModel.find({ user: userId }).exec();
  }

  async removeByTaskId(taskId: string): Promise<{ deletedCount?: number }> {
    return this.timelineModel.deleteMany({ task: taskId }).exec();
  }


  async findByProjectId(projectId: string, from?: string, to?: string): Promise<Timeline[]> {
  const tasks = await this.taskService.findByProject(projectId);
  if (!tasks?.length) throw new NotFoundException(`No tasks found for project ID ${projectId}.`);

  const filterDate: any = {
    ...(from && { $gte: new Date(new Date(from).setHours(0, 0, 0, 0)) }),
    ...(to && { $lte: new Date(new Date(to).setHours(23, 59, 59, 999)) }),
  };
  const hasDateFilter = Object.keys(filterDate).length > 0;
  const queries = tasks.map(({ _id }) =>
    this.timelineModel.find({
      task: _id,
      ...(hasDateFilter && { date: filterDate }),
    }).exec()
  );

  return (await Promise.all(queries)).flat();
}
}
