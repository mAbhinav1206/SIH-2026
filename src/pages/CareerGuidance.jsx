import { useState } from 'react'
import { PageHeader, Card } from '../components/ui'
import { SKILLS, DISTRICTS } from '../data/seedData'
import { recommendCareer } from '../services/aiService'

const EDUCATION_OPTIONS = ['10th', '12th', 'Diploma', "Bachelor's Degree"]

export default function CareerGuidance() {
  const [education, setEducation] = useState('12th')
  const [skills, setSkills] = useState(['Excel'])
  const [location, setLocation] = useState(DISTRICTS[0].name)
  const [interests, setInterests] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  function toggleSkill(name) {
    setSkills(s => s.includes(name) ? s.filter(x => x !== name) : [...s, name])
  }

  async function submit() {
    setLoading(true)
    const res = await recommendCareer({ education, skills, location, interests })
    setResult(res)
    setLoading(false)
  }

  return (
    <div>
      <PageHeader title="Candidate Career Guidance" description="Tell us about the candidate's background to generate a personalized career recommendation and skill roadmap." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="font-medium text-navy-900 mb-4">Candidate profile</div>

          <label className="block text-sm text-ink-600 mb-1.5">Education</label>
          <select value={education} onChange={e => setEducation(e.target.value)} className="w-full border border-ink-400/20 rounded-md px-3 py-2 text-sm mb-4 focus:outline-none focus:border-teal-500">
            {EDUCATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>

          <label className="block text-sm text-ink-600 mb-1.5">Current skills</label>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {SKILLS.map(s => (
              <button
                key={s.id}
                onClick={() => toggleSkill(s.name)}
                className={`text-xs px-2.5 py-1 rounded-full border ${skills.includes(s.name) ? 'bg-navy-900 text-white border-navy-900' : 'border-ink-400/20 text-ink-600'}`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <label className="block text-sm text-ink-600 mb-1.5">Location</label>
          <select value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-ink-400/20 rounded-md px-3 py-2 text-sm mb-4 focus:outline-none focus:border-teal-500">
            {DISTRICTS.map(d => <option key={d.id}>{d.name}</option>)}
          </select>

          <label className="block text-sm text-ink-600 mb-1.5">Interests (optional)</label>
          <input value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g. working with data, being outdoors"
            className="w-full border border-ink-400/20 rounded-md px-3 py-2 text-sm mb-4 focus:outline-none focus:border-teal-500" />

          <button onClick={submit} disabled={loading} className="bg-navy-900 text-white text-sm px-4 py-2 rounded-md hover:bg-navy-800 disabled:opacity-50">
            {loading ? 'Generating…' : 'Generate recommendation'}
          </button>
        </Card>

        <Card>
          <div className="font-medium text-navy-900 mb-4">Recommendation</div>
          {!result && <div className="text-sm text-ink-400">Fill in the profile and generate a recommendation.</div>}
          {result && (
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-ink-400 text-xs mb-0.5">Recommended career</div>
                <div className="text-lg font-medium text-navy-900">{result.recommendedCareer}</div>
              </div>
              <div className="flex gap-6">
                <div>
                  <div className="text-ink-400 text-xs mb-0.5">Current match</div>
                  <div className="text-2xl font-figure font-semibold text-amber-600">{result.currentMatch}%</div>
                </div>
                <div>
                  <div className="text-ink-400 text-xs mb-0.5">Target match</div>
                  <div className="text-2xl font-figure font-semibold text-teal-600">{result.targetMatch}%</div>
                </div>
              </div>
              <div>
                <div className="text-ink-400 text-xs mb-1.5">Skill roadmap</div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {result.roadmap.map((step, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="px-2 py-1 bg-teal-100 text-teal-600 rounded text-xs">{step}</span>
                      {i < result.roadmap.length - 1 && <span className="text-ink-400">→</span>}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-ink-400 text-xs mb-1.5">Missing skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills.length === 0
                    ? <span className="text-teal-600 text-sm">None — candidate is fully matched</span>
                    : result.missingSkills.map(s => <span key={s} className="px-2 py-0.5 bg-clay-100 text-clay-600 rounded text-xs">{s}</span>)}
                </div>
              </div>
              <div>
                <div className="text-ink-400 text-xs mb-1.5">Recommended courses</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.recommendedCourses.map(c => <span key={c} className="px-2 py-0.5 bg-navy-900/5 text-navy-900 rounded text-xs">{c}</span>)}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
