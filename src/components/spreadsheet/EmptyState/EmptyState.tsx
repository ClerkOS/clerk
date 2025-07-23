import React, { useState } from 'react';
import { Upload, Plus, FileText } from 'lucide-react';
import { useTheme } from "../../providers/ThemeProvider";

interface EmptyStateProps {
  onFileUpload: (file: File) => Promise<void>;
  onCreateNewWorkbook: () => void;
  onSampleData: () => void;
  error?: string | null;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onFileUpload, onCreateNewWorkbook, onSampleData, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await onFileUpload(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      {/* Main Upload Area */}
      <div
        className={`relative w-full max-w-md transition-all duration-300 ease-out ${
          isDragging ? 'scale-105' : isHovering ? 'scale-102' : 'scale-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <label className={`
          group cursor-pointer block relative overflow-hidden
          rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragging
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-lg shadow-blue-500/20'
          : isHovering
            ? 'border-gray-400 dark:border-gray-500 bg-gray-50/50 dark:bg-gray-800/50'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        }
        `}>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className={`
            absolute inset-0 opacity-0 transition-opacity duration-300
            bg-gradient-to-br from-blue-500/5 to-purple-500/5
            ${isHovering || isDragging ? 'opacity-100' : ''}
          `} />

          <div className="relative p-12 text-center">
            <div className={`
              inline-flex items-center justify-center w-16 h-16 mb-6
              rounded-full bg-gray-100 dark:bg-gray-800 transition-all duration-300
              ${isDragging ? 'bg-blue-100 dark:bg-blue-900/30 scale-110' : ''}
              ${isHovering ? 'scale-105' : ''}
            `}>
              <Upload
                size={24}
                className={`
                  transition-colors duration-300
                  ${isDragging
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
                }
                `}
              />
            </div>

            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {isDragging ? 'Drop it here' : 'Upload your file'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Drag and drop your CSV or Excel file here, or click to browse
            </p>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">CSV</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">XLSX</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">XLS</span>
            </div>
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-3 max-w-md text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="flex items-center w-full max-w-md my-8">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        <span className="px-4 text-sm text-gray-500 dark:text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div className="flex ">
        <button
          onClick={onCreateNewWorkbook}
          className="
            group flex items-center gap-2 px-4 py-2.5 text-sm font-medium
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700

          "
        >
          <Plus size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          <span className="text-gray-700 dark:text-gray-300">Create new workbook</span>
        </button>

        {/*<button*/}
        {/*  onClick={onSampleData}*/}
        {/*  className="*/}
        {/*    group flex items-center gap-2 px-4 py-2.5 text-sm font-medium*/}
        {/*    bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700*/}
        {/*    rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750*/}
        {/*    transition-all duration-200 hover:scale-105 hover:shadow-md*/}
        {/*  "*/}
        {/*>*/}
        {/*  <FileText size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />*/}
        {/*  <span className="text-gray-700 dark:text-gray-300">Sample Data</span>*/}
        {/*</button>*/}
      </div>
    </div>
  );
};

export default EmptyState;