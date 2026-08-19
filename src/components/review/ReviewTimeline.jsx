import React from 'react';
import { CheckCircle2, Clock, FileCheck, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function ReviewTimeline({ test }) {
  if (!test) return null;

  const review = test.clinicianReview || { status: 'pending', reviewed: false };
  const isPending = review.status === 'pending';
  const isApproved = review.status === 'approved';
  const isFlagged = review.status === 'flagged_retest';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-bold">
          Clinical Review Status Timeline
        </h4>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
          isApproved ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' :
          isFlagged ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
          'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
        }`}>
          {isApproved ? 'Verified & Approved' : isFlagged ? 'Flagged for Retest' : 'Awaiting Clinician Review'}
        </span>
      </div>

      <div className="relative flex items-center justify-between px-2 pt-2">
        {/* Track Line */}
        <div className="absolute left-6 right-6 top-6 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0"></div>

        {/* Step 1: Submitted */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-900">
            <FileCheck className="w-5 h-5" />
          </div>
          <span className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Submitted</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {test.submittedBy}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{formatDate(test.submittedAt)}</span>
        </div>

        {/* Step 2: Queue / Processing */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-900 ${
            isPending
              ? 'bg-sky-500 text-white animate-pulse'
              : 'bg-teal-600 text-white'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <span className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Review Queue</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Auto-queued
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {isPending ? 'Active Queue' : 'Processed'}
          </span>
        </div>

        {/* Step 3: Clinician Decision */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ring-4 ring-white dark:ring-slate-900 ${
            isApproved
              ? 'bg-emerald-600 text-white'
              : isFlagged
              ? 'bg-rose-600 text-white'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
          }`}>
            {isFlagged ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
          <span className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
            {isApproved ? 'Approved' : isFlagged ? 'Retest Flagged' : 'Pending Action'}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {review.reviewedBy || 'Pending Clinician'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {review.reviewedAt ? formatDate(review.reviewedAt) : 'In Queue'}
          </span>
        </div>
      </div>

      {/* Reviewer Notes banner if reviewed */}
      {review.reviewed && (
        <div className={`p-3 rounded-xl border text-xs leading-relaxed mt-2 ${
          isApproved
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="font-semibold mb-0.5 flex items-center gap-1.5">
            <span>Clinician Notes ({review.reviewedBy}):</span>
          </div>
          <p className="italic">{review.notes || 'No specific notes recorded.'}</p>
        </div>
      )}
    </div>
  );
}
