import { useState, useEffect } from 'react';
import { Plus, PlayCircle, Users, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import CaseCard from '../primitives/CaseCard';
import RiskBadge from '../primitives/RiskBadge';
import EmptyState from '../primitives/EmptyState';
import { SkeletonDashboard } from '../primitives/SkeletonLoader';

export default function ScreeningDashboard({ workers, stats, onNavigate, onCaseClick }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SkeletonDashboard />;
  }

  const todayCases = workers.filter(
    (w) => new Date(w.lastActivity).toDateString() === new Date().toDateString()
  );

  const summaryCards = [
    { label: 'Total Workers', value: stats.total, icon: Users, color: 'bg-blue-50 text-blue-600', borderColor: 'border-blue-200' },
    { label: 'Screened Today', value: stats.screened, icon: CheckCircle, color: 'bg-green-50 text-green-600', borderColor: 'border-green-200' },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'bg-amber-50 text-amber-600', borderColor: 'border-amber-200' },
    { label: 'High Risk', value: stats.highRisk, icon: AlertTriangle, color: 'bg-red-50 text-red-600', borderColor: 'border-red-200' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-text-primary">Screening Dashboard</h2>
        <p className="text-sm text-text-secondary">Today's overview &middot; Primary Health Centre, Ambaji</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`p-4 bg-white rounded-xl border ${card.borderColor} animate-slide-up`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-text-primary">{card.value}</p>
              <p className="text-xs text-text-secondary">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onNavigate('register')}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-clinical-600 text-white rounded-xl text-sm font-semibold hover:bg-clinical-700 active:bg-clinical-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Screening
        </button>
        <button
          onClick={() => onNavigate('screening')}
          className="flex items-center justify-center gap-2 py-3.5 px-4 bg-white border border-clinical-300 text-clinical-700 rounded-xl text-sm font-semibold hover:bg-clinical-50 active:bg-clinical-100 transition-colors"
        >
          <PlayCircle className="w-5 h-5" />
          Start Camp
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary">Recent Cases</h3>
          {todayCases.length > 0 && (
            <span className="text-xs text-text-muted">{todayCases.length} today</span>
          )}
        </div>

        {workers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No cases yet"
            description="Start by registering a worker or beginning a screening camp."
            action={
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 bg-clinical-600 text-white rounded-lg text-sm font-medium hover:bg-clinical-700"
              >
                Register First Worker
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {workers.slice(0, 5).map((worker) => (
              <CaseCard
                key={worker.id}
                worker={worker}
                onClick={onCaseClick}
              />
            ))}
            {workers.length > 5 && (
              <button
                onClick={() => onNavigate('cases')}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-clinical-600 hover:text-clinical-700"
              >
                View all {workers.length} cases
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
