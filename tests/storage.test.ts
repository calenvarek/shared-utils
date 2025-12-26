/**
 * Tests for storage utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import path from 'path';
import { create as createStorage } from '../src/storage';

vi.mock('fs');
vi.mock('glob');

describe('Storage Utilities', () => {
    const storage = createStorage();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('exists', () => {
        it('should return true if file exists', async () => {
            vi.mocked(fs.promises.stat).mockResolvedValue({} as any);
            const result = await storage.exists('/test/file.txt');
            expect(result).toBe(true);
        });

        it('should return false if file does not exist', async () => {
            vi.mocked(fs.promises.stat).mockRejectedValue(new Error('ENOENT'));
            const result = await storage.exists('/test/file.txt');
            expect(result).toBe(false);
        });
    });

    describe('isDirectory', () => {
        it('should return true if path is a directory', async () => {
            const mockStats = { isDirectory: vi.fn().mockReturnValue(true) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            const result = await storage.isDirectory('/test/dir');
            expect(result).toBe(true);
        });

        it('should return false if path is not a directory', async () => {
            const mockStats = { isDirectory: vi.fn().mockReturnValue(false) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            const result = await storage.isDirectory('/test/file.txt');
            expect(result).toBe(false);
        });
    });

    describe('isFile', () => {
        it('should return true if path is a file', async () => {
            const mockStats = { isFile: vi.fn().mockReturnValue(true) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            const result = await storage.isFile('/test/file.txt');
            expect(result).toBe(true);
        });

        it('should return false if path is not a file', async () => {
            const mockStats = { isFile: vi.fn().mockReturnValue(false) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            const result = await storage.isFile('/test/dir');
            expect(result).toBe(false);
        });
    });

    describe('isReadable', () => {
        it('should return true if file is readable', async () => {
            vi.mocked(fs.promises.access).mockResolvedValue(undefined);
            const result = await storage.isReadable('/test/file.txt');
            expect(result).toBe(true);
        });

        it('should return false if file is not readable', async () => {
            vi.mocked(fs.promises.access).mockRejectedValue(new Error('EACCES'));
            const result = await storage.isReadable('/test/file.txt');
            expect(result).toBe(false);
        });
    });

    describe('isWritable', () => {
        it('should return true if file is writable', async () => {
            vi.mocked(fs.promises.access).mockResolvedValue(undefined);
            const result = await storage.isWritable('/test/file.txt');
            expect(result).toBe(true);
        });

        it('should return false if file is not writable', async () => {
            vi.mocked(fs.promises.access).mockRejectedValue(new Error('EACCES'));
            const result = await storage.isWritable('/test/file.txt');
            expect(result).toBe(false);
        });
    });

    describe('isFileReadable', () => {
        it('should return true if file exists and is readable', async () => {
            const mockStats = { isFile: vi.fn().mockReturnValue(true) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            vi.mocked(fs.promises.access).mockResolvedValue(undefined);
            const result = await storage.isFileReadable('/test/file.txt');
            expect(result).toBe(true);
        });

        it('should return false if file does not exist', async () => {
            vi.mocked(fs.promises.stat).mockRejectedValue(new Error('ENOENT'));
            const result = await storage.isFileReadable('/test/file.txt');
            expect(result).toBe(false);
        });

        it('should return false if path is not a file', async () => {
            const mockStats = { isFile: vi.fn().mockReturnValue(false) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            const result = await storage.isFileReadable('/test/dir');
            expect(result).toBe(false);
        });
    });

    describe('isDirectoryReadable', () => {
        it('should return true if directory exists and is readable', async () => {
            const mockStats = { isDirectory: vi.fn().mockReturnValue(true) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            vi.mocked(fs.promises.access).mockResolvedValue(undefined);
            const result = await storage.isDirectoryReadable('/test/dir');
            expect(result).toBe(true);
        });

        it('should return false if directory does not exist', async () => {
            vi.mocked(fs.promises.stat).mockRejectedValue(new Error('ENOENT'));
            const result = await storage.isDirectoryReadable('/test/dir');
            expect(result).toBe(false);
        });
    });

    describe('isDirectoryWritable', () => {
        it('should return true if directory exists and is writable', async () => {
            const mockStats = { isDirectory: vi.fn().mockReturnValue(true) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            vi.mocked(fs.promises.access).mockResolvedValue(undefined);
            const result = await storage.isDirectoryWritable('/test/dir');
            expect(result).toBe(true);
        });

        it('should return false if directory is not writable', async () => {
            const mockStats = { isDirectory: vi.fn().mockReturnValue(true) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            vi.mocked(fs.promises.access).mockRejectedValue(new Error('EACCES'));
            const result = await storage.isDirectoryWritable('/test/dir');
            expect(result).toBe(false);
        });
    });

    describe('createDirectory', () => {
        it('should create directory', async () => {
            vi.mocked(fs.promises.mkdir).mockResolvedValue('');
            await storage.createDirectory('/test/dir');
            expect(fs.promises.mkdir).toHaveBeenCalledWith('/test/dir', { recursive: true });
        });

        it('should throw error if mkdir fails', async () => {
            vi.mocked(fs.promises.mkdir).mockRejectedValue(new Error('Permission denied'));
            await expect(storage.createDirectory('/test/dir')).rejects.toThrow('Failed to create output directory');
        });
    });

    describe('ensureDirectory', () => {
        it('should create directory if it does not exist', async () => {
            vi.mocked(fs.promises.stat).mockRejectedValue(new Error('ENOENT'));
            vi.mocked(fs.promises.mkdir).mockResolvedValue('');
            await storage.ensureDirectory('/test/dir');
            expect(fs.promises.mkdir).toHaveBeenCalled();
        });

        it('should not create directory if it already exists', async () => {
            const mockStats = { isDirectory: vi.fn().mockReturnValue(true) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            await storage.ensureDirectory('/test/dir');
            expect(fs.promises.mkdir).not.toHaveBeenCalled();
        });

        it('should throw error if path is a file', async () => {
            const mockStats = { isDirectory: vi.fn().mockReturnValue(false) };
            vi.mocked(fs.promises.stat).mockResolvedValue(mockStats as any);
            await expect(storage.ensureDirectory('/test/file.txt')).rejects.toThrow('Cannot create directory');
        });

        it('should throw error if parent path is blocked by file', async () => {
            vi.mocked(fs.promises.stat)
                .mockRejectedValueOnce(new Error('ENOENT'))  // directory doesn't exist
                .mockRejectedValueOnce(new Error('ENOTDIR')); // mkdir throws ENOTDIR
            vi.mocked(fs.promises.mkdir).mockRejectedValue({ code: 'ENOTDIR' } as any);

            await expect(storage.ensureDirectory('/test/dir/subdir')).rejects.toThrow();
        });
    });

    describe('removeDirectory', () => {
        it('should remove directory if it exists', async () => {
            vi.mocked(fs.promises.stat).mockResolvedValue({} as any);
            vi.mocked(fs.promises.rm).mockResolvedValue(undefined);
            await storage.removeDirectory('/test/dir');
            expect(fs.promises.rm).toHaveBeenCalledWith('/test/dir', { recursive: true, force: true });
        });

        it('should not throw error if directory does not exist', async () => {
            vi.mocked(fs.promises.stat).mockRejectedValue(new Error('ENOENT'));
            await storage.removeDirectory('/test/dir');
            expect(fs.promises.rm).not.toHaveBeenCalled();
        });

        it('should throw error if rm fails', async () => {
            vi.mocked(fs.promises.stat).mockResolvedValue({} as any);
            vi.mocked(fs.promises.rm).mockRejectedValue(new Error('Permission denied'));
            await expect(storage.removeDirectory('/test/dir')).rejects.toThrow('Failed to remove directory');
        });
    });

    describe('readFile', () => {
        it('should read file content', async () => {
            vi.mocked(fs.promises.readFile).mockResolvedValue('file content');
            const result = await storage.readFile('/test/file.txt', 'utf-8');
            expect(result).toBe('file content');
        });

        it('should use correct encoding', async () => {
            vi.mocked(fs.promises.readFile).mockResolvedValue('content');
            await storage.readFile('/test/file.txt', 'utf-8');
            expect(fs.promises.readFile).toHaveBeenCalledWith('/test/file.txt', { encoding: 'utf-8' });
        });
    });

    describe('writeFile', () => {
        it('should write file content', async () => {
            vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);
            await storage.writeFile('/test/file.txt', 'content', 'utf-8');
            expect(fs.promises.writeFile).toHaveBeenCalledWith('/test/file.txt', 'content', { encoding: 'utf-8' });
        });

        it('should handle buffer data', async () => {
            vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);
            const buffer = Buffer.from('content');
            await storage.writeFile('/test/file.txt', buffer, 'utf-8');
            expect(fs.promises.writeFile).toHaveBeenCalled();
        });
    });

    describe('rename', () => {
        it('should rename file', async () => {
            vi.mocked(fs.promises.rename).mockResolvedValue(undefined);
            await storage.rename('/test/old.txt', '/test/new.txt');
            expect(fs.promises.rename).toHaveBeenCalledWith('/test/old.txt', '/test/new.txt');
        });
    });

    describe('deleteFile', () => {
        it('should delete file if it exists', async () => {
            vi.mocked(fs.promises.stat).mockResolvedValue({} as any);
            vi.mocked(fs.promises.unlink).mockResolvedValue(undefined);
            await storage.deleteFile('/test/file.txt');
            expect(fs.promises.unlink).toHaveBeenCalledWith('/test/file.txt');
        });

        it('should not throw error if file does not exist', async () => {
            vi.mocked(fs.promises.stat).mockRejectedValue(new Error('ENOENT'));
            await storage.deleteFile('/test/file.txt');
            expect(fs.promises.unlink).not.toHaveBeenCalled();
        });

        it('should throw error if unlink fails', async () => {
            vi.mocked(fs.promises.stat).mockResolvedValue({} as any);
            vi.mocked(fs.promises.unlink).mockRejectedValue(new Error('Permission denied'));
            await expect(storage.deleteFile('/test/file.txt')).rejects.toThrow('Failed to delete file');
        });
    });

    describe('readStream', () => {
        it('should return read stream', async () => {
            const mockStream = { on: vi.fn() };
            vi.mocked(fs.createReadStream).mockReturnValue(mockStream as any);
            const result = await storage.readStream('/test/file.txt');
            expect(result).toBe(mockStream);
        });
    });

    describe('listFiles', () => {
        it('should list files in directory', async () => {
            vi.mocked(fs.promises.readdir).mockResolvedValue(['file1.txt', 'file2.txt'] as any);
            const result = await storage.listFiles('/test/dir');
            expect(result).toEqual(['file1.txt', 'file2.txt']);
        });
    });

    describe('hashFile', () => {
        it('should hash file content', async () => {
            vi.mocked(fs.promises.readFile).mockResolvedValue('content');
            const result = await storage.hashFile('/test/file.txt', 10);
            expect(typeof result).toBe('string');
            expect(result.length).toBeLessThanOrEqual(10);
        });
    });

    describe('forEachFileIn', () => {
        it('should call callback for each file', async () => {
            const { glob } = await import('glob');
            vi.mocked(glob).mockResolvedValue(['file1.txt', 'file2.txt'] as any);
            const callback = vi.fn().mockResolvedValue(undefined);

            await storage.forEachFileIn('/test/dir', callback);

            expect(callback).toHaveBeenCalledTimes(2);
        });

        it('should use default pattern if not provided', async () => {
            const { glob } = await import('glob');
            vi.mocked(glob).mockResolvedValue([] as any);
            const callback = vi.fn().mockResolvedValue(undefined);

            await storage.forEachFileIn('/test/dir', callback);

            expect(glob).toHaveBeenCalledWith('*.*', expect.any(Object));
        });

        it('should throw error if glob fails', async () => {
            const { glob } = await import('glob');
            vi.mocked(glob).mockRejectedValue(new Error('Glob failed'));
            const callback = vi.fn();

            await expect(storage.forEachFileIn('/test/dir', callback)).rejects.toThrow('Failed to glob pattern');
        });
    });
});

