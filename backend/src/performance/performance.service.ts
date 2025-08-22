import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Performance, PerformanceDocument } from "./performance.schema";
import { CreatePerformanceDto } from "./performance.dto";
import { TaskService } from "src/task/task.service";
import * as dayjs from 'dayjs';
import { UserService } from "src/user/user.service";


@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel(Performance.name)
    private performanceModel: Model<PerformanceDocument>,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) { }

  // Priority weights
  private readonly PriorityWeightage = [
    { PriorityType: 'low', weight: 5 },
    { PriorityType: 'medium', weight: 12 },
    { PriorityType: 'high', weight: 20 },
  ];

  // Task type weights
  private readonly TaskTypeWeightage = [
    { taskType: 'ui/ux', weight: 50 },
    { taskType: 'backend', weight: 50 },
    { taskType: 'ui/ux bug', weight: 5 },
    { taskType: 'backend bug', weight: 25 },
    { taskType: 'DevOps', weight: 35 },
    { taskType: 'QA', weight: 5 },
    { taskType: 'R&D', weight: 5 },
  ];

  // Acceptance weights
  private readonly AcceptanceWeightage = [
    { AcceptanceType: 'pending', weight: 0 },
    { AcceptanceType: 'Average', weight: 5 },
    { AcceptanceType: 'Good', weight: 10 },
    { AcceptanceType: 'Satisfied', weight: 15 },
    { AcceptanceType: 'Very Satisfied', weight: 20 },
    { AcceptanceType: 'Excellent', weight: 30 },
  ];

  // Revision weights
  private readonly RevisionWeightage = [
    { RevisionType: 1, weight: 10 },
    { RevisionType: 2, weight: 5 },
    { RevisionType: 3, weight: 0 }, // 3 or more revisions = 0 score
  ];

  /**
   * Create a performance record and calculate score
   */
  async createPerformance(TaskObj: any) {
    const taskType = TaskObj.type;
    const priorityType = TaskObj.priority;
    const acceptanceType = TaskObj.client_acceptance;
    const revisionType = TaskObj.rivision;

    const taskTypeWeight =
      this.TaskTypeWeightage.find((t) => t.taskType === taskType)?.weight || 0;

    const priorityWeight =
      this.PriorityWeightage.find((t) => t.PriorityType === priorityType)
        ?.weight || 0;

    const acceptanceWeight =
      this.AcceptanceWeightage.find((t) => t.AcceptanceType === acceptanceType)
        ?.weight || 0;

    const revisionWeight =
      this.RevisionWeightage.find((t) =>
        revisionType >= 3 ? t.RevisionType === 3 : t.RevisionType === revisionType
      )?.weight || 0;


    // Timeliness calculation
    const TaskDueDate = dayjs(TaskObj.due_date);
    const completedDate = dayjs(TaskObj.updatedAt);
    let timelinessWeight = 0;
    if (completedDate.isBefore(TaskDueDate) || completedDate.isSame(TaskDueDate)) {
      timelinessWeight = 10;
    }


    // Max possible weights per category
    const taskTypeMax = 50;
    const priorityMax = 20;
    const acceptanceMax = 30;
    const revisionMax = 10;
    const timelinessMax = 10;

    // Adjusted percentage contributions (total = 100)
    const taskTypePercent = 35;   // was 20
    const priorityPercent = 20;   // stays
    const acceptancePercent = 30; // was 20
    const revisionPercent = 10;   // stays
    const timelinessPercent = 5;  // stays

    // Normalized scores
    const taskTypeScore = (taskTypeWeight / taskTypeMax) * taskTypePercent;
    const priorityScore = (priorityWeight / priorityMax) * priorityPercent;
    const acceptanceScore = (acceptanceWeight / acceptanceMax) * acceptancePercent;
    const revisionScore = (revisionWeight / revisionMax) * revisionPercent;
    const timelinessScore = (timelinessWeight / timelinessMax) * timelinessPercent;



    const totalScore = Math.min(
      Math.round(
        taskTypeScore +
        priorityScore +
        acceptanceScore +
        revisionScore +
        timelinessScore
      ),
      100,
    );

    const createPerformanceDto: CreatePerformanceDto = {
      task: TaskObj._id.toString(),
      result: totalScore.toString(),
    };

    await this.create(createPerformanceDto);

    return totalScore;
  }

  /**
   * Save performance to database
   */
  async create(
    createPerformanceDto: CreatePerformanceDto,
  ): Promise<Performance> {
    const createdPerformance = new this.performanceModel(createPerformanceDto);
    return createdPerformance.save();
  }

  async getPerformanceByTaskandUserId(userId: string, start?: string, end?: string): Promise<any> {
    const pageNumber = parseInt('', 10);
    const limitNumber = parseInt('', 10);
  const tasks = await this.taskService.findByAssignedUser(userId,pageNumber,limitNumber);

  const taskIds = tasks.data.map((task) => task._id);


  const matchQuery: any = { task: { $in: taskIds } };

  if (start && end) {
    matchQuery.updatedAt = {
      $gte: new Date(start),
      $lte: new Date(end),
    };
  }

  const performances = await this.performanceModel.aggregate([
    { $match: matchQuery },
    { $sort: { updatedAt: -1 } },
    {
      $group: {
        _id: "$_id",
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


async getPerformanceForAdmin(
  userId?: string,
  start?: string,
  end?: string,
): Promise<any[]> {
  try {
    const users = userId
      ? [await this.userService.findOne(userId)]
      : await this.userService.findUsersByRole('user');


    if (!users || users.length === 0) {
      return [];
    }
  
    const performancesByUser = await Promise.all(
      users.map(async (user) => {
        if (!user._id) {
          console.warn('Invalid user object:', user);
          return null;
        }

        const performance = await this.getPerformanceByTaskandUserId(
          user._id.toString(),
          start,
          end,
        );

        return {
          userId: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          performance,
        };
      }),
    );

    return performancesByUser.filter(Boolean);
  } catch (err) {
    console.error('Error in getPerformanceForUsers:', err);
    throw err;
  }
}
}
