import { useState } from 'react';
import { ArrowLeft, Check, X, FileText, ChevronDown, ChevronUp, Download, Clock, User } from 'lucide-react';
import RiskBadge from '../primitives/RiskBadge';

export default function CompensationCaseFile({ worker, documents, onBack, addToast }) {
  const [auditOpen, setAuditOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const completedCount = documents.filter((d) => d.status === 'complete').length;
  const totalCount = documents.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const allComplete = completedCount === totalCount;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      addToast?.('Case file generated successfully', 'success');
    }, 2000);
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Compensation Case File</h2>
            <p className="text-xs text-text-secondary font-mono">{worker?.id || 'WRK-2026-XXX'}</p>
          </div>
          <RiskBadge level={worker?.riskLevel || 'high'} size="md" />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-text-muted" />
          <span className="text-sm text-text-primary font-medium">{worker?.name || 'Worker'}</span>
          <span className="text-xs text-text-muted">&middot; {worker?.workplace}</span>
        </div>

        {/* Progress */}
        <div className="p-3 bg-surface-secondary rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-secondary">Document Progress</span>
            <span className="text-xs font-bold text-text-primary">{completedCount}/{totalCount} completed</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                allComplete ? 'bg-green-500' : 'bg-clinical-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Document Checklist */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm mb-4">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Document Checklist</h3>

        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                doc.status === 'complete'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  doc.status === 'complete'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-100 text-red-500 border border-red-300'
                }`}
              >
                {doc.status === 'complete' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  doc.status === 'complete' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {doc.name}
                </p>
                {doc.uploadedBy && (
                  <p className="text-[11px] text-text-muted">
                    Uploaded by {doc.uploadedBy} &middot; {doc.date}
                  </p>
                )}
              </div>
              <span className={`text-[10px] font-semibold uppercase ${
                doc.status === 'complete' ? 'text-green-600' : 'text-red-500'
              }`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generating || !allComplete}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-colors mb-4 ${
          allComplete
            ? 'bg-clinical-600 text-white hover:bg-clinical-700'
            : 'bg-gray-200 text-text-muted cursor-not-allowed'
        }`}
      >
        {generating ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating Case File...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            Generate Case File
          </>
        )}
      </button>

      {!allComplete && (
        <p className="text-xs text-center text-amber-600 mb-4">
          All documents must be complete before generating the case file.
        </p>
      )}

      {/* Audit Trail */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <button
          onClick={() => setAuditOpen(!auditOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted" />
            <span className="text-sm font-medium text-text-primary">Audit Trail</span>
          </div>
          {auditOpen ? (
            <ChevronUp className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          )}
        </button>

        {auditOpen && (
          <div className="px-4 pb-4 border-t border-border pt-3 space-y-3 animate-slide-up">
            {[
              { action: 'Registration form submitted', by: 'Priya Patel (ANM)', time: '15 Aug 2026, 10:00 AM', type: 'system' },
              { action: 'Risk screening completed', by: 'Priya Patel (ANM)', time: '15 Aug 2026, 10:15 AM', type: 'system' },
              { action: 'Chest X-ray uploaded', by: 'Priya Patel (ANM)', time: '15 Aug 2026, 11:00 AM', type: 'system' },
              { action: 'AI screening completed — High Risk flagged', by: 'AI System v1.0', time: '15 Aug 2026, 11:02 AM', type: 'ai' },
              { action: 'Clinical review — Silicosis evaluation required', by: 'Dr. Anita Desai', time: '16 Aug 2026, 02:20 PM', type: 'doctor' },
              { action: 'Referral created — District TB Centre', by: 'System', time: '17 Aug 2026, 09:00 AM', type: 'system' },
              { action: 'Aadhaar card uploaded', by: 'Admin Staff', time: '18 Aug 2026, 11:00 AM', type: 'upload' },
              { action: 'Witness statement uploaded', by: 'Admin Staff', time: '18 Aug 2026, 03:00 PM', type: 'upload' },
            ].map((entry, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-clinical-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-text-primary">{entry.action}</p>
                  <p className="text-xs text-text-muted">
                    {entry.by} &middot; {entry.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
