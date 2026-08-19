import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FlaskConical, 
  FileText, 
  Users, 
  CheckSquare, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ pendingCount = 0 }) {
  const { user, logout, switchRole } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Test Wizard', path: '/new-test', icon: FlaskConical },
    { label: 'Test Reports', path: '/reports', icon: FileText },
    { label: 'Patients', path: '/patients', icon: Users },
    { 
      label: 'Review Queue', 
      path: '/review-queue', 
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : null
    },
    { label: 'Technician Profile', path: '/profile', icon: User }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
      <div>
        {/* Top Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <BrandLogo size="md" />
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold shadow-sm border border-teal-200/50 dark:border-teal-800/40'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Role Switcher & Account */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {/* Quick Role Switcher for Demo */}
        <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3 h-3 text-amber-500" /> Active Role
            </span>
            <span className="uppercase text-[10px] text-teal-600 dark:text-teal-400 font-bold">{user?.role}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => switchRole('Technician')}
              className={`py-1 text-center rounded-md font-medium transition-all ${
                user?.role === 'Technician'
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Technician
            </button>
            <button
              onClick={() => switchRole('Clinician')}
              className={`py-1 text-center rounded-md font-medium transition-all ${
                user?.role === 'Clinician'
                  ? 'bg-teal-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Clinician
            </button>
          </div>
        </div>

        {/* User Session Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-teal-500/40 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-500/30">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
            )}
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.designation || user?.email}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
