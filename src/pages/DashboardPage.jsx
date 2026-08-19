import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, 
  CheckSquare, 
  AlertTriangle, 
  Users, 
  ArrowRight, 
  Clock, 
  Building2, 
  FileText,
  Plus
} from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PanelBadge } from '../components/common/Badge';
import { formatDate } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await mockApi.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard statistics..." />;

  const isClinician = user?.role === 'Clinician';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Role Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 border border-white/20 backdrop-blur-md">
            {user?.role === 'Clinician' ? 'Clinician Portal Active' : 'Point-of-Care Technician Mode'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            Welcome, {user?.name || 'Practitioner'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
            {isClinician
              ? `You have ${stats?.pendingReviewsCount || 0} pending test report(s) requiring clinical verification in your queue.`
              : 'Digitizing urinalysis strip readings at the point of care with automated non-linear concentration prediction.'}
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            {isClinician ? (
              <button
                onClick={() => navigate('/review-queue')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-teal-900 font-bold text-xs shadow-md hover:bg-teal-50 transition-all"
              >
                <CheckSquare className="w-4 h-4 text-teal-700" />
                Open Review Queue ({stats?.pendingReviewsCount})
              </button>
            ) : (
              <button
                onClick={() => navigate('/new-test')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-teal-900 font-bold text-xs shadow-md hover:bg-teal-50 transition-all"
              >
                <Plus className="w-4 h-4 text-teal-700" />
                Start New Test Wizard
              </button>
            )}
            <button
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold text-xs transition-all"
            >
              Browse All Reports
            </button>
          </div>
        </div>

        {/* Background Reagent Motif */}
        <div className="absolute right-6 -bottom-10 opacity-10 pointer-events-none hidden md:flex items-end gap-2">
          <div className="w-8 h-48 bg-blue-400 rounded-t-xl"></div>
          <div className="w-8 h-64 bg-rose-400 rounded-t-xl"></div>
          <div className="w-8 h-40 bg-amber-400 rounded-t-xl"></div>
          <div className="w-8 h-56 bg-emerald-400 rounded-t-xl"></div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Tests */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-500 font-bold">Today's Tests</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
            {stats?.todayTestsCount || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Total overall: {stats?.totalTestsCount || 0} tests
          </p>
        </div>

        {/* Pending Review */}
        <div 
          onClick={() => navigate('/review-queue')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-500 font-bold">Pending Review</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
            {stats?.pendingReviewsCount || 0}
          </p>
          <p className="text-[11px] text-sky-600 dark:text-sky-400 mt-1 font-semibold flex items-center gap-1">
            Review Queue <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Abnormal Count */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-500 font-bold">Abnormal Findings</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
            {stats?.abnormalCount || 0}
          </p>
          <p className="text-[11px] text-rose-500 font-medium mt-1">
            Requires clinical attention
          </p>
        </div>

        {/* Total Patients */}
        <div 
          onClick={() => navigate('/patients')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-500 font-bold">Registered Patients</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
            {stats?.totalPatientsCount || 0}
          </p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-semibold flex items-center gap-1">
            View Patients <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Recent Tests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Recent Urinalysis Submissions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest test records across all pathology report destinations
            </p>
          </div>

          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            View All Reports <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="py-3 px-4">Test Code</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Panel Type</th>
                <th className="py-3 px-4">Report Destination</th>
                <th className="py-3 px-4">Result Flag</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-mono">
              {stats?.recentTests?.map((t) => (
                <tr 
                  key={t.id} 
                  onClick={() => navigate(`/reports/${t.id}`)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-teal-600 dark:text-teal-400">
                    {t.testCode}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900 dark:text-white">
                    {t.patientName}
                    <div className="text-[10px] font-mono text-slate-400">{t.patientCode}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <PanelBadge type={t.panelType} />
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[160px]">{t.reportDestination}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={t.overallStatus} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={t.clinicianReview?.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reports/${t.id}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
