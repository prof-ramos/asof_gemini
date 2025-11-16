# Custom Hooks

This directory contains custom React hooks organized by category.

## Directory Structure

- **ui/** - UI-related hooks (scroll position, resize observers, etc.)
  - `useScrollPosition.ts` - Hook for tracking scroll position

## Usage

Import hooks from the barrel export:

```typescript
import { useScrollPosition } from '@/hooks';

function MyComponent() {
  const scrolled = useScrollPosition(50);
  // ...
}
```

## Adding New Hooks

When adding new hooks:

1. Place them in the appropriate category directory (`ui/`, `data/`, etc.)
2. Export them from the category's `index.ts`
3. Re-export from the main `hooks/index.ts`

Example:

```typescript
// hooks/ui/useWindowSize.ts
export default function useWindowSize() {
  // implementation
}

// hooks/ui/index.ts
export { default as useWindowSize } from './useWindowSize';

// hooks/index.ts
export { useScrollPosition, useWindowSize } from './ui';
```
