// src/services/email/EmailService.ts
import {
  IEmailProvider,
  EmailOptions,
  EmailResponse,
  EmailProvider,
} from "./types";
import { ResendProvider } from "./providers/ResendProvider";
import { NodemailerProvider } from "./providers/NodemailerProvider";

export class EmailService {
  private providers: Map<string, IEmailProvider> = new Map();
  private currentProvider: IEmailProvider;

  constructor(defaultProvider: EmailProvider = EmailProvider.RESEND) {
    this.initializeProviders();

    const provider = this.providers.get(defaultProvider);
    if (!provider) {
      throw new Error(`Provider ${defaultProvider} not found`);
    }

    this.currentProvider = provider;
  }

  private initializeProviders(): void {
    // Inicializar Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM_EMAIL || "noreply@example.com";

    if (resendApiKey) {
      this.providers.set(
        EmailProvider.RESEND,
        new ResendProvider(resendApiKey, resendFrom),
      );
    }

    // Inicializar Nodemailer
    const nodemailerHost = process.env.SMTP_HOST;
    const nodemailerPort = process.env.SMTP_PORT;
    const nodemailerUser = process.env.SMTP_USER;
    const nodemailerPass = process.env.SMTP_PASS;
    const nodemailerFrom = process.env.SMTP_FROM_EMAIL || "noreply@example.com";

    if (nodemailerHost && nodemailerPort && nodemailerUser && nodemailerPass) {
      this.providers.set(
        EmailProvider.NODEMAILER,
        new NodemailerProvider({
          host: nodemailerHost,
          port: parseInt(nodemailerPort),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: nodemailerUser,
            pass: nodemailerPass,
          },
          defaultFrom: nodemailerFrom,
        }),
      );
    }
  }

  /**
   * Cambiar el proveedor actual
   */
  setProvider(provider: EmailProvider): void {
    const selectedProvider = this.providers.get(provider);
    if (!selectedProvider) {
      throw new Error(`Provider ${provider} not configured or not found`);
    }
    this.currentProvider = selectedProvider;
  }

  /**
   * Obtener el proveedor actual
   */
  getCurrentProvider(): string {
    return this.currentProvider.getName();
  }

  /**
   * Obtener lista de proveedores disponibles
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Enviar email con el proveedor actual
   */
  async send(options: EmailOptions): Promise<EmailResponse> {
    return this.currentProvider.send(options);
  }

  /**
   * Enviar email con un proveedor específico
   */
  async sendWith(
    provider: EmailProvider,
    options: EmailOptions,
  ): Promise<EmailResponse> {
    const selectedProvider = this.providers.get(provider);
    if (!selectedProvider) {
      throw new Error(`Provider ${provider} not configured or not found`);
    }
    return selectedProvider.send(options);
  }

  /**
   * Enviar con fallback: intenta con el proveedor actual, si falla usa el siguiente
   */
  async sendWithFallback(options: EmailOptions): Promise<EmailResponse> {
    const providers = Array.from(this.providers.values());

    for (const provider of providers) {
      const result = await provider.send(options);
      if (result.success) {
        return result;
      }
      console.warn(
        `Failed to send with ${provider.getName()}, trying next provider...`,
      );
    }

    return {
      success: false,
      provider: "none",
      error: "All providers failed",
    };
  }
}
