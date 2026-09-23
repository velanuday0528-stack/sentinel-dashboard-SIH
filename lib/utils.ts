import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EventLogItem } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatTime(isoString?: string): string {
  const d = isoString ? new Date(isoString) : new Date();
  return d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function exportLogsToCSV(logs: EventLogItem[]) {
  const headers = ['Event ID', 'Timestamp', 'Event Type', 'Sensor', 'Previous State', 'New State', 'Action Taken', 'Severity', 'Status'];
  const rows = logs.map(l => [
    `"${l.id}"`,
    `"${l.timestamp}"`,
    `"${l.eventType.replace(/"/g, '""')}"`,
    `"${l.sensor.replace(/"/g, '""')}"`,
    `"${l.previousState.replace(/"/g, '""')}"`,
    `"${l.newState.replace(/"/g, '""')}"`,
    `"${l.actionTaken.replace(/"/g, '""')}"`,
    `"${l.severity}"`,
    `"${l.status}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `sentinel_event_logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
