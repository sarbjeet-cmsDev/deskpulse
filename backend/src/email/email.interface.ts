export interface IEmailSender {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  variables?: any;
  template?: string;
}