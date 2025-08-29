import { CellData, CellDataBySheet } from "../spreadsheet/Grid/gridTypes";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { createWorkbook, getWorkbook, importWorkbook } from "../../lib/api/apiClient";

interface WorkbookContextType {
   workbookId: string;
   sheets: string[];
   activeSheet: string | null;
   cellDataBySheet: CellDataBySheet;
   setCellDataBySheet: React.Dispatch<React.SetStateAction<CellDataBySheet>>;
   isWorkbookLoaded: boolean;
   createWorkbook: () => Promise<void>;
   importWorkbook: (file: File) => Promise<void>;
   setActiveSheet: (sheet: string) => void;
}

const WorkbookContext = createContext<WorkbookContextType | null>(null);

export const WorkbookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [workbookId, setWorkbookId] = useState("");
   const [sheets, setSheets] = useState<string[]>([]);
   const [activeSheet, setActiveSheet] = useState<string | null>(null);
   const [cellDataBySheet, setCellDataBySheet] = useState<CellDataBySheet>({});
   const [isWorkbookLoaded, setIsWorkbookLoaded] = useState(false);

   const createWorkbookHandler = async () => {
      try {
         const response = await createWorkbook();
         if (response.data.success) {
            const id = response.data.data.workbook_id;
            setWorkbookId(id);

            const defaults = ["Sheet1", "Sheet2", "Sheet3"];
            setSheets(defaults);
            setActiveSheet(defaults[0]);

            const map: CellDataBySheet = {};
            defaults.forEach(sheet => {
               map[sheet] = new Map<string, CellData>();
            });
            setCellDataBySheet(map);

            setIsWorkbookLoaded(true);
         }
      } catch (err) {
         console.error("Error creating workbook", err);
      }
   };

   const importWorkbookHandler = async (file: File) => {
      try {
         const response = await importWorkbook(file);
         if (!response.data.success) return;
         const id = response.data.data.workbook_id;
         setWorkbookId(id);

         const imported = response.data.data.sheets;
         setSheets(imported);
         setActiveSheet(imported[0] ?? null);

         const getResponse = await getWorkbook(id);
         if (getResponse.data.success) {
            const map: CellDataBySheet = {};
            getResponse.data.data.sheets.forEach((s: any) => {
               map[s.name] = new Map(Object.entries(s.cells));
            });
            setCellDataBySheet(map);
         }

         setIsWorkbookLoaded(true);
      } catch (err) {
         console.error("Error importing workbook", err);
      }
   };

   return (
     <WorkbookContext.Provider
       value={{
          workbookId,
          sheets,
          activeSheet,
          cellDataBySheet,
          setCellDataBySheet,
          isWorkbookLoaded,
          createWorkbook: createWorkbookHandler,
          importWorkbook: importWorkbookHandler,
          setActiveSheet,
       }}
     >
        {children}
     </WorkbookContext.Provider>
   );
};

export const useWorkbook = () => {
   const ctx = useContext(WorkbookContext);
   if (!ctx) throw new Error("useWorkbook must be used within WorkbookProvider");
   return ctx;
};