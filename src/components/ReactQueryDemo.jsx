import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCell, useEditCell, queryKeys } from '../hooks/useSpreadsheetQueries';
import { useWorkbookOperations } from '../hooks/useWorkbookOperations';
import { useAIOperations } from '../hooks/useAIOperations';
import { RefreshCw, Database, Zap } from 'lucide-react';

const ReactQueryDemo = () => {
  const queryClient = useQueryClient();
  const [selectedCellId, setSelectedCellId] = useState('A1');
  const [newCellValue, setNewCellValue] = useState('');

  // React Query hooks
  const { data: cellData, isLoading: cellLoading, error: cellError } = useCell(selectedCellId);
  const editCellMutation = useEditCell();
  const { importWorkbook, exportWorkbook, isImporting, isExporting } = useWorkbookOperations();
  const { convertToFormula, isConverting, lastResult } = useAIOperations();

  const handleCellUpdate = async () => {
    if (!newCellValue.trim()) return;
    
    try {
      await editCellMutation.mutateAsync({ cellId: selectedCellId, value: newCellValue });
      setNewCellValue('');
    } catch (error) {
      console.error('Failed to update cell:', error);
    }
  };

  const handleRefreshCache = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cell(selectedCellId) });
  };

  const handleClearCache = () => {
    queryClient.clear();
  };

  const handlePrefetchCell = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.cell('B1'),
      queryFn: () => fetch(`http://localhost:8080/get-cell?cell_id=B1`).then(res => res.json()),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">React Query Demo</h1>
        <p className="text-gray-600">Demonstrating TanStack React Query integration</p>
      </div>

      {/* Cell Operations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Database className="text-blue-600" size={20} />
            <span>Cell Operations</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Cell
              </label>
              <input
                type="text"
                value={selectedCellId}
                onChange={(e) => setSelectedCellId(e.target.value.toUpperCase())}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., A1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cell Data
              </label>
              <div className="p-3 bg-gray-50 rounded-md min-h-[60px]">
                {cellLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Loading...</span>
                  </div>
                ) : cellError ? (
                  <div className="text-red-600">Error: {cellError.message}</div>
                ) : (
                  <pre className="text-sm">{JSON.stringify(cellData, null, 2)}</pre>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Cell Value
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCellValue}
                  onChange={(e) => setNewCellValue(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Enter new value"
                />
                <button
                  onClick={handleCellUpdate}
                  disabled={editCellMutation.isPending || !newCellValue.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {editCellMutation.isPending ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cache Management Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <RefreshCw className="text-green-600" size={20} />
            <span>Cache Management</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Query Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cell Loading:</span>
                  <span className={cellLoading ? 'text-blue-600' : 'text-gray-600'}>
                    {cellLoading ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cell Error:</span>
                  <span className={cellError ? 'text-red-600' : 'text-gray-600'}>
                    {cellError ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Update Pending:</span>
                  <span className={editCellMutation.isPending ? 'text-orange-600' : 'text-gray-600'}>
                    {editCellMutation.isPending ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleRefreshCache}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Refresh Cache
              </button>
              <button
                onClick={handleClearCache}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Clear All Cache
              </button>
              <button
                onClick={handlePrefetchCell}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Prefetch Cell B1
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workbook Operations Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Workbook Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Import Status</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Loading:</span>
                <span className={isImporting ? 'text-blue-600' : 'text-gray-600'}>
                  {isImporting ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Export Status</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Loading:</span>
                <span className={isExporting ? 'text-blue-600' : 'text-gray-600'}>
                  {isExporting ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Operations Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Zap className="text-yellow-600" size={20} />
          <span>AI Operations</span>
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Conversion Status</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Converting:</span>
                <span className={isConverting ? 'text-blue-600' : 'text-gray-600'}>
                  {isConverting ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
          
          {lastResult && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Last Result</h3>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <pre className="text-sm">{JSON.stringify(lastResult, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Query Client Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Query Client Info</h2>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Total Queries:</span>
            <span>{queryClient.getQueryCache().getAll().length}</span>
          </div>
          <div className="flex justify-between">
            <span>Active Queries:</span>
            <span>{queryClient.getQueryCache().getAll().filter(q => q.isActive()).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactQueryDemo; 