import React, { useEffect, useState } from 'react';
import { KeyRound, ShieldAlert, ShieldCheck, Clock, AlertTriangle, Cpu, CheckCircle, XCircle, Zap, Terminal, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AccessRequestInput, AccountType, AuthMethod, DeviceType, PredictionOutput, PrivilegeLevel, ResourceItem, Role } from '../types';

export const RequestAccessPage: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [selectedResource, setSelectedResource] = useState<string>('Production-DB Cluster');
  const [requestedPrivilege, setRequestedPrivilege] = useState<PrivilegeLevel>('Admin-Root');
  const [duration, setDuration] = useState<number>(60);
  const [role, setRole] = useState<Role>(user?.role || 'Software Engineer');
  const [accountType, setAccountType] = useState<AccountType>(user?.accountType || 'Standard');
  const [location, setLocation] = useState<string>('HQ-NewYork');
  const [device, setDevice] = useState<DeviceType>('Corporate-Laptop');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('Password+MFA');
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [loginTime, setLoginTime] = useState<string>('10:00');
  const [newDevice, setNewDevice] = useState<0 | 1>(0);
  const [newLocation, setNewLocation] = useState<0 | 1>(0);
  const [temporaryAccess, setTemporaryAccess] = useState<'Yes' | 'No'>('Yes');

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionOutput | null>(null);

  useEffect(() => {
    fetch('/api/resources')
      .then((res) => res.json())
      .then((data) => {
        setResources(data);
        if (data.length > 0) setSelectedResource(data[0].name);
      })
      .catch((err) => console.error('Failed to load resources:', err));
  }, []);

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setAccountType(user.accountType);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    const requestBody: AccessRequestInput = {
      User_ID: user?.id || 'EMP001',
      Role: role,
      Account_Type: accountType,
      Login_Time: loginTime,
      Login_Location: location,
      Device_Type: device,
      Authentication_Method: authMethod,
      Failed_Login_Attempts: failedAttempts,
      Resource_Accessed: selectedResource,
      Requested_Privilege: requestedPrivilege,
      Requested_Duration: duration,
      Temporary_Access: temporaryAccess,
      Access_Frequency: 'Daily',
      Session_Duration: duration,
      New_Device: newDevice,
      New_Location: newLocation,
    };

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const presetScenarios = [
    {
      label: 'Safe Request (Dev on Code Repo)',
      tag: 'LOW RISK',
      color: 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100',
      apply: () => {
        setSelectedResource('Core Code Repository');
        setRequestedPrivilege('Write');
        setDuration(60);
        setRole('Software Engineer');
        setLocation('HQ-NewYork');
        setDevice('Corporate-Laptop');
        setAuthMethod('Password+MFA');
        setFailedAttempts(0);
        setLoginTime('10:00');
        setNewDevice(0);
        setNewLocation(0);
        setTemporaryAccess('Yes');
      },
    },
    {
      label: 'Off-Hours Admin Escalation',
      tag: 'ELEVATED RISK',
      color: 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100',
      apply: () => {
        setSelectedResource('Production-DB Cluster');
        setRequestedPrivilege('Admin-Root');
        setDuration(240);
        setRole('Software Engineer');
        setLocation('Unknown-IP');
        setDevice('Unknown-Linux');
        setAuthMethod('Password-Only');
        setFailedAttempts(4);
        setLoginTime('02:30');
        setNewDevice(1);
        setNewLocation(1);
        setTemporaryAccess('No');
      },
    },
    {
      label: 'Credential Stuffing / Offshore',
      tag: 'ANOMALY ATTACK',
      color: 'border-rose-300 text-rose-800 bg-rose-50 hover:bg-rose-100',
      apply: () => {
        setSelectedResource('AWS Cloud Admin Console');
        setRequestedPrivilege('Admin-Root');
        setDuration(360);
        setRole('HR Specialist');
        setLocation('Offshore-India');
        setDevice('BYOD-MacBook');
        setAuthMethod('Password-Only');
        setFailedAttempts(5);
        setLoginTime('03:15');
        setNewDevice(1);
        setNewLocation(1);
        setTemporaryAccess('No');
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="cyber-card p-6 rounded-2xl border border-cyan-200/90 bg-white/95 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-code font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
                JUST-IN-TIME (JIT) PIPELINE
              </span>
              <span className="text-xs text-slate-500 font-code">• Ephemeral Lease Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-tech text-slate-900 tracking-tight mt-1 flex items-center space-x-2">
              <KeyRound className="w-6 h-6 text-cyan-600" />
              <span>Zero Standing Privilege Access Request</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Specify requested asset access parameters. The Random Forest & Isolation Forest ML engine will calculate risk real-time.
            </p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-code font-semibold w-fit">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>AI Risk Scoring Active</span>
          </div>
        </div>
      </div>

      {/* Quick Scenario Fill Buttons */}
      <div className="cyber-card p-5 rounded-2xl border border-cyan-200/80 bg-white/95">
        <div className="flex items-center space-x-2 mb-3">
          <Terminal className="w-4 h-4 text-cyan-600" />
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide font-tech">
            Load Pre-Configured Test Scenarios:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presetScenarios.map((sc, i) => (
            <button
              key={i}
              type="button"
              onClick={sc.apply}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between shadow-xs ${sc.color}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-code font-bold px-2 py-0.5 rounded-md bg-white/80 border border-current shadow-xs">
                  {sc.tag}
                </span>
                <span className="text-xs font-tech font-bold opacity-75">Preset #{i + 1}</span>
              </div>
              <span className="text-xs font-bold font-sans">{sc.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-7 cyber-card p-6 rounded-2xl border border-cyan-200/90 bg-white/95 space-y-6">
          <div className="flex items-center space-x-2 border-b border-cyan-100 pb-3">
            <Cpu className="w-4 h-4 text-cyan-600" />
            <h2 className="text-sm font-bold font-tech text-slate-900 uppercase tracking-wide">
              Request Parameters Matrix
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Resource Selection */}
            <div>
              <label className="block text-xs font-bold font-tech text-slate-700 uppercase tracking-wider mb-1.5">
                Target Protected Resource
              </label>
              <select
                id="req-resource"
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                className="w-full bg-slate-50 border border-cyan-200/90 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-medium transition-all"
              >
                {resources.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({r.category} • Base Risk: {r.baselineRisk})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Requested Privilege */}
              <div>
                <label className="block text-xs font-bold font-tech text-slate-700 uppercase tracking-wider mb-1.5">
                  Requested Privilege
                </label>
                <select
                  id="req-privilege"
                  value={requestedPrivilege}
                  onChange={(e) => setRequestedPrivilege(e.target.value as PrivilegeLevel)}
                  className="w-full bg-slate-50 border border-cyan-200/90 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  <option value="Read-Only">Read-Only</option>
                  <option value="Write">Write</option>
                  <option value="Execute">Execute</option>
                  <option value="Admin-Root">Admin-Root</option>
                </select>
              </div>

              {/* Requested Duration */}
              <div>
                <label className="block text-xs font-bold font-tech text-slate-700 uppercase tracking-wider mb-1.5">
                  Duration (Minutes)
                </label>
                <input
                  id="req-duration"
                  type="number"
                  min="15"
                  max="480"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-cyan-200/90 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-code font-bold focus:ring-2 focus:ring-cyan-500"
                />
              </div>

            </div>

            {/* Role & Account Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold font-tech text-slate-700 uppercase tracking-wider mb-1.5">
                  User Role
                </label>
                <select
                  id="req-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-slate-50 border border-cyan-200/90 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="System Admin">System Admin</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="HR Specialist">HR Specialist</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                  <option value="Security Officer">Security Officer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-tech text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Type
                </label>
                <select
                  id="req-acctype"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as AccountType)}
                  className="w-full bg-slate-50 border border-cyan-200/90 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  <option value="Standard">Standard</option>
                  <option value="Privileged">Privileged</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Environment Factors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold font-tech text-slate-700 uppercase tracking-wider mb-1">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-cyan-200/90 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="HQ-NewYork">HQ-NewYork</option>
                  <option value="Remote-Boston">Remote-Boston</option>
                  <option value="Offshore-India">Offshore-India</option>
                  <option value="Unknown-IP">Unknown-IP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-tech text-slate-700 uppercase tracking-wider mb-1">
                  Device Type
                </label>
                <select
                  value={device}
                  onChange={(e) => setDevice(e.target.value as DeviceType)}
                  className="w-full bg-slate-50 border border-cyan-200/90 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Corporate-Laptop">Corporate-Laptop</option>
                  <option value="BYOD-MacBook">BYOD-MacBook</option>
                  <option value="Personal-Phone">Personal-Phone</option>
                  <option value="Unknown-Linux">Unknown-Linux</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-tech text-slate-700 uppercase tracking-wider mb-1">
                  Auth Method
                </label>
                <select
                  value={authMethod}
                  onChange={(e) => setAuthMethod(e.target.value as AuthMethod)}
                  className="w-full bg-slate-50 border border-cyan-200/90 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Password+MFA">Password+MFA</option>
                  <option value="Hardware-Key">Hardware-Key</option>
                  <option value="Password-Only">Password-Only</option>
                </select>
              </div>
            </div>

            {/* Risk Indicators Toggles */}
            <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-200/80 space-y-3">
              <span className="text-xs font-bold font-tech text-cyan-900 uppercase tracking-wider block">
                Risk Condition Triggers:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Failed Logins</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={failedAttempts}
                    onChange={(e) => setFailedAttempts(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-white border border-cyan-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-code font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Login Time</label>
                  <input
                    type="time"
                    value={loginTime}
                    onChange={(e) => setLoginTime(e.target.value)}
                    className="w-full bg-white border border-cyan-200 rounded-lg px-2.5 py-1.5 text-slate-900 font-code font-bold text-xs"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="chk-newdev"
                    checked={newDevice === 1}
                    onChange={(e) => setNewDevice(e.target.checked ? 1 : 0)}
                    className="rounded border-cyan-300 bg-white text-cyan-600 focus:ring-cyan-500"
                  />
                  <label htmlFor="chk-newdev" className="text-slate-700 font-medium cursor-pointer">
                    Flag as New Device
                  </label>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="chk-newloc"
                    checked={newLocation === 1}
                    onChange={(e) => setNewLocation(e.target.checked ? 1 : 0)}
                    className="rounded border-cyan-300 bg-white text-cyan-600 focus:ring-cyan-500"
                  />
                  <label htmlFor="chk-newloc" className="text-slate-700 font-medium cursor-pointer">
                    Flag as New Location
                  </label>
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <button
              id="predict-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold font-tech text-white cyber-btn-primary disabled:opacity-50 transition-all flex items-center justify-center space-x-2 shadow-md shadow-cyan-500/25"
            >
              <Cpu className="w-5 h-5" />
              <span>{loading ? 'EVALUATING ML CIRCUIT BUS...' : 'EVALUATE RISK & REQUEST ACCESS'}</span>
            </button>

          </form>
        </div>

        {/* Prediction Results Display Column */}
        <div className="lg:col-span-5 space-y-6">
          {prediction ? (
            <div className="cyber-card p-6 rounded-2xl border border-cyan-200/90 bg-white/95 space-y-6 shadow-sm">
              
              {/* Decision Banner */}
              <div
                className={`p-5 rounded-2xl border flex items-center space-x-4 shadow-xs ${
                  prediction.accessDecision === 'GRANT'
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50/80 border-rose-300 text-rose-900'
                }`}
              >
                {prediction.accessDecision === 'GRANT' ? (
                  <CheckCircle className="w-10 h-10 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-10 h-10 text-rose-600 shrink-0" />
                )}
                <div>
                  <span className="text-[10px] uppercase font-code tracking-widest block font-bold opacity-80">
                    ML ACCESS DECISION
                  </span>
                  <h3 className="text-2xl font-bold font-tech tracking-tight">
                    ACCESS {prediction.accessDecision}ED
                  </h3>
                  <p className="text-xs mt-0.5 opacity-90 font-medium">
                    {prediction.accessDecision === 'GRANT'
                      ? `Temporary token generated for ${prediction.durationGrantedMinutes} minutes.`
                      : `Request blocked: High risk threshold or anomaly detected.`}
                  </p>
                </div>
              </div>

              {/* Risk Meter Bar */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-cyan-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold font-tech text-slate-700 uppercase tracking-wide">Assessed Risk Score</span>
                  <span
                    className={`font-code font-bold text-sm ${
                      prediction.riskScore >= 45 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {prediction.riskScore.toFixed(1)} / 100
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      prediction.riskScore >= 45 ? 'bg-gradient-to-r from-amber-500 to-rose-600' : 'bg-gradient-to-r from-teal-400 to-emerald-500'
                    }`}
                    style={{ width: `${prediction.riskScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Dual Model Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                
                {/* Random Forest Box */}
                <div className="p-3.5 bg-cyan-50/60 rounded-xl border border-cyan-200 shadow-xs">
                  <span className="text-[10px] text-cyan-800 font-code font-bold block">
                    RANDOM FOREST
                  </span>
                  <p className="font-bold font-tech text-slate-900 text-sm mt-1">
                    {prediction.rfPrediction} ({prediction.rfConfidence}% conf)
                  </p>
                  <span className="text-[10px] text-slate-500 font-sans">Supervised Policy Engine</span>
                </div>

                {/* Isolation Forest Box */}
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 shadow-xs">
                  <span className="text-[10px] text-amber-800 font-code font-bold block">
                    ISOLATION FOREST
                  </span>
                  <p className="font-bold font-tech text-slate-900 text-sm mt-1">
                    {prediction.isAnomaly ? '🚨 ANOMALY' : '✅ NORMAL'}
                  </p>
                  <span className="text-[10px] text-slate-500 font-sans">Attack: {prediction.attackType}</span>
                </div>

              </div>

              {/* Identified Risk Factors */}
              <div>
                <h4 className="text-xs font-bold font-tech text-slate-800 uppercase tracking-wide mb-2 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>ML Risk Factor Analysis:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-cyan-100 font-sans">
                  {prediction.riskFactors.map((factor, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-cyan-600 font-bold font-code">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Granted Countdown Token */}
              {prediction.accessDecision === 'GRANT' && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-3 text-xs text-emerald-900 shadow-xs">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                    <Clock className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <span className="font-bold font-tech text-sm text-emerald-950 block">Zero Standing Privilege Active Token</span>
                    <span className="text-emerald-800">Ephemeral access auto-expires in {prediction.durationGrantedMinutes} mins. No permanent access granted.</span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="cyber-card border border-dashed border-cyan-200 rounded-2xl p-8 text-center text-slate-500 min-h-[380px] flex flex-col items-center justify-center space-y-3 bg-white/60">
              <div className="p-4 bg-cyan-50 rounded-2xl text-cyan-600 border border-cyan-200">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold font-tech text-slate-800 uppercase tracking-wide">
                Awaiting Access Parameters
              </h3>
              <p className="text-xs max-w-xs text-slate-500 font-sans">
                Fill out the request parameters and click "Evaluate Risk & Request Access" to trigger real-time Random Forest & Isolation Forest ML inference.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
