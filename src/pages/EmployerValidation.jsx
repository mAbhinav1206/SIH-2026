import { useState } from 'react'
import { PageHeader, Card } from '../components/ui'
import { EMPLOYERS, SKILLS } from '../data/seedData'

const PLACEMENT_STATS = { placementRate: 64, employerSatisfaction: 4.2, skillMatch: 71, courseEffectiveness: 68 }

export default function EmployerValidation() {
  const [suggestedSkill, setSuggestedSkill] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div>
      <PageHeader title="Employer Validation" description="Employers confirm which skills matter most and how well current training covers them — this feeds directly back into the recommendation engine." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Placement rate" value={`${PLACEMENT_STATS.placementRate}%`} />
        <Stat label="Employer satisfaction" value={`${PLACEMENT_STATS.employerSatisfaction} / 5`} />
        <Stat label="Skill match" value={`${PLACEMENT_STATS.skillMatch}%`} />
        <Stat label="Course effectiveness" value={`${PLACEMENT_STATS.courseEffectiveness}%`} />
      </div>

      <div className="space-y-4 mb-6">
        {EMPLOYERS.map(emp => (
          <Card key={emp.id}>
            <div className="font-medium text-navy-900">{emp.name}</div>
            <div className="text-xs text-ink-400 mb-3">{emp.industry}</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 border-b border-ink-400/10">
                  <th className="pb-2 font-normal">Skill</th>
                  <th className="pb-2 font-normal">Important</th>
                  <th className="pb-2 font-normal">Required proficiency</th>
                  <th className="pb-2 font-normal">Currently taught</th>
                </tr>
              </thead>
              <tbody>
                {emp.validated.map(v => (
                  <tr key={v.skill}>
                    <td className="py-2 text-ink-900">{v.skill}</td>
                    <td className="py-2">{v.important ? 'Yes' : 'No'}</td>
                    <td className="py-2 text-ink-600">{v.proficiency}</td>
                    <td className={`py-2 ${v.taught ? 'text-teal-600' : 'text-clay-600'}`}>{v.taught ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ))}
      </div>

      <Card>
        <div className="font-medium text-navy-900 mb-3">Suggest a new skill</div>
        <p className="text-sm text-ink-600 mb-3">Employers can flag skills that aren't in the taxonomy yet. Confirmed suggestions feed the demand-prediction and curriculum-recommendation models.</p>
        <div className="flex gap-2">
          <select value={suggestedSkill} onChange={e => setSuggestedSkill(e.target.value)} className="flex-1 border border-ink-400/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-teal-500">
            <option value="">Select a related skill area…</option>
            {SKILLS.map(s => <option key={s.id}>{s.name}</option>)}
            <option>Other — describe in feedback</option>
          </select>
          <button
            onClick={() => setSubmitted(true)}
            disabled={!suggestedSkill}
            className="bg-navy-900 text-white text-sm px-4 py-2 rounded-md hover:bg-navy-800 disabled:opacity-50"
          >
            Submit
          </button>
        </div>
        {submitted && <div className="text-sm text-teal-600 mt-3">Thanks — this has been logged and will be reviewed for inclusion in the skill taxonomy.</div>}
      </Card>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <Card>
      <div className="text-sm text-ink-600">{label}</div>
      <div className="text-2xl font-figure font-semibold text-navy-900 mt-1">{value}</div>
    </Card>
  )
}
