# Bedlam

A chaos engineering library that randomly rejects API fetch requests to test your site's reliability.

## Installation

```bash
npm install bedlam
# or
pnpm add bedlam
# or
yarn add bedlam
```

## Usage

```typescript
import { enableChaos, disableChaos } from "bedlam";

// Enable chaos mode
enableChaos({
  failRate: 0.3, // 30% of requests will fail (default: 0.2)
  delayMs: 1000, // Add 1s delay to all requests (default: 0)
  mode: "reject", // 'reject' or 'http-500' (default: 'reject')
  include: ["/api/"], // Only affect URLs containing these strings (default: [])
  exclude: ["/health"], // Never affect URLs containing these strings (default: [])
});

// Disable chaos mode
disableChaos();
```

## Error Modes

- **`reject`**: Simulates network failures (promise rejection)
- **`http-500`**: Simulates server errors (returns HTTP 500 response)

## Example

```typescript
import { enableChaos } from 'bedlam';

// Enable chaos in development
if (process.env.NODE_ENV === 'development') {
  enableChaos({ failRate: 0.2 });
}

// Your app will now randomly fail 20% of fetch requests
fetch('/api/users').then(...).catch(...);
```
