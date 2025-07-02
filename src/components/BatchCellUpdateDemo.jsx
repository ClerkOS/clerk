import React, { useState } from 'react';
import { useBatchCellUpdate } from '../hooks/useSpreadsheetQueries';
import { useSpreadsheet } from '../context/SpreadsheetContext';

const BatchCellUpdateDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { spreadsheetData } = useSpreadsheet();
  const batchCellUpdateMutation = useBatchCellUpdate();

  const sampleData = {
    sheet: "Sheet1",
    edits: [
      { address: "A1", value: "Product", formula: "" },
      { address: "B1", value: "Price", formula: "" },
      { address: "C1", value: "Quantity", formula: "" },
      { address: "A2", value: "Apples", formula: "" },
      { address: "B2", value: "3", formula: "" },
      { address: "C2", value: "10", formula: "" },
      { address: "A3", value: "Oranges", formula: "" },
      { address: "B3", value: "2", formula: "" },
      { address: "C3", value: "5", formula: "" },
      { address: "A4", value: "Total", formula: "" },
      { address: "B4", value: "", formula: "=SUM(B2:B3)" },
      { address: "C4", value: "", formula: "=SUM(C2:C3)" }
    ]
  };

  const handleBatchUpdate = async () => {
    if (!spreadsheetData.workbook_id) {
      alert('No workbook loaded. Please import a workbook first.');
      return;
    }

    setIsLoading(true);
    try {
      await batchCellUpdateMutation.mutateAsync({
        workbookId: spreadsheetData.workbook_id,
        sheet: sampleData.sheet,
        edits: sampleData.edits
      });
      alert('Batch update completed successfully!');
    } catch (error) {
      console.error('Batch update failed:', error);
      alert('Batch update failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Batch Cell Update Demo</h3>
      <p className="text-sm text-gray-600 mb-4">
        This will populate cells A1:C4 with sample product data including formulas.
      </p>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Sample Data:</h4>
        <div className="bg-gray-50 p-3 rounded text-sm">
          <div>A1: Product | B1: Price | C1: Quantity</div>
          <div>A2: Apples | B2: 3 | C2: 10</div>
          <div>A3: Oranges | B3: 2 | C3: 5</div>
          <div>A4: Total | B4: =SUM(B2:B3) | C4: =SUM(C2:C3)</div>
        </div>
      </div>

      <button
        onClick={handleBatchUpdate}
        disabled={isLoading || !spreadsheetData.workbook_id}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Updating...' : 'Run Batch Update'}
      </button>

      {!spreadsheetData.workbook_id && (
        <p className="text-sm text-red-600 mt-2">
          Please import a workbook first to use this feature.
        </p>
      )}
    </div>
  );
};

export default BatchCellUpdateDemo; 