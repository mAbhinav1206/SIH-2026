import { ArrowLeft, User, MapPin, Briefcase } from 'lucide-react';
import StepperTimeline, { HorizontalKanban } from '../primitives/StepperTimeline';
import RiskBadge from '../primitives/RiskBadge';
import StatusPill from '../primitives/StatusPill';

export default function CaseTracking({ worker, onBack, onNavigate }) {
  if (!worker) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <p className="text-text-secondary">Select a case to view its tracking timeline.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Worker Summary Card */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm mb-6">
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
          <div className="flex flex-col items-end gap-1">
            <RiskBadge level={worker.riskLevel} size="md" />
            <StatusPill status={worker.status} size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPin className="w-4 h-4 text-text-muted flex-shrink-0" />
            <span className="truncate">{worker.address}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Briefcase className="w-4 h-4 text-text-muted flex-shrink-0" />
            <span className="truncate">{worker.workplace} &middot; {worker.occupation}</span>
          </div>
        </div>
      </div>

      {/* Horizontal Kanban - Desktop */}
      <div className="hidden md:block mb-6">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Case Lifecycle</h3>
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <HorizontalKanban currentStage={worker.status} timeline={worker.timeline} />
        </div>
      </div>

      {/* Vertical Stepper - Mobile & Desktop Detail */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Case Timeline</h3>
        <StepperTimeline currentStage={worker.status} timeline={worker.timeline} />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mt-6">
        {worker.status === 'ai_reviewed' && (
          <button
            onClick={() => onNavigate?.('clinical-review')}
            className="flex-1 py-3 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors"
          >
            Review Case
          </button>
        )}
        {worker.status === 'doctor_reviewed' && (
          <button
            onClick={() => onNavigate?.('referral')}
            className="flex-1 py-3 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors"
          >
            Create Referral
          </button>
        )}
        {(worker.status === 'referred' || worker.status === 'diagnosed' || worker.status === 'documented') && (
          <button
            onClick={() => onNavigate?.('compensation')}
            className="flex-1 py-3 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors"
          >
            Compensation File
          </button>
        )}
      </div>
    </div>
  );
}
