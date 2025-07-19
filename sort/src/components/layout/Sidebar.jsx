// import React from 'react';
// import { Table, BarChart, Calculator, Bot } from 'lucide-react';
// import Tooltip from '../ui/Tooltip.jsx';
//
// const Sidebar = ({ onFormulaClick, onChartClick, onTableClick, onAIClick }) => {
//   const tools = [
//     { id: 'table', icon: <Table size={18} />, label: 'Tables', onClick: onTableClick },
//     { id: 'chart', icon: <BarChart size={18} />, label: 'Charts', onClick: onChartClick },
//     { id: 'calculator', icon: <Calculator size={18} />, label: 'Formulas', onClick: onFormulaClick },
//     { id: 'ai', icon: <Bot size={18} />, label: 'AI Assistant', onClick: onAIClick }
//   ];
//
//   return (
//     <div className="w-12 sm:w-14 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-1 sm:p-2">
//       <div className="flex flex-col items-center space-y-2 sm:space-y-4">
//         {tools.map(tool => (
//           <Tooltip key={tool.id} text={tool.label} position="right">
//             <button
//               className={`p-1.5 sm:p-2 rounded transition-colors touch-target ${
//                 tool.onClick
//                   ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
//                   : 'opacity-50 cursor-not-allowed'
//               }`}
//               onClick={tool.onClick}
//               disabled={!tool.onClick}
//             >
//               <div className="w-4 h-4 sm:w-[18px] sm:h-[18px] flex items-center justify-center">
//               {tool.icon}
//               </div>
//             </button>
//           </Tooltip>
//         ))}
//       </div>
//     </div>
//   );
// };
//
// export default Sidebar;