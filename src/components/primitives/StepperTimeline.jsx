import { Check, Circle, Loader2 } from 'lucide-react';
import { STAGE_LABELS, CASE_STATUSES } from '../../data/mockData';

const allStages = [
  CASE_STATUSES.REGISTERED,
  CASE_STATUSES.SCREENED,
  CASE_STATUSES.XRAY_UPLOADED,
  CASE_STATUSES.AI_REVIEWED,
  CASE_STATUSES.DOCTOR_REVIEWED,
  CASE_STATUSES.REFERRED,
  CASE_STATUSES.DIAGNOSED,
  CASE_STATUSES.DOCUMENTED,
  CASE_STATUSES.COMPENSATED,
];

export default function StepperTimeline({ currentStage, timeline = [], compact = false }) {
  const currentIndex = allStages.indexOf(currentStage);

  return (
    <div className="relative">
      {allStages.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        const timelineEntry = timeline.find((t) => t.stage === stage);

        return (
          <div key={stage} className={`flex gap-4 ${!compact || index < allStages.length - 1 ? 'pb-4' : ''}`}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted
                    ? 'bg-clinical-600 text-white'
                    : isCurrent
                    ? 'bg-clinical-100 text-clinical-700 border-2 border-clinical-600'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              {index < allStages.length - 1 && (
                <div
                  className={`w-0.5 flex-1 min-h-[20px] ${
                    isCompleted ? 'bg-clinical-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            <div className={`flex-1 ${index < allStages.length - 1 ? 'pb-4' : ''}`}>
              <p
                className={`text-sm font-medium ${
                  isCompleted || isCurrent ? 'text-text-primary' : 'text-text-muted'
                }`}
              >
                {STAGE_LABELS[stage]}
              </p>
              {timelineEntry && !compact && (
                <div className="mt-0.5">
                  <p className="text-xs text-text-secondary">{timelineEntry.by}</p>
                  <p className="text-xs text-text-muted">
                    {new Date(timelineEntry.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
              {!timelineEntry && isCurrent && !compact && (
                <p className="text-xs text-clinical-600 font-medium mt-0.5">In progress</p>
              )}
              {!timelineEntry && isPending && !compact && (
                <p className="text-xs text-text-muted mt-0.5">Pending</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HorizontalKanban({ currentStage, timeline = [] }) {
  const currentIndex = allStages.indexOf(currentStage);

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 px-1">
      {allStages.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const timelineEntry = timeline.find((t) => t.stage === stage);

        return (
          <div
            key={stage}
            className={`flex-shrink-0 w-32 p-3 rounded-xl border transition-all ${
              isCompleted
                ? 'bg-clinical-50 border-clinical-200'
                : isCurrent
                ? 'bg-clinical-50 border-clinical-500 shadow-sm ring-2 ring-clinical-100'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-clinical-600 text-white'
                    : isCurrent
                    ? 'bg-clinical-100 text-clinical-700 border border-clinical-600'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="text-[9px] font-bold">{index + 1}</span>
                )}
              </div>
            </div>
            <p
              className={`text-xs font-medium leading-tight ${
                isCompleted || isCurrent ? 'text-text-primary' : 'text-text-muted'
              }`}
            >
              {STAGE_LABELS[stage]}
            </p>
            {timelineEntry && (
              <p className="text-[10px] text-text-muted mt-1">
                {new Date(timelineEntry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
