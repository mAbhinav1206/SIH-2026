import { ShieldCheck, AlertTriangle, AlertOctagon, Clock } from 'lucide-react';
import { RISK_CONFIG } from '../../data/mockData';

const iconMap = {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Clock,
};

export default function RiskBadge({ level, size = 'md', showLabel = true }) {
  const config = RISK_CONFIG[level];
  if (!config) return null;
  const Icon = iconMap[config.icon];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
    xl: 'px-6 py-3 text-lg gap-2.5',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${config.bg} ${config.color} ${config.border} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'xl' ? 'w-6 h-6' : size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
