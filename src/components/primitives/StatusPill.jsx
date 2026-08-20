import { CASE_STATUSES } from '../../data/mockData';

const statusConfig = {
  [CASE_STATUSES.REGISTERED]: { label: 'Registered', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  [CASE_STATUSES.SCREENED]: { label: 'Screened', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  [CASE_STATUSES.XRAY_UPLOADED]: { label: 'X-ray Uploaded', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  [CASE_STATUSES.AI_REVIEWED]: { label: 'AI Reviewed', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  [CASE_STATUSES.DOCTOR_REVIEWED]: { label: 'Doctor Reviewed', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  [CASE_STATUSES.REFERRED]: { label: 'Referred', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  [CASE_STATUSES.DIAGNOSED]: { label: 'Diagnosed', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  [CASE_STATUSES.DOCUMENTED]: { label: 'Documented', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  [CASE_STATUSES.COMPENSATED]: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' },
};

export default function StatusPill({ status, size = 'sm' }) {
  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${config.color} ${sizeClasses[size]}`}>
      {config.label}
    </span>
  );
}
