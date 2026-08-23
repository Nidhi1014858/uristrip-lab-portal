import React from 'react';

export function BrandLogo({ size = 'md', showText = true, className = '' }) {
  const markSizes = {
    sm: { wrapper: 'w-9 h-7', barWidth: 2.5, scale: 0.9 },
    md: { wrapper: 'w-12 h-9', barWidth: 3.25, scale: 1.05 },
    lg: { wrapper: 'w-16 h-11', barWidth: 4.5, scale: 1.15 },
    xl: { wrapper: 'w-24 h-16', barWidth: 7.5, scale: 1.45 }
  };
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };
  const bars = [
    { color: '#d8ce42', height: 46 },
    { color: '#add789', height: 66 },
    { color: '#e99a42', height: 42 },
    { color: '#d7b5c8', height: 76 },
    { color: '#b98f9d', height: 52 },
    { color: '#e9cb72', height: 72 },
    { color: '#e6a57d', height: 46 },
    { color: '#eadfd8', height: 58 },
    { color: '#d8c7df', height: 42 },
    { color: '#8fc2bd', height: 56 }
  ];
  const currentSize = markSizes[size] || markSizes.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${currentSize.wrapper} shrink-0 overflow-hidden flex items-center justify-center rounded-lg bg-white px-1`} aria-hidden="true">
        <div className="flex h-full w-full items-end justify-between gap-px pb-[12%]">
          {bars.map((bar, index) => (
            <span
              key={`${bar.color}-${index}`}
              className="block shrink-0 rounded-sm"
              style={{
                width: currentSize.barWidth,
                height: `${bar.height * currentSize.scale}%`,
                maxHeight: '92%',
                backgroundColor: bar.color
              }}
            />
          ))}
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-display font-extrabold tracking-tight ${textSizes[size] || textSizes.md} text-slate-950 dark:text-white leading-none`}>
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
