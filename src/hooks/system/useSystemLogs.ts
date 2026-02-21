'use client';

import { useState, useCallback } from 'react';

export type LogType = 'INFO' | 'ALERT' | 'SUCCESS' | 'ERROR';

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: LogType;
}

export interface FormattedLog {
  id: string;
  timestamp: string;
  message: string;
  type: LogType;
  color: string;
  prefix: string;
}

const LOG_COLORS: Record<LogType, string> = {
  INFO: '#37FF1C',
  ALERT: '#FFA500',
  SUCCESS: '#00FF00',
  ERROR: '#FF0055',
};

const LOG_PREFIXES: Record<LogType, string> = {
  INFO: '[OK]',
  ALERT: '[!]',
  SUCCESS: '[✓]',
  ERROR: '[ERR]',
};

export const useSystemLogs = (maxLogs = 50) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const formatLog = (log: LogEntry): FormattedLog => {
    const date = new Date(log.timestamp);
    const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    return {
      id: log.id,
      timestamp: time,
      message: log.message,
      type: log.type,
      color: LOG_COLORS[log.type],
      prefix: LOG_PREFIXES[log.type],
    };
  };

  const addLog = useCallback(
    (message: string, type: LogType = 'INFO') => {
      const newLog: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        message,
        type,
      };

      setLogs((prev) => {
        const updated = [...prev, newLog];
        return updated.length > maxLogs ? updated.slice(-maxLogs) : updated;
      });
    },
    [maxLogs]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const formattedLogs = logs.map(formatLog);

  return {
    logs,
    formattedLogs,
    addLog,
    clearLogs,
    formatLog,
  };
};
