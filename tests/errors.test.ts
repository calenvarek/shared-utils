/**
 * Tests for error types
 */

import { describe, it, expect } from 'vitest';
import {
    ArgumentError,
    CancellationError,
    CommandError,
    ExitError
} from '../src/errors';

describe('Error Types', () => {
    describe('ArgumentError', () => {
        it('should create error with argument name and message', () => {
            const error = new ArgumentError('myArg', 'Invalid argument');
            expect(error.message).toBe('Invalid argument');
            expect(error.name).toBe('ArgumentError');
            expect(error.argument).toBe('myArg');
        });
    });

    describe('CancellationError', () => {
        it('should create error with message', () => {
            const error = new CancellationError('Operation cancelled');
            expect(error.message).toBe('Operation cancelled');
            expect(error.name).toBe('CancellationError');
        });
    });

    describe('CommandError', () => {
        it('should create error with code and message', () => {
            const error = new CommandError('Command failed', 'CMD_FAILED', false);
            expect(error.message).toBe('Command failed');
            expect(error.name).toBe('CommandError');
            expect(error.code).toBe('CMD_FAILED');
            expect(error.recoverable).toBe(false);
        });
    });

    describe('ExitError', () => {
        it('should create error with message', () => {
            const error = new ExitError('Process failed');
            expect(error.message).toBe('Process failed');
            expect(error.name).toBe('ExitError');
        });
    });
});

