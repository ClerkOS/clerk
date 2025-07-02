import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SpreadsheetProvider } from './context/SpreadsheetContext';
import { FormulaPreviewProvider } from './context/FormulaPreviewContext';
import { SheetProvider } from './context/SheetContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Spreadsheet from './components/spreadsheet/Spreadsheet';
import StatusBar from './components/layout/StatusBar';
import CommandPalette from './components/ui/CommandPalette';
import FormulaBuilder from './components/formula/FormulaBuilder';
import ChartBuilder from './components/charts/ChartBuilder';
import ChartEditor from './components/charts/ChartEditor';
import TablesPanel from './components/spreadsheet/TablesPanel';
import AIPanel from './components/ai/AIPanel';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function MainApp() {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
  const [showChartBuilder, setShowChartBuilder] = useState(false);
  const [showTablesPanel, setShowTablesPanel] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [panelWidth, setPanelWidth] = useState(320);
  const [selectedRangeForAI, setSelectedRangeForAI] = useState(null);

  const toggleCommandPalette = () => {
    setShowCommandPalette(!showCommandPalette);
  };

  const toggleFormulaBuilder = () => {
    setShowFormulaBuilder(!showFormulaBuilder);
    if (showChartBuilder) setShowChartBuilder(false);
    if (showTablesPanel) setShowTablesPanel(false);
    if (showAIPanel) setShowAIPanel(false);
  };

  const toggleChartBuilder = () => {
    setShowChartBuilder(!showChartBuilder);
    if (showFormulaBuilder) setShowFormulaBuilder(false);
    if (showTablesPanel) setShowTablesPanel(false);
    if (showAIPanel) setShowAIPanel(false);
  };

  const toggleTablesPanel = () => {
    setShowTablesPanel(!showTablesPanel);
    if (showFormulaBuilder) setShowFormulaBuilder(false);
    if (showChartBuilder) setShowChartBuilder(false);
    if (showAIPanel) setShowAIPanel(false);
  };

  const toggleAIPanel = () => {
    setShowAIPanel(!showAIPanel);
    if (showFormulaBuilder) setShowFormulaBuilder(false);
    if (showChartBuilder) setShowChartBuilder(false);
    if (showTablesPanel) setShowTablesPanel(false);
  };

  const handleOpenAIWithRange = (selectedRange) => {
    // Open AI panel with the selected range
    setShowAIPanel(true);
    // Close other panels
    setShowFormulaBuilder(false);
    setShowChartBuilder(false);
    setShowTablesPanel(false);
    // Store the selected range for the AI panel
    setSelectedRangeForAI(selectedRange);
  };

  const isPanelOpen = showFormulaBuilder || showChartBuilder || showTablesPanel || showAIPanel;

  return (
    <ThemeProvider>
      <SpreadsheetProvider>
        <SheetProvider>
          <FormulaPreviewProvider>
            <Router>
              <Routes>
                <Route path="/" element={
                  <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-200 overflow-hidden">
                    <Header 
                      toggleCommandPalette={toggleCommandPalette} 
                    />
                    {showCommandPalette && (
                      <CommandPalette 
                        onClose={() => setShowCommandPalette(false)} 
                      />
                    )}
                    <div className="flex flex-1 overflow-hidden min-h-0">
                      <Sidebar 
                        onFormulaClick={toggleFormulaBuilder}
                        onChartClick={toggleChartBuilder}
                        onTableClick={toggleTablesPanel}
                        onAIClick={toggleAIPanel}
                      />
                      <div className="flex-1 flex min-w-0">
                        <div className="flex-1 flex flex-col min-w-0">
                          <main className="overflow-auto min-h-0">
                            <Spreadsheet 
                              isPanelOpen={isPanelOpen}
                              panelWidth={panelWidth}
                              onOpenAIWithRange={handleOpenAIWithRange}
                            />
                          </main>
                          <StatusBar />
                        </div>
                        {showFormulaBuilder && (
                          <FormulaBuilder 
                            onWidthChange={setPanelWidth}
                          />
                        )}
                        {showChartBuilder && (
                          <ChartBuilder 
                            onWidthChange={setPanelWidth}
                          />
                        )}
                        {showTablesPanel && (
                          <TablesPanel 
                            onWidthChange={setPanelWidth}
                          />
                        )}
                        {showAIPanel && (
                          <AIPanel 
                            onWidthChange={setPanelWidth}
                            selectedRange={selectedRangeForAI}
                            setSelectedRange={setSelectedRangeForAI}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                } />
                <Route path="/chart-editor" element={<ChartEditor />} />
              </Routes>
            </Router>
          </FormulaPreviewProvider>
        </SheetProvider>
      </SpreadsheetProvider>
    </ThemeProvider>
  );
}

export default MainApp;