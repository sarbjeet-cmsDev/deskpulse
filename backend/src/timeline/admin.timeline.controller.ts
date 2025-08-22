import { Controller, Get, Query } from "@nestjs/common";
import { TimelineService } from "./timeline.service";
import { Timeline } from "./timeline.interface";

@Controller("api/admin/timelines")
export class AdminTimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  async getAllTimelines(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("keyword") keyword?: string,
    @Query("sortOrder") sortOrder: "asc" | "desc" = "asc",
    @Query("start") start?: string,
    @Query("end") end?: string
    ): Promise<{ data: Timeline[]; total: number; page: number; limit: number; totalPages: number }> {
    return await this.timelineService.getAllTimelines(
      page,
      limit,
      keyword,
      sortOrder,
       start,
      end
    );
  }
}
