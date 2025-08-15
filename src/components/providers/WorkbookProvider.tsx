import React, { createContext, ReactNode, useContext, useState } from "react";

interface WorkbookIdContextType {
  workbookId: string | "";
  setWorkbookId: (id: string | "") => void;
}

interface WorkbookIdProviderProps {
  children: ReactNode;
  initialWorkbookId?: string | "";
}

const WorkbookIdContext = createContext<WorkbookIdContextType | null>(null);

export const WorkbookIdProvider: React.FC<WorkbookIdProviderProps> = ({
                                                                        children,
                                                                        initialWorkbookId = ""
                                                                      }) => {
  const [workbookId, setWorkbookId] = useState<string | "">(initialWorkbookId);

  return (
    <WorkbookIdContext.Provider value={{ workbookId, setWorkbookId }}>
      {children}
    </WorkbookIdContext.Provider>
  );
};

export const useWorkbookId = () => {
  const ctx = useContext(WorkbookIdContext);
  if (!ctx) throw new Error("useWorkbookId must be used within WorkbookIdProvider");
  return ctx;
};