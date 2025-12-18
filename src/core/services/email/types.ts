// src/services/email/types.ts
export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
  }>;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
}

export enum EmailProvider {
  RESEND = "resend",
  NODEMAILER = "nodemailer",
}

export interface IEmailProvider {
  send(options: EmailOptions): Promise<EmailResponse>;
  getName(): string;
}
