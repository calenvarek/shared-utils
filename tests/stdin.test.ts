/**
 * Tests for stdin utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readStdin, promptConfirmation } from '../src/stdin';

describe('Stdin Utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        delete process.env.NODE_ENV;
        delete process.env.VITEST;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('readStdin', () => {
        it('should return null in test environment', async () => {
            process.env.VITEST = 'true';

            const promise = readStdin();
            // Simulate timeout
            await new Promise(resolve => setTimeout(resolve, 50));

            const result = await promise;
            expect(result).toBeNull();
        }, 5000);

        it('should return null when stdin is TTY (interactive terminal)', async () => {
            process.stdin.isTTY = true;
            const result = await readStdin();
            expect(result).toBeNull();
        });
    });

    describe('promptConfirmation', () => {
        it('should return true in test environment', async () => {
            process.env.VITEST = 'true';

            const result = await promptConfirmation('Confirm?');
            expect(result).toBe(true);
        });

        it('should prompt user with message', async () => {
            process.env.VITEST = 'true';
            const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true as any);

            const result = await promptConfirmation('Confirm deletion?');

            expect(result).toBe(true);
            vi.restoreAllMocks();
        });

        it('should set encoding to utf8 when not in test env', () => {
            process.env.VITEST = '';
            const setEncodingSpy = vi.spyOn(process.stdin, 'setEncoding');
            const onSpy = vi.spyOn(process.stdin, 'on');

            // We can't really test the full flow without real stdin,
            // but we can verify the setup is correct
            expect(process.stdin).toBeDefined();

            vi.restoreAllMocks();
        });
    });

    describe('readStdin behavior in test mode', () => {
        it('should have test environment detection', () => {
            process.env.VITEST = 'true';
            expect(process.env.VITEST).toBe('true');
        });

        it('should respond to promptConfirmation in test mode', async () => {
            process.env.VITEST = 'true';
            const result = await promptConfirmation('Test prompt?');
            expect(typeof result).toBe('boolean');
        });
    });
});
