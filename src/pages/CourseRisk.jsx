import { useEffect, useState } from 'react'
import { PageHeader, Card, RiskBadge } from '../components/ui'
import { COURSES } from '../data/seedData'
import { assessCourseRisk } from '../services/aiService'

export default function CourseRisk() {
  const [results, setResults] = useState([])

  useEffect(() => {
    Promise.all(COURSES.map(c => assessCourseRisk(c.id))).then(setResults)
  }, [])

  const sorted = [...results].sort((a, b) => b.riskScore - a.riskScore)

  return (
    <div>
      <PageHeader title="Course Risk Detection" description="Identifies oversupplied, outdated, or poorly-performing courses — with the specific reasons behind each flag, not just a verdict." />

      {sorted.length === 0 && <div className="text-sm text-ink-400">Assessing courses…</div>}

      <div className="space-y-4">
        {sorted.map(r => {
          const course = COURSES.find(c => c.name === r.course)
          return (
            <Card key={r.course}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-medium text-navy-900">{r.course}</div>
                  <div className="text-xs text-ink-400 mt-0.5">
                    Seats: <span className="font-figure">{course.seats}</span> · Placement: <span className="font-figure">{course.placementRate}%</span>
                  </div>
                </div>
                <RiskBadge level={r.risk} />
              </div>

              {r.reasons.length > 0 && (
                <ul className="mt-3 text-sm text-ink-600 list-disc list-inside space-y-1">
                  {r.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
                </ul>
              )}

              <div className="mt-3 text-sm bg-canvas rounded-md px-3 py-2 text-ink-900">
                <span className="text-ink-400">Recommendation: </span>{r.recommendation}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
