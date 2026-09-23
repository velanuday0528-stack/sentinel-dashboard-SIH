'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  severity?: 'warning' | 'danger' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'CONFIRM ACTION',
  cancelLabel = 'CANCEL',
  severity = 'warning',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const isDanger = severity === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={cn(
          'relative w-full max-w-md overflow-hidden rounded-xl border p-6 bg-slate-950 shadow-2xl backdrop-blur-2xl transition-all',
          isDanger ? 'border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.3)]' : 'border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
        )}
      >
        {/* Aerospace Corner HUD Brackets */}
        <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-cyan-400" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg border',
              isDanger ? 'bg-red-950/80 border-red-500 text-red-400' : 'bg-amber-950/80 border-amber-500 text-amber-400'
            )}>
              {isDanger ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                OPERATOR OVERRIDE INTERFACE
              </span>
              <h3 className="text-base font-bold font-mono tracking-tight text-white">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-xs font-sans text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800">
          {message}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3 font-mono text-xs">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={cn(
              'px-4 py-2 rounded font-semibold text-white transition-all shadow-lg',
              isDanger
                ? 'bg-red-600 hover:bg-red-500 shadow-red-900/40'
                : 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
