import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { Task } from "./task.interface";

@Controller("api/admin/task")
export class AdminTaskController {
  constructor(private readonly taskService: TaskService) {}


  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("keyword") keyword?: string,
    @Query("sortOrder") sortOrder: "asc" | "desc" = "asc"
  ): Promise<{ data: Task[]; total: number }> {
    return this.taskService.findAll(
      page,
      limit,
      keyword,
      sortOrder
    );
  }


 
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<any> {
    await this.taskService.remove(id);
    return {
      message: "Task deleted successfully!",
    };
  }


   @Get("timesheet")
  async findTaskTimeSheet(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("keyword") keyword?: string,
    @Query("sortOrder") sortOrder: "asc" | "desc" = "asc"
  ): Promise<{ data: Task[]; total: number }> {
    return this.taskService.getTaskDetails(
      page,
      limit,
      keyword,
      sortOrder
    );
  }

}
