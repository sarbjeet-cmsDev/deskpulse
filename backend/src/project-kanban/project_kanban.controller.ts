import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards
} from '@nestjs/common';
import { ProjectKanbanService } from './project_kanban.service';
import { CreateKanbanDto, UpdateKanbanDto } from './project_kanban.dto';
import { ProjectKanbanDocument } from './project_kanban.interface';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
@Controller('project-kanban')
export class ProjectKanbanController {
  constructor(private readonly kanbanService: ProjectKanbanService) { }
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateKanbanDto): Promise<{
    message: string;
    data: ProjectKanbanDocument;
  }> {
    const data = await this.kanbanService.create(dto);
    return {
      message: 'Kanban column created successfully',
      data,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get(':projectId')
  async getAll(@Param('projectId') projectId: string): Promise<{
    message: string;
    data: ProjectKanbanDocument[];
  }> {
    const data = await this.kanbanService.findByProject(projectId);
    return {
      message: 'Kanban columns fetched successfully',
      data,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateKanbanDto,
  ): Promise<{
    message: string;
    data: ProjectKanbanDocument;
  }> {
    const data = await this.kanbanService.update(id, dto);
    return {
      message: 'Kanban column updated successfully',
      data,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{
    message: string;
    data: ProjectKanbanDocument;
  }> {
    const data = await this.kanbanService.delete(id);
    return {
      message: 'Kanban column deleted successfully',
      data,
    };
  }
}
