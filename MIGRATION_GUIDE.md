# React Query Migration Guide

This guide documents the gradual migration of components from direct API calls to React Query hooks for better performance, caching, and error handling.

## Migration Status

### ✅ Completed Migrations

#### 1. **Cell Component** (`src/components/spreadsheet/Cell.jsx`)
**Before:**
```jsx
const { updateCell, getCell } = useSpreadsheet();
const cellData = getCell(col, row);
await updateCell(col, row, draftValue);
```

**After:**
```jsx
import { useCell, useEditCell } from '../../features/useSpreadsheetQueries';

const cellId = `${col}${row}`;
const { data: cellDataFromQuery, isLoading, error } = useCell(cellId);
const editCellMutation = useEditCell();

const cellData = cellDataFromQuery || getCell(col, row);
await editCellMutation.mutateAsync({ cellId, value: draftValue });
```

**Benefits:**
- Automatic caching of cell data
- Loading and error states
- Optimistic updates
- Background refetching

#### 2. **FormulaBuilder Component** (`src/components/formula/FormulaBuilder.jsx`)
**Before:**
```jsx
const { updateCellWithFormula } = useSpreadsheet();
await updateCellWithFormula(col, row, formula, targetRange);
```

**After:**
```jsx
import { useEditCell } from '../../features/useSpreadsheetQueries';

const editCellMutation = useEditCell();
const cellId = `${col}${row}`;
await editCellMutation.mutateAsync({ cellId, value: formula });
```

**Benefits:**
- Better error handling
- Automatic cache invalidation
- Consistent mutation patterns

#### 3. **AIPanel Component** (`src/components/ai/AIPanel.jsx`)
**Before:**
```jsx
const [isLoading, setIsLoading] = useState(false);
// Manual API calls with setTimeout
```

**After:**
```jsx
import { useAIOperations } from '../../features/useAIOperations';

const { convertToFormula, isConverting, conversionError, lastResult } = useAIOperations();
const result = await convertToFormula(input);
```

**Benefits:**
- Proper loading states
- Error handling
- Caching of AI responses
- Automatic retry logic

#### 4. **Spreadsheet Component** (`src/components/spreadsheet/Spreadsheet.jsx`)
**Before:**
```jsx
// Direct file handling without proper loading states
```

**After:**
```jsx
import { useWorkbookOperations } from '../../features/useWorkbookOperations';

const { importWorkbook, exportWorkbook, isImporting, isExporting, importError, exportError } = useWorkbookOperations();
await importWorkbook(file);
await exportWorkbook();
```

**Benefits:**
- Loading states for import/export
- Error handling with notifications
- Proper file handling

### 🔄 In Progress Migrations

#### 1. **Grid Component** (`src/components/spreadsheet/Grid.jsx`)
- Needs migration for cell data fetching
- Consider using `useCell` for individual cells
- Implement virtual scrolling with React Query

#### 2. **TablesPanel Component** (`src/components/spreadsheet/TablesPanel.jsx`)
- Migrate table data fetching
- Add caching for table structures

#### 3. **FormulaBar Component** (`src/components/spreadsheet/FormulaBar.jsx`)
- Integrate with React Query for formula evaluation
- Add real-time formula preview

### 📋 Pending Migrations

#### 1. **SelectionManager Component** (`src/components/spreadsheet/SelectionManager.jsx`)
- Consider caching selection state
- Optimize multi-cell operations

#### 2. **ColumnHeader Component** (`src/components/spreadsheet/ColumnHeader.jsx`)
- Add caching for column metadata
- Optimize resize operations

#### 3. **Context Menu Components** (`src/components/ai/AIContextMenu.jsx`, `src/components/ai/ContextMenu.jsx`)
- Integrate with AI operations
- Add caching for context menu data

## Migration Patterns

### Pattern 1: Replace Direct API Calls with React Query Hooks

**Step 1:** Import React Query hooks
```jsx
import { useCell, useEditCell } from '../../features/useSpreadsheetQueries';
```

**Step 2:** Replace state management
```jsx
// Before
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// After
const { data, isLoading, error } = useCell(cellId);
```

**Step 3:** Replace API calls
```jsx
// Before
const handleUpdate = async () => {
  setLoading(true);
  try {
    const result = await api.updateCell(cellId, value);
    setData(result);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};

// After
const mutation = useEditCell();
const handleUpdate = async () => {
  await mutation.mutateAsync({ cellId, value });
};
```

### Pattern 2: Add Loading and Error States

```jsx
// Add loading state
if (isLoading) {
  return <div className="loading-spinner">Loading...</div>;
}

// Add error state
if (error) {
  return <div className="error-message">Error: {error.message}</div>;
}
```

### Pattern 3: Optimistic Updates

```jsx
const mutation = useEditCell({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['cell', cellId]);
    
    // Snapshot previous value
    const previousData = queryClient.getQueryData(['cell', cellId]);
    
    // Optimistically update
    queryClient.setQueryData(['cell', cellId], newData);
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['cell', cellId], context.previousData);
  },
});
```

## Performance Optimizations

### 1. **Query Deduplication**
React Query automatically deduplicates identical requests:
```jsx
// Multiple components requesting the same cell data
const { data: cellA1 } = useCell('A1'); // Component A
const { data: cellA1Again } = useCell('A1'); // Component B
// Only one API call is made
```

### 2. **Background Refetching**
```jsx
const { data } = useCell(cellId, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
});
```

### 3. **Prefetching**
```jsx
const queryClient = useQueryClient();

// Prefetch data before user needs it
const prefetchCell = (cellId) => {
  queryClient.prefetchQuery({
    queryKey: ['cell', cellId],
    queryFn: () => api.getCell(cellId),
  });
};
```

## Error Handling

### 1. **Global Error Handling**
```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});
```

### 2. **Component-Level Error Handling**
```jsx
const { data, error, isError } = useCell(cellId);

if (isError) {
  return (
    <div className="error-boundary">
      <p>Failed to load cell data</p>
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );
}
```

## Testing Migrated Components

### 1. **Unit Tests**
```jsx
import { renderHook } from '@testing-library/react-features';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

test('useCell fetches data', async () => {
  const { result, waitFor } = renderHook(() => useCell('A1'), { wrapper });
  
  await waitFor(() => result.current.isSuccess);
  expect(result.current.data).toEqual(expectedData);
});
```

### 2. **Integration Tests**
```jsx
test('Cell component updates with React Query', async () => {
  render(<Cell cellId="A1" />);
  
  // Wait for data to load
  await screen.findByText('Cell Value');
  
  // Test mutation
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Value' } });
  fireEvent.click(screen.getByText('Save'));
  
  // Verify optimistic update
  expect(screen.getByText('New Value')).toBeInTheDocument();
});
```

## Best Practices

### 1. **Query Key Structure**
```jsx
// Use consistent query key patterns
export const queryKeys = {
  cell: (cellId) => ['cell', cellId],
  cells: () => ['cells'],
  workbook: () => ['workbook'],
  formulas: () => ['formulas'],
};
```

### 2. **Mutation Patterns**
```jsx
// Always handle errors
const mutation = useEditCell({
  onError: (error) => {
    console.error('Failed to update cell:', error);
    // Show user-friendly error message
  },
});

// Use optimistic updates when appropriate
const mutation = useEditCell({
  onMutate: async (newData) => {
    // Optimistic update logic
  },
});
```

### 3. **Loading States**
```jsx
// Provide meaningful loading states
if (isLoading) {
  return <CellSkeleton />;
}

// Show loading indicators for mutations
<button disabled={mutation.isPending}>
  {mutation.isPending ? 'Saving...' : 'Save'}
</button>
```

## Monitoring and Debugging

### 1. **React Query DevTools**
```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### 2. **Query Monitoring**
```jsx
// Monitor query performance
const { data } = useCell(cellId, {
  onSuccess: (data) => {
    console.log('Cell data loaded:', data);
  },
  onError: (error) => {
    console.error('Cell data failed:', error);
  },
});
```

## Next Steps

1. **Complete Grid Component Migration**
   - Implement virtual scrolling with React Query
   - Add cell prefetching for better performance

2. **Add Advanced Features**
   - Implement batch operations
   - Add real-time collaboration features
   - Implement offline support

3. **Performance Optimization**
   - Add query persistence
   - Implement infinite scrolling
   - Add background sync

4. **Testing**
   - Add comprehensive test coverage
   - Implement E2E tests with React Query
   - Add performance monitoring

## Troubleshooting

### Common Issues

1. **Cache Not Updating**
   - Check query key consistency
   - Verify cache invalidation logic
   - Use React Query DevTools to inspect cache

2. **Infinite Loops**
   - Avoid calling mutations in render functions
   - Use proper dependency arrays in useEffect
   - Check for circular dependencies

3. **Memory Leaks**
   - Configure proper `gcTime` settings
   - Clean up subscriptions properly
   - Use `useQueryClient` for manual cache management

### Performance Issues

1. **Too Many Requests**
   - Implement request deduplication
   - Use `staleTime` to reduce refetches
   - Consider implementing request batching

2. **Slow Loading**
   - Add loading skeletons
   - Implement progressive loading
   - Use prefetching for critical data

This migration guide provides a comprehensive approach to gradually migrating your spreadsheet application to use React Query, ensuring better performance, user experience, and maintainability. 