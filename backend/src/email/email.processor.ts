import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
const mjml2html = require('mjml');
import Handlebars from 'handlebars';
import { IEmailSender } from './email.interface';
import { readFile } from 'fs/promises';
import * as path from 'path';
import 'dotenv/config';
import { log } from 'console';

@Processor('email')
export class EmailProcessor {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: Number(process.env.EMAIL_SMTP_PORT),
    secure: process.env.EMAIL_SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASSWORD,
    },
  } as SMTPTransport.Options);

  async sendEmail(data: IEmailSender) {
    const mailOptions = Object.assign(
      {
        from: process.env.EMAIL_DEFAULT_FROM,
        subject: process.env.EMAIL_DEFAULT_SUBJECT,
      },
      data
    );

    if (mailOptions.template) {
      const html = await this.renderMjmlTemplate(
        path.join(process.cwd(), 'src', mailOptions.template),
        mailOptions.variables || {}
      );
      mailOptions.html = html;
    }
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully.');
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  }

  @Process('send-email')
  async handleSendEmail(job: Job<IEmailSender>) {
    console.log('[Processor] Handling job:', job.id);
    await this.sendEmail(job.data);
  }

  private async renderMjmlTemplate(filePath: string, variables: any): Promise<string> {
    const mjmlContent = await readFile(filePath, 'utf8');
    const template = Handlebars.compile(mjmlContent);
    const renderedMjml = template(variables);
    const { html, errors } = mjml2html(renderedMjml);
    if (errors.length > 0) {
      console.error('MJML render errors:', errors);
      throw new Error('Failed to render MJML template.');
    }
    return html;
  }
}
