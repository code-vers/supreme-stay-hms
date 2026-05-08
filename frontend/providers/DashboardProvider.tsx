"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DashboardContextType = {
  selectedHotelId: string;
  setSelectedHotelId: (id: string) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");

  return (
    <DashboardContext.Provider value={{ selectedHotelId, setSelectedHotelId }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
