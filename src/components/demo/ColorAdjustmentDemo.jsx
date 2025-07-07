import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTheme } from '../../context/ThemeContext';

const ColorAdjustmentDemo = () => {
  const { isDarkMode, adjustColor } = useDarkMode();
  const { toggleTheme } = useTheme();

  // Sample colors to demonstrate the adjustment
  const sampleColors = [
    '#FF6B6B', // Light red
    '#4ECDC4', // Light teal
    '#45B7D1', // Light blue
    '#96CEB4', // Light green
    '#FFEAA7', // Light yellow
    '#DDA0DD', // Light purple
    '#F8BBD9', // Light pink
    '#FFB74D', // Light orange
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dark Mode Color Adjustment Demo
        </h2>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This demo shows how light colors are automatically adjusted for dark mode to ensure good contrast with white text.
        </p>
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>How it works:</strong> Light colors are made darker (40% of original lightness) and more saturated (120% of original saturation) in dark mode.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sampleColors.map((color, index) => {
          const adjustedColor = adjustColor(color);
          const isAdjusted = color !== adjustedColor;

          return (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Color {index + 1}
                </h3>
                
                {/* Original Color */}
                <div className="mb-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Original
                  </div>
                  <div
                    className="h-12 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-white font-mono text-sm"
                    style={{ backgroundColor: color }}
                  >
                    {color}
                  </div>
                </div>

                {/* Adjusted Color (only show if different) */}
                {isAdjusted && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Dark Mode Adjusted
                    </div>
                    <div
                      className="h-12 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-white font-mono text-sm"
                      style={{ backgroundColor: adjustedColor }}
                    >
                      {adjustedColor}
                    </div>
                  </div>
                )}

                {/* Sample Text */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Sample Text
                </div>
                <div
                  className="p-2 rounded text-sm font-medium"
                  style={{ 
                    backgroundColor: isDarkMode ? adjustedColor : color,
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}
                >
                  This is sample text
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
          Current Mode: {isDarkMode ? 'Dark' : 'Light'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Colors are automatically adjusted when you switch between light and dark modes. 
          The adjustments ensure good contrast and readability in both themes.
        </p>
      </div>
    </div>
  );
};

export default ColorAdjustmentDemo; 