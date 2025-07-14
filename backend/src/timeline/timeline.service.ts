import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Timeline } from "./timeline.interface";
import { TaskService } from "src/task/task.service";
import { validateTaskId } from "./task.helpers";
import { CreateTimelineDto, UpdateTimelineDto } from "./timeline.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { fetchTaskProjectUserDetailsByTaskID } from "src/shared/commonhelper";
import { ProjectService } from "src/project/project.service";
import { log } from "console";
import { UserService } from "src/user/user.service";


@Injectable()
export class TimelineService {
  constructor(
    @InjectModel("Timeline") private readonly timelineModel: Model<Timeline>,
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
     private readonly userService: UserService,
    private eventEmitter: EventEmitter2,
  ) { }
  async create(createTimelineDto: CreateTimelineDto): Promise<Timeline> {
    const taskdata = await fetchTaskProjectUserDetailsByTaskID({ taskService: this.taskService, projectService: this.projectService , userService: this.userService},{ taskId: createTimelineDto.task.toString() , userId: createTimelineDto.created_by.toString() });
    log(taskdata)
    const createdTimeline = new this.timelineModel(createTimelineDto);
    this.eventEmitter.emit('timeline.created', {
      taskdata: taskdata,
      createdTimeline:createdTimeline
    });
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

  async update(
    id: string,
    updateTaskDto: UpdateTimelineDto
  ): Promise<Timeline> {
    if (updateTaskDto.task) {
      await validateTaskId(this.taskService, updateTaskDto.task.toString());
    }
    return this.timelineModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Timeline> {
    const timeline = await this.timelineModel.findByIdAndDelete(id).exec();
    if (!timeline) {
      throw new NotFoundException(`Timeline with ID ${id} not found.`);
    }
    return timeline;
  }

  async findByTaskId(
    taskId: string,
    page: number,
    limit: number
  ): Promise<{ data: Timeline[]; total: number; page: number; limit: number }> {
    await validateTaskId(this.taskService, taskId);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.timelineModel
        .find({ task: taskId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
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

  async findByProjectId(
    projectId: string,
    options: {
      from?: string;
      to?: string;
      page: number;
      limit: number;
    }
  ): Promise<{ data: Timeline[]; total: number; page: number; limit: number }> {

    const { from, to, page, limit } = options;

    const tasksResult = await this.taskService.findByProject(projectId, page, limit);
    const tasks = tasksResult.data;

    if (!tasks?.length) {
      throw new NotFoundException(`No tasks found for project ID ${projectId}.`);
    }

    const filterDate: any = {
      ...(from && { $gte: new Date(new Date(from).setHours(0, 0, 0, 0)) }),
      ...(to && { $lte: new Date(new Date(to).setHours(23, 59, 59, 999)) }),
    };
    const hasDateFilter = Object.keys(filterDate).length > 0;

    const queries = tasks.map(({ _id }) =>
      this.timelineModel
        .find({
          task: _id,
          ...(hasDateFilter && { date: filterDate }),
        })
        .exec()
    );

    const timelines = (await Promise.all(queries)).flat();

    return {
      data: timelines,
      total: timelines.length,
      page,
      limit,
    };
  }


}
