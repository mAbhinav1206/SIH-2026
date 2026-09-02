import { useMemo, useState } from 'react'
import { PageHeader, Card, DemandBadge, GrowthTag } from '../components/ui'
import { JOB_ROLES, SKILLS, INDUSTRIES, DISTRICTS } from '../data/seedData'

export default function MarketIntelligence() {
  const [industry, setIndustry] = useState('All')
  const [district, setDistrict] = useState('All')

  const jobs = useMemo(
    () => JOB_ROLES.filter(j => industry === 'All' || j.industry === industry).sort((a, b) => b.growth - a.growth),
    [industry]
  )
  const rising = SKILLS.filter(s => s.growth >= 30).sort((a, b) => b.growth - a.growth)
  const declining = SKILLS.filter(s => s.growth < 0).sort((a, b) => a.growth - b.growth)

  return (
    <div>
      <PageHeader title="Labour Market Intelligence" description="Real-time view of job roles, skills and demand shifts across districts and industries." />

      <div className="flex flex-wrap gap-3 mb-6">
        <Select label="District" value={district} onChange={setDistrict} options={['All', ...DISTRICTS.map(d => d.name)]} />
        <Select label="Industry" value={industry} onChange={setIndustry} options={['All', ...INDUSTRIES]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="font-medium text-navy-900 mb-4">Emerging skills</div>
          <div className="space-y-3">
            {rising.map(s => (
              <div key={s.id} className="flex items-center justify-between border-b border-ink-400/10 pb-2 last:border-0 last:pb-0">
                <div>
                  <div className="text-sm text-ink-900">{s.name}</div>
                  <DemandBadge level={s.demand} />
                </div>
                <GrowthTag value={s.growth} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="font-medium text-navy-900 mb-4">Declining skills</div>
          <div className="space-y-3">
            {declining.map(s => (
              <div key={s.id} className="flex items-center justify-between border-b border-ink-400/10 pb-2 last:border-0 last:pb-0">
                <div>
                  <div className="text-sm text-ink-900">{s.name}</div>
                  <DemandBadge level={s.demand} />
                </div>
                <GrowthTag value={s.growth} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="font-medium text-navy-900 mb-4">Top job roles {district !== 'All' && <span className="text-ink-400 font-normal">— filtered demo view for {district}</span>}</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-400 border-b border-ink-400/10">
              <th className="pb-2 font-normal">Role</th>
              <th className="pb-2 font-normal">Industry</th>
              <th className="pb-2 font-normal">Demand</th>
              <th className="pb-2 font-normal">Growth</th>
              <th className="pb-2 font-normal">Openings</th>
              <th className="pb-2 font-normal">Avg. Salary</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id} className="border-b border-ink-400/10 last:border-0">
                <td className="py-2.5 text-ink-900">{j.title}</td>
                <td className="py-2.5 text-ink-600">{j.industry}</td>
                <td className="py-2.5"><DemandBadge level={j.demand} /></td>
                <td className="py-2.5"><GrowthTag value={j.growth} /></td>
                <td className="py-2.5 font-figure text-ink-600">{j.openings.toLocaleString()}</td>
                <td className="py-2.5 font-figure text-ink-600">{j.avgSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="text-sm text-ink-600 flex items-center gap-2 bg-white border border-ink-400/15 rounded-md px-3 py-1.5">
      {label}
      <select value={value} onChange={e => onChange(e.target.value)} className="bg-transparent text-ink-900 font-medium focus:outline-none">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}
