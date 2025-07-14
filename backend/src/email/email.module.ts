import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { EmailListener } from './email.listener';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    UserModule,ProjectModule,TaskModule
  ],
  providers: [EmailService, EmailProcessor, EmailListener],
  exports: [EmailService],
})
export class EmailModule {}
