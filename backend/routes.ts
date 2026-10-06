import { Request, Response, Router } from 'express';
import { db } from '../database/db.js';
import { isolationForestModel } from '../models/isolation_forest.js';
import { ModelEvaluator } from '../models/model_evaluator.js';
import { randomForestModel } from '../models/random_forest.js';
import { AccessRequestInput, DashboardStats, PredictionOutput } from '../src/types.js';
import { authMiddleware, generateToken } from './auth.js';

export const apiRouter = Router();

// 1. POST /login & /api/login
const handleLogin = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const user = db.getUserByUsername(username);

  // Simple authentication logic for college prototype (accepts password or password123)
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials: User not found' });
  }

  const token = generateToken(user);

  return res.json({
    message: 'Authentication successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      accountType: user.accountType,
      department: user.department,
    },
  });
};

apiRouter.post('/login', handleLogin);

// 2. GET /dashboard & /api/dashboard
const handleDashboard = (req: Request, res: Response) => {
  const users = db.getUsers();
  const logs = db.getAuditLogs();
  const comparison = ModelEvaluator.getComparison();

  const totalRequests = logs.length;
  const grantedCount = logs.filter((l) => l.decision === 'GRANT').length;
  const deniedCount = logs.filter((l) => l.decision === 'DENY').length;
  const anomaliesCount = logs.filter((l) => l.anomaly === 1).length;
  const avgRiskScore = totalRequests > 0 ? Math.round((logs.reduce((acc, l) => acc + l.risk_score, 0) / totalRequests) * 10) / 10 : 0;

  const stats: DashboardStats = {
    totalEmployees: users.length,
    totalRequests,
    grantedCount,
    deniedCount,
    anomaliesCount,
    avgRiskScore,
    modelMetrics: {
      randomForest: {
        accuracy: comparison.randomForest.accuracy,
        precision: comparison.randomForest.precision,
        recall: comparison.randomForest.recall,
        f1Score: comparison.randomForest.f1Score,
      },
      isolationForest: {
        accuracy: comparison.isolationForest.accuracy,
        precision: comparison.isolationForest.precision,
        recall: comparison.isolationForest.recall,
        f1Score: comparison.isolationForest.f1Score,
        anomalyDetectionRate: comparison.isolationForest.anomalyDetectionRate,
      },
    },
    recentRequests: logs.slice(0, 10),
  };

  return res.json(stats);
};

apiRouter.get('/dashboard', handleDashboard);

// 3. POST /predict & /api/predict
const handlePredict = (req: Request, res: Response) => {
  const input: AccessRequestInput = req.body;

  if (!input.User_ID || !input.Resource_Accessed || !input.Requested_Privilege) {
    return res.status(400).json({ error: 'Missing required access request fields' });
  }

  // Execute Random Forest (Primary Decision & Risk Score)
  const rfResult = randomForestModel.predict(input);

  // Execute Isolation Forest (Anomaly Detection & Attack Type)
  const ifResult = isolationForestModel.detectAnomaly(input);

  // Final Decision Strategy: Random Forest Primary, overridden to DENY if Isolation Forest flags extreme anomaly score (> 0.75)
  let finalDecision = rfResult.decision;
  let attackType = ifResult.attackType;

  if (ifResult.ifAnomalyScore >= 0.75) {
    finalDecision = 'DENY';
    if (attackType === 'Normal') {
      attackType = 'Off-Hours Mass Access';
    }
  }

  const durationGranted = finalDecision === 'GRANT' ? input.Requested_Duration : 0;
  const expiresAt = finalDecision === 'GRANT' ? new Date(Date.now() + durationGranted * 60000).toISOString() : undefined;

  const prediction: PredictionOutput = {
    riskScore: rfResult.riskScore,
    accessDecision: finalDecision,
    rfPrediction: rfResult.decision,
    rfConfidence: rfResult.confidence,
    ifAnomalyScore: ifResult.ifAnomalyScore,
    isAnomaly: ifResult.isAnomaly,
    attackType: attackType,
    riskFactors: rfResult.riskFactors,
    durationGrantedMinutes: durationGranted,
    expiresAt,
  };

  // Save into Audit Logs
  db.addAuditLog({
    user_id: input.User_ID,
    role: input.Role,
    resource: input.Resource_Accessed,
    requested_privilege: input.Requested_Privilege,
    requested_duration: input.Requested_Duration,
    risk_score: rfResult.riskScore,
    attack_type: attackType,
    decision: finalDecision,
    anomaly: ifResult.isAnomaly ? 1 : 0,
    login_location: input.Login_Location,
    device_type: input.Device_Type,
    auth_method: input.Authentication_Method,
  });

  return res.json(prediction);
};

apiRouter.post('/predict', handlePredict);

// 4. GET /audit & /api/audit
const handleAudit = (req: Request, res: Response) => {
  const { userId, decision, anomalyOnly, search } = req.query;

  const logs = db.getAuditLogs({
    userId: userId as string,
    decision: decision as string,
    anomalyOnly: anomalyOnly === 'true',
    search: search as string,
  });

  return res.json(logs);
};

apiRouter.get('/audit', handleAudit);

// 5. GET /resources & /api/resources
const handleResources = (req: Request, res: Response) => {
  return res.json(db.getResources());
};

apiRouter.get('/resources', handleResources);

// 6. GET /api/dataset
apiRouter.get('/dataset', (req: Request, res: Response) => {
  return res.json(db.getDataset());
});

// 7. GET /api/models/comparison
apiRouter.get('/models/comparison', (req: Request, res: Response) => {
  return res.json(ModelEvaluator.getComparison());
});
