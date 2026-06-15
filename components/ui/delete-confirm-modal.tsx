"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    isLoading = false
}: DeleteConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden text-black"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 text-red-500 mb-6 mx-auto">
                                <AlertTriangle className="w-8 h-8" />
                            </div>

                            <div className="text-center mb-8">
                                <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed">
                                    {description}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="flex-1 h-14 rounded-2xl font-black text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="flex-1 h-14 rounded-2xl font-black bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                                >
                                    {isLoading ? "Deleting..." : "Delete Now"}
                                </Button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
