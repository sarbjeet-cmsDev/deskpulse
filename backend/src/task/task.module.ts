import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskSchema } from './task.schema';
import { ProjectModule } from '../project/project.module'; // ✅ IMPORT

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]), ProjectModule],  // ✅ Add this line
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService], // ✅ EXPORT the service
})
export class TaskModule {}


