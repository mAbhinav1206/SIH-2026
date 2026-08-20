import { useState } from 'react';
import { Stethoscope, AlertTriangle, Clock, Filter, Search, ArrowRight } from 'lucide-react';
import RiskBadge from '../primitives/RiskBadge';
import StatusPill from '../primitives/StatusPill';
import { RISK_LEVELS } from '../../data/mockData';

export default function DoctorWorklist({ workers, onCaseClick, onBack }) {
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkers = workers
    .filter((w) => filterRisk === 'all' || w.riskLevel === filterRisk)
    .filter((w) => filterStatus === 'all' || w.status === filterStatus)
    .filter(
      (w) =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // High risk + TB suspicious first
      const aHigh = a.riskLevel === RISK_LEVELS.HIGH && a.aiFindings?.tb?.status.includes('evaluation');
      const bHigh = b.riskLevel === RISK_LEVELS.HIGH && b.aiFindings?.tb?.status.includes('evaluation');
      if (aHigh && !bHigh) return -1;
      if (!aHigh && bHigh) return 1;
      // Then pending > 24h
      const aPending = !a.doctorDecision;
      const bPending = !b.doctorDecision;
      if (aPending && !bPending) return -1;
      if (!aPending && bPending) return 1;
      return new Date(b.lastActivity) - new Date(a.lastActivity);
    });

  const needsReview = filteredWorkers.filter((w) => !w.doctorDecision);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Doctor Worklist</h2>
          <p className="text-sm text-text-secondary">
            {needsReview.length} cases pending review
          </p>
        </div>
        <div className="w-10 h-10 bg-clinical-100 rounded-xl flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-clinical-600" />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-clinical-500 placeholder:text-text-muted"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterRisk('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            filterRisk === 'all' ? 'bg-clinical-600 text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
          }`}
        >
          All Risk
        </button>
        {Object.values(RISK_LEVELS).filter(r => r !== 'pending').map((risk) => (
          <button
            key={risk}
            onClick={() => setFilterRisk(risk)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize transition-colors ${
              filterRisk === risk ? 'bg-clinical-600 text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            {risk} Risk
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredWorkers.map((worker) => {
          const isPending24h = !worker.doctorDecision;
          return (
            <button
              key={worker.id}
              onClick={() => onCaseClick(worker)}
              className="w-full text-left p-4 bg-white rounded-xl border border-border hover:border-clinical-300 hover:shadow-sm transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-text-primary">{worker.name}</p>
                    {isPending24h && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 rounded-full text-[10px] font-semibold text-red-700">
                        <Clock className="w-3 h-3" />
                        Pending &gt;24h
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">{worker.id} &middot; {worker.workplace}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <RiskBadge level={worker.riskLevel} size="sm" />
                  <StatusPill status={worker.status} size="xs" />
                </div>
              </div>

              {worker.aiFindings && (
                <div className="p-3 bg-surface-secondary rounded-lg space-y-1.5">
                  <p className="text-[11px] font-medium text-text-muted uppercase tracking-wide">AI Findings</p>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-text-primary">
                      <span className="font-medium">Silicosis:</span>{' '}
                      {worker.aiFindings.silicosis.status}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-text-primary">
                      <span className="font-medium">TB:</span>{' '}
                      {worker.aiFindings.tb.status}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-1 mt-3 text-xs font-medium text-clinical-600">
                Review case
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}

        {filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-secondary">No cases match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
