import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Timeline } from "./timeline.interface";
import { TaskService } from "src/task/task.service";
import { validateTaskId } from "./task.helpers";
import { CreateTimelineDto, UpdateTimelineDto } from "./timeline.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ProjectService } from "src/project/project.service";
import { UserService } from "src/user/user.service";
import { Types } from "mongoose";

@Injectable()
export class TimelineService {
  constructor(
    @InjectModel("Timeline") private readonly timelineModel: Model<Timeline>,
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createTimelineDto: CreateTimelineDto): Promise<Timeline> {
    if (createTimelineDto.time_spent) {
      createTimelineDto.time_spent = Number(createTimelineDto.time_spent) * 60;
    }

    const createdTimeline = new this.timelineModel(createTimelineDto);
    const savedTimeline = await createdTimeline.save();

    if (createTimelineDto.task && createTimelineDto.time_spent) {
      await this.taskService.incrementTimeSpent(
        createTimelineDto.task.toString(),
        Number(createTimelineDto.time_spent)
      );
    }

    this.eventEmitter.emit("timeline.created", {
      timeLineObj: createdTimeline,
    });
    return savedTimeline;
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

  async remove(timelineId: string): Promise<Timeline> {
    const timeline = await this.timelineModel.findById(timelineId).exec();

    if (!timeline) {
      throw new NotFoundException(`Timeline with ID ${timelineId} not found.`);
    }

    await this.timelineModel.findByIdAndDelete(timelineId);

    if (timeline.task && timeline.time_spent) {
      await this.taskService.incrementTimeSpent(
        timeline.task.toString(),
        -timeline.time_spent
      );
      this.eventEmitter.emit("timeline.deleted", {
        timeLineObj: timeline,
      });
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

  async findTimeLineByUserId(
    userId: string,
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string,
    sortOrder: "asc" | "desc" = "desc",
  ): Promise<{ data: Timeline[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const matchFilter: any = {
      user: new Types.ObjectId(userId),
    };

    if (startDate || endDate) {
      matchFilter.date = {};
      if (startDate) {
        matchFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        matchFilter.date.$lte = new Date(endDate);
      }
    }

    const total = await this.timelineModel.countDocuments(matchFilter);

    const data = await this.timelineModel.aggregate([
      {
        $match: matchFilter,
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task",
          foreignField: "_id",
          as: "tasks",
        },
      },
      {
        $unwind: "$tasks",
      },
      {
        $sort: { createdAt: sortOrder === "desc" ? 1 : -1 } ,
      },
      {
        $project: {
          _id: 1,
          date: 1,
          time_spent: 1,
          comment: 1,
          createdAt:1,
          taskId: "$task",
          task_title: "$tasks.title",

        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
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

    const tasksResult = await this.taskService.findByProject(
      projectId,
      page,
      limit
    );
    const tasks = tasksResult.data;

    if (!tasks?.length) {
      throw new NotFoundException(
        `No tasks found for project ID ${projectId}.`
      );
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

  async getAllTimelines(
    page: number,
    limit: number,
    keyword?: string,
    sortOrder: "asc" | "desc" = "desc",
    start?: string,
    end?: string,
    projectId?: string
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    totalTimeSpent:number;
  }> {

    let safePage = Math.max(Number(page) || 1, 1);
    let safeLimit = Math.max(Number(limit) || 25, 1);
    const MAX_LIMIT = 1000;
    if (safeLimit > MAX_LIMIT) safeLimit = MAX_LIMIT;

    const filter: Record<string, any> = {};

    if (keyword && keyword.trim()) {
      filter.comment = { $regex: keyword.trim(), $options: "i" };
    }

    if (start && end) {
      filter.date = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const countPipeline: any[] = [
    { $match: filter },
    {
      $lookup: {
        from: "tasks",
        localField: "task",
        foreignField: "_id",
        as: "task_detail",
      },
    },
    { $unwind: { path: "$task_detail", preserveNullAndEmptyArrays: true } },
    ...(projectId ? [{ $match: { "task_detail.project": new Types.ObjectId(projectId) } }] : []),
    { $count: "total" },
  ];

  const countResult = await this.timelineModel.aggregate(countPipeline).exec();
  const total = countResult.length > 0 ? countResult[0].total : 0;
  const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);
  if (totalPages > 0 && safePage > totalPages) safePage = totalPages;

    const pipeline: any[] = [
      { $match: filter },
      
      {
        $lookup: {
          from: "tasks",
          localField: "task",
          foreignField: "_id",
          as: "task_detail",
        },
      },
      { $unwind: { path: "$task_detail", preserveNullAndEmptyArrays: true } },
      ...(projectId
        ? [{ $match: { "task_detail.project": new Types.ObjectId(projectId) } }]
        : []),
      { $sort: { createdAt: sortOrder === "desc" ? 1 : -1 } },

      { $skip: (safePage - 1) * safeLimit },
      { $limit: safeLimit },
      {
        $project: {
          _id: 1,
          comment: 1,
          task: 1,
          project:1,
          date: 1,
          user: 1,
          time_spent: 1,
          task_title: "$task_detail.title",
          task_id: "$task_detail._id",
          task_code:"$task_detail.code",
          project_id: "$task_detail.project",
          assigned_id: "$task_detail.assigned_to",
          task_status:"$task_detail.status"
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "_id",
          as: "project_detail",
        },
      },
      {
        $unwind: { path: "$project_detail", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user_detail",
        },
      },
      { $unwind: { path: "$user_detail", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          comment: 1,
          user: 1,
          task: 1,
          project:1,
          date: 1,
          time_spent: 1,
          task_title: 1,
          task_id: 1,
          task_code:1,
          task_status:1,
          project_id: 1,
          assigned_id: 1,
          project_name: "$project_detail.title",
          username: {
            $concat: [
              { $ifNull: ["$user_detail.firstName", ""] },
              " ",
              { $ifNull: ["$user_detail.lastName", ""] },
            ],
          },
        },
      },
    ];

     if (projectId) {
    pipeline.push({
      $match: { 'project_id': new Types.ObjectId(projectId) },
    });
  }

    const data = await this.timelineModel.aggregate(pipeline).exec();

    const totalTimePipeline: any[] = [
    { $match: filter },
    {
      $lookup: {
        from: "tasks",
        localField: "task",
        foreignField: "_id",
        as: "task_detail",
      },
    },
    { $unwind: { path: "$task_detail", preserveNullAndEmptyArrays: true } },
    ...(projectId ? [{ $match: { "task_detail.project": new Types.ObjectId(projectId) } }] : []),
    {
      $group: {
        _id: null,
        totalTimeSpent: { $sum: "$time_spent" },
      },
    },
  ];


  const totalTimeResult = await this.timelineModel.aggregate(totalTimePipeline).exec();
  const totalTimeSpent = totalTimeResult.length > 0 ? totalTimeResult[0].totalTimeSpent : 0;

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      totalTimeSpent,
    };
  }

  async findUsersTimeLine(
    userIds: string[],
    page: number,
    limit: number,
    sortOrder: "asc" | "desc" = "desc",
    startDate?: string,
    endDate?: string,
    projectId?: string
  ): Promise<{
    data: Timeline[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    totalTimeSpent:number;
  }> {
    const skip = (page - 1) * limit;

    let safePage = Math.max(Number(page) || 1, 1);
    let safeLimit = Math.max(Number(limit) || 25, 1);
    const MAX_LIMIT = 1000;
    if (safeLimit > MAX_LIMIT) safeLimit = MAX_LIMIT;
    
    const matchFilter: any = {
      user: { $in: userIds.map((id) => new Types.ObjectId(id)) },
    };
     
    if (startDate || endDate) {
      matchFilter.date = {};
      if (startDate) {
        matchFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        matchFilter.date.$lte = new Date(endDate);
      }
    }

    const countPipeline: any[] = [
    { $match: matchFilter },
    {
      $lookup: {
        from: "tasks",
        localField: "task",
        foreignField: "_id",
        as: "task_detail",
      },
    },
    { $unwind: { path: "$task_detail", preserveNullAndEmptyArrays: true } },
    ...(projectId ? [{ $match: { "task_detail.project": new Types.ObjectId(projectId) } }] : []),
    { $count: "total" },
  ];

    const countResult = await this.timelineModel.aggregate(countPipeline).exec();
    const total = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);
    if (totalPages > 0 && safePage > totalPages) safePage = totalPages;

    const pipeline: any[] = [
      { $match: matchFilter },
      
      {
        $lookup: {
          from: "tasks",
          localField: "task",
          foreignField: "_id",
          as: "task_detail",
        },
      },
      { $unwind: { path: "$task_detail", preserveNullAndEmptyArrays: true } },
      ...(projectId
        ? [{ $match: { "task_detail.project": new Types.ObjectId(projectId) } }]
        : []),
        { $sort: { createdAt: sortOrder === "desc" ? 1 : -1 } },
        { $skip: (safePage - 1) * safeLimit },
        { $limit: safeLimit },
      {
        $project: {
          _id: 1,
          comment: 1,
          task: 1,
          project:1,
          date: 1,
          user: 1,
          time_spent: 1,
          task_title: "$task_detail.title",
          task_id: "$task_detail._id",
          task_code:"$task_detail.code",
          project_id: "$task_detail.project",
          assigned_id: "$task_detail.assigned_to",
          task_status:"$task_detail.status"
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "_id",
          as: "project_detail",
        },
      },
      {
        $unwind: { path: "$project_detail", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user_detail",
        },
      },
      { $unwind: { path: "$user_detail", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          comment: 1,
          user: 1,
          task: 1,
          project:1,
          date: 1,
          time_spent: 1,
          task_title: 1,
          task_id: 1,
          task_code:1,
          task_status:1,
          project_id: 1,
          assigned_id: 1,
          project_name: "$project_detail.title",
          username: {
            $concat: [
              { $ifNull: ["$user_detail.firstName", ""] },
              " ",
              { $ifNull: ["$user_detail.lastName", ""] },
            ],
          },
        },
      },
    ];

     if (projectId) {
    pipeline.push({
      $match: { 'project_id': new Types.ObjectId(projectId) },
    });
  }

    const data = await this.timelineModel.aggregate(pipeline).exec();

    const totalTimePipeline: any[] = [
    { $match: matchFilter },
    {
      $lookup: {
        from: "tasks",
        localField: "task",
        foreignField: "_id",
        as: "task_detail",
      },
    },
    { $unwind: { path: "$task_detail", preserveNullAndEmptyArrays: true } },
    ...(projectId ? [{ $match: { "task_detail.project": new Types.ObjectId(projectId) } }] : []),
    {
      $group: {
        _id: null,
        totalTimeSpent: { $sum: "$time_spent" },
      },
    },
  ];

  const totalTimeResult = await this.timelineModel.aggregate(totalTimePipeline).exec();
  const totalTimeSpent = totalTimeResult.length > 0 ? totalTimeResult[0].totalTimeSpent : 0;

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      totalTimeSpent,
    };
  }
}
