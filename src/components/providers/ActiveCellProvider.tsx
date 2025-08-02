import React, { createContext, useContext, useState } from "react";

type CellId = string;

interface ActiveCellContextType {
  activeCellId: CellId | null;
  setActiveCellId: (id: CellId | null) => void;
}

const ActiveCellContext = createContext<ActiveCellContextType | null>(null);

export const ActiveCellProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCellId, setActiveCellId] = useState<CellId | null>(null);

  return (
    <ActiveCellContext.Provider value={{ activeCellId, setActiveCellId }}>
      {children}
    </ActiveCellContext.Provider>
  );
};

export const useActiveCell = () => {
  const ctx = useContext(ActiveCellContext);
  if (!ctx) throw new Error("useActiveCell must be used within ActiveCellProvider");
  return ctx;
};