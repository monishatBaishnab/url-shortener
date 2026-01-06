/* eslint-disable @typescript-eslint/no-explicit-any */
import { NODE_ENV } from "@/config/config";

// Simple function-based approach
export const logger = {
  log: (...args: any[]) => {
    if (NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (NODE_ENV === 'development') {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (NODE_ENV === 'development') {
      console.info(...args);
    }
  },
};
