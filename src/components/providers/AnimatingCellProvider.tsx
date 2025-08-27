import React, { createContext, useContext, useState, useCallback } from "react";

type AnimateContextType = {
   animatingCells: Set<string>;
   triggerCellAnimations: (addresses: string[]) => void;
};

const AnimatingCellContext = createContext<AnimateContextType | undefined>(undefined);

export function AnimateCellProvider({ children }: { children: React.ReactNode }) {
   const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());

   const triggerCellAnimations = useCallback((addresses: string[]) => {
      setAnimatingCells(new Set(addresses));
      setTimeout(() => setAnimatingCells(new Set()), 900);
   }, []);

   return (
     <AnimatingCellContext.Provider value={{ animatingCells, triggerCellAnimations }}>
        {children}
     </AnimatingCellContext.Provider>
   );
}

export function useAnimateCell() {
   const ctx = useContext(AnimatingCellContext);
   if (!ctx) throw new Error("useAnimateCell must be used inside AnimateCellProvider");
   return ctx;
}