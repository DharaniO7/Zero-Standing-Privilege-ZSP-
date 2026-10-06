import React, { useEffect, useState } from 'react';
import { Users, FileCheck, CheckCircle2, XCircle, AlertTriangle, Shield, Cpu, ArrowRight, Activity, Zap, RefreshCw } from 'lucide-react';
import { DashboardStats } from '../types';

interface DashboardPageProps {
  onNavigateToRequest: () => void;
  onNavigateToAudit: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateToRequest, onNavigateToAudit }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-500">
        <div className="cyber-card p-6 rounded-2xl flex items-center space-x-3 border border-cyan-200">
          <div className="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-code text-sm text-cyan-800 font-semibold">Reading CyberCircuit Bus Telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Header Banner with Cyber Light Accent */}
      <div className="cyber-card p-6 rounded-2xl border border-cyan-200/80 bg-white/95 relative overflow-hidden">
        {/* Subtle Circuit Trace Line */}
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-cyan-100/40 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-code font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
                ACTIVE MONITORING BUS
              </span>
              <span className="text-xs text-slate-500 font-code">• 24/7 Policy Evaluation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-tech text-slate-900 tracking-tight mt-1.5">
              Zero Standing Privilege <span className="text-cyan-600">(ZSP)</span> Security Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
              Autonomous access gatekeeper using supervised Random Forest risk classification and unsupervised Isolation Forest anomaly telemetry.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDashboard}
              title="Refresh Metrics"
              className="p-2.5 rounded-xl border border-cyan-200 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 transition-colors shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              id="dash-request-btn"
              onClick={onNavigateToRequest}
              className="flex items-center space-x-2 cyber-btn-primary text-white text-xs font-bold font-tech px-5 py-2.5 rounded-xl transition-all"
            >
              <Shield className="w-4 h-4" />
              <span>REQUEST JIT ACCESS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards with Cyber Circuit Light Theme */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Employees */}
        <div className="cyber-card p-4 rounded-xl border border-cyan-200/70 corner-circuit">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide font-tech">Total Employees</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg border border-sky-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-tech text-slate-900 mt-2">{stats?.totalEmployees || 0}</p>
          <div className="flex items-center space-x-1 mt-1 text-[11px] text-slate-500 font-code">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            <span>Registered Identities</span>
          </div>
        </div>

        {/* Total Access Requests */}
        <div className="cyber-card p-4 rounded-xl border border-cyan-200/70 corner-circuit">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide font-tech">Access Requests</span>
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg border border-cyan-200">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-tech text-slate-900 mt-2">{stats?.totalRequests || 0}</p>
          <div className="flex items-center space-x-1 mt-1 text-[11px] text-slate-500 font-code">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            <span>Processed by ML</span>
          </div>
        </div>

        {/* Granted */}
        <div className="cyber-card p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 corner-circuit">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide font-tech">Access Granted</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-tech text-emerald-700 mt-2">{stats?.grantedCount || 0}</p>
          <div className="flex items-center space-x-1 mt-1 text-[11px] text-emerald-700 font-code font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 circuit-pulse"></span>
            <span>JIT Ephemeral Tokens</span>
          </div>
        </div>

        {/* Denied */}
        <div className="cyber-card p-4 rounded-xl border border-rose-200/80 bg-rose-50/30 corner-circuit">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wide font-tech">Access Denied</span>
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg border border-rose-200">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-tech text-rose-600 mt-2">{stats?.deniedCount || 0}</p>
          <div className="flex items-center space-x-1 mt-1 text-[11px] text-rose-700 font-code font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>High Risk Blocked</span>
          </div>
        </div>

        {/* Anomalies */}
        <div className="cyber-card p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 col-span-2 lg:col-span-1 corner-circuit">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide font-tech">Anomalies Detected</span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-tech text-amber-600 mt-2">{stats?.anomaliesCount || 0}</p>
          <div className="flex items-center space-x-1 mt-1 text-[11px] text-amber-700 font-code font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 circuit-pulse"></span>
            <span>Isolation Flags</span>
          </div>
        </div>

      </div>

      {/* Machine Learning Models Comparison Section (Cyber Architecture Board) */}
      <div className="cyber-card rounded-2xl border border-cyan-200/90 p-6 space-y-5 bg-white/95">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-cyan-100 pb-4 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-cyan-100 rounded-lg text-cyan-700">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold font-tech text-slate-900 tracking-tight">
                ML Architecture & Benchmark Comparison
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Evaluated on 20-feature Cleaned Employee Access Dataset (Random Forest vs Isolation Forest)
            </p>
          </div>
          <span className="text-xs px-3.5 py-1.5 bg-cyan-50 text-cyan-800 rounded-full border border-cyan-300 font-code font-semibold w-fit flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-600" />
            <span>PRIMARY CONTROLLER: RANDOM FOREST</span>
          </span>
        </div>

        {/* Model Metrics Table */}
        <div className="overflow-x-auto rounded-xl border border-cyan-100 bg-slate-50/50">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-cyan-50/80 uppercase text-[10px] text-cyan-900 font-code border-b border-cyan-200/70">
              <tr>
                <th className="py-3 px-4">Model Algorithm</th>
                <th className="py-3 px-4">Primary Function</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1 Score</th>
                <th className="py-3 px-4">Role in ZSP Framework</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-100 font-sans">
              
              {/* Random Forest Row */}
              <tr className="bg-cyan-50/30 hover:bg-cyan-50/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2 font-tech text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-400"></span>
                  <span>Random Forest (Classifier)</span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">Supervised Decision Boundary & Risk Scoring</td>
                <td className="py-3.5 px-4 font-code font-bold text-emerald-600 text-sm">{stats?.modelMetrics.randomForest.accuracy}%</td>
                <td className="py-3.5 px-4 font-code font-semibold">{stats?.modelMetrics.randomForest.precision}%</td>
                <td className="py-3.5 px-4 font-code font-semibold">{stats?.modelMetrics.randomForest.recall}%</td>
                <td className="py-3.5 px-4 font-code font-bold text-cyan-700 text-sm">{stats?.modelMetrics.randomForest.f1Score}%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-tech font-bold text-[10px] shadow-xs">
                    FINAL DECISION ENGINE
                  </span>
                </td>
              </tr>

              {/* Isolation Forest Row */}
              <tr className="bg-amber-50/20 hover:bg-amber-50/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2 font-tech text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-400"></span>
                  <span>Isolation Forest (Anomaly)</span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">Unsupervised Behavioral Outlier Detection</td>
                <td className="py-3.5 px-4 font-code font-bold text-amber-700 text-sm">{stats?.modelMetrics.isolationForest.accuracy}%</td>
                <td className="py-3.5 px-4 font-code font-semibold">{stats?.modelMetrics.isolationForest.precision}%</td>
                <td className="py-3.5 px-4 font-code font-semibold">{stats?.modelMetrics.isolationForest.recall}%</td>
                <td className="py-3.5 px-4 font-code font-bold text-amber-700 text-sm">{stats?.modelMetrics.isolationForest.f1Score}%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-tech font-bold text-[10px]">
                    ANOMALY DETECTOR
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Why Random Forest is selected banner */}
        <div className="bg-gradient-to-r from-cyan-50/80 to-sky-50/80 p-4 rounded-xl border border-cyan-200/80 text-xs text-slate-700 leading-relaxed shadow-xs">
          <p className="font-bold text-slate-900 mb-1 flex items-center space-x-1.5 font-tech text-sm">
            <Shield className="w-4 h-4 text-cyan-600" />
            <span>Why Random Forest is Chosen as Primary Access Governor:</span>
          </p>
          <p className="text-slate-600">
            Random Forest demonstrates higher precision and an F1-Score of <strong>{stats?.modelMetrics.randomForest.f1Score}%</strong> on multidimensional access policy features (Resource Risk, Time, Role & Device Trust). Simultaneously, Isolation Forest acts as an asynchronous watchdog to intercept novel behavioral outliers and credential anomalies without standing admin grants.
          </p>
        </div>
      </div>

      {/* Recent Access Requests Table */}
      <div className="cyber-card rounded-2xl border border-cyan-200/90 p-6 space-y-4 bg-white/95">
        <div className="flex items-center justify-between border-b border-cyan-100 pb-4">
          <div>
            <h2 className="text-lg font-bold font-tech text-slate-900 tracking-tight">
              Recent Evaluated Access Requests
            </h2>
            <p className="text-xs text-slate-500 font-sans">Live telemetry feed of incoming user requests</p>
          </div>
          <button
            onClick={onNavigateToAudit}
            className="flex items-center space-x-1.5 text-xs text-cyan-700 hover:text-cyan-800 font-bold font-tech hover:underline"
          >
            <span>VIEW FULL AUDIT TRAIL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-cyan-100">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-cyan-50/80 uppercase text-[10px] text-cyan-900 font-code border-b border-cyan-200/70">
              <tr>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Protected Resource</th>
                <th className="py-3 px-4">Privilege</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Attack Type</th>
                <th className="py-3 px-4">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-100 bg-white">
              {stats?.recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-cyan-50/40 transition-colors">
                  <td className="py-3 px-4 font-code font-bold text-cyan-800">{req.user_id}</td>
                  <td className="py-3 px-4 font-medium text-slate-700">{req.role}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{req.resource}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md font-code text-[10px] text-slate-700 border border-slate-200 font-semibold">
                      {req.requested_privilege}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-code">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        req.risk_score >= 45
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {req.risk_score.toFixed(1)} / 100
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    <span
                      className={
                        req.attack_type === 'Normal' 
                          ? 'text-slate-500' 
                          : 'text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200'
                      }
                    >
                      {req.attack_type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold font-tech tracking-wider ${
                        req.decision === 'GRANT'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {req.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
