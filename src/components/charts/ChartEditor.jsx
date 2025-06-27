import React from 'react';
import { BarChart3, LineChart, PieChart, BarChart, Mountain, ScatterChart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const chartTypes = [
  { id: 'column', name: 'Column', icon: <BarChart3 size={20} /> },
  { id: 'line', name: 'Line', icon: <LineChart size={20} /> },
  { id: 'pie', name: 'Pie', icon: <PieChart size={20} /> },
  { id: 'bar', name: 'Bar', icon: <BarChart size={20} /> },
  { id: 'area', name: 'Area', icon: <Mountain size={20} /> },
  { id: 'scatter', name: 'Scatter', icon: <ScatterChart size={20} /> },
];

const colorSchemes = [
  'bg-blue-500', 'bg-green-500', 'bg-orange-400', 'bg-red-500', 'bg-purple-500', 'bg-pink-500'
];

const ChartEditor = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            title="Back to Sheet"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline text-sm">Back</span>
          </button>
          <h1 className="text-xl font-semibold">Sales Performance Chart</h1>
          <span className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium">Column Chart</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm">Save as Template</button>
          <button className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm">Export</button>
          <button className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 text-sm">Apply to Sheet</button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-8 transition-colors duration-200">
          {/* Chart Type */}
          <div>
            <h2 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Chart Type</h2>
            <div className="grid grid-cols-3 gap-2">
              {chartTypes.map(type => (
                <button key={type.id} className="flex flex-col items-center gap-1 p-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition">
                  {type.icon}
                  <span className="text-xs text-gray-700 dark:text-gray-200">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Data Source */}
          <div>
            <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Data Source</h2>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">X-Axis Data:</label>
              <input className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200" value="A2:A6" readOnly />
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Y-Axis Data:</label>
              <input className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200" value="B2:B6" readOnly />
            </div>
            <button className="w-full mt-2 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Edit Data Range</button>
          </div>

          {/* Chart Elements */}
          <div>
            <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Chart Elements</h2>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Chart Title</label>
              <input className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200" value="Sales Performance" readOnly />
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">X-Axis Label</label>
              <input className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200" value="Months" readOnly />
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Y-Axis Label</label>
              <input className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200" value="Revenue ($)" readOnly />
            </div>
          </div>
        </aside>

        {/* Center Chart Preview */}
        <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="w-[700px] h-[400px] bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center border-8 border-white shadow-xl">
            {/* Placeholder for chart graphic */}
            <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
              <rect x="20" y="60" width="20" height="40" rx="4" fill="#fff" />
              <rect x="50" y="40" width="20" height="60" rx="4" fill="#fff" />
              <rect x="80" y="30" width="20" height="70" rx="4" fill="#fff" />
              <rect x="110" y="80" width="20" height="20" rx="4" fill="#fff" />
              <rect x="140" y="50" width="20" height="50" rx="4" fill="#fff" />
            </svg>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-8 transition-colors duration-200">
          {/* Appearance */}
          <div>
            <h2 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Appearance</h2>
            <div className="flex items-center gap-2 mb-3">
              {colorSchemes.map((color, i) => (
                <span key={i} className={`w-6 h-6 rounded-full border-2 border-white cursor-pointer ${color}`}></span>
              ))}
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Transparency</label>
              <input type="range" min="0" max="100" className="w-full" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Border Width</label>
              <input type="range" min="0" max="10" className="w-full" />
            </div>
          </div>

          {/* Typography */}
          <div>
            <h2 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Typography</h2>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Font Family</label>
              <select className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200">
                <option>Arial</option>
                <option>Inter</option>
                <option>Roboto</option>
                <option>Georgia</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Title Size</label>
              <input type="range" min="10" max="48" className="w-full" />
            </div>
          </div>

          {/* Layout */}
          <div>
            <h2 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Layout</h2>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Legend Position</label>
              <select className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200">
                <option>Right</option>
                <option>Left</option>
                <option>Top</option>
                <option>Bottom</option>
              </select>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-8 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs transition-colors duration-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Grid Lines</span>
          <button className="px-2 py-1 rounded bg-blue-700 text-white">Major X</button>
          <button className="px-2 py-1 rounded bg-blue-700 text-white">Major Y</button>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Minor X</button>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Minor Y</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Data Labels</span>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Show Values</button>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Show Percentages</button>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Show Categories</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Animation</span>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Entrance</button>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Emphasis</button>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Exit</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Interaction</span>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Tooltip</button>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Drill Down</button>
          <button className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">Zoom</button>
        </div>
      </div>
    </div>
  );
};

export default ChartEditor; 