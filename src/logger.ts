/**
 * Logger utilities
 * Provides optional Winston integration with console fallback
 */

import type { Logger } from './types';

let logger: Logger | undefined;

/**
 * Set the logger instance
 */
export function setLogger(newLogger: Logger): void {
    logger = newLogger;
}

/**
 * Get the current logger or create a console fallback
 */
export function getLogger(): Logger {
    if (logger) {
        return logger;
    }

    // Console fallback
    /* eslint-disable no-console */
    return {
        error: (message: string, ...args: any[]) => console.error(message, ...args),
        warn: (message: string, ...args: any[]) => console.warn(message, ...args),
        info: (message: string, ...args: any[]) => console.log(message, ...args),
        debug: (message: string, ...args: any[]) => console.debug(message, ...args),
    };
    /* eslint-enable no-console */
}

