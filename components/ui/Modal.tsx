"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-morph-panel border border-morph-border w-[50vw] max-h-[85vh] overflow-y-auto z-50 focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-morph-border">
            <Dialog.Title className="font-display text-xl text-morph-white">
              {title}
            </Dialog.Title>
            <Dialog.Close className="text-morph-white/40 hover:text-morph-white transition-colors">
              <X size={20} />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
