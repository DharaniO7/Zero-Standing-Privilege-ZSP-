import React, { useState } from 'react';
import { ShieldCheck, Key, UserCheck, Lock, AlertCircle, Cpu, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    setLoading(false);

    if (success) {
      onSuccess();
    } else {
      setError('Invalid credentials. Please check your username.');
    }
  };

  const presetUsers = [
    { username: 'admin', role: 'Security Officer', type: 'Admin', desc: 'Full System Admin Access' },
    { username: 'dev_alex', role: 'Software Engineer', type: 'Standard', desc: 'Standard Developer Account' },
    { username: 'sys_marcus', role: 'System Admin', type: 'Privileged', desc: 'SysAdmin Privileged Account' },
    { username: 'devops_priya', role: 'DevOps Engineer', type: 'Privileged', desc: 'DevOps Cloud Admin Account' },
    { username: 'hr_elena', role: 'HR Specialist', type: 'Standard', desc: 'HR Portal Specialist Account' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 cyber-card p-8 rounded-2xl border border-cyan-200/90 bg-white/95 shadow-xl relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-cyan-100 text-cyan-700 border border-cyan-300 flex items-center justify-center shadow-xs">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="inline-block mt-3 px-2.5 py-0.5 rounded-full text-[10px] font-code font-bold bg-cyan-50 text-cyan-800 border border-cyan-300">
            SECURE AUTH GATEWAY
          </div>
          <h2 className="mt-2 text-2xl font-bold font-tech text-slate-900 tracking-tight">
            ZSP Framework Login
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-sans">
            Zero Standing Privilege Access Control & ML Risk Assessment
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-300 text-rose-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 font-sans font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold font-tech text-slate-700 uppercase tracking-wider mb-1.5">
              Identity Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-600">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                id="login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-cyan-200/90 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-tech text-slate-700 uppercase tracking-wider mb-1.5">
              Access Credential
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-600">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-cyan-200/90 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold font-tech text-white cyber-btn-primary disabled:opacity-50 transition-all shadow-md shadow-cyan-500/25"
          >
            <Key className="w-4 h-4" />
            <span>{loading ? 'AUTHENTICATING IDENTITY...' : 'AUTHENTICATE & ENTER'}</span>
          </button>
        </form>

        {/* Demo Preset Buttons for Quick Testing */}
        <div className="pt-4 border-t border-cyan-100">
          <p className="text-[11px] font-bold font-tech text-slate-600 uppercase tracking-wider mb-2.5 text-center">
            Quick Demo Accounts (Click to Select)
          </p>
          <div className="space-y-1.5">
            {presetUsers.map((u) => (
              <button
                key={u.username}
                type="button"
                onClick={() => {
                  setUsername(u.username);
                  setPassword('password123');
                }}
                className={`w-full text-left px-3.5 py-2 rounded-xl border text-xs transition-all flex justify-between items-center ${
                  username === u.username
                    ? 'bg-cyan-100/70 border-cyan-400 text-cyan-950 font-semibold shadow-xs'
                    : 'bg-slate-50 border-cyan-100 text-slate-700 hover:bg-cyan-50/50 hover:border-cyan-200'
                }`}
              >
                <div>
                  <span className="font-bold font-code text-slate-900">{u.username}</span>
                  <span className="text-[10px] text-slate-500 block font-sans">{u.role}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-cyan-200 font-code font-bold text-cyan-800">
                  {u.type}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
