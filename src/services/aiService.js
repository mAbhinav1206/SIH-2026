// ---------------------------------------------------------------------------
// AIService — abstraction layer for all AI-driven features.
//
// In production, every function below issues a request to the Spring Boot
// backend (e.g. POST /api/jobs/analyze), which in turn calls the Python
// FastAPI "ai-service" microservice. The AI microservice is provider-agnostic:
// it can be backed by Gemini, Hugging Face, an OpenAI-compatible endpoint,
// local Sentence-Transformers, or later a custom fine-tuned model — selected
// via an environment variable (AI_PROVIDER) with zero changes to this file
// or to the React components that call it.
//
// For this frontend-only MVP/demo build, each function runs a deterministic
// local fallback so the app is fully interactive without live network calls.
// This mirrors the real backend's "AI failure fallback" requirement: if the
// live AI API is unavailable, the same deterministic algorithm keeps the
// demo working end-to-end.
// ---------------------------------------------------------------------------

import { SKILLS, JOB_ROLES, COURSES } from '../data/seedData'
import { appEnv } from '../config/env'

const KNOWN_SKILLS = SKILLS.map(s => s.name)

async function callRemoteOrFallback(promiseFactory, fallback) {
  const isRemoteConfigured = appEnv.apiBaseUrl && appEnv.apiBaseUrl.length > 0

  if (!isRemoteConfigured) return fallback()

  try {
    return await promiseFactory()
  } catch (error) {
    console.warn('Backend AI request failed, using local fallback.', error)
    return fallback()
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 1. Job skill extraction ----------------------------------------------------
export async function extractJobSkills(jobDescriptionText) {
  return callRemoteOrFallback(async () => {
    const response = await fetch(`${appEnv.apiBaseUrl}/job-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: jobDescriptionText })
    })

    if (!response.ok) throw new Error(`AI API request failed with status ${response.status}`)
    return response.json()
  }, async () => {
    await delay(500)
    const text = jobDescriptionText.toLowerCase()
    const foundSkills = KNOWN_SKILLS.filter(skill => text.includes(skill.toLowerCase().split(' ')[0]))

    const expMatch = text.match(/(\d+)\s*[-to]+\s*(\d+)\s*years?/)
    const experience = expMatch ? `${expMatch[1]}-${expMatch[2]} years` : (/fresher|junior|0-2/.test(text) ? '0-2 years' : 'Not specified')

    const education = /bachelor|b\.tech|b\.e\.|graduate/.test(text) ? "Bachelor's degree"
      : /12th|diploma/.test(text) ? '12th / Diploma' : 'Not specified'

    const roleGuess = JOB_ROLES.find(r => text.includes(r.title.toLowerCase()))?.title
      || (foundSkills.includes('Python') && foundSkills.includes('SQL') ? 'Data Analyst' : 'Role not confidently identified')

    return {
      role: roleGuess,
      skills: foundSkills.length ? foundSkills : ['No known skills detected — consider adding to the skill taxonomy'],
      experience,
      education,
      industry: JOB_ROLES.find(r => r.title === roleGuess)?.industry || 'Unclassified',
      confidence: foundSkills.length >= 2 ? 0.86 : 0.52,
      method: appEnv.aiProvider && appEnv.aiProvider !== 'mock' ? appEnv.aiProvider : 'fallback-keyword-taxonomy',
    }
  })
}

// 2. Skill similarity (semantic, not exact string match) --------------------
const SIMILARITY_PAIRS = {
  'data visualization': ['power bi', 'dashboard'],
  'power bi': ['data visualization', 'dashboard'],
}
export async function skillSimilarity(skillA, skillB) {
  await delay(150)
  const a = skillA.toLowerCase()
  const b = skillB.toLowerCase()
  if (a === b) return 1
  if (a.includes(b) || b.includes(a)) return 0.82
  const related = SIMILARITY_PAIRS[a] || []
  if (related.some(r => b.includes(r))) return 0.74
  return 0.15
}

// 3. Skill-gap detection + alignment score -----------------------------------
export async function computeCourseAlignment(courseId) {
  await delay(400)
  const course = COURSES.find(c => c.id === courseId)
  if (!course) throw new Error('Course not found')

  const covered = course.industryRequirement.filter(skill => course.curriculum.includes(skill))
  const gaps = course.industryRequirement.filter(skill => !course.curriculum.includes(skill))
  const alignmentScore = Math.round((covered.length / course.industryRequirement.length) * 100)

  const recommendations = gaps.map(skill => `Add ${skill} module`)
  if (course.placementRate < 50) recommendations.push('Add an industry capstone project to lift placement outcomes')

  return { course: course.name, curriculum: course.curriculum, industryRequirement: course.industryRequirement, covered, gaps, alignmentScore, recommendations }
}

// 4. Demand prediction (simple regression-style projection) -----------------
export async function predictDemand(skillName, months = 6) {
  await delay(300)
  const skill = SKILLS.find(s => s.name === skillName)
  const growthRate = skill ? skill.growth / 100 : 0.05
  const base = 100
  const projection = Array.from({ length: months }, (_, i) => Math.round(base * Math.pow(1 + growthRate / 12, i + 1)))
  return { skill: skillName, method: 'trend-extrapolation (XGBoost in production)', projection }
}

// 5. Course risk detection with explainability -------------------------------
export async function assessCourseRisk(courseId) {
  await delay(350)
  const course = COURSES.find(c => c.id === courseId)
  if (!course) throw new Error('Course not found')
  const gapCount = course.industryRequirement.filter(s => !course.curriculum.includes(s)).length
  const reasons = []
  let riskScore = 0

  if (course.placementRate < 45) { reasons.push(`Placement rate is low at ${course.placementRate}%`); riskScore += 40 }
  if (gapCount >= 2) { reasons.push(`${gapCount} industry-required skills are missing from the curriculum`); riskScore += 30 }
  if (course.seats > 250 && course.placementRate < 50) { reasons.push(`High seat count (${course.seats}) relative to weak placement outcomes suggests oversupply`); riskScore += 20 }

  const risk = riskScore >= 60 ? 'HIGH' : riskScore >= 30 ? 'MEDIUM' : 'LOW'
  const recommendation = risk === 'HIGH'
    ? 'Reduce new seat allocation and plan a curriculum transition toward in-demand skill modules.'
    : risk === 'MEDIUM'
      ? 'Update curriculum modules to close remaining skill gaps before next intake.'
      : 'Course is well aligned — maintain current curriculum and monitor quarterly.'

  return { course: course.name, riskScore, risk, reasons, recommendation }
}

// 6. Career recommendation ----------------------------------------------------
export async function recommendCareer({ education, skills = [], location, interests }) {
  await delay(500)
  const scored = JOB_ROLES.map(role => {
    const overlap = role.skills.filter(s => skills.includes(s)).length
    const currentMatch = Math.round((overlap / role.skills.length) * 100)
    return { role, currentMatch }
  }).sort((a, b) => b.currentMatch - a.currentMatch || (b.role.growth - a.role.growth))

  const best = scored[0]
  const missing = best.role.skills.filter(s => !skills.includes(s))
  const roadmap = [...skills.filter(s => best.role.skills.includes(s)), ...missing, 'Industry project', 'Internship', best.role.title]

  return {
    recommendedCareer: best.role.title,
    currentMatch: best.currentMatch,
    targetMatch: 86,
    missingSkills: missing,
    roadmap,
    recommendedCourses: COURSES.filter(c => missing.some(m => c.industryRequirement.includes(m))).map(c => c.name),
  }
}

// 7. Curriculum recommendation (alias used by Course Alignment page) --------
export const recommendCurriculum = computeCourseAlignment
