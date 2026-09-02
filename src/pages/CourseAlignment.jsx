import { useEffect, useState } from 'react'
import { PageHeader, Card } from '../components/ui'
import { COURSES } from '../data/seedData'
import { computeCourseAlignment } from '../services/aiService'

export default function CourseAlignment() {
  const [courseId, setCourseId] = useState(COURSES[0].id)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    computeCourseAlignment(courseId).then(r => { setResult(r); setLoading(false) })
  }, [courseId])

  return (
    <div>
      <PageHeader title="Course–Curriculum Alignment" description="Compare a course's current curriculum against live industry requirements and generate improvement recommendations." />

      <div className="mb-6">
        <select
          value={courseId}
          onChange={e => setCourseId(e.target.value)}
          className="bg-white border border-ink-400/20 rounded-md px-3 py-2 text-sm font-medium text-navy-900 focus:outline-none focus:border-teal-500"
        >
          {COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading && <div className="text-sm text-ink-400">Comparing curriculum against industry requirements…</div>}

      {result && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <div className="font-medium text-navy-900 mb-3">Current curriculum</div>
              <ul className="space-y-2 text-sm">
                {result.industryRequirement.map(skill => (
                  <li key={skill} className="flex items-center gap-2">
                    <span className={result.curriculum.includes(skill) ? 'text-teal-600' : 'text-clay-600'}>
                      {result.curriculum.includes(skill) ? '✓' : '✗'}
                    </span>
                    <span className="text-ink-900">{skill}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <div className="font-medium text-navy-900 mb-3">Industry requirement</div>
              <ul className="space-y-2 text-sm">
                {result.industryRequirement.map(skill => (
                  <li key={skill} className="flex items-center gap-2">
                    <span className="text-teal-600">✓</span>
                    <span className="text-ink-900">{skill}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-sm text-ink-600">Alignment score</div>
              <div className="text-4xl font-figure font-semibold text-navy-900 mt-1">{result.alignmentScore}%</div>
              <div className="w-full bg-ink-400/10 rounded-full h-2 mt-4">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${result.alignmentScore}%` }} />
              </div>
            </Card>
            <Card>
              <div className="text-sm text-ink-600 mb-2">Skill gaps</div>
              {result.gaps.length === 0
                ? <div className="text-sm text-teal-600">No gaps — fully aligned</div>
                : <div className="flex flex-wrap gap-1.5">{result.gaps.map(g => <span key={g} className="px-2 py-0.5 bg-clay-100 text-clay-600 rounded text-xs">{g}</span>)}</div>}
            </Card>
            <Card>
              <div className="text-sm text-ink-600 mb-2">AI recommendations</div>
              <ol className="text-sm text-ink-900 space-y-1.5 list-decimal list-inside">
                {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ol>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
