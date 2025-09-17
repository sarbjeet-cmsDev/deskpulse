import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskChecklist, TaskChecklistSchema } from './taskchecklist.schema';
import { TaskChecklistController } from './taskchecklist.controller';
import { TaskChecklistService } from './taskchecklist.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TaskChecklist.name, schema: TaskChecklistSchema }]),
  ],
  controllers: [TaskChecklistController],
  providers: [TaskChecklistService],
  exports: [TaskChecklistService],
})
export class TaskChecklistModule {}
