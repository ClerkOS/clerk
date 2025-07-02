import React, { useState, useMemo } from 'react';
import { BarChart3, LineChart, PieChart, BarChart, Mountain, ScatterChart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartTypes = [
  { id: 'column', name: 'Column', icon: <BarChart3 size={20} />, chart: 'bar' },
  { id: 'line', name: 'Line', icon: <LineChart size={20} />, chart: 'line' },
  { id: 'pie', name: 'Pie', icon: <PieChart size={20} />, chart: 'pie' },
  { id: 'bar', name: 'Bar', icon: <BarChart size={20} />, chart: 'bar-horizontal' },
  { id: 'area', name: 'Area', icon: <Mountain size={20} />, chart: 'area' },
  { id: 'scatter', name: 'Scatter', icon: <ScatterChart size={20} />, chart: 'scatter' },
];

const colorSchemes = [
  '#3b82f6', '#22c55e', '#fb923c', '#ef4444', '#8b5cf6', '#ec4899'
];

const ChartEditor = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { spreadsheetData, getActiveSheet } = useSpreadsheet();

  // Sheet and column selection
  const sheets = spreadsheetData.sheets || [];
  const [selectedSheetId, setSelectedSheetId] = useState(sheets[0]?.id || '');
  const selectedSheet = useMemo(() => sheets.find(s => s.id === selectedSheetId) || sheets[0], [sheets, selectedSheetId]);
  const columns = selectedSheet ? selectedSheet.columns : [];
  const cells = selectedSheet ? selectedSheet.cells : {};

  // Find all columns with at least one non-empty value
  const availableColumns = useMemo(() => {
    if (!columns || !cells) return [];
    return columns.filter(col => {
      return Object.keys(cells).some(cellId => cellId.startsWith(col) && cells[cellId]?.value !== '');
    });
  }, [columns, cells]);

  // Chart state
  const [chartType, setChartType] = useState('column');
  const [xCol, setXCol] = useState(availableColumns[0] || '');
  const [yCol, setYCol] = useState(availableColumns[1] || '');
  const [chartTitle, setChartTitle] = useState('Chart Title');
  const [xLabel, setXLabel] = useState('X Axis');
  const [yLabel, setYLabel] = useState('Y Axis');
  const [color, setColor] = useState(colorSchemes[0]);

  // Extract data for chart
  const chartData = useMemo(() => {
    if (!xCol || !yCol || !cells) return null;
    // Find all rows with both x and y values
    const rows = [];
    for (let row = 1; row <= selectedSheet?.rows; row++) {
      const xCell = cells[`${xCol}${row}`];
      const yCell = cells[`${yCol}${row}`];
      if (xCell && yCell && xCell.value !== '' && yCell.value !== '' && !isNaN(Number(yCell.value))) {
        rows.push({ x: xCell.value, y: Number(yCell.value) });
      }
    }
    if (rows.length === 0) return null;
    return rows;
  }, [xCol, yCol, cells, selectedSheet]);

  // Chart.js data config
  const chartJsData = useMemo(() => {
    if (!chartData) return null;
    if (chartType === 'pie') {
      return {
        labels: chartData.map(r => r.x),
        datasets: [{
          data: chartData.map(r => r.y),
          backgroundColor: colorSchemes,
        }],
      };
    } else if (chartType === 'scatter') {
      return {
        datasets: [{
          label: chartTitle,
          data: chartData.map(r => ({ x: r.x, y: r.y })),
          backgroundColor: color,
        }],
      };
    } else {
      return {
        labels: chartData.map(r => r.x),
        datasets: [{
          label: chartTitle,
          data: chartData.map(r => r.y),
          backgroundColor: color,
        }],
      };
    }
  }, [chartData, chartType, chartTitle, color]);

  // Chart.js options config
  const chartJsOptions = useMemo(() => {
    if (!chartData) return {};
    return {
      responsive: true,
      plugins: {
        legend: { display: chartType !== 'pie' },
        title: { display: !!chartTitle, text: chartTitle },
      },
      scales: chartType === 'pie' ? {} : {
        x: { title: { display: !!xLabel, text: xLabel } },
        y: { title: { display: !!yLabel, text: yLabel } },
      },
    };
  }, [chartData, chartType, chartTitle, xLabel, yLabel]);

  // Chart component selection
  const renderChart = () => {
    if (!chartJsData) return <div className="text-center text-gray-400">No data to display. Select columns with data.</div>;
    if (chartType === 'pie') return <Pie data={chartJsData} options={chartJsOptions} />;
    if (chartType === 'line') return <Line data={chartJsData} options={chartJsOptions} />;
    if (chartType === 'scatter') return <Scatter data={chartJsData} options={chartJsOptions} />;
    // Area chart is a line chart with fill
    if (chartType === 'area') return <Line data={{...chartJsData, datasets: chartJsData.datasets.map(ds => ({...ds, fill: true}))}} options={chartJsOptions} />;
    // Bar/Column
    return <Bar data={chartJsData} options={chartJsOptions} />;
  };

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
          <h1 className="text-xl font-semibold">Chart Editor</h1>
          <span className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium">{chartTypes.find(t => t.id === chartType)?.name}</span>
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
                <button
                  key={type.id}
                  className={`flex flex-col items-center gap-1 p-2 rounded ${chartType === type.id ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' : 'bg-gray-100 dark:bg-gray-800'} hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition`}
                  onClick={() => setChartType(type.id)}
                >
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
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Sheet:</label>
              <select
                className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200"
                value={selectedSheetId}
                onChange={e => setSelectedSheetId(e.target.value)}
              >
                {sheets.map(sheet => (
                  <option key={sheet.id} value={sheet.id}>{sheet.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">X-Axis Column:</label>
              <select
                className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200"
                value={xCol}
                onChange={e => setXCol(e.target.value)}
              >
                <option value="">Select column</option>
                {availableColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Y-Axis Column:</label>
              <select
                className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200"
                value={yCol}
                onChange={e => setYCol(e.target.value)}
              >
                <option value="">Select column</option>
                {availableColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Elements */}
          <div>
            <h2 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Chart Elements</h2>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Chart Title</label>
              <input
                className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200"
                value={chartTitle}
                onChange={e => setChartTitle(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">X-Axis Label</label>
              <input
                className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200"
                value={xLabel}
                onChange={e => setXLabel(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Y-Axis Label</label>
              <input
                className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-200"
                value={yLabel}
                onChange={e => setYLabel(e.target.value)}
              />
            </div>
          </div>
        </aside>

        {/* Center Chart Preview */}
        <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="w-[700px] h-[400px] bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center border-8 border-white shadow-xl">
            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">
              {renderChart()}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-8 transition-colors duration-200">
          {/* Appearance */}
          <div>
            <h2 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Appearance</h2>
            <div className="flex items-center gap-2 mb-3">
              {colorSchemes.map((c, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 border-white cursor-pointer ${color === c ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                ></span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ChartEditor; 