import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Performance, PerformanceDocument } from "./performance.schema";
import { CreatePerformanceDto } from "./performance.dto";
import { TaskService } from "src/task/task.service";
import * as dayjs from 'dayjs';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel(Performance.name)
    private performanceModel: Model<PerformanceDocument>,
    private readonly taskService: TaskService
  ) {}

  private readonly TaskTypeWeightage = [
    { taskType: "ui/ux", weight: 50 },
    { taskType: "backend", weight: 50 },
    { taskType: "ui/ux bug", weight: 5 },
    { taskType: "backend bug", weight: 25 },
    { taskType: "DevOps", weight: 35 },
    { taskType: "QA", weight: 5 },
    { taskType: "R&D", weight: 5 },
  ];

  private readonly taskStatusTypeWeightage = [
    { taskStatus: "pending", weight: 5 },
    { taskStatus: "todo", weight: 5 },
    { taskStatus: "BACKLOG", weight: 5 },
    { taskStatus: "inprogress", weight: 25 },
    { taskStatus: "code_review", weight: 35 },
    { taskStatus: "qq", weight: 40 },
    { taskStatus: "todeploy", weight: 45 },
    { taskStatus: "done", weight: 50 },
    { taskStatus: "completed", weight: 50 },
  ];

  private readonly PriorityWeightage = [
    { PriorityType: "low", weight: 5 },
    { PriorityType: "medium", weight: 12 },
    { PriorityType: "high", weight: 20 },
  ];

  private readonly AcceptanceWeightage = [
    { AcceptanceType: "Average", weight: 5 },
    { AcceptanceType: "Good", weight: 10 },
    { AcceptanceType: "Satisfied", weight: 15 },
    { AcceptanceType: "Very Satisfied", weight: 20 },
    { AcceptanceType: "Excellent", weight: 30 },
  ];

  private readonly RevisionWeightage = [
    { RevisionType: 1, weight: 10 },
    { RevisionType: 2, weight: 5 },
    { RevisionType: 3, weight: 0 }, // Represent "3 or more"
  ];

  async createPerformance(TaskObj: any) {
    const taskType = TaskObj.type;
    const taskStatus = TaskObj.status;
    const priorityType = TaskObj.priority;
    const acceptanceType = TaskObj.acceptance;
    const revisionType = TaskObj.rivision;

    const taskTypeWeight =
      this.TaskTypeWeightage.find((t) => t.taskType === taskType)?.weight || 0;
    const taskStatusWeight =
      this.taskStatusTypeWeightage.find((t) => t.taskStatus === taskStatus)
        ?.weight || 0;
    const priorityWeight =
      this.PriorityWeightage.find((t) => t.PriorityType === priorityType)
        ?.weight || 0;
    const acceptanceWeight =
      this.AcceptanceWeightage.find((t) => t.AcceptanceType === acceptanceType)
        ?.weight || 0;
    const revisionWeight =
      this.RevisionWeightage.find((t) =>
        revisionType >= 3
          ? t.RevisionType === 3
          : t.RevisionType === revisionType
      )?.weight || 0;
    // log(taskTypeWeight,taskStatusWeight,priorityWeight,acceptanceWeight,revisionWeight)
    // Max possible weights per category
    const taskTypeMax = 50;
    const taskStatusMax = 50;
    const priorityMax = 20;
    const acceptanceMax = 30;
    const revisionMax = 10;
    // How much each category counts toward final score
    const taskTypePercent = 20; // 20% of 100
    const taskStatusPercent = 30; // 30% of 100
    const priorityPercent = 20; // 20% of 100
    const acceptancePercent = 20; // 20% of 100
    const revisionPercent = 10; // 10% of 100
    // Normalized scores
    const taskTypeScore = (taskTypeWeight / taskTypeMax) * taskTypePercent;
    const taskStatusScore =
      (taskStatusWeight / taskStatusMax) * taskStatusPercent;
    const priorityScore = (priorityWeight / priorityMax) * priorityPercent;
    const acceptanceScore =
      (acceptanceWeight / acceptanceMax) * acceptancePercent;
    const revisionScore = (revisionWeight / revisionMax) * revisionPercent;
    const totalScore = Math.round(
      taskTypeScore +
        taskStatusScore +
        priorityScore +
        acceptanceScore +
        revisionScore
    );
    const createPerformanceDto: CreatePerformanceDto = {
      task: TaskObj._id.toString(),
      result: totalScore.toString(),
    };
    this.create(createPerformanceDto);
    return totalScore;
  }
  async create(
    createPerformanceDto: CreatePerformanceDto
  ): Promise<Performance> {
    const createdNotification = new this.performanceModel(createPerformanceDto);
    return createdNotification.save();
  }

  async getPerformanceByTaskandUserId(userId: string): Promise<any> {
    const pageNumber = parseInt('', 10);
    const limitNumber = parseInt('', 10);
  const tasks = await this.taskService.findByAssignedUser(userId,pageNumber,limitNumber);

  const taskIds = tasks.data.map((task) => task._id);

  const performances = await this.performanceModel.aggregate([
    { $match: { task: { $in: taskIds } } },
    { $sort: { updatedAt: -1 } },
    {
      $group: {
        _id: "$task",
        task: { $first: "$task" },
        result: { $first: "$result" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
  ]);

  const result = performances.map((perf) => {
    return {
      date: dayjs(perf.updatedAt).format("YYYY-MM-DD"),
      performance: parseInt(perf.result, 10),
    };
  });

 
  const groupedByDate = result.reduce((acc, curr) => {
    if (!acc[curr.date]) {
      acc[curr.date] = [];
    }
    acc[curr.date].push(curr.performance);
    return acc;
  }, {} as Record<string, number[]>);

  const averagedPerformance = Object.entries(groupedByDate).map(
    ([date, values]) => ({
      date,
      performance:
        values.reduce((sum, val) => sum + val, 0) / values.length,
    }),
  );

  return averagedPerformance; 
}
}
