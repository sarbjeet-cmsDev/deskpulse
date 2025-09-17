import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Taskactivitylog,
  TaskactivitylogDocument,
} from "./taskactivitylog.schema";
import { CreateTaskActivityLogDto } from "./taskactivitylog.dto";

@Injectable()
export class TaskactivitylogService {
  constructor(
    @InjectModel(Taskactivitylog.name)
    private readonly taskChecklistModel: Model<TaskactivitylogDocument>
  ) {}
  async create(
    createTaskChecklistDto: CreateTaskActivityLogDto
  ): Promise<Taskactivitylog> {
    const createdChecklist = new this.taskChecklistModel(
      createTaskChecklistDto
    );
    return createdChecklist.save();
  }

  async findAll(): Promise<TaskactivitylogDocument[]> {
    return this.taskChecklistModel.find().exec();
  }
  async findLogactivityByTaskId(
    taskId: string,
    page: number,
    limit: number
  ): Promise<{ taskactivitylog: TaskactivitylogDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const [taskactivitylog, total] = await Promise.all([
      this.taskChecklistModel
        .find({ task: taskId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskChecklistModel.countDocuments({ task: taskId }),
    ]);

    return { taskactivitylog, total };
  }

  async findLogactivityByTaskCode(
    code: string,
    page: number,
    limit: number
  ): Promise<{ taskactivitylog: TaskactivitylogDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const [taskactivitylog, total] = await Promise.all([
      this.taskChecklistModel
        .find({ code: code })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskChecklistModel.countDocuments({ code: code }),
    ]);

    return { taskactivitylog, total };
  }
}
