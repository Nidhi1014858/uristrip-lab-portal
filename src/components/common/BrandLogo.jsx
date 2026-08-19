import React from 'react';

export function BrandLogo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-md shadow-teal-500/20 p-1.5 shrink-0`}>
        {/* Reagent Strip Motif: small 5-bar color strip */}
        <div className="w-full h-full bg-slate-900/90 rounded-lg flex items-center justify-between px-1 py-1 gap-0.5">
          <div className="w-1.5 h-full rounded-sm bg-blue-500 animate-pulse"></div>
          <div className="w-1.5 h-full rounded-sm bg-rose-500"></div>
          <div className="w-1.5 h-full rounded-sm bg-amber-400"></div>
          <div className="w-1.5 h-full rounded-sm bg-emerald-500"></div>
          <div className="w-1.5 h-full rounded-sm bg-indigo-400"></div>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-extrabold tracking-tight text-xl text-slate-900 dark:text-white leading-none">
            Cura
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-teal-600 dark:text-teal-400 mt-0.5">
            POCT Urinalysis
          </span>
        </div>
      )}
    </div>
  );
}
