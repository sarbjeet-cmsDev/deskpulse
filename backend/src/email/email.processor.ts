import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import nodemailer from 'nodemailer';
import mjml2html from 'mjml';
import Handlebars from 'handlebars';
import { IEmailSender } from './email.interface';
const { readFile } = require('fs').promises;
const path = require('path')
require("dotenv").config();


@Processor('email')
export class EmailProcessor {
    private transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST,
        port: process.env.EMAIL_SMTP_PORT,
        secure: process.env.EMAIL_SMTP_SECURE,
        auth: {
            user: process.env.EMAIL_SMTP_USER,
            pass: process.env.EMAIL_SMTP_PASSWORD,
        },
    });

    async sendEmail(data: IEmailSender) {
        const mailOptions = Object.assign({}, {
            from: process.env.EMAIL_DEFAULT_FROM,
            subject: process.env.EMAIL_DEFAULT_SUBJECT
        }, data);

        if (mailOptions.template) {
            const html = await this.renderMjmlTemplate(
                path.join(process.cwd(), 'src', mailOptions.template),
                mailOptions.variables || {}
            );
            mailOptions.html = html;
        }
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (err) {
            console.error('Failed to send email:', err);
        }
    }

    @Process('send-email')
    async handleSendEmail(job: Job<IEmailSender>) {
        await this.sendEmail(job.data);
    }

    private async renderMjmlTemplate(filePath: string, variables: any): Promise<string> {
        const mjmlContent = await readFile(filePath, 'utf8');
        const template = Handlebars.compile(mjmlContent);
        const renderedMjml = template(variables);
        const { html, errors } = mjml2html(renderedMjml);
        // log(html)
        if (errors.length > 0) {
            throw new Error('Failed to render MJML template.');
        }
        return html;
    }
}