import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceSchema } from './performance.schema';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { PerformanceListener } from './performance.listener';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Performance.name, schema: PerformanceSchema },
    ]),
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService, PerformanceListener],  // <== Add listener here
  exports: [PerformanceService],
})
export class PerformanceModule {}
