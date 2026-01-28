import fs from "fs";
import path from "path";

type LogLevel = "INFO" | "WARN" | "ERROR" | "HTTP_ERROR";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  method?: string;
  url?: string;
  statusCode?: number;
  ip?: string;
  userId?: string | number;
  stack?: string;
  details?: unknown;
}

class Logger {
  private logDir: string;
  private errorLogPath: string;
  private httpErrorLogPath: string;

  constructor() {
    this.logDir = path.join(process.cwd(), "logs");
    this.errorLogPath = path.join(this.logDir, "errors.log");
    this.httpErrorLogPath = path.join(this.logDir, "http-errors.log");
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatLogEntry(entry: LogEntry): string {
    const lines = [
      `[${entry.timestamp}] [${entry.level}]`,
      `Message: ${entry.message}`,
    ];

    if (entry.method) lines.push(`Method: ${entry.method}`);
    if (entry.url) lines.push(`URL: ${entry.url}`);
    if (entry.statusCode) lines.push(`Status Code: ${entry.statusCode}`);
    if (entry.ip) lines.push(`IP: ${entry.ip}`);
    if (entry.userId) lines.push(`User ID: ${entry.userId}`);
    if (entry.stack) lines.push(`Stack Trace:\n${entry.stack}`);
    if (entry.details) {
      lines.push(`Details: ${JSON.stringify(entry.details, null, 2)}`);
    }

    return lines.join("\n") + "\n" + "=".repeat(80) + "\n\n";
  }

  private writeToFile(filePath: string, content: string): void {
    try {
      fs.appendFileSync(filePath, content, "utf8");
    } catch (err) {
      console.error("Failed to write to log file:", err);
    }
  }

  private getRotatedLogPath(basePath: string): string {
    const date = new Date().toISOString().split("T")[0];
    const ext = path.extname(basePath);
    const name = path.basename(basePath, ext);
    const dir = path.dirname(basePath);
    return path.join(dir, `${name}-${date}${ext}`);
  }

  error(message: string, error?: Error | unknown, details?: unknown): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: "ERROR",
      message,
      details,
    };

    if (error instanceof Error) {
      entry.stack = error.stack;
      entry.details = { ...((entry.details as object) || {}), errorMessage: error.message };
    } else if (error) {
      entry.details = { ...((entry.details as object) || {}), error };
    }

    const logContent = this.formatLogEntry(entry);
    this.writeToFile(this.getRotatedLogPath(this.errorLogPath), logContent);

    // Also log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error(`[ERROR] ${message}`, error);
    }
  }

  httpError(
    statusCode: number,
    message: string,
    req: {
      method?: string;
      originalUrl?: string;
      url?: string;
      ip?: string;
      user?: { id?: string | number };
    },
    error?: Error | unknown
  ): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: "HTTP_ERROR",
      message,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode,
      ip: req.ip,
      userId: req.user?.id,
    };

    if (error instanceof Error) {
      entry.stack = error.stack;
      entry.details = { errorMessage: error.message };
    } else if (error) {
      entry.details = { error };
    }

    const logContent = this.formatLogEntry(entry);
    this.writeToFile(this.getRotatedLogPath(this.httpErrorLogPath), logContent);

    // Also log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error(`[HTTP ${statusCode}] ${req.method} ${req.originalUrl || req.url} - ${message}`);
    }
  }

  warn(message: string, details?: unknown): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: "WARN",
      message,
      details,
    };

    const logContent = this.formatLogEntry(entry);
    this.writeToFile(this.getRotatedLogPath(this.errorLogPath), logContent);
  }

  info(message: string, details?: unknown): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[INFO] ${message}`, details || "");
    }
  }
}

export const logger = new Logger();
