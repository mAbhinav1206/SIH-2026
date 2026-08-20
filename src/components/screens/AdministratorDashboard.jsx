import { useState, useEffect } from 'react';
import {
  Users, AlertTriangle, Stethoscope, FileCheck, Activity, TrendingUp,
  CheckCircle, XCircle, BarChart3,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import RiskBadge from '../primitives/RiskBadge';
import { SkeletonDashboard } from '../primitives/SkeletonLoader';

const monthlyData = [
  { month: 'Mar', cases: 12, referrals: 3 },
  { month: 'Apr', cases: 18, referrals: 5 },
  { month: 'May', cases: 25, referrals: 8 },
  { month: 'Jun', cases: 22, referrals: 6 },
  { month: 'Jul', cases: 35, referrals: 12 },
  { month: 'Aug', cases: 45, referrals: 15 },
];

export default function AdministratorDashboard({ stats, workplaces, onNavigate, onCaseClick }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 700);
  }, []);

  if (loading) {
    return <SkeletonDashboard />;
  }

  const statCards = [
    { label: 'Workers Screened', value: stats.workersScreened, icon: Users, color: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
    { label: 'High-Risk Cases', value: stats.highRiskCases, icon: AlertTriangle, color: 'bg-red-50 text-red-600', border: 'border-red-200' },
    { label: 'TB Suspicious', value: stats.tbSuspicious, icon: Stethoscope, color: 'bg-amber-50 text-amber-600', border: 'border-amber-200' },
    { label: 'Silicosis Suspicious', value: stats.silicosisSuspicious, icon: Activity, color: 'bg-orange-50 text-orange-600', border: 'border-orange-200' },
    { label: 'Referred', value: stats.referred, icon: FileCheck, color: 'bg-purple-50 text-purple-600', border: 'border-purple-200' },
    { label: 'Completed Follow-up', value: stats.completedFollowUp, icon: CheckCircle, color: 'bg-green-50 text-green-600', border: 'border-green-200' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-text-primary">Administrator Dashboard</h2>
        <p className="text-sm text-text-secondary">Occupational health screening overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`p-4 bg-white rounded-xl border ${card.border} animate-slide-up`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-text-primary">{card.value}</p>
              <p className="text-xs text-text-secondary">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Workplace Risk Heatmap */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Workplace Risk Overview</h3>
        <div className="space-y-2">
          {workplaces
            .sort((a, b) => {
              const order = { high: 0, moderate: 1, low: 2 };
              return order[a.riskLevel] - order[b.riskLevel];
            })
            .map((wp) => (
              <div
                key={wp.name}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-clinical-300 transition-colors cursor-pointer"
                onClick={() => {}}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{wp.name}</p>
                  <p className="text-xs text-text-secondary">{wp.district} &middot; {wp.screened}/{wp.workers} screened</p>
                </div>
                <RiskBadge level={wp.riskLevel} size="sm" />
              </div>
            ))}
        </div>
      </div>

      {/* AI Monitoring Panel */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* AI Agreement Rate */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4">AI Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-secondary">Agreement with Doctor</span>
                <span className="text-sm font-bold text-text-primary">{stats.aiAgreementRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-clinical-500 rounded-full"
                  style={{ width: `${stats.aiAgreementRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-secondary">Image Rejection Rate</span>
                <span className="text-sm font-bold text-text-primary">{stats.imageRejectionRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${stats.imageRejectionRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-green-50 rounded-xl text-center">
                <p className="text-lg font-bold text-green-700">{Math.round(stats.workersScreened * stats.aiAgreementRate / 100)}</p>
                <p className="text-[10px] text-green-600">AI Correct</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-center">
                <p className="text-lg font-bold text-amber-700">{Math.round(stats.workersScreened * (100 - stats.aiAgreementRate) / 100)}</p>
                <p className="text-[10px] text-amber-600">AI Override</p>
              </div>
            </div>
          </div>
        </div>

        {/* Case Volume Trend */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Case Volume Trend</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="cases" fill="#0c90e9" radius={[4, 4, 0, 0]} name="Total Cases" />
                <Bar dataKey="referrals" fill="#d97706" radius={[4, 4, 0, 0]} name="Referrals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
