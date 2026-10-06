import React from 'react';
import { ShieldCheck, LayoutDashboard, KeyRound, FileText, Database, LogOut, User as UserIcon, Activity, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'request', label: 'Request Access', icon: KeyRound },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'dataset', label: 'Dataset Explorer', icon: Database },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md text-slate-800 border-b border-cyan-200/90 sticky top-0 z-50 shadow-sm shadow-cyan-900/5">
      {/* Top Circuit Data Conduit Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-400 via-sky-500 to-teal-400 opacity-90"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title with Cyber Circuit Board Accent */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="relative p-2.5 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-xl text-white shadow-md shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all border border-cyan-300">
              <ShieldCheck className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white circuit-pulse"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-tech font-bold text-lg tracking-tight text-slate-900 leading-tight">
                  ZSP <span className="text-cyan-600">CYBER</span>CIRCUIT
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-code font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                  v2.4 JIT
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-code flex items-center space-x-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                <span>Zero Standing Privilege Engine</span>
              </span>
            </div>
          </div>

          {/* Navigation Links with Cyber Circuit Aesthetics */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-100/80 p-1 rounded-xl border border-cyan-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-sm shadow-cyan-500/30 border border-cyan-400/80 font-tech tracking-wide'
                      : 'text-slate-600 hover:text-cyan-700 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Cyber Actions */}
          <div className="flex items-center space-x-3">
            {/* Live Telemetry Node Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-code">
              <span className="w-2 h-2 rounded-full bg-emerald-500 circuit-pulse"></span>
              <span>NODE: SYNCED</span>
            </div>

            {user ? (
              <div className="flex items-center space-x-2.5 bg-cyan-50/70 hover:bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200/80 transition-colors shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-sky-700 text-white flex items-center justify-center font-bold font-tech text-xs shadow-xs border border-cyan-300">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-cyan-700 font-code font-medium">{user.role} • {user.accountType}</p>
                </div>
                <button
                  id="logout-btn"
                  onClick={logout}
                  title="Logout / Switch User"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-0.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="login-tab-btn"
                onClick={() => setActiveTab('login')}
                className="flex items-center space-x-1.5 cyber-btn-primary text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex space-x-1 py-2 border-t border-cyan-100 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'bg-cyan-600 text-white shadow-xs font-semibold' 
                    : 'text-slate-600 bg-slate-100 hover:bg-cyan-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
