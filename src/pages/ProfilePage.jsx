import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, ShieldCheck, Building2, Upload, Save } from 'lucide-react';
import { Avatar } from '../components/common/Avatar';

export function ProfilePage() {
  const { user, updateUserProfile, changePassword } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    designation: user?.designation || '',
    department: user?.department || 'Point-of-Care Testing (POCT)',
    photoUrl: user?.photoUrl || null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result }));
        setConfirmRemove(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = async () => {
    setIsSubmitting(true);
    try {
      await updateUserProfile({ photoUrl: null });
      setFormData((current) => ({ ...current, photoUrl: null }));
      setConfirmRemove(false);
      addToast('Profile photo removed.', 'success');
    } catch (err) {
      addToast(err.message || 'Unable to remove profile photo', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUserProfile(formData);
      addToast('Profile updated successfully! Reflecting immediately.', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation must match.');
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordOpen(false);
      addToast('Password updated successfully.', 'success');
    } catch (err) {
      setPasswordError(err.message || 'Unable to update password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
          User Account & Technician Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your credentials, designation, department, and digital signature avatar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Profile Avatar Row */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative group">
            <Avatar name={formData.name} photoUrl={formData.photoUrl} className="w-20 h-20 border-2 border-teal-500 shadow-md" />
            <label className="absolute inset-0 rounded-full bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold cursor-pointer transition-opacity">
              <Upload className="w-4 h-4 mb-0.5" /> Change
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{user?.name}</h3>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                {user?.role}
              </span>
              <span className="text-xs text-slate-500 font-mono">{user?.designation}</span>
            </div>
            {formData.photoUrl && !confirmRemove && <button type="button" onClick={() => setConfirmRemove(true)} className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">Remove photo</button>}
            {formData.photoUrl && confirmRemove && <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs"><span className="text-rose-700 dark:text-rose-300 font-semibold">Remove profile photo?</span><button type="button" onClick={handleRemovePhoto} disabled={isSubmitting} className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold disabled:opacity-50">Confirm</button><button type="button" onClick={() => setConfirmRemove(false)} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">Cancel</button></div>}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Designation / Title
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Senior Pathology Technician"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div><h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2"><Lock className="w-4 h-4 text-teal-600" />Password</h2><p className="text-xs text-slate-500 mt-1">Change your password through a separate security action.</p></div>
          <button type="button" onClick={() => { setPasswordOpen((open) => !open); setPasswordError(''); }} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-teal-50 dark:hover:bg-teal-950">{passwordOpen ? 'Cancel' : 'Change Password'}</button>
        </div>
        {passwordOpen && <form onSubmit={handlePasswordSubmit} className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[['currentPassword', 'Current password'], ['newPassword', 'New password'], ['confirmPassword', 'Confirm new password']].map(([field, label]) => <div key={field}><label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</label><input type="password" required value={passwordData[field]} onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500" /></div>)}
          </div>
          {passwordError && <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{passwordError}</p>}
          <div className="flex justify-end"><button type="submit" disabled={isChangingPassword} className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold disabled:opacity-50">{isChangingPassword ? 'Updating Password...' : 'Update Password'}</button></div>
        </form>}
      </section>
    </div>
  );
}
