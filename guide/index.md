# @eldrforge/shared - Agentic Guide

## Purpose

Shared utilities for Eldrforge tools. Provides storage, validation, error handling, date utilities, and common helpers.

## Key Features

- **Storage** - File-based storage with JSON/YAML support
- **Validation** - Input validation and sanitization
- **Error Handling** - Custom error types (ArgumentError, CommandErrors, etc.)
- **Date Utilities** - Date parsing and formatting
- **Safety** - Safe file operations and input handling
- **Standard Input** - Interactive input reading

## Usage

```typescript
import {
  Storage,
  validateInput,
  ArgumentError,
  formatDate,
  safeReadFile
} from '@eldrforge/shared';

// Storage
const storage = new Storage('config.json');
await storage.save({ key: 'value' });
const data = await storage.load();

// Validation
const valid = validateInput(userInput, schema);

// Error handling
if (!valid) {
  throw new ArgumentError('Invalid input', { input: userInput });
}

// Date utilities
const formatted = formatDate(new Date(), 'YYYY-MM-DD');
```

## Dependencies

- dayjs - Date manipulation
- js-yaml - YAML parsing
- glob - File pattern matching
- moment-timezone - Timezone support
- semver - Version parsing
- zod - Schema validation

## Package Structure

```
src/
├── errors/               # Error types
│   ├── ArgumentError.ts
│   ├── CancellationError.ts
│   ├── CommandErrors.ts
│   ├── ExitError.ts
│   └── index.ts
├── storage.ts            # File storage
├── validation.ts         # Input validation
├── dates.ts              # Date utilities
├── general.ts            # General utilities
├── safety.ts             # Safe operations
├── stdin.ts              # Standard input
├── types.ts              # Type definitions
└── index.ts
```

## Key Exports

- `Storage` - File-based storage
- `validateInput()` - Input validation
- `ArgumentError` - Argument validation error
- `CommandError` - Command execution error
- `CancellationError` - Operation cancelled
- `ExitError` - Process exit error
- `formatDate()` - Date formatting
- `safeReadFile()` - Safe file reading
- `sanitizeInput()` - Input sanitization

