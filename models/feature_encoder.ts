import { AccessRequestInput, DatasetRow } from '../src/types.js';

export interface EncodedFeatures {
  vector: number[];
  featureNames: string[];
}

export class FeatureEncoder {
  // Category maps
  static roles = ['Software Engineer', 'System Admin', 'DevOps Engineer', 'HR Specialist', 'Financial Analyst', 'Security Officer'];
  static accountTypes = ['Standard', 'Privileged', 'Admin', 'Service'];
  static locations = ['HQ-NewYork', 'Remote-Boston', 'Offshore-India', 'Unknown-IP'];
  static devices = ['Corporate-Laptop', 'Personal-Phone', 'Unknown-Linux', 'BYOD-MacBook'];
  static authMethods = ['Password+MFA', 'Hardware-Key', 'Password-Only'];
  static privileges = ['Read-Only', 'Write', 'Admin-Root', 'Execute'];
  static frequencies = ['Daily', 'Weekly', 'First-Time', 'Rare'];

  static encode(input: AccessRequestInput): number[] {
    const roleIdx = this.roles.indexOf(input.Role);
    const accountIdx = this.accountTypes.indexOf(input.Account_Type);
    const locationIdx = this.locations.indexOf(input.Login_Location);
    const deviceIdx = this.devices.indexOf(input.Device_Type);
    const authIdx = this.authMethods.indexOf(input.Authentication_Method);
    const privilegeIdx = this.privileges.indexOf(input.Requested_Privilege);
    const freqIdx = this.frequencies.indexOf(input.Access_Frequency);

    // Time parse (hour of day 0-23)
    const hour = parseInt(input.Login_Time.split(':')[0] || '12', 10);
    const isOffHours = hour < 7 || hour > 19 ? 1 : 0;

    return [
      roleIdx >= 0 ? roleIdx : 0,
      accountIdx >= 0 ? accountIdx : 0,
      hour,
      isOffHours,
      locationIdx >= 0 ? locationIdx : 3,
      deviceIdx >= 0 ? deviceIdx : 2,
      authIdx >= 0 ? authIdx : 2,
      input.Failed_Login_Attempts,
      privilegeIdx >= 0 ? privilegeIdx : 0,
      input.Requested_Duration / 60, // duration in hours
      input.Temporary_Access === 'Yes' ? 1 : 0,
      freqIdx >= 0 ? freqIdx : 2,
      input.Session_Duration / 60,
      input.New_Device,
      input.New_Location,
    ];
  }

  static getFeatureNames(): string[] {
    return [
      'Role_Code',
      'Account_Type_Code',
      'Login_Hour',
      'Is_Off_Hours',
      'Location_Code',
      'Device_Code',
      'Auth_Method_Code',
      'Failed_Logins',
      'Privilege_Code',
      'Requested_Duration_Hours',
      'Temporary_Access',
      'Frequency_Code',
      'Session_Duration_Hours',
      'New_Device',
      'New_Location',
    ];
  }
}
