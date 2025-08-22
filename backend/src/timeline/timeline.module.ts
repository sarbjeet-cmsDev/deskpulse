import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelineController } from './timeline.controller';
import { TimelineService } from './timeline.service';
import { TimelineSchema } from './timeline.schema';
import { TaskModule } from 'src/task/task.module';
import { ProjectModule } from 'src/project/project.module';
import { UserModule } from 'src/user/user.module';
import { AdminTimelineController } from './admin.timeline.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Timeline', schema: TimelineSchema }]),
    TaskModule,
    ProjectModule, // ✅ Correct! Import the module that provides ProjectService
    UserModule
  ],
  controllers: [TimelineController,AdminTimelineController],
  providers: [TimelineService],
})
export class TimelineModule {}



