-- Zero Standing Privilege (ZSP) Framework Database Schema (MySQL)
-- Database Name: zsp_access_db

CREATE DATABASE IF NOT EXISTS zsp_access_db;
USE zsp_access_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    baseline_risk VARCHAR(20) NOT NULL,
    required_privilege VARCHAR(50) NOT NULL,
    description TEXT
);

-- 3. ML Feature Dataset Table (Cleaned & Feature Engineered)
CREATE TABLE IF NOT EXISTS ml_dataset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    User_ID VARCHAR(50) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    Account_Type VARCHAR(50) NOT NULL,
    Login_Time VARCHAR(10) NOT NULL,
    Login_Location VARCHAR(50) NOT NULL,
    Device_Type VARCHAR(50) NOT NULL,
    Authentication_Method VARCHAR(50) NOT NULL,
    Failed_Login_Attempts INT DEFAULT 0,
    Resource_Accessed VARCHAR(100) NOT NULL,
    Requested_Privilege VARCHAR(50) NOT NULL,
    Requested_Duration INT NOT NULL,
    Temporary_Access VARCHAR(10) DEFAULT 'Yes',
    Access_Frequency VARCHAR(20) NOT NULL,
    Session_Duration INT NOT NULL,
    New_Device TINYINT(1) DEFAULT 0,
    New_Location TINYINT(1) DEFAULT 0,
    Risk_Score FLOAT NOT NULL,
    Access_Decision VARCHAR(20) NOT NULL,
    Attack_Type VARCHAR(50) NOT NULL,
    Anomaly TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Access Requests & Temporary Permissions Table (Zero Standing Privilege Engine)
CREATE TABLE IF NOT EXISTS access_requests (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    requested_privilege VARCHAR(50) NOT NULL,
    requested_duration INT NOT NULL, -- duration in minutes
    risk_score FLOAT NOT NULL,
    rf_prediction VARCHAR(20) NOT NULL,
    if_anomaly_score FLOAT NOT NULL,
    is_anomaly TINYINT(1) DEFAULT 0,
    decision VARCHAR(20) NOT NULL, -- GRANT / DENY
    granted_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    requested_privilege VARCHAR(50) NOT NULL,
    requested_duration INT NOT NULL,
    risk_score FLOAT NOT NULL,
    attack_type VARCHAR(50) NOT NULL,
    decision VARCHAR(20) NOT NULL,
    anomaly TINYINT(1) DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_location VARCHAR(50) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    auth_method VARCHAR(50) NOT NULL
);

-- Indexes for optimized querying
CREATE INDEX idx_user_id ON audit_logs(user_id);
CREATE INDEX idx_decision ON audit_logs(decision);
CREATE INDEX idx_anomaly ON audit_logs(anomaly);
CREATE INDEX idx_timestamp ON audit_logs(timestamp);
