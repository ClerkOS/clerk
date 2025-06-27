# React Query Integration Guide

This document explains how TanStack React Query has been integrated into the spreadsheet application for efficient data fetching and state management.

## Overview

React Query has been implemented to handle all API operations in the spreadsheet application, providing:
- Automatic caching and background updates
- Loading and error states
- Optimistic updates
- Request deduplication
- Background refetching

## Setup

### 1. Installation
```bash
npm install @tanstack/react-query
```

### 2. Query Client Configuration
The query client is configured in `src/main.jsx`:

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## Available Hooks

### Core Spreadsheet Operations

#### `useCell(cellId)`
Fetches a single cell's data.

```jsx
import { useCell } from '../hooks/useSpreadsheetQueries';

const { data: cellData, isLoading, error } = useCell('A1');
```

#### `useEditCell()`
Updates a cell's value.

```jsx
import { useEditCell } from '../hooks/useSpreadsheetQueries';

const editCellMutation = useEditCell();

// Usage
await editCellMutation.mutateAsync({ cellId: 'A1', value: 'New Value' });
```

#### `useImportWorkbook()`
Imports a workbook file.

```jsx
import { useImportWorkbook } from '../hooks/useSpreadsheetQueries';

const importMutation = useImportWorkbook();

// Usage
await importMutation.mutateAsync(file);
```

#### `useExportWorkbook()`
Exports the current workbook.

```jsx
import { useExportWorkbook } from '../hooks/useSpreadsheetQueries';

const exportMutation = useExportWorkbook();

// Usage
const blob = await exportMutation.mutateAsync();
```

#### `useNl2Formula()`
Converts natural language to Excel formulas.

```jsx
import { useNl2Formula } from '../hooks/useSpreadsheetQueries';

const nl2formulaMutation = useNl2Formula();

// Usage
const result = await nl2formulaMutation.mutateAsync('sum of cells A1 to A10');
```

### Composite Hooks

#### `useWorkbookOperations()`
Combines import and export operations with enhanced error handling.

```jsx
import { useWorkbookOperations } from '../hooks/useWorkbookOperations';

const {
  importWorkbook,
  exportWorkbook,
  isImporting,
  isExporting,
  importError,
  exportError,
} = useWorkbookOperations();
```

#### `useAIOperations()`
Enhanced AI operations with caching and suggestions.

```jsx
import { useAIOperations } from '../hooks/useAIOperations';

const {
  convertToFormula,
  getFormulaSuggestions,
  isConverting,
  conversionError,
  lastResult,
} = useAIOperations();
```

## Query Keys

Query keys are organized for efficient cache management:

```jsx
export const queryKeys = {
  cell: (cellId) => ['cell', cellId],
  cells: () => ['cells'],
  workbook: () => ['workbook'],
  formulas: () => ['formulas'],
};
```

## Usage Patterns

### 1. Basic Cell Operations

```jsx
import React from 'react';
import { useCell, useEditCell } from '../hooks/useSpreadsheetQueries';

const CellComponent = ({ cellId }) => {
  const { data: cell, isLoading, error } = useCell(cellId);
  const editCell = useEditCell();

  const handleUpdate = async (newValue) => {
    try {
      await editCell.mutateAsync({ cellId, value: newValue });
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <span>{cell?.value || ''}</span>
      <button onClick={() => handleUpdate('New Value')}>
        Update
      </button>
    </div>
  );
};
```

### 2. Optimistic Updates

The `useEditCell` hook automatically handles optimistic updates by updating the cache immediately and then syncing with the server.

### 3. Error Handling

```jsx
const editCell = useEditCell();

// Check for errors
if (editCell.error) {
  console.error('Edit failed:', editCell.error);
}

// Handle in mutation
const handleEdit = async () => {
  try {
    await editCell.mutateAsync({ cellId: 'A1', value: 'test' });
  } catch (error) {
    // Handle error
  }
};
```

### 4. Loading States

```jsx
const { isLoading, isPending } = editCell;

// Show loading state
if (isLoading || isPending) {
  return <div>Updating...</div>;
}
```

## Cache Management

### Manual Cache Invalidation

```jsx
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../hooks/useSpreadsheetQueries';

const queryClient = useQueryClient();

// Invalidate specific cell
queryClient.invalidateQueries({ queryKey: queryKeys.cell('A1') });

// Invalidate all cells
queryClient.invalidateQueries({ queryKey: queryKeys.cells() });

// Clear all cache
queryClient.clear();
```

### Prefetching

```jsx
const queryClient = useQueryClient();

// Prefetch a cell
queryClient.prefetchQuery({
  queryKey: queryKeys.cell('B1'),
  queryFn: () => api.getCell('B1'),
});
```

## Integration with Existing Context

The `SpreadsheetContext` has been updated to use React Query hooks while maintaining backward compatibility:

```jsx
// Old way (still works)
const { updateCell } = useSpreadsheet();

// New way (with React Query)
const editCell = useEditCell();
await editCell.mutateAsync({ cellId: 'A1', value: 'test' });
```

## Performance Benefits

1. **Automatic Caching**: Data is cached and reused across components
2. **Background Updates**: Data is refreshed in the background
3. **Request Deduplication**: Multiple requests for the same data are deduplicated
4. **Optimistic Updates**: UI updates immediately while server syncs in background
5. **Smart Refetching**: Only refetches when data is stale

## Best Practices

1. **Use the provided hooks**: Don't make direct API calls, use the React Query hooks
2. **Handle loading states**: Always check `isLoading` and `isPending` states
3. **Error boundaries**: Implement error boundaries for better error handling
4. **Cache invalidation**: Invalidate related queries after mutations
5. **Prefetching**: Prefetch data that users are likely to need

## Examples

See the following components for complete examples:
- `CellWithReactQuery.jsx` - Basic cell operations
- `WorkbookOperations.jsx` - File import/export
- `AIFormulaConverter.jsx` - AI-powered formula generation
- `ReactQueryDemo.jsx` - Comprehensive demo

## Migration Guide

If you're updating existing components:

1. Replace direct API calls with React Query hooks
2. Update loading states to use `isLoading` and `isPending`
3. Handle errors using the `error` property from hooks
4. Use `mutateAsync` for async operations instead of direct API calls

## Troubleshooting

### Common Issues

1. **Cache not updating**: Ensure you're invalidating the correct query keys
2. **Stale data**: Check `staleTime` configuration
3. **Infinite loops**: Avoid calling mutations in render functions
4. **Memory leaks**: Use `gcTime` to control cache garbage collection

### Debug Tools

React Query DevTools can be added for debugging:

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add to your app
<ReactQueryDevtools initialIsOpen={false} />
``` 