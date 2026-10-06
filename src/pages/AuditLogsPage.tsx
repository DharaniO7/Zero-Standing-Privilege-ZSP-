import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, FileText, AlertCircle, ShieldAlert, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { AuditLogItem } from '../types';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [search, setSearch] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('');
  const [anomalyOnly, setAnomalyOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (decisionFilter) params.append('decision', decisionFilter);
      if (anomalyOnly) params.append('anomalyOnly', 'true');

      const res = await fetch(`/api/audit?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, decisionFilter, anomalyOnly]);

  const handleExportCSV = () => {
    if (logs.length === 0) return;

    const headers = ['ID', 'User_ID', 'Role', 'Resource', 'Privilege', 'Risk_Score', 'Attack_Type', 'Decision', 'Anomaly', 'Timestamp', 'Location', 'Device'];
    const rows = logs.map((l) => [
      l.id,
      l.user_id,
      l.role,
      `"${l.resource}"`,
      l.requested_privilege,
      l.risk_score,
      `"${l.attack_type}"`,
      l.decision,
      l.anomaly,
      l.timestamp,
      l.login_location,
      l.device_type,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zsp_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="cyber-card p-6 rounded-2xl border border-cyan-200/90 bg-white/95 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-code font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
                IMMUTABLE AUDIT TRACE
              </span>
              <span className="text-xs text-slate-500 font-code">• Forensic Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-tech text-slate-900 tracking-tight mt-1 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-cyan-600" />
              <span>Zero Standing Privilege Audit Logs</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Historical access evaluations, risk scoring telemetry, and Isolation Forest anomaly tags.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchLogs}
              title="Refresh Logs"
              className="p-2.5 rounded-xl border border-cyan-200 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 transition-colors shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-cyan-950 text-white text-xs font-bold font-tech px-4 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>EXPORT CSV LOGS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="cyber-card p-4 rounded-2xl border border-cyan-200/80 bg-white/95 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-600">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="audit-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by User ID, Role, Resource, or Attack Type..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-cyan-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          <select
            id="audit-filter-decision"
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value)}
            className="bg-slate-50 border border-cyan-200/80 rounded-xl px-3 py-2 text-xs text-slate-800 font-tech font-bold focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Decisions</option>
            <option value="GRANT">Decision: GRANT</option>
            <option value="DENY">Decision: DENY</option>
          </select>

          <label className="flex items-center space-x-2 bg-amber-50 px-3 py-2 rounded-xl border border-amber-300 text-xs text-amber-900 font-tech font-bold cursor-pointer hover:bg-amber-100/80 transition-colors">
            <input
              id="chk-anomaly-only"
              type="checkbox"
              checked={anomalyOnly}
              onChange={(e) => setAnomalyOnly(e.target.checked)}
              className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
            />
            <span className="flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Anomalies Only</span>
            </span>
          </label>

        </div>

      </div>

      {/* Table */}
      <div className="cyber-card rounded-2xl border border-cyan-200/90 bg-white/95 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-code font-medium">Scanning Log Circuit Nodes...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <AlertCircle className="w-8 h-8 text-cyan-600 mx-auto opacity-70" />
            <p className="font-tech font-bold text-sm text-slate-700">No Audit Records Found</p>
            <p className="text-slate-500">No logs match the current query or filter parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-cyan-50/80 uppercase text-[10px] text-cyan-900 font-code border-b border-cyan-200/70">
                <tr>
                  <th className="py-3.5 px-4">Log ID</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Resource</th>
                  <th className="py-3.5 px-4">Privilege</th>
                  <th className="py-3.5 px-4">Risk Score</th>
                  <th className="py-3.5 px-4">Attack Type</th>
                  <th className="py-3.5 px-4">Decision</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-100 font-sans">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-cyan-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-code text-cyan-800 text-[11px] font-bold">{log.id}</td>
                    <td className="py-3.5 px-4 font-code font-bold text-slate-900">{log.user_id}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{log.role}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.resource}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md font-code text-[10px] text-slate-700 border border-slate-200 font-semibold">
                        {log.requested_privilege}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-code">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          log.risk_score >= 45
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {log.risk_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        {log.anomaly === 1 && (
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span
                          className={
                            log.attack_type === 'Normal' 
                              ? 'text-slate-500' 
                              : 'text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]'
                          }
                        >
                          {log.attack_type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold font-tech tracking-wider ${
                          log.decision === 'GRANT'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {log.decision}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-code text-[10px]">
                      {new Date(log.timestamp).toLocaleString()}
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
