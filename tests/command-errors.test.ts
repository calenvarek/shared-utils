/**
 * Tests for CommandError classes
 */

import { describe, it, expect } from 'vitest';
import {
    CommandError,
    ConfigurationError,
    ValidationError,
    UserCancellationError,
    ExternalDependencyError,
    FileOperationError,
    PullRequestCheckError
} from '../src/errors/CommandErrors';

describe('CommandError Classes', () => {
    describe('CommandError', () => {
        it('should create error with message and code', () => {
            const error = new CommandError('Test error', 'TEST_CODE');
            expect(error.message).toBe('Test error');
            expect(error.code).toBe('TEST_CODE');
            expect(error.name).toBe('CommandError');
        });

        it('should set recoverable to false by default', () => {
            const error = new CommandError('Test error', 'TEST_CODE');
            expect(error.recoverable).toBe(false);
        });

        it('should set recoverable to true when specified', () => {
            const error = new CommandError('Test error', 'TEST_CODE', true);
            expect(error.recoverable).toBe(true);
        });

        it('should include original cause', () => {
            const cause = new Error('Original cause');
            const error = new CommandError('Test error', 'TEST_CODE', false, cause);
            expect(error.originalCause).toBe(cause);
            expect((error as any).cause).toBe(cause);
        });

        it('should be instanceof Error', () => {
            const error = new CommandError('Test error', 'TEST_CODE');
            expect(error instanceof Error).toBe(true);
        });

        it('should support stack traces', () => {
            const error = new CommandError('Test error', 'TEST_CODE');
            expect(error.stack).toBeDefined();
        });
    });

    describe('ConfigurationError', () => {
        it('should create configuration error', () => {
            const error = new ConfigurationError('Config missing');
            expect(error.message).toBe('Config missing');
            expect(error.code).toBe('CONFIG_ERROR');
            expect(error.name).toBe('ConfigurationError');
            expect(error.recoverable).toBe(false);
        });

        it('should include cause', () => {
            const cause = new Error('Original error');
            const error = new ConfigurationError('Config invalid', cause);
            expect(error.originalCause).toBe(cause);
        });
    });

    describe('ValidationError', () => {
        it('should create validation error', () => {
            const error = new ValidationError('Invalid input');
            expect(error.message).toBe('Invalid input');
            expect(error.code).toBe('VALIDATION_ERROR');
            expect(error.name).toBe('ValidationError');
            expect(error.recoverable).toBe(false);
        });

        it('should include cause', () => {
            const cause = new Error('Validation failed');
            const error = new ValidationError('Invalid data', cause);
            expect(error.originalCause).toBe(cause);
        });
    });

    describe('UserCancellationError', () => {
        it('should create cancellation error with default message', () => {
            const error = new UserCancellationError();
            expect(error.message).toBe('Operation cancelled by user');
            expect(error.code).toBe('USER_CANCELLED');
            expect(error.name).toBe('UserCancellationError');
            expect(error.recoverable).toBe(true);
        });

        it('should create cancellation error with custom message', () => {
            const error = new UserCancellationError('User declined');
            expect(error.message).toBe('User declined');
            expect(error.code).toBe('USER_CANCELLED');
        });

        it('should be recoverable', () => {
            const error = new UserCancellationError();
            expect(error.recoverable).toBe(true);
        });
    });

    describe('ExternalDependencyError', () => {
        it('should create external dependency error', () => {
            const error = new ExternalDependencyError('not found', 'npm');
            expect(error.message).toContain('npm');
            expect(error.message).toContain('not found');
            expect(error.code).toBe('EXTERNAL_DEPENDENCY_ERROR');
            expect(error.name).toBe('ExternalDependencyError');
            expect(error.recoverable).toBe(false);
        });

        it('should include cause', () => {
            const cause = new Error('System error');
            const error = new ExternalDependencyError('failed', 'git', cause);
            expect(error.originalCause).toBe(cause);
        });

        it('should format message with dependency name', () => {
            const error = new ExternalDependencyError('not found', 'npm');
            expect(error.message).toBe('npm: not found');
        });
    });

    describe('FileOperationError', () => {
        it('should create file operation error', () => {
            const error = new FileOperationError('cannot read', '/path/to/file.txt');
            expect(error.message).toContain('File operation failed');
            expect(error.message).toContain('/path/to/file.txt');
            expect(error.code).toBe('FILE_OPERATION_ERROR');
            expect(error.name).toBe('FileOperationError');
        });

        it('should include cause', () => {
            const cause = new Error('Permission denied');
            const error = new FileOperationError('cannot write', '/path/file', cause);
            expect(error.originalCause).toBe(cause);
        });

        it('should format message with file path', () => {
            const error = new FileOperationError('write failed', '/home/user/file.txt');
            expect(error.message).toBe('File operation failed on /home/user/file.txt: write failed');
        });
    });

    describe('PullRequestCheckError', () => {
        it('should create PR check error', () => {
            const error = new PullRequestCheckError(
                'PR checks failed',
                123,
                [{ name: 'test', conclusion: 'failure' }],
                'https://github.com/org/repo/pull/123'
            );
            expect(error.message).toBe('PR checks failed');
            expect(error.code).toBe('PR_CHECK_FAILED');
            expect(error.name).toBe('PullRequestCheckError');
            expect(error.recoverable).toBe(true);
        });

        it('should store PR number and URL', () => {
            const error = new PullRequestCheckError(
                'Failed',
                456,
                [{ name: 'lint', conclusion: 'failure' }],
                'https://github.com/org/repo/pull/456'
            );
            expect(error.prNumber).toBe(456);
            expect(error.prUrl).toBe('https://github.com/org/repo/pull/456');
        });

        it('should store failed checks', () => {
            const checks = [
                { name: 'tests', conclusion: 'failure' },
                { name: 'lint', conclusion: 'failure' }
            ];
            const error = new PullRequestCheckError(
                'Failed',
                789,
                checks,
                'https://github.com/org/repo/pull/789'
            );
            expect(error.failedChecks).toEqual(checks);
            expect(error.failedChecks.length).toBe(2);
        });

        it('should be recoverable', () => {
            const error = new PullRequestCheckError(
                'Failed',
                100,
                [],
                'https://github.com/org/repo/pull/100'
            );
            expect(error.recoverable).toBe(true);
        });

        it('should get recovery instructions for test failures', () => {
            const error = new PullRequestCheckError(
                'PR checks failed',
                101,
                [{ name: 'test: unit tests', conclusion: 'failure' }],
                'https://github.com/org/repo/pull/101',
                'feature-branch'
            );
            const instructions = error.getRecoveryInstructions();
            expect(Array.isArray(instructions)).toBe(true);
            expect(instructions.length).toBeGreaterThan(0);
            expect(instructions.join(' ').toLowerCase()).toContain('test');
        });

        it('should get recovery instructions for lint failures', () => {
            const error = new PullRequestCheckError(
                'PR checks failed',
                102,
                [{ name: 'lint: eslint', conclusion: 'failure' }],
                'https://github.com/org/repo/pull/102'
            );
            const instructions = error.getRecoveryInstructions();
            expect(instructions.join(' ').toLowerCase()).toContain('lint');
        });

        it('should get recovery instructions for build failures', () => {
            const error = new PullRequestCheckError(
                'PR checks failed',
                103,
                [{ name: 'build: typescript', conclusion: 'failure' }],
                'https://github.com/org/repo/pull/103'
            );
            const instructions = error.getRecoveryInstructions();
            expect(instructions.join(' ').toLowerCase()).toContain('build');
        });

        it('should include branch name in instructions when provided', () => {
            const error = new PullRequestCheckError(
                'Failed',
                104,
                [],
                'https://github.com/org/repo/pull/104',
                'my-feature-branch'
            );
            const instructions = error.getRecoveryInstructions();
            expect(instructions.join(' ')).toContain('my-feature-branch');
        });

        it('should use default branch when not provided', () => {
            const error = new PullRequestCheckError(
                'Failed',
                105,
                [],
                'https://github.com/org/repo/pull/105'
            );
            const instructions = error.getRecoveryInstructions();
            expect(instructions.join(' ')).toContain('your current branch');
        });

        it('should handle check details with output', () => {
            const error = new PullRequestCheckError(
                'Failed',
                106,
                [{
                    name: 'Test Suite',
                    conclusion: 'failure',
                    output: {
                        title: 'Test Failures',
                        summary: '5 tests failed'
                    }
                }],
                'https://github.com/org/repo/pull/106'
            );
            expect(error.failedChecks[0].output?.title).toBe('Test Failures');
        });
    });

    describe('Error hierarchy', () => {
        it('should maintain error hierarchy', () => {
            const cmdError = new CommandError('test', 'CODE');
            const configError = new ConfigurationError('test');
            const validationError = new ValidationError('test');

            expect(cmdError instanceof CommandError).toBe(true);
            expect(configError instanceof CommandError).toBe(true);
            expect(validationError instanceof CommandError).toBe(true);
            expect(cmdError instanceof Error).toBe(true);
        });

        it('all error types should be instanceof Error', () => {
            const errors = [
                new CommandError('test', 'CODE'),
                new ConfigurationError('test'),
                new ValidationError('test'),
                new UserCancellationError(),
                new ExternalDependencyError('failed', 'npm'),
                new FileOperationError('failed', '/path'),
                new PullRequestCheckError('failed', 1, [], 'url'),
            ];

            errors.forEach(error => {
                expect(error instanceof Error).toBe(true);
            });
        });
    });

    describe('Error properties', () => {
        it('should preserve all properties through serialization', () => {
            const cause = new Error('Original');
            const error = new CommandError('Message', 'CODE', true, cause);

            expect(error.message).toBe('Message');
            expect(error.code).toBe('CODE');
            expect(error.recoverable).toBe(true);
            expect(error.originalCause).toBe(cause);
            expect(error.name).toBe('CommandError');
        });

        it('should have proper toString representation', () => {
            const error = new CommandError('Test message', 'TEST_CODE');
            expect(error.toString()).toContain('CommandError');
        });
    });
});
