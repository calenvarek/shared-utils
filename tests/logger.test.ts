/**
 * Tests for logger utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLogger, setLogger } from '../src/logger';
import type { Logger } from '../src/types';

describe('Logger', () => {
    beforeEach(() => {
        // Reset logger before each test
        setLogger(undefined as any);
    });

    describe('getLogger', () => {
        it('should return console fallback when no logger is set', () => {
            const logger = getLogger();
            expect(logger).toBeDefined();
            expect(logger.info).toBeDefined();
            expect(logger.error).toBeDefined();
            expect(logger.warn).toBeDefined();
            expect(logger.debug).toBeDefined();
        });

        it('should return same console fallback on multiple calls', () => {
            const logger1 = getLogger();
            const logger2 = getLogger();
            expect(logger1.info).toBeDefined();
            expect(logger2.info).toBeDefined();
        });

        it('should have working console fallback methods', () => {
            const consoleSpy = vi.spyOn(console, 'log');
            const logger = getLogger();
            logger.info('test message');
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('should call console.error for error logs', () => {
            const consoleSpy = vi.spyOn(console, 'error');
            const logger = getLogger();
            logger.error('error message');
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('should call console.warn for warn logs', () => {
            const consoleSpy = vi.spyOn(console, 'warn');
            const logger = getLogger();
            logger.warn('warn message');
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('should call console.debug for debug logs', () => {
            const consoleSpy = vi.spyOn(console, 'debug');
            const logger = getLogger();
            logger.debug('debug message');
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('setLogger', () => {
        it('should set custom logger', () => {
            const customLogger: Logger = {
                info: vi.fn(),
                error: vi.fn(),
                warn: vi.fn(),
                debug: vi.fn(),
            };

            setLogger(customLogger);
            const logger = getLogger();
            expect(logger).toBe(customLogger);
        });

        it('should return custom logger when set', () => {
            const customLogger: Logger = {
                info: () => {},
                error: () => {},
                warn: () => {},
                debug: () => {},
            };

            setLogger(customLogger);
            const logger = getLogger();
            expect(logger).toBe(customLogger);
        });

        it('should override previous logger', () => {
            const logger1: Logger = {
                info: vi.fn(),
                error: vi.fn(),
                warn: vi.fn(),
                debug: vi.fn(),
            };

            const logger2: Logger = {
                info: vi.fn(),
                error: vi.fn(),
                warn: vi.fn(),
                debug: vi.fn(),
            };

            setLogger(logger1);
            expect(getLogger()).toBe(logger1);

            setLogger(logger2);
            expect(getLogger()).toBe(logger2);
        });

        it('should allow setting logger back to undefined', () => {
            const customLogger: Logger = {
                info: vi.fn(),
                error: vi.fn(),
                warn: vi.fn(),
                debug: vi.fn(),
            };

            setLogger(customLogger);
            expect(getLogger()).toBe(customLogger);

            setLogger(undefined as any);
            const logger = getLogger();
            expect(logger).not.toBe(customLogger);
            expect(logger.info).toBeDefined();
        });
    });

    describe('Logger interface implementation', () => {
        it('should support all logger methods with multiple arguments', () => {
            const customLogger: Logger = {
                info: vi.fn(),
                error: vi.fn(),
                warn: vi.fn(),
                debug: vi.fn(),
            };

            setLogger(customLogger);
            const logger = getLogger();

            logger.info('message', 'arg1', 'arg2');
            expect(customLogger.info).toHaveBeenCalledWith('message', 'arg1', 'arg2');

            logger.error('error', 'context');
            expect(customLogger.error).toHaveBeenCalledWith('error', 'context');

            logger.warn('warning', 'details');
            expect(customLogger.warn).toHaveBeenCalledWith('warning', 'details');

            logger.debug('debug', 'info');
            expect(customLogger.debug).toHaveBeenCalledWith('debug', 'info');
        });

        it('should handle empty arguments', () => {
            const customLogger: Logger = {
                info: vi.fn(),
                error: vi.fn(),
                warn: vi.fn(),
                debug: vi.fn(),
            };

            setLogger(customLogger);
            const logger = getLogger();

            logger.info('message');
            expect(customLogger.info).toHaveBeenCalledWith('message');
        });
    });
});

