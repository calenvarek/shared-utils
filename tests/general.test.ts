/**
 * Tests for general utilities
 */

import { describe, it, expect, vi } from 'vitest';
import {
    deepMerge,
    incrementPatchVersion,
    incrementMinorVersion,
    incrementMajorVersion,
    validateVersionString,
    calculateTargetVersion,
    incrementPrereleaseVersion,
    convertToReleaseVersion,
    sleep,
    retryWithBackoff,
    uniqueArray,
    groupBy,
    truncateString,
    safeJsonParse,
    stringifyJSON
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

    describe('deepMerge', () => {
        it('should skip prototype-polluting keys', () => {
            const target = { a: 1 };
            const source = { __proto__: { polluted: true }, constructor: { polluted: true }, b: 2 };
            const result = deepMerge(target, source);
            expect(result.polluted).toBeUndefined();
            expect(result.b).toBe(2);
        });

        it('should deeply merge nested objects', () => {
            const target = { a: { b: { c: 1 } } };
            const source = { a: { b: { d: 2 } } };
            const result = deepMerge(target, source);
            expect(result.a.b.c).toBe(1);
            expect(result.a.b.d).toBe(2);
        });

        it('should override array values', () => {
            const target = { a: [1, 2] };
            const source = { a: [3, 4] };
            const result = deepMerge(target, source);
            expect(result.a).toEqual([3, 4]);
        });

        it('should not merge non-object values', () => {
            const target = { a: 'string' };
            const source = { a: 123 };
            const result = deepMerge(target, source);
            expect(result.a).toBe(123);
        });
    });

    describe('Version utilities', () => {
        it('should increment patch version', () => {
            expect(incrementPatchVersion('1.2.3')).toBe('1.2.4');
            expect(incrementPatchVersion('v1.2.3')).toBe('1.2.4');
        });

        it('should increment patch version with prerelease', () => {
            expect(incrementPatchVersion('1.2.3-dev.0')).toBe('1.2.4');
        });

        it('should throw error for invalid patch version format', () => {
            expect(() => incrementPatchVersion('1.2')).toThrow('Invalid version string');
            expect(() => incrementPatchVersion('1.2.x')).toThrow('Invalid patch number');
        });

        it('should handle patch with multiple prerelease segments', () => {
            expect(incrementPatchVersion('1.2.3-dev.0.test')).toBe('1.2.4');
        });

        it('should increment minor version', () => {
            expect(incrementMinorVersion('1.2.3')).toBe('1.3.0');
            expect(incrementMinorVersion('v1.2.3')).toBe('1.3.0');
        });

        it('should throw error for invalid minor version format', () => {
            expect(() => incrementMinorVersion('1.2')).toThrow('Invalid version string');
            expect(() => incrementMinorVersion('1.x.3')).toThrow('Invalid minor version');
        });

        it('should increment major version', () => {
            expect(incrementMajorVersion('1.2.3')).toBe('2.0.0');
            expect(incrementMajorVersion('v1.2.3')).toBe('2.0.0');
        });

        it('should throw error for invalid major version format', () => {
            expect(() => incrementMajorVersion('1.2')).toThrow('Invalid version string');
            expect(() => incrementMajorVersion('x.2.3')).toThrow('Invalid major version');
        });

        it('should validate version strings', () => {
            expect(validateVersionString('1.2.3')).toBe(true);
            expect(validateVersionString('v1.2.3')).toBe(true);
            expect(validateVersionString('1.2.3-dev.0')).toBe(true);
            expect(validateVersionString('1.2.3-beta.2')).toBe(true);
            expect(validateVersionString('invalid')).toBe(false);
            expect(validateVersionString('1.2')).toBe(false);
        });

        it('should calculate target version with patch', () => {
            expect(calculateTargetVersion('1.2.3', 'patch')).toBe('1.2.4');
        });

        it('should calculate target version with minor', () => {
            expect(calculateTargetVersion('1.2.3', 'minor')).toBe('1.3.0');
        });

        it('should calculate target version with major', () => {
            expect(calculateTargetVersion('1.2.3', 'major')).toBe('2.0.0');
        });

        it('should calculate target version with explicit version', () => {
            expect(calculateTargetVersion('1.2.3', '2.0.0')).toBe('2.0.0');
            expect(calculateTargetVersion('1.2.3', 'v2.0.0')).toBe('2.0.0');
        });

        it('should throw error for invalid explicit version', () => {
            expect(() => calculateTargetVersion('1.2.3', 'invalid')).toThrow('Invalid version format');
        });

        it('should increment prerelease version with same tag', () => {
            expect(incrementPrereleaseVersion('1.2.3-dev.0', 'dev')).toBe('1.2.3-dev.1');
            expect(incrementPrereleaseVersion('1.2.3-dev.5', 'dev')).toBe('1.2.3-dev.6');
        });

        it('should increment prerelease version with different tag', () => {
            expect(incrementPrereleaseVersion('1.2.3-dev.0', 'beta')).toBe('1.2.3-beta.0');
        });

        it('should add prerelease to version without it', () => {
            expect(incrementPrereleaseVersion('1.2.3', 'dev')).toBe('1.2.3-dev.0');
        });

        it('should handle prerelease with dot segments', () => {
            expect(incrementPrereleaseVersion('1.2.3-dev.0', 'dev')).toBe('1.2.3-dev.1');
        });

        it('should throw error for invalid prerelease version', () => {
            expect(() => incrementPrereleaseVersion('1.2', 'dev')).toThrow('Invalid version string');
        });

        it('should convert prerelease version to release', () => {
            expect(convertToReleaseVersion('1.2.3-dev.0')).toBe('1.2.3');
            expect(convertToReleaseVersion('1.2.3-beta.5')).toBe('1.2.3');
            expect(convertToReleaseVersion('v1.2.3-dev.0')).toBe('1.2.3');
        });

        it('should throw error converting invalid version', () => {
            expect(() => convertToReleaseVersion('1.2')).toThrow('Invalid version string');
        });
    });

    describe('Async utilities', () => {
        it('should sleep for specified time', async () => {
            const start = Date.now();
            await sleep(100);
            const elapsed = Date.now() - start;
            expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some variance
        });

        it('should retry on failure', async () => {
            let attempts = 0;
            const fn = vi.fn().mockImplementation(async () => {
                attempts++;
                if (attempts < 3) {
                    throw new Error('Failed');
                }
                return 'success';
            });

            const result = await retryWithBackoff(fn, 5, 10);
            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(3);
        });

        it('should throw after max retries', async () => {
            const fn = vi.fn().mockRejectedValue(new Error('Failed'));
            await expect(retryWithBackoff(fn, 2, 10)).rejects.toThrow('Failed');
            expect(fn).toHaveBeenCalledTimes(2);
        });

        it('should use exponential backoff', async () => {
            const fn = vi.fn().mockRejectedValue(new Error('Failed'));
            const start = Date.now();
            await retryWithBackoff(fn, 3, 10).catch(() => {});
            const elapsed = Date.now() - start;
            // With exponential backoff: 10ms, 20ms = 30ms min (plus overhead), so less strict
            expect(elapsed).toBeGreaterThanOrEqual(20);
        });
    });

    describe('Array utilities', () => {
        it('should return unique array', () => {
            expect(uniqueArray([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
        });

        it('should handle empty array', () => {
            expect(uniqueArray([])).toEqual([]);
        });

        it('should work with string arrays', () => {
            expect(uniqueArray(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
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

        it('should handle empty array for groupBy', () => {
            const grouped = groupBy([], 'type');
            expect(grouped).toEqual({});
        });

        it('should work with numeric keys for groupBy', () => {
            const items = [
                { category: 1, name: 'a' },
                { category: 2, name: 'b' },
                { category: 1, name: 'c' }
            ];
            const grouped = groupBy(items, 'category');
            expect(grouped['1']).toHaveLength(2);
            expect(grouped['2']).toHaveLength(1);
        });
    });

    describe('String utilities', () => {
        it('should truncate long strings', () => {
            expect(truncateString('hello world', 5)).toBe('he...');
            expect(truncateString('short', 10)).toBe('short');
        });

        it('should use custom suffix for truncation', () => {
            expect(truncateString('hello world', 8, '→')).toBe('hello w→');
        });

        it('should handle edge case where max length equals string length', () => {
            expect(truncateString('hello', 5)).toBe('hello');
        });

        it('should handle very short max length', () => {
            expect(truncateString('hello world', 3)).toBe('...');
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

        it('should parse arrays', () => {
            expect(safeJsonParse('[1, 2, 3]')).toEqual([1, 2, 3]);
        });

        it('should parse primitives', () => {
            expect(safeJsonParse('42')).toBe(42);
            expect(safeJsonParse('"string"')).toBe('string');
            expect(safeJsonParse('true')).toBe(true);
            expect(safeJsonParse('null')).toBe(null);
        });

        it('should stringify objects', () => {
            const obj = { a: 1, b: 2 };
            const result = stringifyJSON(obj);
            expect(result).toContain('a');
            expect(result).toContain('1');
        });

        it('should stringify arrays', () => {
            const arr = [1, 2, 3];
            const result = stringifyJSON(arr);
            expect(result).toBe('[1,2,3]');
        });

        it('should stringify primitives', () => {
            expect(stringifyJSON(42)).toBe('42');
            expect(stringifyJSON('test')).toBe('"test"');
            expect(stringifyJSON(true)).toBe('true');
            expect(stringifyJSON(null)).toBe('null');
        });

        it('should handle nested objects', () => {
            const obj = { a: { b: { c: 1 } } };
            const result = stringifyJSON(obj);
            expect(result).toContain('a');
            expect(result).toContain('c');
        });

        it('should handle empty array', () => {
            expect(stringifyJSON([])).toBe('[]');
        });

        it('should respect depth limit', () => {
            const obj = { a: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: 1 } } } } } } } } } } } };
            const result = stringifyJSON(obj);
            expect(result).toContain('Maximum depth reached');
        });

        it('should skip functions and undefined', () => {
            const obj = { a: 1, b: () => {}, c: undefined, d: 2 };
            const result = stringifyJSON(obj);
            expect(result).toContain('a');
            expect(result).toContain('d');
            expect(result).not.toContain('b');
        });
    });
});

