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
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusUpdateDto } from './task.dto';
import { Task } from './task.interface';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { log } from 'console';

@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  private readonly logger = new Logger(TaskController.name);


 @Post()
async create(@Body() createTaskDto: CreateTaskDto): Promise<{ message: string; data: Task }> {
  const task = await this.taskService.create(createTaskDto);
  return {
    message: 'Task created successfully',
    data: task,
  };
}

  @Get()
  async findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get('fetch/:id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Get('project/:projectId')
  async findByProject(
    @Param('projectId') projectId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5"
  ): Promise<{data :Task[]; total: number; page: number; limit: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.taskService.findByProject(projectId, pageNumber, limitNumber);
  }

  // @Get('assigned/:userId')
  // async findByAssignedUser(@Param('userId') userId: string): Promise<Task[]> {
  //   return this.taskService.findByAssignedUser(userId);
  // }

  @Get('report-to/:userId')
  async findByReportToUser(@Param('userId') userId: string): Promise<Task[]> {
    return this.taskService.findByReportToUser(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }


  
  @Patch('status/:id')
  async updateTaskStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateTaskStatusUpdateDto: UpdateTaskStatusUpdateDto,
  ): Promise<{ message: string; checklist: Task }> {
    const userData = req.user; // <--- declared user_id properly
    const checklist = await this.taskService.updateTaskStatus(id, updateTaskStatusUpdateDto,userData);
    return { message: 'Task Status  updated successfully', checklist };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Task> {
    return this.taskService.remove(id);
  }


  
    @Get('me')
    async getMyTaskes(
      @Req() req: any,
      @Query("page") page: string = "1",
      @Query("limit") limit: string = "5"
    )
    : Promise<{ data:Task[]; total: number; page: number; limit: number }> {
      const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
      return this.taskService.findByAssignedUser(req.user.userId, pageNumber, limitNumber);
    }
}
