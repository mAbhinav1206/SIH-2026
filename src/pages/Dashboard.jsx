import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import { PageHeader, StatCard, Card } from '../components/ui'
import { DASHBOARD_STATS, SKILL_DEMAND_TREND, INDUSTRY_DISTRIBUTION, JOB_ROLES, COURSES } from '../data/seedData'

const PIE_COLORS = ['#0F2A4A', '#12959F', '#D98E04', '#C6543C', '#1E4D7B', '#0E7C86', '#B36B03', '#8592A3']

export default function Dashboard() {
  const coursesAtRisk = COURSES.filter(c => c.placementRate < 50).length
  const alignment = Math.round(COURSES.reduce((acc, c) => {
    const covered = c.industryRequirement.filter(s => c.curriculum.includes(s)).length
    return acc + covered / c.industryRequirement.length
  }, 0) / COURSES.length * 100)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A live snapshot of labour-market demand and how well current training supply is keeping up with it."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Jobs Analyzed" value={DASHBOARD_STATS.jobsAnalyzed.toLocaleString()} sublabel="last 90 days" />
        <StatCard label="High-Demand Skills" value={DASHBOARD_STATS.highDemandSkills} sublabel="across 8 industries" tone="teal" />
        <StatCard label="Skill Gaps" value={DASHBOARD_STATS.skillGaps} sublabel="unmet by current courses" tone="amber" />
        <StatCard label="Courses at Risk" value={coursesAtRisk} sublabel="low placement / declining demand" tone="clay" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <div className="font-medium text-navy-900 mb-4">Skill demand trend</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={SKILL_DEMAND_TREND}>
              <CartesianGrid stroke="#EAECEF" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8592A3' }} axisLine={{ stroke: '#EAECEF' }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8592A3' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Python" stroke="#0F2A4A" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="PowerBI" stroke="#12959F" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="SolarPV" stroke="#D98E04" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="font-medium text-navy-900 mb-4">Industry distribution</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={INDUSTRY_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
                {INDUSTRY_DISTRIBUTION.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="font-medium text-navy-900 mb-4">Job growth by role</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={JOB_ROLES} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid stroke="#EAECEF" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#8592A3' }} axisLine={false} tickLine={false} unit="%" />
              <YAxis type="category" dataKey="title" width={140} tick={{ fontSize: 12, fill: '#1C2733' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="growth" radius={[0, 4, 4, 0]}>
                {JOB_ROLES.map(r => <Cell key={r.id} fill={r.growth < 0 ? '#C6543C' : '#12959F'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="font-medium text-navy-900 mb-1">Overall course alignment</div>
          <div className="text-xs text-ink-400 mb-4">Weighted average across all active courses</div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-figure font-semibold text-navy-900">{alignment}%</div>
            <div className="text-xs text-ink-400 mb-1">industry-aligned</div>
          </div>
          <div className="w-full bg-ink-400/10 rounded-full h-2 mt-4">
            <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${alignment}%` }} />
          </div>
          <p className="text-sm text-ink-600 mt-4">
            Courses tied to Python, Power BI and Solar PV Installation are trending toward better alignment.
            Data-entry and manual bookkeeping courses are dragging the average down — see Course Risk.
          </p>
        </Card>
      </div>
    </div>
  )
}
