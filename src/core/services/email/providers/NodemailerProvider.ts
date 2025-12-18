// src/services/email/providers/NodemailerProvider.ts
import nodemailer, { Transporter } from "nodemailer";
import { IEmailProvider, EmailOptions, EmailResponse } from "../types";

export class NodemailerProvider implements IEmailProvider {
  private transporter: Transporter;
  private defaultFrom: string;

  constructor(config: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    defaultFrom: string;
  }) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
    this.defaultFrom = config.defaultFrom;
  }

  async send(options: EmailOptions): Promise<EmailResponse> {
    try {
      const result = await this.transporter.sendMail({
        from: options.from || this.defaultFrom,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
      });

      return {
        success: true,
        messageId: result.messageId,
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
    return "nodemailer";
  }
}
