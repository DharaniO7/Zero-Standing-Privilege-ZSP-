import React, { useEffect, useState } from 'react';
import { Database, FileSpreadsheet, Layers, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';
import { DatasetRow } from '../types';

export const DatasetPage: React.FC = () => {
  const [dataset, setDataset] = useState<DatasetRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dataset')
      .then((res) => res.json())
      .then((data) => {
        setDataset(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dataset:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="cyber-card p-6 rounded-2xl border border-cyan-200/90 bg-white/95 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-code font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
                TRAINING CORPUS & FEATURE STORE
              </span>
              <span className="text-xs text-slate-500 font-code">• 20 Engineered Attributes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-tech text-slate-900 tracking-tight mt-1 flex items-center space-x-2">
              <Database className="w-6 h-6 text-cyan-600" />
              <span>Cleaned & Feature-Engineered Employee Access Dataset</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Multidimensional training matrix utilized by Random Forest (Supervised Risk) and Isolation Forest (Unsupervised Anomalies).
            </p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-code font-semibold">
            <Cpu className="w-4 h-4 text-cyan-600" />
            <span>{dataset.length} Training Observations</span>
          </div>
        </div>
      </div>

      {/* Feature Columns Checklist */}
      <div className="cyber-card p-5 rounded-2xl border border-cyan-200/80 bg-white/95 text-xs text-slate-700 space-y-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-600" />
          <span className="font-bold font-tech text-slate-900 uppercase tracking-wide">
            Dataset Feature Schema (20 Columns):
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 font-code text-[11px]">
          {[
            'User_ID',
            'Role',
            'Account_Type',
            'Login_Time',
            'Login_Location',
            'Device_Type',
            'Authentication_Method',
            'Failed_Login_Attempts',
            'Resource_Accessed',
            'Requested_Privilege',
            'Requested_Duration',
            'Temporary_Access',
            'Access_Frequency',
            'Session_Duration',
            'New_Device',
            'New_Location',
            'Risk_Score',
            'Access_Decision',
            'Attack_Type',
            'Anomaly',
          ].map((col, idx) => (
            <span key={col} className="px-2.5 py-1 bg-cyan-50/80 rounded-lg border border-cyan-200 text-cyan-900 font-semibold shadow-xs">
              <span className="text-cyan-600 font-bold mr-1">{idx + 1}.</span>
              {col}
            </span>
          ))}
        </div>
      </div>

      {/* Dataset Table */}
      <div className="cyber-card rounded-2xl border border-cyan-200/90 bg-white/95 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-code font-medium">Extracting Dataset Matrix...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
              <thead className="bg-cyan-50/80 uppercase text-[10px] text-cyan-900 font-code border-b border-cyan-200/70">
                <tr>
                  <th className="py-3 px-3">User_ID</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Account_Type</th>
                  <th className="py-3 px-3">Login_Time</th>
                  <th className="py-3 px-3">Login_Location</th>
                  <th className="py-3 px-3">Device_Type</th>
                  <th className="py-3 px-3">Auth_Method</th>
                  <th className="py-3 px-3">Failed_Logins</th>
                  <th className="py-3 px-3">Resource_Accessed</th>
                  <th className="py-3 px-3">Privilege</th>
                  <th className="py-3 px-3">Req_Duration</th>
                  <th className="py-3 px-3">Temp_Access</th>
                  <th className="py-3 px-3">Frequency</th>
                  <th className="py-3 px-3">Sess_Duration</th>
                  <th className="py-3 px-3">New_Device</th>
                  <th className="py-3 px-3">New_Loc</th>
                  <th className="py-3 px-3">Risk_Score</th>
                  <th className="py-3 px-3">Decision</th>
                  <th className="py-3 px-3">Attack_Type</th>
                  <th className="py-3 px-3">Anomaly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-100 font-sans">
                {dataset.map((row, idx) => (
                  <tr key={idx} className="hover:bg-cyan-50/40 transition-colors">
                    <td className="py-2.5 px-3 font-code font-bold text-cyan-800">{row.User_ID}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{row.Role}</td>
                    <td className="py-2.5 px-3 font-code text-[11px] text-slate-600">{row.Account_Type}</td>
                    <td className="py-2.5 px-3 font-code text-slate-700">{row.Login_Time}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.Login_Location}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.Device_Type}</td>
                    <td className="py-2.5 px-3 font-code text-[10px] text-slate-600">{row.Authentication_Method}</td>
                    <td className="py-2.5 px-3 font-code text-center font-bold text-amber-700">{row.Failed_Login_Attempts}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{row.Resource_Accessed}</td>
                    <td className="py-2.5 px-3 font-code text-[11px] text-cyan-800 font-semibold">{row.Requested_Privilege}</td>
                    <td className="py-2.5 px-3 font-code text-center">{row.Requested_Duration}m</td>
                    <td className="py-2.5 px-3 text-center font-medium">{row.Temporary_Access}</td>
                    <td className="py-2.5 px-3 text-slate-600">{row.Access_Frequency}</td>
                    <td className="py-2.5 px-3 font-code text-center">{row.Session_Duration}m</td>
                    <td className="py-2.5 px-3 text-center font-code font-semibold">{row.New_Device}</td>
                    <td className="py-2.5 px-3 text-center font-code font-semibold">{row.New_Location}</td>
                    <td className="py-2.5 px-3 font-code font-bold text-slate-900">{row.Risk_Score.toFixed(1)}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-tech ${
                          row.Access_Decision === 'GRANT'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {row.Access_Decision}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{row.Attack_Type}</td>
                    <td className="py-2.5 px-3 text-center font-code font-bold">
                      {row.Anomaly === 1 ? (
                        <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">1 (Yes)</span>
                      ) : (
                        <span className="text-slate-400">0 (No)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
