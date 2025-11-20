import React from "react";
import { InstallModalProvider } from "@/components/about/context/InstallModalContext";
import { InstallModal } from "@/components/about/modals/InstallModal";
import { SmoothScroll } from "@/components/about/ui/SmoothScroll";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InstallModalProvider>
      <SmoothScroll>
        {children}
        <InstallModal />
      </SmoothScroll>
    </InstallModalProvider>
  );
}
