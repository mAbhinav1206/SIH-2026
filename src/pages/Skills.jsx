import { useState } from 'react'
import { PageHeader, Card, DemandBadge, GrowthTag } from '../components/ui'
import { SKILLS } from '../data/seedData'

export default function Skills() {
  const [selected, setSelected] = useState(SKILLS[0])

  return (
    <div>
      <PageHeader title="Skill Intelligence" description="Demand, growth and industry associations for every tracked skill." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 border-b border-ink-400/10">
                <th className="py-2.5 px-5 font-normal">Skill</th>
                <th className="py-2.5 font-normal">Demand</th>
                <th className="py-2.5 font-normal">Growth</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS.map(s => (
                <tr
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`border-b border-ink-400/10 last:border-0 cursor-pointer ${selected.id === s.id ? 'bg-teal-100/50' : 'hover:bg-canvas'}`}
                >
                  <td className="py-2.5 px-5 text-ink-900">{s.name}</td>
                  <td className="py-2.5"><DemandBadge level={s.demand} /></td>
                  <td className="py-2.5"><GrowthTag value={s.growth} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <div className="text-lg font-medium text-navy-900">{selected.name}</div>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <div className="text-ink-400 text-xs mb-1">Demand</div>
              <DemandBadge level={selected.demand} />
            </div>
            <div>
              <div className="text-ink-400 text-xs mb-1">Growth</div>
              <GrowthTag value={selected.growth} />
            </div>
            <div>
              <div className="text-ink-400 text-xs mb-1">Required proficiency</div>
              <div className="text-ink-900">{selected.proficiency}</div>
            </div>
            <div>
              <div className="text-ink-400 text-xs mb-1">Used in industries</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.industries.map(i => <span key={i} className="px-2 py-0.5 bg-navy-900/5 text-navy-900 rounded text-xs">{i}</span>)}
              </div>
            </div>
            <div>
              <div className="text-ink-400 text-xs mb-1">Associated jobs</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.jobs.map(j => <span key={j} className="px-2 py-0.5 bg-navy-900/5 text-navy-900 rounded text-xs">{j}</span>)}
              </div>
            </div>
            <div>
              <div className="text-ink-400 text-xs mb-1">Related skills</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.related.map(r => <span key={r} className="px-2 py-0.5 bg-teal-100 text-teal-600 rounded text-xs">{r}</span>)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
