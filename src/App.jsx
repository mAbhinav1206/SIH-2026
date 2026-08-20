import { useState, useCallback } from 'react';
import AppShell from './components/layout/AppShell';
import Login from './components/screens/Login';
import ScreeningDashboard from './components/screens/ScreeningDashboard';
import WorkerRegistration from './components/screens/WorkerRegistration';
import SymptomExposureAssessment from './components/screens/SymptomExposureAssessment';
import XRayUpload from './components/screens/XRayUpload';
import DoctorWorklist from './components/screens/DoctorWorklist';
import ClinicalReview from './components/screens/ClinicalReview';
import ReferralConfirmation from './components/screens/ReferralConfirmation';
import CaseTracking from './components/screens/CaseTracking';
import CompensationCaseFile from './components/screens/CompensationCaseFile';
import AdministratorDashboard from './components/screens/AdministratorDashboard';
import ToastContainer from './components/primitives/Toast';
import { useConnectivity } from './hooks/useConnectivity';
import { useToast } from './hooks/useToast';
import { mockWorkers, mockWorkplaces, mockStats, compensationDocuments } from './data/mockData';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [workers, setWorkers] = useState(mockWorkers);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [screeningData, setScreeningData] = useState(null);
  const { isOnline, queueCount, queueForSync } = useConnectivity();
  const { toasts, addToast, removeToast } = useToast();

  const navigate = useCallback((screen, worker) => {
    setCurrentScreen(screen);
    if (worker) setSelectedWorker(worker);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'doctor') {
      setCurrentScreen('worklist');
    } else if (userData.role === 'admin') {
      setCurrentScreen('admin-dashboard');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
    setSelectedWorker(null);
    setScreeningData(null);
  };

  const handleCaseClick = (worker) => {
    setSelectedWorker(worker);
    if (user?.role === 'doctor') {
      setCurrentScreen('clinical-review');
    } else {
      setCurrentScreen('case-tracking');
    }
  };

  const handleRegistrationSubmit = (data) => {
    const newWorker = {
      ...data,
      riskLevel: 'pending',
      status: 'registered',
      registeredDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString(),
      symptoms: {},
      exposure: {
        silica: data.silica,
        asbestos: data.asbestos,
        coal: data.coal,
        yearsOfExposure: parseInt(data.yearsExposed) || 0,
        ppe: data.ppe,
        ventilation: data.ventilation,
      },
      aiFindings: null,
      doctorDecision: null,
      referral: null,
      timeline: [
        { stage: 'registered', date: new Date().toISOString(), by: user?.name || 'ANM Staff' },
      ],
    };
    setWorkers((prev) => [newWorker, ...prev]);
    setSelectedWorker(newWorker);
    setScreeningData({ name: data.name, id: data.id, exposure: newWorker.exposure });
    setCurrentScreen('symptom-assessment');
    addToast('Worker registered successfully', 'success');
  };

  const handleSymptomSubmit = (risk, symptoms) => {
    setScreeningData((prev) => ({ ...prev, symptoms, risk }));
    setCurrentScreen('xray-upload');
  };

  const handleXRayComplete = (aiResult) => {
    setScreeningData((prev) => ({ ...prev, aiResult }));
    if (selectedWorker) {
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === selectedWorker.id
            ? {
                ...w,
                status: 'ai_reviewed',
                aiFindings: aiResult,
                riskLevel: aiResult.overallRisk,
                lastActivity: new Date().toISOString(),
                timeline: [
                  ...w.timeline,
                  { stage: 'xray_uploaded', date: new Date().toISOString(), by: user?.name || 'ANM Staff' },
                  { stage: 'ai_reviewed', date: new Date().toISOString(), by: 'AI System' },
                ],
              }
            : w
        )
      );
    }
    if (user?.role === 'doctor') {
      setCurrentScreen('worklist');
    } else {
      setCurrentScreen('case-tracking');
      addToast('AI screening complete. Sent for clinical review.', 'success');
    }
  };

  const handleClinicalReview = (review) => {
    if (selectedWorker) {
      const decisionType =
        review.decision === 'no_abnormality'
          ? 'no_abnormality'
          : review.decision === 'tb'
          ? 'tb'
          : review.decision === 'silicosis'
          ? 'silicosis'
          : review.decision === 'both'
          ? 'both'
          : 'other';

      setWorkers((prev) =>
        prev.map((w) =>
          w.id === selectedWorker.id
            ? {
                ...w,
                status: decisionType === 'no_abnormality' ? 'doctor_reviewed' : 'referred',
                doctorDecision: review.decision,
                referral: decisionType !== 'no_abnormality'
                  ? {
                      destination:
                        decisionType === 'tb'
                          ? 'District TB Centre, Banaskantha'
                          : decisionType === 'silicosis'
                          ? 'Occupational Health Specialist, Civil Hospital'
                          : 'District TB Centre + Occupational Health Unit',
                      priority: 'high',
                      status: 'scheduled',
                      date: '2026-08-25',
                    }
                  : null,
                lastActivity: new Date().toISOString(),
                timeline: [
                  ...w.timeline,
                  { stage: 'doctor_reviewed', date: new Date().toISOString(), by: user?.name || 'Doctor' },
                  ...(decisionType !== 'no_abnormality'
                    ? [{ stage: 'referred', date: new Date().toISOString(), by: 'System' }]
                    : []),
                ],
              }
            : w
        )
      );

      if (decisionType !== 'no_abnormality') {
        setCurrentScreen('referral');
      } else {
        setCurrentScreen('case-tracking');
        addToast('Clinical review submitted', 'success');
      }
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <Login onLogin={handleLogin} isOnline={isOnline} queueCount={queueCount} />;

      case 'dashboard':
        return (
          <ScreeningDashboard
            workers={workers}
            stats={mockStats.worker}
            onNavigate={navigate}
            onCaseClick={handleCaseClick}
          />
        );

      case 'register':
        return (
          <WorkerRegistration
            onSubmit={handleRegistrationSubmit}
            onBack={() => navigate('dashboard')}
            existingWorkers={workers}
          />
        );

      case 'symptom-assessment':
        return (
          <SymptomExposureAssessment
            worker={screeningData}
            onSubmit={handleSymptomSubmit}
            onBack={() => navigate('register')}
          />
        );

      case 'xray-upload':
        return (
          <XRayUpload
            worker={{ ...selectedWorker, ...screeningData }}
            onComplete={handleXRayComplete}
            onBack={() => navigate('symptom-assessment')}
          />
        );

      case 'worklist':
        return (
          <DoctorWorklist
            workers={workers.filter((w) => !w.doctorDecision || w.status === 'ai_reviewed')}
            onCaseClick={handleCaseClick}
          />
        );

      case 'clinical-review':
        return (
          <ClinicalReview
            worker={selectedWorker}
            onSubmit={handleClinicalReview}
            onBack={() => navigate('worklist')}
            addToast={addToast}
          />
        );

      case 'referral':
        return (
          <ReferralConfirmation
            worker={selectedWorker}
            referralDecision={selectedWorker?.doctorDecision}
            onNavigate={navigate}
            onBack={() => navigate('dashboard')}
          />
        );

      case 'case-tracking':
        return (
          <CaseTracking
            worker={selectedWorker}
            onBack={() =>
              user?.role === 'doctor'
                ? navigate('worklist')
                : user?.role === 'admin'
                ? navigate('admin-dashboard')
                : navigate('dashboard')
            }
            onNavigate={navigate}
          />
        );

      case 'compensation':
        return (
          <CompensationCaseFile
            worker={selectedWorker}
            documents={compensationDocuments}
            onBack={() => navigate('case-tracking')}
            addToast={addToast}
          />
        );

      case 'admin-dashboard':
        return (
          <AdministratorDashboard
            stats={mockStats.admin}
            workplaces={mockWorkplaces}
            onNavigate={navigate}
            onCaseClick={handleCaseClick}
          />
        );

      default:
        return <div>Screen not found</div>;
    }
  };

  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} isOnline={isOnline} queueCount={queueCount} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  return (
    <>
      <AppShell
        user={user}
        isOnline={isOnline}
        queueCount={queueCount}
        onLogout={handleLogout}
        currentScreen={currentScreen}
        onNavigate={navigate}
      >
        {renderScreen()}
      </AppShell>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
