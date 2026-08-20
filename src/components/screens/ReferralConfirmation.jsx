import { CheckCircle, MapPin, Calendar, ArrowRight, Printer, Share2 } from 'lucide-react';
import RiskBadge from '../primitives/RiskBadge';

const referralDestinations = {
  silicosis: 'Occupational Health Specialist, Civil Hospital',
  tb: 'District TB Centre, Banaskantha',
  both: 'District TB Centre + Occupational Health Unit',
  other: 'General Medicine, District Hospital',
};

const referralPriorities = {
  silicosis: 'moderate',
  tb: 'high',
  both: 'high',
  other: 'moderate',
};

export default function ReferralConfirmation({ worker, referralDecision, onNavigate, onBack }) {
  const destination = referralDestinations[referralDecision] || referralDestinations.other;
  const priority = referralPriorities[referralDecision] || 'moderate';
  const caseId = worker?.id || 'WRK-2026-XXX';

  const stepperStages = [
    { label: 'Referral Created', status: 'completed', date: '20 Aug 2026, 10:30 AM' },
    { label: 'Awaiting Appointment', status: 'current', date: 'Pending' },
    { label: 'Appointment Scheduled', status: 'pending', date: null },
    { label: 'Consultation Completed', status: 'pending', date: null },
  ];

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-1">Referral Created</h2>
          <p className="text-sm text-text-secondary">Case has been referred for clinical evaluation</p>
        </div>

        {/* Receipt-style Details */}
        <div className="border border-border rounded-xl overflow-hidden mb-6">
          <div className="p-4 bg-surface-secondary border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Case Reference</span>
              <span className="text-sm font-bold text-text-primary font-mono">{caseId}</span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Patient</span>
              <span className="font-medium text-text-primary">{worker?.name || 'Worker'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Priority</span>
              <RiskBadge level={priority} size="sm" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Destination
              </span>
              <span className="font-medium text-text-primary text-right max-w-[60%]">{destination}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Created
              </span>
              <span className="font-medium text-text-primary">20 Aug 2026, 10:30 AM</span>
            </div>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Referral Status</h3>
          <div className="space-y-0">
            {stepperStages.map((stage, index) => (
              <div key={stage.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      stage.status === 'completed'
                        ? 'bg-clinical-600 text-white'
                        : stage.status === 'current'
                        ? 'bg-clinical-100 border-2 border-clinical-600 text-clinical-700'
                        : 'bg-gray-100 border border-gray-200 text-gray-400'
                    }`}
                  >
                    {stage.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-[10px] font-bold">{index + 1}</span>
                    )}
                  </div>
                  {index < stepperStages.length - 1 && (
                    <div className={`w-0.5 h-8 ${stage.status === 'completed' ? 'bg-clinical-600' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="pb-6">
                  <p className={`text-sm font-medium ${
                    stage.status === 'pending' ? 'text-text-muted' : 'text-text-primary'
                  }`}>
                    {stage.label}
                  </p>
                  {stage.date && (
                    <p className="text-xs text-text-muted">{stage.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate?.('case-tracking')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 transition-colors"
          >
            Track Case
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-3 bg-white border border-border rounded-xl text-text-secondary hover:bg-gray-50 transition-colors">
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white border border-border rounded-xl text-text-secondary hover:bg-gray-50 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full mt-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary text-center"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
