import React from 'react';
import { getStatusBadgeStyle } from '../../utils/formatters';

export function StatusBadge({ status, label, className = '' }) {
  const displayLabel = label || (
    status === 'flagged_retest' ? 'Flagged for Retest' :
    status === 'approved' ? 'Approved' :
    status === 'pending' ? 'Pending Review' :
    status === 'abnormal' ? 'Abnormal' :
    status === 'trace' ? 'Trace' :
    status === 'normal' ? 'Normal' : status
  );

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${getStatusBadgeStyle(status)} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'abnormal' || status === 'flagged_retest' ? 'bg-rose-500 animate-ping' :
        status === 'trace' ? 'bg-amber-500' :
        status === 'approved' || status === 'normal' ? 'bg-emerald-500' : 'bg-sky-500'
      }`}></span>
      {displayLabel}
    </span>
  );
}

export function PanelBadge({ type, className = '' }) {
  const is14 = type === '14-panel';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold tracking-wide uppercase ${
      is14
        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
        : 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-300 dark:border-teal-800'
    } ${className}`}>
      {type || '10-panel'}
    </span>
  );
}
