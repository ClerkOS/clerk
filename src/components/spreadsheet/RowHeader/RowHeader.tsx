import React from "react";

interface RowHeaderProps {
  rowIndex: number;
  height: number;
}

const RowHeader: React.FC<RowHeaderProps> = ({ rowIndex, height }) => {
  return (
    <td
      className="sticky left-0 z-10 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs sm:text-xs"
      style={{ height }}
    >
      {rowIndex + 1}
    </td>
  );
};

export default RowHeader