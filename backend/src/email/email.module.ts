import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { EmailListener } from './email.listener';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    UserModule,
  ],
  providers: [EmailService, EmailProcessor, EmailListener],
  exports: [EmailService],
})
export class EmailModule {}
