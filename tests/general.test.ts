/**
 * Tests for general utilities
 */

import { describe, it, expect } from 'vitest';
import {
    deepMerge,
    incrementPatchVersion,
    incrementMinorVersion,
    incrementMajorVersion,
    validateVersionString,
    sleep,
    uniqueArray,
    groupBy,
    truncateString,
    safeJsonParse
} from '../src/general';

describe('General Utilities', () => {
    describe('deepMerge', () => {
        it('should merge objects deeply', () => {
            const target = { a: 1, b: { c: 2 } };
            const source = { b: { d: 3 }, e: 4 };
            const result = deepMerge(target, source);
            expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
        });
    });

    describe('Version utilities', () => {
        it('should increment patch version', () => {
            expect(incrementPatchVersion('1.2.3')).toBe('1.2.4');
            expect(incrementPatchVersion('v1.2.3')).toBe('1.2.4');
        });

        it('should increment minor version', () => {
            expect(incrementMinorVersion('1.2.3')).toBe('1.3.0');
            expect(incrementMinorVersion('v1.2.3')).toBe('1.3.0');
        });

        it('should increment major version', () => {
            expect(incrementMajorVersion('1.2.3')).toBe('2.0.0');
            expect(incrementMajorVersion('v1.2.3')).toBe('2.0.0');
        });

        it('should validate version strings', () => {
            expect(validateVersionString('1.2.3')).toBe(true);
            expect(validateVersionString('v1.2.3')).toBe(true);
            expect(validateVersionString('1.2.3-dev.0')).toBe(true);
            expect(validateVersionString('invalid')).toBe(false);
        });
    });

    describe('Async utilities', () => {
        it('should sleep for specified time', async () => {
            const start = Date.now();
            await sleep(100);
            const elapsed = Date.now() - start;
            expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some variance
        });
    });

    describe('Array utilities', () => {
        it('should return unique array', () => {
            expect(uniqueArray([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
        });

        it('should group by key', () => {
            const items = [
                { type: 'a', value: 1 },
                { type: 'b', value: 2 },
                { type: 'a', value: 3 }
            ];
            const grouped = groupBy(items, 'type');
            expect(grouped.a).toHaveLength(2);
            expect(grouped.b).toHaveLength(1);
        });
    });

    describe('String utilities', () => {
        it('should truncate long strings', () => {
            expect(truncateString('hello world', 5)).toBe('he...');
            expect(truncateString('short', 10)).toBe('short');
        });
    });

    describe('JSON utilities', () => {
        it('should safely parse valid JSON', () => {
            expect(safeJsonParse('{"a":1}')).toEqual({ a: 1 });
        });

        it('should return null for invalid JSON', () => {
            expect(safeJsonParse('invalid')).toBeNull();
        });

        it('should return fallback for invalid JSON', () => {
            expect(safeJsonParse('invalid', { default: true })).toEqual({ default: true });
        });
    });
});

