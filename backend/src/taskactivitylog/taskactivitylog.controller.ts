import {
  Controller,
  UseGuards,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { TaskactivitylogService } from "./taskactivitylog.service";
import { Taskactivitylog } from "./taskactivitylog.schema";
@Controller("api/taskactivitylog")
@UseGuards(JwtAuthGuard)
export class TaskactivitylogController {
  constructor(
    private readonly taskactivitylogservice: TaskactivitylogService
  ) {}
  @Get()
  async findAll(): Promise<{
    message: string;
    taskactivitylog: Taskactivitylog[];
  }> {
    const taskactivitylog = await this.taskactivitylogservice.findAll();
    return {
      message: "taskactivitylog fetched successfully",
      taskactivitylog,
    };
  }
  
  @Get("task-activity/:taskId")
  async findlogByTaskId(
    @Param("taskId") taskId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5"
  ): Promise<{
    taskactivitylog: Taskactivitylog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const { taskactivitylog, total } =
      await this.taskactivitylogservice.findLogactivityByTaskId(
        taskId,
        pageNumber,
        limitNumber
      );

    return {
      taskactivitylog,
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  @Get("task-activity/code/:code")
  async findlogByTaskCode(
    @Param("code") code: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5"
  ): Promise<{
    taskactivitylog: Taskactivitylog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const { taskactivitylog, total } =
      await this.taskactivitylogservice.findLogactivityByTaskCode(
        code,
        pageNumber,
        limitNumber
      );

    return {
      taskactivitylog,
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }
}
