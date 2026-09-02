import { useState } from 'react'
import { PageHeader, Card } from '../components/ui'
import { extractJobSkills } from '../services/aiService'

const SAMPLES = [
  'Junior Data Analyst required with Excel, SQL, Python and Power BI. 0-2 years experience. Bachelor\'s degree preferred.',
  'Hiring a Cloud Engineer with hands-on AWS/Azure experience and knowledge of cybersecurity fundamentals. 2-4 years experience.',
  'Solar Technician needed for on-site installation work. Solar PV Installation experience required. 12th pass or diploma accepted.',
]

export default function JobAnalysis() {
  const [text, setText] = useState(SAMPLES[0])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function analyze() {
    setLoading(true)
    setResult(null)
    try {
      const res = await extractJobSkills(text)
      setResult(res)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Job Analysis" description="Paste a job posting and let the AI extract structured requirements — role, skills, experience and education." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="font-medium text-navy-900 mb-3">Job description</div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
            className="w-full border border-ink-400/20 rounded-md p-3 text-sm text-ink-900 focus:outline-none focus:border-teal-500"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {SAMPLES.map((s, i) => (
              <button key={i} onClick={() => setText(s)} className="text-xs px-2.5 py-1 rounded border border-ink-400/20 text-ink-600 hover:border-teal-500 hover:text-teal-600">
                Sample {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={analyze}
            disabled={loading || !text.trim()}
            className="mt-4 bg-navy-900 text-white text-sm px-4 py-2 rounded-md hover:bg-navy-800 disabled:opacity-50"
          >
            {loading ? 'Analyzing…' : 'Analyze with AI'}
          </button>
        </Card>

        <Card>
          <div className="font-medium text-navy-900 mb-3">Extracted requirements</div>
          {!result && !loading && <div className="text-sm text-ink-400">Run an analysis to see structured output here.</div>}
          {loading && <div className="text-sm text-ink-400">Extracting role, skills, experience and education…</div>}
          {result && (
            <div className="space-y-4 text-sm">
              <Field label="Job Role" value={result.role} />
              <div>
                <div className="text-ink-400 mb-1.5">Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-teal-100 text-teal-600 rounded text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <Field label="Experience" value={result.experience} />
              <Field label="Education" value={result.education} />
              <Field label="Industry" value={result.industry} />
              <div className="pt-3 border-t border-ink-400/10 text-xs text-ink-400">
                Confidence {Math.round(result.confidence * 100)}% · method: {result.method}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-ink-400 text-xs mb-0.5">{label}</div>
      <div className="text-ink-900 font-medium">{value}</div>
    </div>
  )
}
