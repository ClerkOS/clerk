import React, { createContext, ReactNode, useContext, useState } from "react";

interface ActiveSheetContextType {
  activeSheet: string | null;
  setActiveSheet: (sheetName: string) => void;
}

interface ActiveSheetProviderProps {
  children: ReactNode;
  initialSheet?: string;
}

const ActiveSheetContext = createContext<ActiveSheetContextType | null>(null);

export const ActiveSheetProvider: React.FC<ActiveSheetProviderProps> = ({
                                                                          children,
                                                                          initialSheet=null
                                                                        }) => {
  const [activeSheet, setActiveSheet] = useState<string | null>(initialSheet);

  return (
    <ActiveSheetContext.Provider value={{ activeSheet, setActiveSheet }}>
      {children}
    </ActiveSheetContext.Provider>
  );
};

export const useActiveSheet = () => {
  const ctx = useContext(ActiveSheetContext);
  if (!ctx) throw new Error("useActiveSheet must be used within ActiveSheetProvider");
  return ctx;
};