import React, { useState, useRef, useEffect} from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { BarChart3, LineChart, PieChart, BarChart, Mountain, ScatterChart, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface ChartType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
}

interface ChartBuilderProps {
  onWidthChange: (width: number) => void;
}

const chartTypes: ChartType[] = [
  {
    id: 'column',
    name: 'Column',
    description: 'Compare values across categories',
    icon: <BarChart3 size={24} />
  },
  {
    id: 'line',
    name: 'Line',
    description: 'Show trends over time',
    icon: <LineChart size={24} />
  },
  {
    id: 'pie',
    name: 'Pie',
    description: 'Show parts of a whole',
    icon: <PieChart size={24} />
  },
  {
    id: 'bar',
    name: 'Bar',
    description: 'Horizontal comparison',
    icon: <BarChart size={24} />
  },
  {
    id: 'area',
    name: 'Area',
    description: 'Cumulative trends',
    icon: <Mountain size={24} />
  },
  {
    id: 'scatter',
    name: 'Scatter',
    description: 'Show correlations',
    icon: <ScatterChart size={24} />
  }
];

const ChartBuilder: React.FC<ChartBuilderProps> = ({ onWidthChange }) => {
  const { theme } = useTheme();
  // const navigate = useNavigate();
  const [width, setWidth] = useState<number>(320);
  const [dataMode, setDataMode] = useState<'range' | 'table' | 'selection'>('range');
  const [selectedChart, setSelectedChart] = useState<string>('column');
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [dataRange, setDataRange] = useState<string>('A1:C10');
  const [labelRange, setLabelRange] = useState<string>('');
  const [chartTitle, setChartTitle] = useState<string>('Sales Data Q1-Q4');
  const [xAxisLabel, setXAxisLabel] = useState<string>('Quarters');
  const [yAxisLabel, setYAxisLabel] = useState<string>('Revenue ($)');
  const [chartType, setChartType] = useState<string>('column');

  const isResizing = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const delta = startX.current - e.clientX;
    const newWidth = Math.min(Math.max(startWidth.current + delta, 280), 500);
    setWidth(newWidth);
    onWidthChange(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);


  // const handleCreateChart = () => {
  //   // Navigate to the chart editor page
  //   navigate('/chart-editor');
  // };

  const handleDataRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataRange(e.target.value);
  };

  const handleLabelRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelRange(e.target.value);
  };

  return (
    <div
      className="relative border-l flex flex-col h-full bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/50"
        onMouseDown={handleMouseDown}
      >
        <GripVertical
          size={16}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
        />
      </div>

      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="font-medium text-lg">Chart Builder</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create and customize your charts
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Data Source Selector */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <span>📊</span>
            <span className="font-medium">Select Data Range</span>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <input
              type="text"
              value={dataRange}
              onChange={(e) => setDataRange(e.target.value)}
              className="px-3 py-2 rounded-md border font-mono text-sm bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="e.g., A1:C10"
            />
            <input
              type="text"
              value={labelRange}
              onChange={(e) => setLabelRange(e.target.value)}
              className="px-3 py-2 rounded-md border font-mono text-sm bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Labels: A1:A10 (optional)"
            />
          </div>
          <div className="flex gap-2">
            {['range', 'table', 'selection'].map((mode) => (
              <button
                key={mode}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  dataMode === mode
                    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Types */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span>📈</span>
            <span className="font-medium">Chart Type</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {chartTypes.map((chart) => (
              <button
                key={chart.id}
                onClick={() => setSelectedChart(chart.id)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  selectedChart === chart.id
                    ? 'bg-purple-100 border-purple-500 dark:bg-purple-900 dark:border-purple-500'
                    : 'bg-gray-50 border-gray-200 hover:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-purple-500'
                }`}
              >
                <div className="mb-2">{chart.icon}</div>
                <div className="font-medium text-sm">{chart.name}</div>
                <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  {chart.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Create Chart Button */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold shadow text-sm"
        >
          Create Chart
        </button>
      </div>
    </div>
  );
}

export default ChartBuilder;