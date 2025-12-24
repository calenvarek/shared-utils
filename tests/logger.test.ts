/**
 * Tests for logger utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getLogger, setLogger } from '../src/logger';
import type { Logger } from '../src/types';

describe('Logger', () => {
    beforeEach(() => {
        // Reset logger before each test
        setLogger(undefined as any);
    });

    it('should return console fallback when no logger is set', () => {
        const logger = getLogger();
        expect(logger).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.error).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.debug).toBeDefined();
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
});

