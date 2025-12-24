/**
 * General utility functions
 */

// Utility function for deep merging two objects.
export function deepMerge(target: any, source: any): any {
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (key === "__proto__" || key === "constructor") {
                continue; // Skip prototype-polluting keys
            }
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// Recursive implementation of JSON.stringify
export const stringifyJSON = function (obj: any, options: { depth: number } = { depth: 0 }): string {

    if (options.depth > 10) {
        return '{"error": "Maximum depth reached"}';
    }

    const arrOfKeyVals: string[] = [];
    const arrVals: string[] = [];
    let objKeys: string[] = [];

    /*********CHECK FOR PRIMITIVE TYPES**********/
    if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null)
        return '' + obj;
    else if (typeof obj === 'string')
        return '"' + obj + '"';

    /*********CHECK FOR ARRAY**********/
    else if (Array.isArray(obj)) {
        //check for empty array
        if (obj[0] === undefined)
            return '[]';
        else {
            obj.forEach(function (el) {
                arrVals.push(stringifyJSON(el, { depth: options.depth + 1 }));
            });
            return '[' + arrVals + ']';
        }
    }
    /*********CHECK FOR OBJECT**********/
    else if (obj instanceof Object) {
        //get object keys
        objKeys = Object.keys(obj);
        //set key output;
        objKeys.forEach(function (key) {
            const keyOut = '"' + key + '":';
            const keyValOut = obj[key];
            //skip functions and undefined properties
            if (keyValOut instanceof Function || keyValOut === undefined)
                arrOfKeyVals.push('');
            else if (typeof keyValOut === 'string')
                arrOfKeyVals.push(keyOut + '"' + keyValOut + '"');
            else if (typeof keyValOut === 'boolean' || typeof keyValOut === 'number' || keyValOut === null)
                arrOfKeyVals.push(keyOut + keyValOut);
            //check for nested objects, call recursively until no more objects
            else if (keyValOut instanceof Object) {
                arrOfKeyVals.push(keyOut + stringifyJSON(keyValOut, { depth: options.depth + 1 }));
            }
        });
        return '{' + arrOfKeyVals + '}';
    }
    return '';
};

// Version increment functions
export const incrementPatchVersion = (version: string): string => {
    // Remove 'v' prefix if present
    const cleanVersion = version.startsWith('v') ? version.slice(1) : version;

    // Split into major.minor.patch and handle pre-release identifiers
    const parts = cleanVersion.split('.');
    if (parts.length < 3) {
        throw new Error(`Invalid version string: ${version}`);
    }

    // Handle pre-release versions like "4.6.24-dev.0"
    // Split the patch part on '-' to separate patch number from pre-release
    const patchPart = parts[2];
    let patchNumber: number;

    if (patchPart.startsWith('-')) {
        // Handle negative patch numbers like "-1" or "-5" or "-1-dev.0"
        const negativeComponents = patchPart.split('-');
        if (negativeComponents.length === 2) {
            // "-1" format
            patchNumber = parseInt(negativeComponents[1]);
        } else if (negativeComponents.length > 2) {
            // "-1-dev.0" format - take the number after first dash
            patchNumber = parseInt(negativeComponents[1]);
        } else {
            throw new Error(`Invalid version string: ${version}`);
        }
    } else if (patchPart.includes('-')) {
        // Normal case with possible prerelease: "24-dev.0" or "24"
        const patchComponents = patchPart.split('-');
        patchNumber = parseInt(patchComponents[0]);
    } else {
        // Simple patch number: "24"
        patchNumber = parseInt(patchPart);
    }

    if (isNaN(patchNumber)) {
        throw new Error(`Invalid patch number in version: ${version}`);
    }

    const incrementedPatch = patchNumber + 1;
    return `${parts[0]}.${parts[1]}.${incrementedPatch}`;
};

export const incrementMinorVersion = (version: string): string => {
    // Remove 'v' prefix if present
    const cleanVersion = version.startsWith('v') ? version.slice(1) : version;

    const parts = cleanVersion.split('.');
    if (parts.length < 3) {
        throw new Error(`Invalid version string: ${version}`);
    }

    const major = parts[0];
    const minor = parseInt(parts[1]);
    if (isNaN(minor)) {
        throw new Error(`Invalid minor version in: ${version}`);
    }

    return `${major}.${minor + 1}.0`;
};

export const incrementMajorVersion = (version: string): string => {
    // Remove 'v' prefix if present
    const cleanVersion = version.startsWith('v') ? version.slice(1) : version;

    const parts = cleanVersion.split('.');
    if (parts.length < 3) {
        throw new Error(`Invalid version string: ${version}`);
    }

    const major = parseInt(parts[0]);
    if (isNaN(major)) {
        throw new Error(`Invalid major version in: ${version}`);
    }

    return `${major + 1}.0.0`;
};

export const validateVersionString = (version: string): boolean => {
    // Simple validation: x.y.z format (with optional v prefix)
    const cleanVersion = version.startsWith('v') ? version.slice(1) : version;
    return /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/.test(cleanVersion);
};

export const calculateTargetVersion = (currentVersion: string, targetVersion: string): string => {
    switch (targetVersion) {
        case 'patch':
            return incrementPatchVersion(currentVersion);
        case 'minor':
            return incrementMinorVersion(currentVersion);
        case 'major':
            return incrementMajorVersion(currentVersion);
        default:
            // Explicit version provided
            if (!validateVersionString(targetVersion)) {
                throw new Error(`Invalid version format: ${targetVersion}. Expected format: "x.y.z" or one of: "patch", "minor", "major"`);
            }
            return targetVersion.startsWith('v') ? targetVersion.slice(1) : targetVersion;
    }
};

export const incrementPrereleaseVersion = (version: string, tag: string): string => {
    const cleanVersion = version.startsWith('v') ? version.slice(1) : version;

    // Split on dots but only use first 3 parts for major.minor.patch
    // This handles cases like "1.2.3-dev.5" correctly
    const dotParts = cleanVersion.split('.');
    if (dotParts.length < 3) {
        throw new Error(`Invalid version string: ${version}`);
    }

    const major = dotParts[0];
    const minor = dotParts[1];

    // Reconstruct the patch part - everything after the second dot
    const patchAndPrerelease = dotParts.slice(2).join('.');
    const patchComponents = patchAndPrerelease.split('-');
    const patchNumber = patchComponents[0];

    if (patchComponents.length > 1) {
        // Already has prerelease (e.g., "3-dev.0" or "3-test.2")
        const prereleaseString = patchComponents.slice(1).join('-'); // Handle multiple dashes
        const prereleaseComponents = prereleaseString.split('.');
        const existingTag = prereleaseComponents[0];
        const existingPrereleaseVersion = prereleaseComponents[1];

        if (existingTag === tag) {
            // Same tag, increment the prerelease version
            const prereleaseNumber = parseInt(existingPrereleaseVersion) || 0;
            return `${major}.${minor}.${patchNumber}-${tag}.${prereleaseNumber + 1}`;
        } else {
            // Different tag, start at 0
            return `${major}.${minor}.${patchNumber}-${tag}.0`;
        }
    } else {
        // No prerelease yet, add it
        return `${major}.${minor}.${patchNumber}-${tag}.0`;
    }
};

export const convertToReleaseVersion = (version: string): string => {
    const cleanVersion = version.startsWith('v') ? version.slice(1) : version;

    // Split on dots but only use first 3 parts for major.minor.patch
    const dotParts = cleanVersion.split('.');
    if (dotParts.length < 3) {
        throw new Error(`Invalid version string: ${version}`);
    }

    const major = dotParts[0];
    const minor = dotParts[1];

    // Reconstruct the patch part - everything after the second dot
    const patchAndPrerelease = dotParts.slice(2).join('.');
    const patchComponents = patchAndPrerelease.split('-');
    const patchNumber = patchComponents[0];

    return `${major}.${minor}.${patchNumber}`;
};

// Async utility functions
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> => {
    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < maxRetries - 1) {
                const delay = initialDelay * Math.pow(2, i);
                await sleep(delay);
            }
        }
    }

    throw lastError || new Error('Retry failed');
};

// Array utilities
export const uniqueArray = <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
};

// String utilities
export const truncateString = (str: string, maxLength: number, suffix: string = '...'): string => {
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength - suffix.length) + suffix;
};

// JSON utilities
export const safeJsonParse = <T = any>(jsonString: string, fallback?: T): T | null => {
    try {
        return JSON.parse(jsonString);
    } catch {
        return fallback !== undefined ? fallback : null;
    }
};
