import { useState } from 'react';
import { ArrowLeft, AlertTriangle, Check, Send, User, MapPin, Briefcase, FileText } from 'lucide-react';
import RiskBadge from '../primitives/RiskBadge';
import StatusPill from '../primitives/StatusPill';
import { symptomLabels } from '../../data/mockData';

export default function ClinicalReview({ worker, onSubmit, onBack, addToast }) {
  const [decision, setDecision] = useState(null);
  const [notes, setNotes] = useState('');
  const [showDisagreement, setShowDisagreement] = useState(false);

  const decisions = [
    { id: 'no_abnormality', label: 'No abnormality detected', description: 'Findings are within normal limits' },
    { id: 'silicosis', label: 'Silicosis evaluation required', description: 'Refer to occupational health specialist' },
    { id: 'tb', label: 'TB evaluation required', description: 'Refer to District TB Centre' },
    { id: 'both', label: 'Both silicosis and TB evaluation', description: 'Dual referral needed' },
    { id: 'other', label: 'Other findings', description: 'Specify in clinical notes' },
  ];

  const activeSymptoms = worker.symptoms
    ? Object.entries(worker.symptoms)
        .filter(([_, v]) => v)
        .map(([k]) => symptomLabels[k] || k)
    : [];

  const handleDecisionSelect = (id) => {
    setDecision(id);
    // Check for disagreement
    if (
      id === 'no_abnormality' &&
      worker.aiFindings &&
      worker.aiFindings.overallRisk !== 'low'
    ) {
      setShowDisagreement(true);
    } else {
      setShowDisagreement(false);
    }
  };

  const handleSubmit = () => {
    if (!decision || !notes.trim()) return;
    onSubmit({
      decision,
      notes,
      disagreesWithAI: showDisagreement,
    });
    addToast?.('Clinical review submitted successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Worklist
      </button>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Worker Info + AI Findings */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-clinical-50 flex items-center justify-center">
                  <User className="w-6 h-6 text-clinical-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary">{worker.name}</h2>
                  <p className="text-xs text-text-secondary">{worker.id} &middot; {worker.age}y {worker.gender}</p>
                </div>
              </div>
              <RiskBadge level={worker.riskLevel} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">{worker.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary">{worker.occupation} &middot; {worker.yearsExposed}y</span>
              </div>
            </div>

            {activeSymptoms.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Reported Symptoms</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeSymptoms.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-clinical-50 text-clinical-700 border border-clinical-200 rounded text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Findings Side-by-Side */}
          {worker.aiFindings && (
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-semibold text-text-primary">AI Screening Findings</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
                  <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Silicosis-related</p>
                  <p className={`text-sm font-medium ${
                    worker.aiFindings.silicosis.status.includes('No') ? 'text-green-700' : 'text-amber-700'
                  }`}>
                    {worker.aiFindings.silicosis.status}
                  </p>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {worker.aiFindings.silicosis.details}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                  <p className="text-xs font-semibold text-red-800 uppercase tracking-wide mb-1">TB-related</p>
                  <p className={`text-sm font-medium ${
                    worker.aiFindings.tb.status.includes('No') ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {worker.aiFindings.tb.status}
                  </p>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {worker.aiFindings.tb.details}
                  </p>
                </div>
              </div>

              {/* Simulated X-ray image area */}
              <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-text-muted">Chest X-ray Image</span>
                </div>
                <p className="text-xs text-text-muted mt-2">PA View &middot; {worker.id}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Decision Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm sticky top-20">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Clinical Decision</h3>

            <div className="space-y-2 mb-4">
              {decisions.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDecisionSelect(d.id)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                    decision === d.id
                      ? 'border-clinical-500 bg-clinical-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-sm font-medium text-text-primary">{d.label}</p>
                  <p className="text-xs text-text-secondary">{d.description}</p>
                </button>
              ))}
            </div>

            {showDisagreement && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 animate-slide-up">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-semibold text-amber-800">AI Disagreement Flag</p>
                </div>
                <p className="text-xs text-amber-700">
                  The AI system flagged this case as {worker.aiFindings?.overallRisk} risk, but you've selected "No abnormality." This will be flagged for supervisory review.
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Clinical Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your clinical observations and rationale..."
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500 resize-none placeholder:text-text-muted"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!decision || !notes.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
