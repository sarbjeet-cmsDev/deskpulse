import { Controller, UseGuards, Get, Param, Req, Query } from "@nestjs/common";
import { PerformanceService } from "./performance.service";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { AdminGuard } from "src/guard/admin.guard";

@Controller("api/admin/performance")
@UseGuards(AdminGuard)
export class AdminPerformanceController {
  constructor(private readonly performanceService: PerformanceService) { }

  @Get("users-performance")
  async getAllUsersPerformance(
    @Query("userId") userId?: string,
    @Query("start") start?: string,
    @Query("end") end?: string
  ): Promise<any> {
    return this.performanceService.getPerformanceForAdmin(userId, start, end);
  }

  @Get("multipleUsers")
  async getAllPerformance(
    @Query("userIds") userIds?: string,
    @Query("start") start?: string,
    @Query("end") end?: string,
  ): Promise<any> {
    return this.performanceService.getAllPerformanceFromAdmin(userIds, start, end);
  }
}
