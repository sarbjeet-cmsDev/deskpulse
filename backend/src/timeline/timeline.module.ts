import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelineController } from './timeline.controller';
import { TimelineService } from './timeline.service';
import { TimelineSchema } from './timeline.schema';
import { TaskModule } from 'src/task/task.module';
import { ProjectModule } from 'src/project/project.module';
import { UserModule } from 'src/user/user.module';
import { AdminTimelineController } from './admin.timeline.controller';
import { TaskSchema } from 'src/task/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Timeline', schema: TimelineSchema },{ name: "Task", schema: TaskSchema },]),
    TaskModule,
    ProjectModule, 
    UserModule
  ],
  controllers: [TimelineController,AdminTimelineController],
  providers: [TimelineService],
})
export class TimelineModule {}



