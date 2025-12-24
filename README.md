# @eldrforge/shared

Shared utilities for Eldrforge tools.

## Overview

This package provides common utilities used across @eldrforge packages:
- File storage operations
- User input handling
- Error types
- Date formatting
- Validation helpers
- General utilities

## Installation

```bash
npm install @eldrforge/shared
```

## Dependencies

- `zod` - Validation schemas
- `semver` - Version utilities
- `js-yaml` - YAML parsing
- `dayjs` - Date manipulation
- `moment-timezone` - Timezone support
- `winston` - Optional peer dependency for logging

## Usage

```typescript
import { getLogger, setLogger } from '@eldrforge/shared';

// Set custom logger
setLogger(myWinstonLogger);

// Use logger
const logger = getLogger();
logger.info('Hello from shared utilities!');
```

More documentation coming as utilities are extracted.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

## License

Apache-2.0

