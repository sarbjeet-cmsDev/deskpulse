import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskSchema } from './task.schema';
import { ProjectModule } from '../project/project.module';
import { TaskactivitylogModule } from 'src/taskactivitylog/taskactivitylog.module';
import { UserModule } from 'src/user/user.module';
import { TaskListener } from './task.listener';
import { AdminTaskController } from './admin.task.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    forwardRef(() => ProjectModule),   // <-- fixed
    UserModule,
    TaskactivitylogModule,
  ],
  controllers: [TaskController, AdminTaskController],
  providers: [TaskService, TaskListener], // removed module from providers
  exports: [TaskService],
})
export class TaskModule { }
