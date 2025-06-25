import React from 'react';
import { Table, BarChart, Calculator, Bot } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

const Sidebar = ({ onFormulaClick, onChartClick, onTableClick, onAIClick }) => {
  const tools = [
    { id: 'table', icon: <Table size={18} />, label: 'Tables', onClick: onTableClick },
    { id: 'chart', icon: <BarChart size={18} />, label: 'Charts', onClick: onChartClick },
    { id: 'calculator', icon: <Calculator size={18} />, label: 'Formulas', onClick: onFormulaClick },
    { id: 'ai', icon: <Bot size={18} />, label: 'AI Assistant', onClick: onAIClick }
  ];

  return (
    <div className="hidden md:block w-14 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-2">
      <div className="flex flex-col items-center space-y-4">
        {tools.map(tool => (
          <Tooltip key={tool.id} text={tool.label} position="right">
            <button 
              className={`p-2 rounded transition-colors ${
                tool.onClick 
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-800' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={tool.onClick}
              disabled={!tool.onClick}
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