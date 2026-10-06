export type Role = 'Software Engineer' | 'System Admin' | 'DevOps Engineer' | 'HR Specialist' | 'Financial Analyst' | 'Security Officer';
export type AccountType = 'Standard' | 'Privileged' | 'Admin' | 'Service';
export type DeviceType = 'Corporate-Laptop' | 'Personal-Phone' | 'Unknown-Linux' | 'BYOD-MacBook';
export type AuthMethod = 'Password+MFA' | 'Hardware-Key' | 'Password-Only';
export type PrivilegeLevel = 'Read-Only' | 'Write' | 'Admin-Root' | 'Execute';
export type AccessDecision = 'GRANT' | 'DENY';
export type AttackType = 'Normal' | 'Privilege Escalation' | 'Credential Stuffing' | 'Impossible Travel' | 'Off-Hours Mass Access' | 'Unauthorized Resource Access';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  accountType: AccountType;
  department: string;
  token?: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: string;
  baselineRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  requiredPrivilege: PrivilegeLevel;
  description: string;
}

export interface AccessRequestInput {
  User_ID: string;
  Role: Role;
  Account_Type: AccountType;
  Login_Time: string; // e.g. "09:15" or "02:30"
  Login_Location: string; // e.g. "HQ-NewYork", "Remote-Boston", "Offshore-India", "Unknown-IP"
  Device_Type: DeviceType;
  Authentication_Method: AuthMethod;
  Failed_Login_Attempts: number;
  Resource_Accessed: string;
  Requested_Privilege: PrivilegeLevel;
  Requested_Duration: number; // in minutes e.g. 15, 60, 240
  Temporary_Access: 'Yes' | 'No';
  Access_Frequency: 'Daily' | 'Weekly' | 'First-Time' | 'Rare';
  Session_Duration: number; // in minutes
  New_Device: 0 | 1;
  New_Location: 0 | 1;
}

export interface DatasetRow extends AccessRequestInput {
  Risk_Score: number; // 0 to 100
  Access_Decision: AccessDecision;
  Attack_Type: AttackType;
  Anomaly: 0 | 1; // 0 = Normal, 1 = Anomaly
}

export interface PredictionOutput {
  riskScore: number;
  accessDecision: AccessDecision;
  rfPrediction: AccessDecision;
  rfConfidence: number;
  ifAnomalyScore: number;
  isAnomaly: boolean;
  attackType: AttackType;
  riskFactors: string[];
  durationGrantedMinutes?: number;
  expiresAt?: string;
}

export interface AuditLogItem {
  id: string;
  user_id: string;
  role: Role;
  resource: string;
  requested_privilege: PrivilegeLevel;
  requested_duration: number;
  risk_score: number;
  attack_type: AttackType;
  decision: AccessDecision;
  anomaly: 0 | 1;
  timestamp: string;
  login_location: string;
  device_type: DeviceType;
  auth_method: AuthMethod;
}

export interface DashboardStats {
  totalEmployees: number;
  totalRequests: number;
  grantedCount: number;
  deniedCount: number;
  anomaliesCount: number;
  avgRiskScore: number;
  modelMetrics: {
    randomForest: {
      accuracy: number;
      precision: number;
      recall: number;
      f1Score: number;
    };
    isolationForest: {
      accuracy: number;
      precision: number;
      recall: number;
      f1Score: number;
      anomalyDetectionRate: number;
    };
  };
  recentRequests: AuditLogItem[];
}
