import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskChecklist, TaskChecklistSchema } from './taskchecklist.schema';
import { TaskChecklistController } from './taskchecklist.controller';
import { TaskChecklistService } from './taskchecklist.service';
import { TaskModule } from 'src/task/task.module';
import { UserModule } from 'src/user/user.module'; // ✅ Import the module, not the service

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TaskChecklist.name, schema: TaskChecklistSchema }]),
    TaskModule,
    UserModule, // ✅ Corrected
  ],
  controllers: [TaskChecklistController],
  providers: [TaskChecklistService],
  exports: [TaskChecklistService],
})
export class TaskChecklistModule {}
