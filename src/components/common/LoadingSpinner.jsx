import React from 'react';

export function LoadingSpinner({ size = 'md', text = 'Loading data...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400">
      <div className={`${sizes[size]} border-3 border-teal-500/30 border-t-teal-600 dark:border-t-teal-400 rounded-full animate-spin mb-3`}></div>
      {text && <span className="text-xs font-mono tracking-wider">{text}</span>}
    </div>
  );
}
