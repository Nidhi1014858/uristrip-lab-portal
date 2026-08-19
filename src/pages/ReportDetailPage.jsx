import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { StatusBadge, PanelBadge } from '../components/common/Badge';
import { ReviewTimeline } from '../components/review/ReviewTimeline';
import { ReviewModal } from '../components/review/ReviewModal';
import { formatDate } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Building2, 
  User, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [test, setTest] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchReport = async () => {
    try {
      const data = await mockApi.getTestById(id);
      setTest(data);
      if (data.patientId) {
        const p = await mockApi.getPatientById(data.patientId);
        setPatient(p);
      }
    } catch (err) {
      addToast(err.message || 'Report not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handleReviewSubmitted = async (testId, reviewData) => {
    const updated = await mockApi.updateClinicianReview(testId, reviewData);
    setTest(updated);
  };

  if (loading) return <LoadingSpinner text="Loading report details..." />;
  if (!test) return <div className="p-8 text-center text-slate-500">Report not found.</div>;

  const isPendingReview = test.clinicianReview?.status === 'pending';

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Reports
        </button>

        <div className="flex items-center gap-3">
          {/* Dedicated Direct Review Action if pending or clinician */}
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all"
          >
            <UserCheck className="w-4 h-4" />
            {isPendingReview ? 'Review Now' : 'Update Review Verdict'}
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Awaiting Review Action Banner */}
      {isPendingReview && (
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sky-500 text-white shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-sky-950 dark:text-sky-200">
                Awaiting Clinician Verification & Approval
              </h4>
              <p className="text-xs text-sky-800 dark:text-sky-300">
                This test report has been auto-submitted to the Clinician Queue. You can verify and approve it directly on this page.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shrink-0 shadow-md transition-all"
          >
            Review & Sign Off Now
          </button>
        </div>
      )}

      {/* Clinical Review Timeline Component */}
      <ReviewTimeline test={test} />

      {/* Printable Clinical Report Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 card-print">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                Cura Clinical Report
              </span>
              <PanelBadge type={test.panelType} />
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
              Report Code: <strong className="text-slate-900 dark:text-white">{test.testCode}</strong>
            </p>
          </div>

          {/* Pathology Destination Badge */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-right sm:text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Report Prepared For
            </span>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5" /> {test.reportDestination}
            </span>
          </div>
        </div>

        {/* Patient & Demographics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Patient Name</span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">{test.patientName}</span>
            <span className="text-[11px] font-mono text-slate-500 block">ID: {test.patientCode}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Demographics</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {patient?.gender || 'N/A'}, {patient?.age || 'N/A'} yrs
            </span>
            <span className="text-[11px] font-mono text-slate-500 block">Blood: {patient?.bloodGroup || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Specimen & Operator</span>
            <span className="font-semibold text-slate-900 dark:text-white">{test.stripBrand}</span>
            <span className="text-[11px] font-mono text-slate-500 block">Tech: {test.submittedBy}</span>
          </div>
        </div>

        {/* Full Analyte Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase font-bold text-slate-700 dark:text-slate-300 tracking-wider">
              Urinalysis Analyte Panel ({test.analytes?.length || 10} Parameters)
            </h3>
            <StatusBadge status={test.overallStatus} />
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-400 bg-slate-50 dark:bg-slate-900">
                  <th className="py-2.5 px-4">Analyte Parameter</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Result Value</th>
                  <th className="py-2.5 px-4">Reference Range</th>
                  <th className="py-2.5 px-4">Status Flag</th>
                  <th className="py-2.5 px-4 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-mono">
                {test.analytes?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {item.category || 'General'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {item.value}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {item.refRange}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.flag} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                        {item.score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technician Notes */}
        {test.technicianNotes && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              Technician Observations:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {test.technicianNotes}
            </p>
          </div>
        )}

        {/* Audit Trail Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Audit Trail & History
          </span>
          <div className="space-y-1.5">
            {test.auditTrail?.map((aud) => (
              <div key={aud.id} className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between py-1 border-b border-slate-100/60 dark:border-slate-800/40">
                <div>
                  <strong className="text-slate-700 dark:text-slate-300">{aud.action}</strong> by {aud.actor}
                  {aud.details && <span className="text-slate-400 font-sans ml-2">— {aud.details}</span>}
                </div>
                <span>{formatDate(aud.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        test={test}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
