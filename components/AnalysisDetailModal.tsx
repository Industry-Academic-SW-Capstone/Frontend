import React from "react";
import { Drawer } from "vaul";
import { XMarkIcon } from "@/components/icons/Icons";

interface AnalysisDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: React.ReactNode;
}

const AnalysisDetailModal: React.FC<AnalysisDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm" />
        <Drawer.Content
          className="fixed bottom-0 left-0 pb-safe right-0 z-[10001] w-full max-w-md mx-auto bg-bg-secondary rounded-t-3xl p-6 shadow-2xl outline-none"
          style={{ touchAction: "none" }}
        >
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-300/50 rounded-full mx-auto mb-8" />

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <Drawer.Title className="text-2xl font-bold text-text-primary leading-tight">
              {title}
            </Drawer.Title>
            <button
              onClick={onClose}
              className="p-2 -mr-2 -mt-2 text-text-secondary hover:bg-bg-primary rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="text-text-secondary text-lg leading-relaxed whitespace-pre-wrap pb-8">
            {description}
          </div>

          {/* Safe Area Padding for Mobile */}
          <div className="h-6" />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default AnalysisDetailModal;
