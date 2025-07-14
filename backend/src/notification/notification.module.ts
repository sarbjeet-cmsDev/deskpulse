import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationListener } from './notification.listener';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    UserModule, ProjectModule ,TaskModule

  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationListener],  // <== Add listener here
  exports: [NotificationService],
})
export class NotificationModule { }
