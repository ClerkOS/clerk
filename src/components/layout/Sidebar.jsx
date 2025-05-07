import React from 'react';
import { Table, BarChart, Calculator, Database } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

const Sidebar = ({ onFormulaClick }) => {
  const tools = [
    { id: 'table', icon: <Table size={18} />, label: 'Tables' },
    { id: 'chart', icon: <BarChart size={18} />, label: 'Charts' },
    { id: 'calculator', icon: <Calculator size={18} />, label: 'Formulas' },
    { id: 'database', icon: <Database size={18} />, label: 'Data' }
  ];

  return (
    <div className="hidden md:block w-14 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2">
      <div className="flex flex-col items-center space-y-4">
        {tools.map(tool => (
          <Tooltip key={tool.id} text={tool.label} position="right">
            <button 
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              onClick={() => tool.id === 'calculator' && onFormulaClick()}
            >
              {tool.icon}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;