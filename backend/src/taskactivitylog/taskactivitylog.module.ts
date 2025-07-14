import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskactivitylogController } from './taskactivitylog.controller';
import { Taskactivitylog, TaskChecklistSchema } from './taskactivitylog.schema';
import { TaskactivitylogService } from './taskactivitylog.service';
import { TaskActivityLogListener } from './taskactivitylog.listener';
import { UserModule } from 'src/user/user.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Taskactivitylog.name, schema: TaskChecklistSchema },
    ]),
    UserModule,
    forwardRef(() => TaskModule), // ✅ Use forwardRef here
  ],
  controllers: [TaskactivitylogController],
  providers: [TaskactivitylogService, TaskActivityLogListener],
  exports: [TaskactivitylogService],
})
export class TaskactivitylogModule {}
