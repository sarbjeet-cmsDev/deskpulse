import { Controller, Get, Query } from "@nestjs/common";
import { TimelineService } from "./timeline.service";
import { Timeline } from "./timeline.interface";

@Controller("api/admin/timelines")
export class AdminTimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  async getAllTimelines(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 25,
    @Query("keyword") keyword?: string,
    @Query("sortOrder") sortOrder: "asc" | "desc" = "asc",
    @Query("start") start?: string,
    @Query("end") end?: string,
    @Query("projectId") projectId?: string
    ): Promise<{ data: Timeline[]; total: number; page: number; limit: number; totalPages: number;totalTimeSpent:number }> {
    return await this.timelineService.getAllTimelines(
      page,
      limit,
      keyword,
      sortOrder,
      start,
      end,
      projectId
    );
  }

  @Get("user")
    async findTimelineByUser(
      @Query("userIds") userIds?: string,
      @Query("page") page: number = 1,
      @Query("limit") limit: string = "25",
      @Query("start") start?: string,
      @Query("end") end?: string,
      @Query("sortOrder") sortOrder: "asc" | "desc" = "asc",
      @Query("projectId") projectId?: string
    ): Promise<{ data: Timeline[]; total: number; page: number; limit: number,totalPages: number, totalTimeSpent:number  }> {
      const limitNumber = parseInt(limit, 25);
  
      const userIdArray = userIds.split(",");
      return this.timelineService.findUsersTimeLine(
        userIdArray,
        page,
        limitNumber,
        sortOrder,
        start,
        end,
        projectId
      );
    }
}
