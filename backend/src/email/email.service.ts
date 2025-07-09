import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EmailProcessor } from './email.processor';
import { IEmailSender } from './email.interface';



@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly emailProcessor: EmailProcessor
  ) {}

  async sendEmail(data: IEmailSender) {
    await this.emailQueue.add('send-email', data);
  }

  async instantEmail(data: IEmailSender) {
      await this.emailProcessor.sendEmail(data);
  }
}