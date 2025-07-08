import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Taskactivitylog, TaskChecklistSchema } from './taskactivitylog.schema';
import { TaskactivitylogController } from './taskactivitylog.controller';
import { TaskactivitylogService } from './taskactivitylog.service';
import { TaskActivityLogListener } from './taskactivitylog.listener';  // Import your listener

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Taskactivitylog.name, schema: TaskChecklistSchema }]),
  ],
  controllers: [TaskactivitylogController],
  providers: [TaskactivitylogService, TaskActivityLogListener],  // add listener here
  exports: [TaskactivitylogService],
})
export class TaskactivitylogModule {}
