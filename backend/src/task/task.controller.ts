import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { Task } from './task.interface';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Get('project/:projectId')
  async findByProject(@Param('projectId') projectId: string): Promise<Task[]> {
    return this.taskService.findByProject(projectId);
  }

  @Get('assigned/:userId')
  async findByAssignedUser(@Param('userId') userId: string): Promise<Task[]> {
    return this.taskService.findByAssignedUser(userId);
  }

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

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Task> {
    return this.taskService.remove(id);
  }
}
