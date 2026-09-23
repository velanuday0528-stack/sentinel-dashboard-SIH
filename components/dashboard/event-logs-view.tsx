'use client';

import React, { useState, useMemo } from 'react';
import { useSentinel } from '@/context/sentinel-context';
import { StatusBadge } from '@/components/ui/status-badge';
import { exportLogsToCSV } from '@/lib/utils';
import { 
  FileText, 
  Search, 
  Download, 
  Trash2, 
  Plus, 
  Filter, 
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { EventLogItem, AlertSeverity } from '@/lib/types';

export function EventLogsView() {
  const { logs, clearLogs, addLog } = useSentinel();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [sensorFilter, setSensorFilter] = useState<string>('ALL');

  // Extract unique sensors for filter dropdown
  const uniqueSensors = useMemo(() => {
    const set = new Set(logs.map(l => l.sensor));
    return Array.from(set);
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const matchesSearch = 
        l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.actionTaken.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.previousState.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.newState.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = severityFilter === 'ALL' || l.severity === severityFilter;
      const matchesSensor = sensorFilter === 'ALL' || l.sensor === sensorFilter;

      return matchesSearch && matchesSeverity && matchesSensor;
    });
  }, [logs, searchQuery, severityFilter, sensorFilter]);

  const handleInjectSampleLog = () => {
    addLog({
      eventType: 'Manual Diagnostics Ping',
      sensor: 'ESP32 Self-Test Bus',
      previousState: 'QUIESCENT',
      newState: 'ECHO_RECEIVED',
      actionTaken: 'Loopback diagnostics completed in 12ms',
      severity: 'INFO',
      status: 'EXECUTED',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Bar */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase font-semibold">
              Forensic Audit Trail
            </span>
            <span className="text-xs font-mono text-slate-400">
              Deterministic Event Sequencer
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white mt-1">
            System Event & Telemetry Logs
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Chronological audit log recording sensor transitions, relay actuation events, and automated rule executions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => exportLogsToCSV(filteredLogs)}
            className="px-3 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleInjectSampleLog}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inject Test Event</span>
          </button>

          <button
            onClick={clearLogs}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-red-950/60 border border-slate-700 hover:border-red-700 text-slate-400 hover:text-red-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by ID, action, state, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500/60 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>

          {/* Sensor Filter */}
          <select
            value={sensorFilter}
            onChange={(e) => setSensorFilter(e.target.value)}
            className="py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500/60 cursor-pointer max-w-[160px]"
          >
            <option value="ALL">All Sensors</option>
            {uniqueSensors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Sensor / Source</th>
                <th className="py-3 px-4">Previous State</th>
                <th className="py-3 px-4">New State</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-mono">
                    No matching log entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-cyan-400 whitespace-nowrap">
                      {log.id}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-semibold whitespace-nowrap">
                      {log.eventType}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {log.sensor}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      <code className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                        {log.previousState}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-slate-200 whitespace-nowrap">
                      <code className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-[10px]">
                        {log.newState}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate" title={log.actionTaken}>
                      {log.actionTaken}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={log.severity} size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Showing {filteredLogs.length} of {logs.length} logged events</span>
          <span>Buffer: Circular FIFO (100 Max)</span>
        </div>
      </div>
    </div>
  );
}
