import { Controller, UseGuards, Get, Param,Req,Query } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('api/performance')
@UseGuards(JwtAuthGuard)
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

   @Get('task')
  async getPerformanceByTask(
    @Req() req: any,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.performanceService.getPerformanceByTaskandUserId(req.user.userId,start,end);
  }

}
