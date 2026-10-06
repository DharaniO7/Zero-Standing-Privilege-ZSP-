import { AuditLogItem, DatasetRow, ResourceItem, User } from '../src/types.js';
import { AVAILABLE_RESOURCES, INITIAL_USERS, SEED_DATASET } from './seed_data.js';

class DatabaseEngine {
  private users: User[] = [...INITIAL_USERS];
  private resources: ResourceItem[] = [...AVAILABLE_RESOURCES];
  private dataset: DatasetRow[] = [...SEED_DATASET];
  private auditLogs: AuditLogItem[] = [];

  constructor() {
    // Generate initial audit logs from seed dataset
    this.auditLogs = this.dataset.map((item, idx) => ({
      id: `AUD-${1000 + idx}`,
      user_id: item.User_ID,
      role: item.Role,
      resource: item.Resource_Accessed,
      requested_privilege: item.Requested_Privilege,
      requested_duration: item.Requested_Duration,
      risk_score: item.Risk_Score,
      attack_type: item.Attack_Type,
      decision: item.Access_Decision,
      anomaly: item.Anomaly,
      timestamp: new Date(Date.now() - (15 - idx) * 3600000).toISOString(),
      login_location: item.Login_Location,
      device_type: item.Device_Type,
      auth_method: item.Authentication_Method,
    }));
  }

  // Users
  getUsers(): User[] {
    return this.users;
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  // Resources
  getResources(): ResourceItem[] {
    return this.resources;
  }

  // Dataset
  getDataset(): DatasetRow[] {
    return this.dataset;
  }

  addDatasetRow(row: DatasetRow): void {
    this.dataset.unshift(row);
  }

  // Audit Logs
  getAuditLogs(query?: {
    userId?: string;
    decision?: string;
    anomalyOnly?: boolean;
    search?: string;
  }): AuditLogItem[] {
    let logs = [...this.auditLogs];

    if (query?.userId) {
      logs = logs.filter((l) => l.user_id === query.userId);
    }
    if (query?.decision) {
      logs = logs.filter((l) => l.decision === query.decision);
    }
    if (query?.anomalyOnly) {
      logs = logs.filter((l) => l.anomaly === 1);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.user_id.toLowerCase().includes(q) ||
          l.role.toLowerCase().includes(q) ||
          l.resource.toLowerCase().includes(q) ||
          l.attack_type.toLowerCase().includes(q)
      );
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addAuditLog(log: Omit<AuditLogItem, 'id' | 'timestamp'>): AuditLogItem {
    const newLog: AuditLogItem = {
      ...log,
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);

    // Also sync to dataset table
    this.addDatasetRow({
      User_ID: log.user_id,
      Role: log.role,
      Account_Type: 'Standard',
      Login_Time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      Login_Location: log.login_location,
      Device_Type: log.device_type,
      Authentication_Method: log.auth_method,
      Failed_Login_Attempts: 0,
      Resource_Accessed: log.resource,
      Requested_Privilege: log.requested_privilege,
      Requested_Duration: log.requested_duration,
      Temporary_Access: 'Yes',
      Access_Frequency: 'Daily',
      Session_Duration: log.requested_duration,
      New_Device: 0,
      New_Location: 0,
      Risk_Score: log.risk_score,
      Access_Decision: log.decision,
      Attack_Type: log.attack_type,
      Anomaly: log.anomaly,
    });

    return newLog;
  }
}

export const db = new DatabaseEngine();
