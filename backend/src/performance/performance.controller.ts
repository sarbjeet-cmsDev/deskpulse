import { Controller, UseGuards, Get, Param,Req } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('api/performance')
@UseGuards(JwtAuthGuard)
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

   @Get('task')
  async getPerformanceByTask(@Req() req: any,) {
    return this.performanceService.getPerformanceByTaskandUserId(req.user.userId,);
  }

}
