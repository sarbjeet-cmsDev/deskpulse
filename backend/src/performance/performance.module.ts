import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PerformanceSchema } from "./performance.schema";
import { PerformanceService } from "./performance.service";
import { PerformanceController } from "./performance.controller";
import { PerformanceListener } from "./performance.listener";
import { TaskModule } from "src/task/task.module";
import { AdminPerformanceController } from "./admin.performance.controller";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Performance.name, schema: PerformanceSchema },
    ]),
    TaskModule,
    UserModule
  ],
  controllers: [PerformanceController, AdminPerformanceController],
  providers: [PerformanceService, PerformanceListener], // <== Add listener here
  exports: [PerformanceService],
})
export class PerformanceModule {}
