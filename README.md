# Zero Standing Privilege (ZSP) Framework for Secure Employee Resource Access

## 📌 Project Overview

The **Zero Standing Privilege (ZSP) Framework** is a security-focused machine learning project designed to prevent unnecessary permanent access privileges for employees.

Instead of providing users with continuous access to organizational resources, the system follows the **Zero Standing Privilege** approach, where access is granted temporarily with the minimum required privilege and can be revoked after the required duration.

The system analyzes employee access behavior and uses machine learning techniques to identify anomalous access patterns and support secure access decisions.

---

## 🎯 Objectives

- Implement a Zero Standing Privilege based access control framework.
- Provide temporary and least-privilege access to resources.
- Analyze employee access behavior and identify suspicious activities.
- Detect anomalous access requests using machine learning.
- Use risk-based analysis for access decisions.
- Maintain audit logs for monitoring and accountability.
- Reduce security risks caused by permanent privileges.

---

## 🚀 Key Features

- 🔐 Secure employee authentication
- ⏳ Temporary access privileges
- 🛡️ Least-privilege access control
- 🤖 Machine learning-based anomaly detection
- 📊 Risk score analysis
- 🌲 Random Forest classification
- 🔎 Isolation Forest anomaly detection
- 🚫 Grant/Deny access decisions
- 📝 Audit logging
- 📈 Dashboard for monitoring access activity

---

## 🧠 Machine Learning Models

### 1. Random Forest

Random Forest is used as a **supervised learning algorithm** to classify employee access behavior into:

- Normal
- Anomalous

The model learns patterns from labeled employee access data and helps in making access decisions.

### 2. Isolation Forest

Isolation Forest is used for **unsupervised anomaly detection**.

It identifies unusual employee access behavior by detecting data points that are significantly different from normal access patterns.

### Why Two Models?

Using both models provides complementary detection capabilities:

- **Random Forest** → Detects known patterns using labeled data.
- **Isolation Forest** → Identifies unusual or potentially unseen patterns.

---

## 📊 Dataset

The project uses a synthetic employee access dataset containing **3000 records**.

The dataset includes attributes related to:

- User ID
- Role
- Account Type
- Login Time
- Login Location
- Device Type
- Authentication Method
- Failed Login Attempts
- Resource Accessed
- Requested Privilege
- Requested Duration
- Temporary Access
- Access Frequency
- Session Duration
- New Device
- New Location
- Risk Score
- Access Decision
- Attack Type
- Anomaly

### Feature Engineering

Additional features are derived from login activity, including:

- Login Hour
- Login Day
- Weekend Indicator

These features help the machine learning models identify behavioral patterns.

---

## 🔄 Project Workflow

```text
Employee Access Request
          ↓
Authentication
          ↓
Collect Access Information
          ↓
Data Preprocessing
          ↓
Feature Engineering
          ↓
Risk & Behavior Analysis
          ↓
Machine Learning Models
     ↙              ↘
Random Forest    Isolation Forest
     ↘              ↙
      Anomaly Detection
              ↓
      Access Decision
       ↙            ↘
    GRANT          DENY
              ↓
        Audit Logging
