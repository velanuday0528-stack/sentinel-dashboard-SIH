'use client';

import React from 'react';
import { Radio, ShieldAlert, Cpu, Heart, ExternalLink } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/95 py-8 px-4 lg:px-8 mt-16 text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Mandatory Prototype Disclaimer Box */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 leading-relaxed font-sans text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold font-mono text-cyan-300 block uppercase tracking-wider text-[11px]">
              Prototype Engineering & Demonstration Disclaimer
            </span>
            <p className="text-slate-400">
              This dashboard demonstrates a prototype concept using simulated and/or sensor-derived data. Actual RF performance, ice removal efficiency, and field performance require dedicated hardware validation.
            </p>
          </div>
        </div>

        {/* Brand & Team Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-widest text-sm">SENTINEL</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Hackathon Prototype Console
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                AI-Powered Antenna Anti-Icing & Environmental Protection System
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-white font-semibold flex items-center gap-1.5 md:justify-end">
              <span>Developed with innovation by</span>
              <strong className="text-cyan-400 font-bold">Team ELECTRONAUTS</strong>
            </div>
            <div className="text-[10px] text-slate-500">
              Extreme Cold & High-Altitude Defense Infrastructure Testbed
            </div>
          </div>
        </div>

        {/* Bottom Credits & Status Ticker */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[10px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ESP32 Node Simulation Streaming (1000ms Polling Interval)</span>
          </div>
          <div>
            <span>Version 2.4-PROTOTYPE • Built for Hackathon Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
