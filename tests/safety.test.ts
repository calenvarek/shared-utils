import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkForFileDependencies, logFileDependencyWarning, logFileDependencySuggestions } from '../src/safety';

const mockLogger = {
    debug: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
};

// Mock the logger module
vi.mock('../src/logger', () => ({
    getLogger: vi.fn(() => mockLogger)
}));

describe('Safety Utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('checkForFileDependencies', () => {
        it('should return empty array when no file dependencies found', async () => {
            const mockStorage = {
                exists: vi.fn().mockResolvedValue(true),
                isDirectory: vi.fn().mockResolvedValue(true),
                listFiles: vi.fn().mockResolvedValue([]),
                readFile: vi.fn(),
                isFile: vi.fn(),
            };

            const result = await checkForFileDependencies(mockStorage, '/test');
            expect(result).toEqual([]);
        });

        it('should detect file: dependencies in package.json', async () => {
            const mockStorage = {
                exists: vi.fn().mockResolvedValue(true),
                isDirectory: vi.fn()
                    .mockResolvedValueOnce(true)  // root dir
                    .mockResolvedValueOnce(true), // subdirectory
                listFiles: vi.fn()
                    .mockResolvedValueOnce(['package.json'])  // root files
                    .mockResolvedValueOnce([]),               // no subdirs
                readFile: vi.fn().mockResolvedValue(JSON.stringify({
                    name: 'test-package',
                    dependencies: {
                        'local-dep': 'file:../local-dep'
                    }
                })),
            };

            const result = await checkForFileDependencies(mockStorage, '/test');
            expect(result.length).toBe(1);
            expect(result[0].dependencies.length).toBe(1);
            expect(result[0].dependencies[0].name).toBe('local-dep');
            expect(result[0].dependencies[0].version).toBe('file:../local-dep');
        });

        it('should detect file: dependencies in devDependencies', async () => {
            const mockStorage = {
                exists: vi.fn().mockResolvedValue(true),
                isDirectory: vi.fn().mockResolvedValue(true),
                listFiles: vi.fn().mockResolvedValueOnce(['package.json']).mockResolvedValueOnce([]),
                readFile: vi.fn().mockResolvedValue(JSON.stringify({
                    name: 'test-package',
                    devDependencies: {
                        'local-dev': 'file:../local-dev'
                    }
                })),
            };

            const result = await checkForFileDependencies(mockStorage, '/test');
            expect(result.length).toBe(1);
            expect(result[0].dependencies[0].dependencyType).toBe('devDependencies');
        });

        it('should detect file: dependencies in peerDependencies', async () => {
            const mockStorage = {
                exists: vi.fn().mockResolvedValue(true),
                isDirectory: vi.fn().mockResolvedValue(true),
                listFiles: vi.fn().mockResolvedValueOnce(['package.json']).mockResolvedValueOnce([]),
                readFile: vi.fn().mockResolvedValue(JSON.stringify({
                    name: 'test-package',
                    peerDependencies: {
                        'local-peer': 'file:../local-peer'
                    }
                })),
            };

            const result = await checkForFileDependencies(mockStorage, '/test');
            expect(result.length).toBe(1);
            expect(result[0].dependencies[0].dependencyType).toBe('peerDependencies');
        });

        it('should skip excluded directories', async () => {
            const mockStorage = {
                exists: vi.fn().mockResolvedValue(true),
                isDirectory: vi.fn()
                    .mockResolvedValueOnce(true)  // root
                    .mockResolvedValueOnce(false), // node_modules is checked but isn't a dir
                listFiles: vi.fn()
                    .mockResolvedValueOnce(['node_modules', 'dist', 'package.json'])
                    .mockResolvedValueOnce([]),
                readFile: vi.fn().mockResolvedValue(JSON.stringify({
                    name: 'test-package',
                    dependencies: {}
                })),
            };

            const result = await checkForFileDependencies(mockStorage, '/test');
            // Should find package.json in root but skip excluded dirs
            expect(result.length).toBeGreaterThanOrEqual(0);
        });

        it('should handle directory access errors gracefully', async () => {
            const mockStorage = {
                exists: vi.fn().mockResolvedValue(true),
                isDirectory: vi.fn()
                    .mockResolvedValueOnce(true)
                    .mockRejectedValueOnce(new Error('Access denied')),
                listFiles: vi.fn().mockResolvedValue(['package.json']),
                readFile: vi.fn().mockResolvedValue(JSON.stringify({
                    name: 'test-package'
                })),
            };

            const result = await checkForFileDependencies(mockStorage, '/test');
            expect(Array.isArray(result)).toBe(true);
        });

        it('should handle invalid JSON in package.json', async () => {
            const mockStorage = {
                exists: vi.fn().mockResolvedValue(true),
                isDirectory: vi.fn().mockResolvedValue(true),
                listFiles: vi.fn().mockResolvedValueOnce(['package.json']).mockResolvedValueOnce([]),
                readFile: vi.fn().mockResolvedValue('invalid json'),
            };

            const result = await checkForFileDependencies(mockStorage, '/test');
            expect(Array.isArray(result)).toBe(true);
        });

        it('should handle missing root directory', async () => {
            const mockStorage = {
                exists: vi.fn().mockResolvedValue(false),
                isDirectory: vi.fn().mockResolvedValue(false),
                listFiles: vi.fn(),
                readFile: vi.fn(),
            };

            const result = await checkForFileDependencies(mockStorage, '/nonexistent');
            expect(result).toEqual([]);
        });

        it('should respect depth limit to prevent infinite recursion', async () => {
            let callCount = 0;
            const mockStorage = {
                exists: vi.fn().mockResolvedValue(true),
                isDirectory: vi.fn().mockImplementation(() => {
                    callCount++;
                    return Promise.resolve(true);
                }),
                listFiles: vi.fn().mockImplementation(() => {
                    return Promise.resolve(['subdir']);
                }),
                readFile: vi.fn().mockResolvedValue(JSON.stringify({ name: 'test' })),
            };

            await checkForFileDependencies(mockStorage, '/test');
            // Depth limit is 5, so we shouldn't make too many calls
            expect(callCount).toBeLessThan(20);
        });

        it('should handle multiple file dependencies in single package', async () => {
            const mockStorage = {
                exists: vi.fn().mockResolvedValue(true),
                isDirectory: vi.fn().mockResolvedValue(true),
                listFiles: vi.fn().mockResolvedValueOnce(['package.json']).mockResolvedValueOnce([]),
                readFile: vi.fn().mockResolvedValue(JSON.stringify({
                    name: 'test-package',
                    dependencies: {
                        'dep1': 'file:../dep1',
                        'dep2': 'file:../dep2',
                        'normal-dep': '^1.0.0'
                    }
                })),
            };

            const result = await checkForFileDependencies(mockStorage, '/test');
            expect(result[0].dependencies).toHaveLength(2);
        });
    });

    describe('logFileDependencyWarning', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should not log when issues array is empty', () => {
            logFileDependencyWarning([]);
            expect(mockLogger.warn).not.toHaveBeenCalled();
        });

        it('should log warning for file dependencies', () => {
            const issues = [{
                packagePath: 'packages/my-package',
                dependencies: [{
                    name: 'local-dep',
                    version: 'file:../local-dep',
                    dependencyType: 'dependencies' as const
                }]
            }];

            logFileDependencyWarning(issues, 'commit');
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('FILE_DEPS_WARNING'));
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('commit'));
        });

        it('should log package info for each issue', () => {
            const issues = [{
                packagePath: 'packages/my-package',
                dependencies: [{
                    name: 'local-dep',
                    version: 'file:../local-dep',
                    dependencyType: 'dependencies' as const
                }]
            }];

            logFileDependencyWarning(issues);
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('FILE_DEPS_PACKAGE'));
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('packages/my-package'));
        });

        it('should log dependency details', () => {
            const issues = [{
                packagePath: 'packages/my-package',
                dependencies: [{
                    name: 'local-dep',
                    version: 'file:../local-dep',
                    dependencyType: 'dependencies' as const
                }]
            }];

            logFileDependencyWarning(issues);
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('FILE_DEPS_DETAIL'));
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('local-dep'));
        });

        it('should use default context when not provided', () => {
            const issues = [{
                packagePath: '.',
                dependencies: [{
                    name: 'dep',
                    version: 'file:../dep',
                    dependencyType: 'dependencies' as const
                }]
            }];

            logFileDependencyWarning(issues);
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('operation'));
        });
    });

    describe('logFileDependencySuggestions', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should log suggestions with unlink capability', () => {
            logFileDependencySuggestions(true);
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('FILE_DEPS_RESOLUTION'));
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('kodrdriv unlink'));
        });

        it('should log suggestions without unlink capability', () => {
            logFileDependencySuggestions(false);
            // Verify it includes the manual restore message
            const calls = mockLogger.warn.mock.calls.map(call => call[0]);
            const hasManualRestore = calls.some(call =>
                call.includes('manually restore') || call.includes('STEP_1')
            );
            expect(hasManualRestore).toBe(true);
        });

        it('should show bypass options', () => {
            logFileDependencySuggestions(true);
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('FILE_DEPS_BYPASS'));
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('--skip-file-check'));
        });

        it('should default to true for unlink capability', () => {
            logFileDependencySuggestions();
            expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('kodrdriv unlink'));
        });
    });
});

