import { User, MapPin, Clock } from 'lucide-react';
import RiskBadge from './RiskBadge';
import StatusPill from './StatusPill';

export default function CaseCard({ worker, onClick, showAI = false }) {
  const timeAgo = getTimeAgo(worker.lastActivity);

  return (
    <button
      onClick={() => onClick?.(worker)}
      className="w-full text-left p-4 bg-white rounded-xl border border-border hover:border-clinical-300 hover:shadow-sm transition-all duration-200 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-clinical-50 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-clinical-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{worker.name}</p>
            <p className="text-xs text-text-secondary">{worker.id} &middot; {worker.age}y {worker.gender}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <RiskBadge level={worker.riskLevel} size="sm" />
          <StatusPill status={worker.status} size="xs" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {worker.workplace}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </span>
      </div>

      {showAI && worker.aiFindings && (
        <div className="mt-3 p-2.5 bg-surface-secondary rounded-lg border border-border">
          <p className="text-[11px] font-medium text-text-muted uppercase tracking-wide mb-1">AI Screening</p>
          <div className="space-y-1">
            <p className="text-xs text-text-primary">
              <span className="font-medium">Silicosis:</span>{' '}
              {worker.aiFindings.silicosis.status}
            </p>
            <p className="text-xs text-text-primary">
              <span className="font-medium">TB:</span>{' '}
              {worker.aiFindings.tb.status}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
