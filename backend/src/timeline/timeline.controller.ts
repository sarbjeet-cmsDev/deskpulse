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
import { CreateTimelineDto } from './timeline.dto';
import { Timeline } from './timeline.interface';
import { TimelineService } from './timeline.service';
import { get } from 'http';

@Controller('timelines')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}
    @Post()
    async create(@Body() createTimelineDto: CreateTimelineDto): Promise<Timeline> {
      return this.timelineService.create(createTimelineDto);
    }
    @Get()
    async findAll(
      @Query('task') task?: string,
      @Query('user') user?: string,
      @Query('is_active') is_active?: boolean,
    ): Promise<Timeline[]> {
      return this.timelineService.findAll();
    }
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Timeline> {
      return this.timelineService.findOne(id);
    }

    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updateTimelineDto: CreateTimelineDto,
    ): Promise<Timeline> {
      return this.timelineService.update(id, updateTimelineDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Timeline> {
      return this.timelineService.remove(id);
    }

    @Get('task/:taskId')
    async findByTaskId(@Param('taskId') taskId: string): Promise<Timeline[]> {
      return this.timelineService.findByTaskId(taskId);
    }
    @Get('user/:userId')
    async findByUserId(@Param('userId') userId: string): Promise<Timeline[]> {
      return this.timelineService.findByUserId(userId);
    }

    @Get('project/:projectId')
    async getByProject(
      @Param('projectId') projectId: string,
      @Query('from') from?: string,
      @Query('to') to?: string,
    ): Promise<Timeline[]> {
      return this.timelineService.findByProjectId(projectId, from, to);
    }

    

}
