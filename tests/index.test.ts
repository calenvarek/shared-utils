/**
 * Tests for index exports and module validation
 */

import { describe, it, expect } from 'vitest';
import * as shared from '../src/index';

describe('Index Exports', () => {
    describe('Logger exports', () => {
        it('should export setLogger', () => {
            expect(shared.setLogger).toBeDefined();
            expect(typeof shared.setLogger).toBe('function');
        });

        it('should export getLogger', () => {
            expect(shared.getLogger).toBeDefined();
            expect(typeof shared.getLogger).toBe('function');
        });
    });

    describe('Error exports', () => {
        it('should export error classes', () => {
            expect(shared.ArgumentError).toBeDefined();
            expect(shared.CancellationError).toBeDefined();
            expect(shared.ExitError).toBeDefined();
        });
    });

    describe('Storage exports', () => {
        it('should export createStorage', () => {
            expect(shared.createStorage).toBeDefined();
            expect(typeof shared.createStorage).toBe('function');
        });
    });

    describe('Stdin exports', () => {
        it('should export readStdin', () => {
            expect(shared.readStdin).toBeDefined();
            expect(typeof shared.readStdin).toBe('function');
        });

        it('should export promptConfirmation', () => {
            expect(shared.promptConfirmation).toBeDefined();
            expect(typeof shared.promptConfirmation).toBe('function');
        });
    });

    describe('Date utilities exports', () => {
        it('should export createDateUtility', () => {
            expect(shared.createDateUtility).toBeDefined();
            expect(typeof shared.createDateUtility).toBe('function');
        });

        it('should export validTimezones', () => {
            expect(shared.validTimezones).toBeDefined();
            expect(typeof shared.validTimezones).toBe('function');
        });
    });

    describe('General utilities exports', () => {
        it('should export deepMerge', () => {
            expect(shared.deepMerge).toBeDefined();
            expect(typeof shared.deepMerge).toBe('function');
        });

        it('should export version functions', () => {
            expect(shared.incrementPatchVersion).toBeDefined();
            expect(shared.incrementMinorVersion).toBeDefined();
            expect(shared.incrementMajorVersion).toBeDefined();
            expect(shared.validateVersionString).toBeDefined();
            expect(shared.calculateTargetVersion).toBeDefined();
            expect(shared.incrementPrereleaseVersion).toBeDefined();
            expect(shared.convertToReleaseVersion).toBeDefined();
        });

        it('should export async utilities', () => {
            expect(shared.sleep).toBeDefined();
            expect(shared.retryWithBackoff).toBeDefined();
        });

        it('should export array utilities', () => {
            expect(shared.uniqueArray).toBeDefined();
            expect(shared.groupBy).toBeDefined();
        });

        it('should export string utilities', () => {
            expect(shared.truncateString).toBeDefined();
        });

        it('should export JSON utilities', () => {
            expect(shared.safeJsonParse).toBeDefined();
        });

        it('should export stringifyJSON', () => {
            expect(shared.stringifyJSON).toBeDefined();
            expect(typeof shared.stringifyJSON).toBe('function');
        });
    });

    describe('Safety utilities exports', () => {
        it('should export checkForFileDependencies', () => {
            expect(shared.checkForFileDependencies).toBeDefined();
            expect(typeof shared.checkForFileDependencies).toBe('function');
        });

        it('should export logFileDependencyWarning', () => {
            expect(shared.logFileDependencyWarning).toBeDefined();
            expect(typeof shared.logFileDependencyWarning).toBe('function');
        });

        it('should export logFileDependencySuggestions', () => {
            expect(shared.logFileDependencySuggestions).toBeDefined();
            expect(typeof shared.logFileDependencySuggestions).toBe('function');
        });
    });

    describe('Validation exports', () => {
        it('should export validation functions', () => {
            expect(shared.validate).toBeDefined();
            expect(shared.validateString).toBeDefined();
            expect(shared.validateNumber).toBeDefined();
            expect(shared.validateBoolean).toBeDefined();
            expect(shared.validateArray).toBeDefined();
            expect(shared.validateObject).toBeDefined();
            expect(shared.validateNonEmptyString).toBeDefined();
            expect(shared.validateEnum).toBeDefined();
        });
    });

    describe('Types exports', () => {
        it('should export shared module types through TypeScript', () => {
            // TypeScript types are not available at runtime
            // This test verifies the module exports the necessary functions
            // that use these types internally
            expect(shared.setLogger).toBeDefined();
            expect(shared.getLogger).toBeDefined();
            expect(shared.createStorage).toBeDefined();
        });
    });
});

