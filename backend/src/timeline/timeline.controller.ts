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
} from "@nestjs/common";
import { CreateTimelineDto, UpdateTimelineDto } from "./timeline.dto";
import { Timeline } from "./timeline.interface";
import { TimelineService } from "./timeline.service";
import { CurrentUser } from "src/shared/current-user.decorator";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { log } from "console";

@Controller("api/timelines")
@UseGuards(JwtAuthGuard)
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}
  @Post()
  async create(
    @Body() createTimelineDto: CreateTimelineDto,
    @CurrentUser() user: any
  ): Promise<{ message: string; data: Timeline }> {
    createTimelineDto.created_by = user.userId; // Safe, server-side only
    const createdTimeline =
      await this.timelineService.create(createTimelineDto);
    return {
      message: "Timeline created successfully!",
      data: createdTimeline,
    };
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
    @Body() updateTimelineDto: UpdateTimelineDto
  ): Promise<Timeline> {
    return this.timelineService.update(id, updateTimelineDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.timelineService.remove(id);
    return {
      message: "Timeline deleted and task's time updated.",
    };
  }

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

  @Get("user/timeline/:userId")
  async findTimelineByUserId(
    @Param("userId") userId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ): Promise<{ data: Timeline[]; total: number; page: number; limit: number }> {
  
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 4, 1);

    return this.timelineService.findTimeLineByUserId(
      userId,
      pageNumber,
      limitNumber,
      startDate,
      endDate
    );
  }

  @Get("project/:projectId")
  async getByProject(
    @Param("projectId") projectId: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5"
  ): Promise<{ data: Timeline[]; total: number; page: number; limit: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.timelineService.findByProjectId(projectId, {
      from,
      to,
      page: pageNumber,
      limit: limitNumber,
    });
  }

  
}
