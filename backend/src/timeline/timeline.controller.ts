import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { CreateTimelineDto } from "./timeline.dto";
import { Timeline } from "./timeline.interface";
import { TimelineService } from "./timeline.service";
import { get } from "http";

@Controller("api/timelines")
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}
  @Post()
  async create(
    @Body() createTimelineDto: CreateTimelineDto
  ): Promise<Timeline> {
    return this.timelineService.create(createTimelineDto);
  }
  @Get()
  async findAll(
    @Query("task") task?: string,
    @Query("user") user?: string,
    @Query("is_active") is_active?: boolean
  ): Promise<Timeline[]> {
    return this.timelineService.findAll();
  }
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Timeline> {
    return this.timelineService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTimelineDto: CreateTimelineDto
  ): Promise<Timeline> {
    return this.timelineService.update(id, updateTimelineDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Timeline> {
    return this.timelineService.remove(id);
  }

  // @Get('task/:taskId')
  // async findByTaskId(@Param('taskId') taskId: string, @Query('page') page: string = '1',  @Query('limit') limit: string = '10'): Promise<{Timeline[]; total: number; page: number; limit: number }> {
  //     const pageNumber = parseInt(page, 10);
  //     const limitNumber = parseInt(limit, 10);
  //   return this.timelineService.findByTaskId(taskId, pageNumber, limitNumber);
  // }

  @Get("task/:taskId")
  async findByTaskId(
    @Param("taskId") taskId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5"
  ): Promise<{ data: Timeline[]; total: number; page: number; limit: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.timelineService.findByTaskId(taskId, pageNumber, limitNumber);
  }
  @Get("user/:userId")
  async findByUserId(@Param("userId") userId: string): Promise<Timeline[]> {
    return this.timelineService.findByUserId(userId);
  }

  @Get("project/:projectId")
  async getByProject(
    @Param("projectId") projectId: string,
    @Query("from") from?: string,
    @Query("to") to?: string
  ): Promise<Timeline[]> {
    return this.timelineService.findByProjectId(projectId, from, to);
  }
}
