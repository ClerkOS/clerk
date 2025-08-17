import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { ActiveSheetProvider } from "./components/providers/SheetProvider";
import { ActiveCellProvider } from "./components/providers/ActiveCellProvider";
import { WorkbookIdProvider } from "./components/providers/WorkbookProvider";
import { CellMapProvider } from "./components/providers/CellMapProvider";

// TODO: Add providers here
// function App() {
//   return (
//       <div className="min-h-screen bg-gray-100 text-gray-900">
//         <h1 className="text-2xl font-bold p-4">Hello from TypeScript</h1>
//       </div>
//   );
// }

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <WorkbookIdProvider>
          <ActiveSheetProvider>
          <CellMapProvider>
            <App />
          </CellMapProvider>
          </ActiveSheetProvider>
        </WorkbookIdProvider>
      </ThemeProvider>
    </StrictMode>
  );
}