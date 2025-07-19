import Header from "./Header";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";
import CommandPalette from "./CommandPalette";
import FormulaBuilder from "./FormulaBuilder";
import ChartBuilder from "./ChartBuilder";
import React, { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {

  const [panelWidth, setPanelWidth] = useState(320);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
  const [showChartBuilder, setShowChartBuilder] = useState(false);
  const [showTablesPanel, setShowTablesPanel] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedRangeForAI, setSelectedRangeForAI] = useState<string | null>(null);

  const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => setter((prev) => !prev);

  const toggleCommandPalette = toggle(setCommandPaletteOpen);
  const toggleFormulaBuilder = toggle(setShowFormulaBuilder);
  const toggleChartBuilder = toggle(setShowChartBuilder);
  const toggleTablesPanel = toggle(setShowTablesPanel);
  const toggleAIPanel = toggle(setShowAIPanel);

  const handleOpenAIWithRange = (range: string) => {
    setSelectedRangeForAI(range);
    setShowAIPanel(true);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-200 overflow-hidden">
      <Header />

      {commandPaletteOpen && (
        <CommandPalette onClose={() => setCommandPaletteOpen(false)} />
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
              {/* Children get rendered here, like <Spreadsheet /> */}
              {/*{children || (*/}
              {/*  <Spreadsheet*/}
              {/*    isPanelOpen={showFormulaBuilder || showChartBuilder || showTablesPanel || showAIPanel}*/}
              {/*    panelWidth={panelWidth}*/}
              {/*    onOpenAIWithRange={handleOpenAIWithRange}*/}
              {/*  />*/}
              {/*)}*/}
            </main>
            <StatusBar />
          </div>

          {showFormulaBuilder && <FormulaBuilder onWidthChange={setPanelWidth} />}
          {showChartBuilder && <ChartBuilder onWidthChange={setPanelWidth} />}
          {/*{showTablesPanel && <TablesPanel onWidthChange={setPanelWidth} />}*/}
          {/*{showAIPanel && (*/}
          {/*  <AIPanel*/}
          {/*    onWidthChange={setPanelWidth}*/}
          {/*    selectedRange={selectedRangeForAI}*/}
          {/*    setSelectedRange={setSelectedRangeForAI}*/}
          {/*  />*/}
          {/*)}*/}
        </div>
      </div>
    </div>
  );
}