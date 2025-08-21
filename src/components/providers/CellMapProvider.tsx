import React, { createContext, useContext, useState } from "react";
import { CellData } from "../spreadsheet/Grid/gridTypes";

// Key: sheet name, Value: map of cell addresses to data
export type CellDataBySheet = Record<string, Map<string, CellData>>;

interface CellMapContextType {
   cellDataBySheet: CellDataBySheet;
   setCellDataBySheet: React.Dispatch<React.SetStateAction<CellDataBySheet>>;
}

const CellMapContext = createContext<CellMapContextType | null>(null);

export const CellMapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [cellDataBySheet, setCellDataBySheet] = useState<CellDataBySheet>({
      Sheet1: new Map<string, CellData>(),
   });
   return (
     <CellMapContext.Provider value={{ cellDataBySheet, setCellDataBySheet }}>
        {children}
     </CellMapContext.Provider>
   );
};

export const useCellMap = () => {
   const ctx = useContext(CellMapContext);
   if (!ctx) throw new Error("useCellMap must be used within CellMapProvider");
   return ctx;
};