/**
 * @eldrforge/shared
 * Shared utilities for Eldrforge tools
 */

// Types
export * from './types';

// Logger
export { setLogger, getLogger } from './logger';

// Errors
export * from './errors';

// Storage
export { create as createStorage } from './storage';
export type { Utility as StorageUtility } from './storage';

// User Input (stdin)
export { readStdin, promptConfirmation } from './stdin';

// Date Utilities
export { create as createDateUtility, validTimezones } from './dates';
export type { Utility as DateUtility } from './dates';

// General Utilities
export {
    deepMerge,
    stringifyJSON,
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
    safeJsonParse
} from './general';

// Safety Checks
export {
    checkForFileDependencies,
    logFileDependencyWarning,
    logFileDependencySuggestions
} from './safety';

// Validation
export {
    validate,
    validateString,
    validateNumber,
    validateBoolean,
    validateArray,
    validateObject,
    validateNonEmptyString,
    validateEnum
} from './validation';

// Note: More exports will be added as we extract utilities

