import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SpreadsheetProvider } from './context/SpreadsheetContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Grid from './components/spreadsheet/Grid';
import FormulaBar from './components/spreadsheet/FormulaBar';
import StatusBar from './components/layout/StatusBar';
import CommandPalette from './components/ui/CommandPalette';
import FormulaBuilder from './components/formula/FormulaBuilder';
import ContextMenu from './components/ai/ContextMenu';

function App() {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const toggleCommandPalette = () => {
    setShowCommandPalette(!showCommandPalette);
  };

  const toggleFormulaBuilder = () => {
    setShowFormulaBuilder(!showFormulaBuilder);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <ThemeProvider>
      <SpreadsheetProvider>
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-200">
          <Header 
            toggleCommandPalette={toggleCommandPalette} 
          />
          
          {showCommandPalette && (
            <CommandPalette 
              onClose={() => setShowCommandPalette(false)} 
            />
          )}
          
          <div className="flex flex-1 overflow-hidden">
            <Sidebar onFormulaClick={toggleFormulaBuilder} />
            
            <div className="flex-1 flex flex-col">
              <FormulaBar />
              <main 
                className="flex-1 overflow-auto p-4"
                onContextMenu={handleContextMenu}
              >
                <Grid />
              </main>
              <StatusBar />
            </div>
            
            {showFormulaBuilder && <FormulaBuilder />}
          </div>
        </div>

        {contextMenu && (
          <ContextMenu
            position={contextMenu}
            onClose={handleCloseContextMenu}
          />
        )}
      </SpreadsheetProvider>
    </ThemeProvider>
  );
}

export default App;