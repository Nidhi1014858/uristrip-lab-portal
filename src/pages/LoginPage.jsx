import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrandLogo } from '../components/common/BrandLogo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('tech@cura.lab');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Technician');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password, role);
      addToast(`Welcome back! Logged in as ${role}`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (demoRole) => {
    if (demoRole === 'Technician') {
      setEmail('tech@cura.lab');
      setPassword('password123');
      setRole('Technician');
    } else {
      setEmail('clinician@cura.lab');
      setPassword('password123');
      setRole('Clinician');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white font-sans">
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo size="xl" showText={true} />
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Point-of-Care Urinalysis & Clinical Diagnostic Review Portal
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-slate-800/80 p-1 rounded-2xl border border-slate-700/80 grid grid-cols-2 gap-1 text-xs">
          <button
            type="button"
            onClick={() => setRole('Technician')}
            className={`py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              role === 'Technician'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Technician
          </button>
          <button
            type="button"
            onClick={() => setRole('Clinician')}
            className={`py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              role === 'Clinician'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Clinician
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {isSubmitting ? 'Authenticating...' : `Sign In as ${role}`}
          </button>
        </form>

        {/* Quick Demo Credentials Buttons */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <Sparkles className="w-3 h-3 text-amber-400" /> Quick Demo Credentials:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemoAccount('Technician')}
              className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-left"
            >
              <div className="font-bold text-teal-400">Lab Technician</div>
              <div className="text-[10px] text-slate-400 font-mono">tech@cura.lab</div>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('Clinician')}
              className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-left"
            >
              <div className="font-bold text-teal-400">Dr. Clinician</div>
              <div className="text-[10px] text-slate-400 font-mono">clinician@cura.lab</div>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-400 hover:underline font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
