import { Controller, UseGuards, Get, Param, Req, Query } from "@nestjs/common";
import { PerformanceService } from "./performance.service";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";

@Controller("api/admin/performance")
@UseGuards(JwtAuthGuard)
export class AdminPerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get("users-performance")
  async getAllUsersPerformance(
    @Query("userId") userId?: string,
    @Query("start") start?: string,
    @Query("end") end?: string
  ): Promise<any> {
    return this.performanceService.getPerformanceForAdmin(userId, start, end);
  }
}
