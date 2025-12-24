/**
 * Shared types for @eldrforge packages
 */

export interface Logger {
  error: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

export interface StorageOptions {
  encoding?: BufferEncoding;
  atomic?: boolean;
  createDirectories?: boolean;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

