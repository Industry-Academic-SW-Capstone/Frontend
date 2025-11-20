"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface InstallModalContextType {
  isInstallModalOpen: boolean;
  openInstallModal: () => void;
  closeInstallModal: () => void;
}

const InstallModalContext = createContext<InstallModalContextType | undefined>(
  undefined
);

export const InstallModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const openInstallModal = () => setIsInstallModalOpen(true);
  const closeInstallModal = () => setIsInstallModalOpen(false);

  return (
    <InstallModalContext.Provider
      value={{ isInstallModalOpen, openInstallModal, closeInstallModal }}
    >
      {children}
    </InstallModalContext.Provider>
  );
};

export const useInstallModal = () => {
  const context = useContext(InstallModalContext);
  if (context === undefined) {
    throw new Error(
      "useInstallModal must be used within an InstallModalProvider"
    );
  }
  return context;
};
