/**
 * Runtime validation utilities for safe type handling
 */

import type { ValidationResult } from './types';

/**
 * Generic validation function that validates data against a schema
 * @param data Data to validate
 * @param schema Validation schema (can be a Zod schema or custom validator)
 * @returns ValidationResult with success status and either data or error
 */
export const validate = <T>(
    data: unknown,
    schema: { parse: (data: unknown) => T }
): ValidationResult<T> => {
    try {
        const validated = schema.parse(data);
        return { success: true, data: validated };
    } catch (error) {
        return { success: false, error: String(error) };
    }
};

/**
 * Validates that a value is a string
 */
export const validateString = (value: unknown, fieldName: string = 'value'): string => {
    if (typeof value !== 'string') {
        throw new Error(`${fieldName} must be a string`);
    }
    return value;
};

/**
 * Validates that a value is a number
 */
export const validateNumber = (value: unknown, fieldName: string = 'value'): number => {
    if (typeof value !== 'number' || isNaN(value)) {
        throw new Error(`${fieldName} must be a valid number`);
    }
    return value;
};

/**
 * Validates that a value is a boolean
 */
export const validateBoolean = (value: unknown, fieldName: string = 'value'): boolean => {
    if (typeof value !== 'boolean') {
        throw new Error(`${fieldName} must be a boolean`);
    }
    return value;
};

/**
 * Validates that a value is an array
 */
export const validateArray = <T>(value: unknown, fieldName: string = 'value'): T[] => {
    if (!Array.isArray(value)) {
        throw new Error(`${fieldName} must be an array`);
    }
    return value;
};

/**
 * Validates that a value is an object (and not null or array)
 */
export const validateObject = (value: unknown, fieldName: string = 'value'): Record<string, any> => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error(`${fieldName} must be an object`);
    }
    return value as Record<string, any>;
};

/**
 * Validates that a string is not empty
 */
export const validateNonEmptyString = (value: unknown, fieldName: string = 'value'): string => {
    const str = validateString(value, fieldName);
    if (str.trim().length === 0) {
        throw new Error(`${fieldName} must not be empty`);
    }
    return str;
};

/**
 * Validates that a value is one of the allowed values
 */
export const validateEnum = <T>(
    value: unknown,
    allowedValues: readonly T[],
    fieldName: string = 'value'
): T => {
    if (!allowedValues.includes(value as T)) {
        throw new Error(
            `${fieldName} must be one of: ${allowedValues.join(', ')}. Got: ${value}`
        );
    }
    return value as T;
};
