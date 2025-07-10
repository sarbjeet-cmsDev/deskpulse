import { Controller, Post, Body, UseGuards, Req, Get, Param, Put, NotFoundException, Delete } from '@nestjs/common';
import { CreateTaskChecklistDto, UpdateTaskChecklistDto } from './taskchecklist.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { TaskChecklistService } from './taskchecklist.service';
import { TaskChecklist } from './taskchecklist.schema';
@Controller('api/taskchecklist')
@UseGuards(JwtAuthGuard)
export class TaskChecklistController {
  constructor(private readonly taskChecklistService: TaskChecklistService) {}
  @Post()
  async create(@Body() createTaskChecklistDto: CreateTaskChecklistDto): Promise<{ message: string; checklist: TaskChecklist }> {
    const checklist = await this.taskChecklistService.create(createTaskChecklistDto);
    return { message: 'Task checklist created successfully', checklist };
  }
    @Get()
    async findAll(): Promise<{ message: string; checklists: TaskChecklist[] }> {
        const checklists = await this.taskChecklistService.findAll();
        return { message: 'Task checklists fetched successfully', checklists };
    }
    @Get(':id')
        async findOne(@Param('id') id: string): Promise<{ message: string; checklist: TaskChecklist | null }> {
            const checklist = await this.taskChecklistService.findOne(id);
            if (!checklist) throw new NotFoundException('Task checklist not found');
            return { message: 'Task checklist fetched successfully', checklist };
        }

    @Get('task/:taskId')
    async findByTaskId(@Param('taskId') taskId: string, @Req() req): Promise<{ checklists: TaskChecklist[] }> {
        const checklists = await this.taskChecklistService.findByTaskId(taskId);
        if (!checklists || checklists.length === 0) {
            throw new NotFoundException('No task checklists found for this task');
        }
        return { 
            // message: 'Task checklists fetched successfully', 
            checklists 
        };
    }


    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTaskChecklistDto: UpdateTaskChecklistDto): Promise<{ message: string; checklist: TaskChecklist | null }> {
        const checklist = await this.taskChecklistService.findOne(id);
        if (!checklist) throw new NotFoundException('Task checklist not found');
        const updatedChecklist = await this.taskChecklistService.update(id, updateTaskChecklistDto);
        return { message: 'Task checklist updated successfully', checklist: updatedChecklist };
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.taskChecklistService.remove(id);
    return { message: 'Task checklist deleted successfully' };
    }

}
