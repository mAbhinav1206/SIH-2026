export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-ink-400/15 rounded-lg p-5 ${className}`}>
      {children}
    </div>
  )
}

export function PageHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-navy-900">{title}</h1>
      {description && <p className="text-ink-600 mt-1 max-w-2xl">{description}</p>}
    </div>
  )
}

const DEMAND_STYLES = {
  'VERY HIGH': 'bg-teal-100 text-teal-600',
  HIGH: 'bg-teal-100 text-teal-600',
  MEDIUM: 'bg-amber-100 text-amber-600',
  LOW: 'bg-clay-100 text-clay-600',
}
export function DemandBadge({ level }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${DEMAND_STYLES[level] || 'bg-ink-400/10 text-ink-600'}`}>
      {level}
    </span>
  )
}

const RISK_STYLES = {
  HIGH: 'bg-clay-100 text-clay-600',
  MEDIUM: 'bg-amber-100 text-amber-600',
  LOW: 'bg-teal-100 text-teal-600',
}
export function RiskBadge({ level }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${RISK_STYLES[level] || ''}`}>
      {level} RISK
    </span>
  )
}

export function StatCard({ label, value, sublabel, tone = 'navy' }) {
  const toneMap = {
    navy: 'text-navy-900',
    teal: 'text-teal-600',
    amber: 'text-amber-600',
    clay: 'text-clay-600',
  }
  return (
    <Card>
      <div className="text-sm text-ink-600">{label}</div>
      <div className={`text-3xl font-figure font-semibold mt-1 ${toneMap[tone]}`}>{value}</div>
      {sublabel && <div className="text-xs text-ink-400 mt-1">{sublabel}</div>}
    </Card>
  )
}

export function GrowthTag({ value }) {
  const positive = value >= 0
  return (
    <span className={`font-figure text-sm font-medium ${positive ? 'text-teal-600' : 'text-clay-600'}`}>
      {positive ? '+' : ''}{value}%
    </span>
  )
}

export function EmptyState({ title, description }) {
  return (
    <Card className="text-center py-12">
      <div className="text-ink-900 font-medium">{title}</div>
      {description && <div className="text-ink-400 text-sm mt-1">{description}</div>}
    </Card>
  )
}
