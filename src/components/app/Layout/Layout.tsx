import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import StatusBar from "../StatusBar/StatusBar";
import CommandPalette from "../CommandPalette/CommandPalette";
import Spreadsheet from "../../spreadsheet/Sheet/Sheet";
import Conversation from "../Conversation/Conversation";
import React, { useState } from "react";
import { RangeSelection } from "../Conversation/conversationTypes";

export function Layout({ children }: { children: React.ReactNode }) {

   const [panelWidth, setPanelWidth] = useState(10);
   const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
   const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
   const [showChartBuilder, setShowChartBuilder] = useState(false);
   const [showTablesPanel, setShowTablesPanel] = useState(false);
   const [showAIPanel, setShowAIPanel] = useState(false);
   const [showInsightsPanel, setShowInsightsPanel] = useState(false);
   const [selectedRangeForAI, setSelectedRangeForAI] = useState<RangeSelection | null>(null);

   const toggleCommandPalette = () => {
      setCommandPaletteOpen(!commandPaletteOpen);
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
      if (showInsightsPanel) setShowInsightsPanel(false);
   };

   const toggleInsightsPanel = () => {
      setShowInsightsPanel(!showInsightsPanel);
      if (showFormulaBuilder) setShowFormulaBuilder(false);
      if (showChartBuilder) setShowChartBuilder(false);
      if (showTablesPanel) setShowTablesPanel(false);
      if (showAIPanel) setShowAIPanel(false);
   };

   const handleOpenAIWithRange = (range: string) => {
      const rangeSelection: RangeSelection = { range: range };
      setSelectedRangeForAI(rangeSelection);
      setShowAIPanel(true);
   };

   return (
     <div
       className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-200 overflow-hidden">
        <Header />

        {commandPaletteOpen && (
          <CommandPalette onClose={() => setCommandPaletteOpen(false)} />
        )}

        <div className="flex flex-1 overflow-hidden min-h-0">
           <SideBar
             onFormulaClick={toggleFormulaBuilder}
             onChartClick={toggleChartBuilder}
             onTableClick={toggleTablesPanel}
             onAIClick={toggleAIPanel}
             onInsightsClick={toggleInsightsPanel}
           />

           {/*<AnimatePresence>*/}
           {/*  {showInsightsPanel && (*/}
           {/*    <motion.div*/}
           {/*      key="ai-panel"*/}
           {/*      initial={{ x: "-100%", opacity: 0 }} // start off screen at left*/}
           {/*      animate={{ x: 0, opacity: 1 }} // slide into place*/}
           {/*      exit={{ x: "-100%", opacity: 0 }} // slide back out to left*/}
           {/*      transition={{ duration: 0.3, ease: "easeInOut" }}*/}
           {/*      className="h-full"*/}
           {/*    >*/}
           {/*      <Insights*/}
           {/*        onWidthChange={setPanelWidth}*/}
           {/*        selectedRange={selectedRangeForAI}*/}
           {/*        setSelectedRange={setSelectedRangeForAI}*/}
           {/*      />*/}
           {/*    </motion.div>*/}
           {/*  )}*/}
           {/*</AnimatePresence>*/}

           <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 overflow-auto min-h-0">
                 <main className="h-full">
                    {/* Children get rendered here, like <Spreadsheet /> */}
                    <Spreadsheet
                      isPanelOpen={showFormulaBuilder || showChartBuilder || showTablesPanel || showAIPanel}
                      panelWidth={panelWidth}
                      onOpenAIWithRange={handleOpenAIWithRange}
                    />
                 </main>
              </div>
              <StatusBar />
           </div>
           {showAIPanel && (
             <Conversation
               onWidthChange={setPanelWidth}
               selectedRange={selectedRangeForAI}
               setSelectedRange={setSelectedRangeForAI}
             />
           )}


        </div>
     </div>
   );
}