import { useState } from 'react';
import { ArrowRight, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import Toggle from '../primitives/Toggle';
import RiskBadge from '../primitives/RiskBadge';
import { RISK_LEVELS, symptomLabels } from '../../data/mockData';

export default function SymptomExposureAssessment({ worker, onSubmit, onBack }) {
  const [symptoms, setSymptoms] = useState({
    cough: false,
    breathlessness: false,
    chestPain: false,
    hemoptysis: false,
    weightLoss: false,
    nightSweats: false,
    fever: false,
    fatigue: false,
  });
  const [showResult, setShowResult] = useState(false);
  const [riskResult, setRiskResult] = useState(null);

  const toggleSymptom = (key) => {
    setSymptoms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeSymptoms = Object.entries(symptoms).filter(([_, v]) => v).map(([k]) => k);

  const calculateRisk = () => {
    let score = 0;
    if (symptoms.hemoptysis) score += 3;
    if (symptoms.breathlessness) score += 2;
    if (symptoms.weightLoss) score += 2;
    if (symptoms.nightSweats) score += 2;
    if (symptoms.chestPain) score += 1;
    if (symptoms.cough) score += 1;
    if (symptoms.fever) score += 1;
    if (symptoms.fatigue) score += 0.5;

    // Factor in occupational exposure
    if (worker?.exposure?.silica) score += 2;
    if (worker?.exposure?.yearsExposed > 10) score += 2;
    if (worker?.exposure?.ppe === 'never') score += 1;
    if (worker?.exposure?.ventilation === 'poor') score += 1;

    if (score >= 7) return RISK_LEVELS.HIGH;
    if (score >= 3) return RISK_LEVELS.MODERATE;
    return RISK_LEVELS.LOW;
  };

  const getRiskExplanation = () => {
    const reasons = [];
    if (symptoms.hemoptysis) reasons.push('Hemoptysis (coughing blood) is a red-flag symptom requiring urgent evaluation');
    if (symptoms.breathlessness && symptoms.chestPain) reasons.push('Respiratory symptoms suggest possible pulmonary compromise');
    if (symptoms.weightLoss && symptoms.nightSweats) reasons.push('Constitutional symptoms are consistent with TB or advanced pneumoconiosis');
    if (symptoms.fever && symptoms.nightSweats) reasons.push('Fever with night sweats raises suspicion for active tuberculosis');
    if (worker?.exposure?.silica) reasons.push('Documented silica dust exposure is a known risk factor for silicosis');
    if (worker?.exposure?.yearsExposed > 10) reasons.push(`${worker.exposure.yearsExposed} years of occupational exposure exceeds typical latency period`);
    if (worker?.exposure?.ppe === 'never') reasons.push('No personal protective equipment usage increases exposure risk');
    if (worker?.exposure?.ventilation === 'poor') reasons.push('Poor workplace ventilation compounds dust inhalation risk');
    if (reasons.length === 0) reasons.push('No significant symptoms or high-risk exposure factors identified at this time');
    return reasons;
  };

  const handleSubmit = () => {
    const risk = calculateRisk();
    setRiskResult(risk);
    setShowResult(true);
  };

  if (showResult && riskResult) {
    const reasons = getRiskExplanation();
    const isHigh = riskResult === RISK_LEVELS.HIGH;
    const isModerate = riskResult === RISK_LEVELS.MODERERATE;

    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="text-center mb-8 animate-slide-up">
            <div className="mb-4">
              <RiskBadge level={riskResult} size="xl" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-1">
              {isHigh ? 'High Risk Identified' : isModerate ? 'Moderate Risk Detected' : 'Low Risk Assessment'}
            </h2>
            <p className="text-sm text-text-secondary">
              {isHigh
                ? 'This worker requires priority evaluation and clinical review.'
                : isModerate
                ? 'This worker should be scheduled for chest imaging and clinical follow-up.'
                : 'No immediate concerns. Continue routine monitoring.'}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Why this worker is flagged</h3>
            <div className="space-y-2">
              {reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-surface-secondary rounded-lg">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isHigh ? 'bg-red-100' : isModerate ? 'bg-amber-100' : 'bg-green-100'
                    }`}
                  >
                    {isHigh ? (
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                    ) : isModerate ? (
                      <Clock className="w-3 h-3 text-amber-600" />
                    ) : (
                      <ShieldCheck className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-text-primary">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {activeSymptoms.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-text-primary mb-2">Reported symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {activeSymptoms.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 bg-clinical-50 text-clinical-700 border border-clinical-200 rounded-lg text-xs font-medium"
                  >
                    {symptomLabels[s]}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowResult(false);
                setRiskResult(null);
              }}
              className="py-3 px-5 bg-white border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
            >
              Edit Symptoms
            </button>
            <button
              onClick={() => onSubmit(riskResult, symptoms)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors"
            >
              Proceed to Chest Imaging
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const symptomGroups = [
    {
      title: 'Respiratory Symptoms',
      items: [
        { key: 'cough', label: symptomLabels.cough },
        { key: 'breathlessness', label: symptomLabels.breathlessness },
        { key: 'chestPain', label: symptomLabels.chestPain },
        { key: 'hemoptysis', label: symptomLabels.hemoptysis },
      ],
    },
    {
      title: 'Constitutional Symptoms',
      items: [
        { key: 'weightLoss', label: symptomLabels.weightLoss },
        { key: 'nightSweats', label: symptomLabels.nightSweats },
        { key: 'fever', label: symptomLabels.fever },
        { key: 'fatigue', label: symptomLabels.fatigue },
      ],
    },
  ];

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary">Symptom Assessment</h2>
        <p className="text-sm text-text-secondary">
          {worker?.name ? `Screening for ${worker.name}` : 'Complete the symptom checklist below'}
        </p>
      </div>

      <div className="space-y-6">
        {symptomGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wide">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.items.map((item) => (
                <Toggle
                  key={item.key}
                  label={item.label}
                  checked={symptoms[item.key]}
                  onChange={() => toggleSymptom(item.key)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="py-3 px-5 bg-white border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors"
        >
          Submit Assessment
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
