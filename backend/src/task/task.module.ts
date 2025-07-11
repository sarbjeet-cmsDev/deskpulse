import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskSchema } from './task.schema';
import { ProjectModule } from '../project/project.module';
import { TaskactivitylogModule } from 'src/taskactivitylog/taskactivitylog.module';
import { UserModule } from 'src/user/user.module';
import { TaskListener } from './task.listener';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    ProjectModule, UserModule],
  controllers: [TaskController],
  providers: [TaskService, TaskactivitylogModule, TaskListener
  ],
  exports: [TaskService],
})
export class TaskModule { }
