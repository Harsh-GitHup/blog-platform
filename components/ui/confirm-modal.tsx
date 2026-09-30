"use client"

import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    isLoading?: boolean;
}

export function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description, 
    confirmText = "Confirm", 
    isLoading = false 
}: ConfirmModalProps) {
    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card border shadow-xl rounded-xl max-w-sm w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-muted-foreground text-sm">
                        {description}
                    </p>
                </div>
                <div className="flex gap-3 justify-center w-full pt-2">
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    )
}
