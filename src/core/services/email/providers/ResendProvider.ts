// src/services/email/providers/ResendProvider.ts
import { Resend } from "resend";
import { IEmailProvider, EmailOptions, EmailResponse } from "../types";

export class ResendProvider implements IEmailProvider {
  private client: Resend;
  private defaultFrom: string;

  constructor(apiKey: string, defaultFrom: string) {
    this.client = new Resend(apiKey);
    this.defaultFrom = defaultFrom;
  }

  async send(options: EmailOptions): Promise<EmailResponse> {
    try {
      // Construir el objeto solo con los campos que tienen valor
      const emailData: any = {
        from: options.from || this.defaultFrom,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
      };

      // Solo agregar campos opcionales si tienen valor
      if (options.text) {
        emailData.text = options.text;
      }

      if (options.html) {
        emailData.html = options.html;
      }

      if (options.cc) {
        emailData.cc = Array.isArray(options.cc) ? options.cc : [options.cc];
      }

      if (options.bcc) {
        emailData.bcc = Array.isArray(options.bcc)
          ? options.bcc
          : [options.bcc];
      }

      if (options.attachments && options.attachments.length > 0) {
        // Resend espera attachments en un formato específico
        emailData.attachments = options.attachments.map((att) => ({
          filename: att.filename,
          content: att.content,
          path: att.path,
        }));
      }

      const result = await this.client.emails.send(emailData);

      return {
        success: true,
        messageId: result.data?.id,
        provider: this.getName(),
      };
    } catch (error) {
      return {
        success: false,
        provider: this.getName(),
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  getName(): string {
    return "resend";
  }
}
