/**
 * Tests for validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
    validateString,
    validateNumber,
    validateBoolean,
    validateArray,
    validateObject,
    validateNonEmptyString,
    validateEnum
} from '../src/validation';

describe('Validation', () => {
    describe('validateString', () => {
        it('should validate string values', () => {
            expect(validateString('hello')).toBe('hello');
        });

        it('should throw for non-string values', () => {
            expect(() => validateString(123)).toThrow('value must be a string');
        });
    });

    describe('validateNumber', () => {
        it('should validate number values', () => {
            expect(validateNumber(123)).toBe(123);
        });

        it('should throw for non-number values', () => {
            expect(() => validateNumber('123')).toThrow('value must be a valid number');
        });
    });

    describe('validateBoolean', () => {
        it('should validate boolean values', () => {
            expect(validateBoolean(true)).toBe(true);
            expect(validateBoolean(false)).toBe(false);
        });

        it('should throw for non-boolean values', () => {
            expect(() => validateBoolean(1)).toThrow('value must be a boolean');
        });
    });

    describe('validateArray', () => {
        it('should validate array values', () => {
            const arr = [1, 2, 3];
            expect(validateArray(arr)).toBe(arr);
        });

        it('should throw for non-array values', () => {
            expect(() => validateArray('not array')).toThrow('value must be an array');
        });
    });

    describe('validateObject', () => {
        it('should validate object values', () => {
            const obj = { a: 1 };
            expect(validateObject(obj)).toBe(obj);
        });

        it('should throw for non-object values', () => {
            expect(() => validateObject('not object')).toThrow('value must be an object');
            expect(() => validateObject(null)).toThrow('value must be an object');
            expect(() => validateObject([1, 2])).toThrow('value must be an object');
        });
    });

    describe('validateNonEmptyString', () => {
        it('should validate non-empty strings', () => {
            expect(validateNonEmptyString('hello')).toBe('hello');
        });

        it('should throw for empty strings', () => {
            expect(() => validateNonEmptyString('')).toThrow('value must not be empty');
            expect(() => validateNonEmptyString('   ')).toThrow('value must not be empty');
        });
    });

    describe('validateEnum', () => {
        it('should validate enum values', () => {
            const allowed = ['a', 'b', 'c'] as const;
            expect(validateEnum('a', allowed)).toBe('a');
        });

        it('should throw for invalid enum values', () => {
            const allowed = ['a', 'b', 'c'] as const;
            expect(() => validateEnum('d', allowed)).toThrow('value must be one of: a, b, c');
        });
    });
});

