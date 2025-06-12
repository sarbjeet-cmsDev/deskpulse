import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelineController } from './timeline.controller';
import { TimelineService } from './timeline.service';
import { TimelineSchema } from './timeline.schema';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Timeline', schema: TimelineSchema }]), TaskModule],  // ✅ Add this line
  controllers: [TimelineController],
  providers: [TimelineService],
})
export class TimelineModule {}


