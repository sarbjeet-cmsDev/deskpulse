import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Logger,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusUpdateDto,
} from "./task.dto";
import { Task } from "./task.interface";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { CurrentUser } from "src/shared/current-user.decorator";

@Controller("api/tasks")
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) { }
  private readonly logger = new Logger(TaskController.name);

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: any
  ): Promise<{ message: string; data: Task }> {
    createTaskDto.created_by = user.userId.toString();
    const task = await this.taskService.create(createTaskDto);
    return {
      message: "Task created successfully",
      data: task,
    };
  }

  @Get("fetch/:id")
  async findOne(@Param("id") id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Get("project/:projectId")
  async findByProject(
    @Param("projectId") projectId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5"
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.taskService.findByProject(projectId, pageNumber, limitNumber);
  }

  @Get("get-tasks")
  async fetchTasksByUsersAndProject(
    @Query("userIds") userIds: string,
    @Query("projectid") projectId: string
  ): Promise<{ tasks: Task[] }> {
    const userIdArray = userIds.split(",");
    const tasks = await this.taskService.fetchTasksByUserAndProjectIds(
      userIdArray,
      projectId
    );
    return { tasks };
  }

  @Get("assigned-to")
  async findAssignedTasks(
    @Query("userIds") userIds?: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: string = "10",
    @Query("start") start?: string,
    @Query("end") end?: string
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const limitNumber = parseInt(limit, 10);

    const userIdArray = userIds.split(",");
    return this.taskService.findByAssignedToUser(
      userIdArray,
      page,
      limitNumber,
      start,
      end
    );
  }

  @Get("code/:code")
  async findByCode(@Param("code") code: string): Promise<Task> {
    return this.taskService.findByCode(code);
  }

  @Get("report-to/:userId")
  async findByReportToUser(@Param("userId") userId: string): Promise<Task[]> {
    return this.taskService.findByReportToUser(userId);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any
  ): Promise<{ message: string; task: Task }> {
    updateTaskDto.updated_by = user.userId.toString();
    const updatedTask = await this.taskService.update(id, updateTaskDto);
    return {
      message: "Task updated successfully",
      task: updatedTask,
    };
  }

  @Patch("status/:id")
  async updateTaskStatus(
    @Param("id") id: string,
    @Body() updateTaskStatusUpdateDto: UpdateTaskStatusUpdateDto,
    @CurrentUser() user: any
  ): Promise<{ message: string; task: Task }> {
    updateTaskStatusUpdateDto.updated_by = user.userId.toString();
    const task = await this.taskService.updateTaskStatus(
      id,
      updateTaskStatusUpdateDto
    );
    return { message: "Task updated successfully", task };
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Task> {
    return this.taskService.remove(id);
  }

  @Get("get-due-task")
  async FetchDueTask(@CurrentUser() user: any): Promise<any> {
    const tasks = await this.taskService.FetchDueTask(user.userId);
    return {
      message: "Due tasks fetched successfully.",
      tasks: tasks,
    };
  }

  @Get("me")
  async getMyTaskes(
    @Req() req: any,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5"
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.taskService.findByAssignedUser(
      req.user.userId,
      pageNumber,
      limitNumber
    );
  }

  @Patch("archive/:taskId")
  async archiveTask(@Param("taskId") taskId: string): Promise<Task> {
    return this.taskService.update(taskId, { isArchived: true });
  }

  @Patch("unArchive/:taskId")
  async unArchiveTask(@Param("taskId") taskId: string): Promise<Task> {
    return this.taskService.update(taskId, { isArchived: false });
  }
}
