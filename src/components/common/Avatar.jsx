import React from 'react';
import { UserRound } from 'lucide-react';

export function Avatar({ name, photoUrl, className = 'w-8 h-8' }) {
  if (photoUrl) {
    return <img src={photoUrl} alt={name || 'User'} className={`${className} rounded-full object-cover border border-teal-500/40 shrink-0`} />;
  }
  return <span aria-label={`${name || 'User'} profile placeholder`} className={`${className} rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30`}><UserRound className="w-[55%] h-[55%]" aria-hidden="true" /></span>;
}
