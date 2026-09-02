import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, FileSearch, Sparkles, GitCompareArrows,
  AlertTriangle, MapPinned, Route, BadgeCheck,
} from 'lucide-react'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/market-intelligence', label: 'Market Intelligence', icon: TrendingUp },
  { to: '/job-analysis', label: 'Job Analysis', icon: FileSearch },
  { to: '/skills', label: 'Skills', icon: Sparkles },
  { to: '/course-alignment', label: 'Course Alignment', icon: GitCompareArrows },
  { to: '/course-risk', label: 'Course Risk', icon: AlertTriangle },
  { to: '/district-planner', label: 'District Planner', icon: MapPinned },
  { to: '/career-guidance', label: 'Career Guidance', icon: Route },
  { to: '/employer-validation', label: 'Employer Validation', icon: BadgeCheck },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-navy-950 text-white flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="text-sm text-teal-500 font-figure tracking-tight">SkillAlign AI</div>
        <div className="text-xs text-white/50 mt-0.5">Labour Market Intelligence</div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-white border-r-2 border-teal-500'
                  : 'text-white/65 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-white/10 text-xs text-white/40">
        Demo data · synthetic dataset
      </div>
    </aside>
  )
}
