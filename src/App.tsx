import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { RequestAccessPage } from './pages/RequestAccessPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { DatasetPage } from './pages/DatasetPage';
import { LoginPage } from './pages/LoginPage';
import { ShieldCheck, Cpu, Activity, Zap, Lock } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { user } = useAuth();

  return (
    <div className="min-h-screen cyber-circuit-bg text-slate-800 font-sans flex flex-col relative overflow-hidden">
      
      {/* Decorative Circuit Board Glow Elements in Background */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Cyber Circuit Telemetry Status Ticker */}
      <div className="bg-white/80 border-b border-cyan-200/60 px-4 py-1.5 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-[11px] font-code text-slate-600 gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-cyan-700 font-bold font-tech">
              <Zap className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500 animate-pulse" />
              <span>CIRCUIT BUS: ONLINE</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-500">
              RF MODEL ACCURACY: <strong className="text-emerald-600 font-bold">96.8%</strong>
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-slate-500">
              IF ANOMALY RADAR: <strong className="text-cyan-700 font-bold">ACTIVE (0.05 CONTAM)</strong>
            </span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500">
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-cyan-600" />
              <span>STANDBY: 0 STANDING PERMISSIONS</span>
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {activeTab === 'login' && <LoginPage onSuccess={() => setActiveTab('dashboard')} />}
        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigateToRequest={() => setActiveTab('request')}
            onNavigateToAudit={() => setActiveTab('audit')}
          />
        )}
        {activeTab === 'request' && <RequestAccessPage />}
        {activeTab === 'audit' && <AuditLogsPage />}
        {activeTab === 'dataset' && <DatasetPage />}
      </main>

      {/* Cyber Circuit Footer */}
      <footer className="border-t border-cyan-200/80 bg-white/90 py-5 text-center text-xs text-slate-600 font-code relative shadow-sm">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-0 left-0"></div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-slate-700 font-semibold font-tech">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>Zero Standing Privilege (ZSP) Security Framework</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Supervised Random Forest Classifier & Unsupervised Isolation Forest ML Engine
          </div>
          <div className="flex items-center space-x-1.5 text-cyan-700 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-cyan-500 circuit-pulse"></span>
            <span>CYBER-CIRCUIT NODE v2.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
