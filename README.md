# SkillAlign AI — Labour Market Intelligence & Curriculum Alignment Platform

An MVP for the SIH problem statement on skill-development / industry mismatch. It analyzes job-market
signals, employer requirements, and course curricula to surface in-demand skills, skill gaps, at-risk
courses, district training plans, and candidate career pathways.

## What's in this delivery

This build ships a **fully working, runnable frontend** (Phase 1 of the build order) implementing every
page and interaction from the spec, wired to a mock but semantically real `AIService` layer and realistic
synthetic demo data. The **Spring Boot + MySQL backend** and **FastAPI AI microservice** are specified in
full below (schema, endpoints, module layout) so they can be implemented directly against this frontend's
contract — they aren't included as running code in this delivery because this environment can't provision
a JVM + MySQL + Python service stack. See "What's implemented vs. planned" at the end.

## 1. Architecture

```
React (Vite, Tailwind, Recharts, Leaflet)
        │  REST / JSON
        ▼
Spring Boot (Java) ── Spring Security + JWT ── Spring Data JPA
        │  REST / JSON                              │
        ▼                                            ▼
Python AI microservice (FastAPI)                   MySQL
        │
        ▼
Pretrained models / AI APIs (Gemini, Hugging Face, Sentence-Transformers, ...)
```

The frontend never talks to the AI microservice directly — it only calls Spring Boot, which proxies AI
requests. This keeps auth, rate-limiting and business rules in one place, and lets the AI provider be
swapped without touching the frontend contract.

## 2. Tech stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, React-Leaflet, Axios, React Router
- **Backend**: Java 17+, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security, JWT
- **Database**: MySQL 8
- **AI service**: Python 3.11, FastAPI, Pandas, NumPy, scikit-learn, Sentence-Transformers, spaCy, XGBoost

## 3. Repository layout (this delivery)

```
skillalign-ai/
  src/
    components/     Sidebar, Layout, shared UI primitives (Card, badges, stat cards)
    data/           seedData.js — synthetic demo dataset (clearly separated from real data)
    services/       aiService.js — the AIService abstraction layer (see §5)
    pages/          one file per route (Dashboard, MarketIntelligence, JobAnalysis, Skills,
                     CourseAlignment, CourseRisk, DistrictPlanner, CareerGuidance, EmployerValidation)
  index.html, vite.config.js, tailwind.config.js, package.json
```

## 4. Running the frontend

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to dist/
```

No environment variables are required to run this demo build — it runs entirely on local mock data and
the in-browser `AIService` fallback described below.

## 5. AI architecture — the `AIService` abstraction

All AI-driven logic (job-skill extraction, skill similarity, course alignment, course risk, demand
prediction, career recommendation) is isolated behind one module: `src/services/aiService.js`. Every page
calls this module — never a specific model or provider directly.

In this demo build, each function runs a **deterministic local algorithm** (keyword/taxonomy matching,
rule-based scoring, trend extrapolation) so the app is fully interactive offline. This mirrors the
production fallback requirement: if the live AI API is unavailable, the same deterministic logic keeps
the platform usable.

In production, this same file's functions become thin HTTP calls to Spring Boot:

```js
export async function extractJobSkills(text) {
  const { data } = await axios.post('/api/jobs/analyze', { text })
  return data
}
```

Spring Boot forwards to the FastAPI AI service, which selects a provider via `AI_PROVIDER`:

```
AI_PROVIDER=gemini | huggingface | openai_compatible | sentence_transformer | custom_model
GEMINI_API_KEY=...
HF_API_KEY=...
OPENAI_COMPATIBLE_BASE_URL=...
OPENAI_COMPATIBLE_API_KEY=...
```

No API keys are ever sent to or stored in the React frontend.

### Planned AI microservice layout (`/ai-service`)

```
/ai-service
  /models        provider adapters (gemini.py, huggingface.py, sentence_transformer.py, xgboost_demand.py)
  /services      skill_extraction.py, skill_similarity.py, job_classification.py,
                 skill_gap.py, demand_prediction.py, career_recommendation.py, curriculum_recommendation.py
  /embeddings    embedding generation + a vector cache for skill/course similarity
  /prediction    XGBoost / Random Forest demand-forecast training + inference
  /training      fine-tuning scripts (kept separate from inference so training never blocks the API)
  /datasets      versioned training data, clearly separated from synthetic demo data
  main.py        FastAPI app, one router per capability above
```

Each capability is a swappable interface (e.g. `SkillExtractor.extract(text) -> dict`), so a pretrained
API call today can become a fine-tuned local model tomorrow without changing `services/aiService.js`,
Spring Boot's controllers, or any React component.

## 6. Skill-gap algorithm (implemented in `computeCourseAlignment`)

```
alignment_score = |industry_skills ∩ course_skills| / |industry_skills|
gaps            = industry_skills − course_skills
```

`skillSimilarity()` shows where this gets upgraded from exact-match to semantic match — e.g. "Data
Visualization" and "Power BI Dashboard Development" should score high similarity even though the strings
don't match. The demo uses a small lookup table; production replaces it with Sentence-Transformer cosine
similarity.

## 7. Planned database schema (MySQL via Spring Data JPA)

Core entities, matching the spec: `User, Job, Skill, JobSkill, Course, CourseSkill, CourseModule,
District, Industry, Employer, TrainingCentre, Placement, EmployerFeedback, SkillDemand, SkillGap,
Recommendation, CandidateProfile, CareerPath, Trainer, Equipment`.

Key relationships:
- `Job` ↔ `Skill` via `JobSkill` (many-to-many, with a `requiredProficiency` attribute)
- `Course` ↔ `Skill` via `CourseSkill`; `Course` → `CourseModule` (one-to-many)
- `Course` → `TrainingCentre` → `District` (many-to-one chains)
- `CandidateProfile` → `Skill` (many-to-many, "current skills") and → `CareerPath` (one-to-many, generated roadmap)
- `Placement` references `CandidateProfile`, `Course`, and `Employer`; `EmployerFeedback` references `Employer` and `Skill`

## 8. Planned REST API (Spring Boot)

```
GET  /api/jobs
POST /api/jobs/analyze
GET  /api/skills
GET  /api/skills/top
GET  /api/market-demand
GET  /api/courses
GET  /api/courses/{id}/alignment
POST /api/course-alignment/analyze
GET  /api/course-risk
GET  /api/districts/{id}/training-plan
POST /api/career/recommend
POST /api/employer/feedback
GET  /api/dashboard/stats
```

Every endpoint that touches AI (`/analyze`, `/course-alignment/analyze`, `/career/recommend`) is a thin
controller that validates input, calls the FastAPI AI service, and persists the result — matching the
functions already defined in `aiService.js`, so wiring the real backend in is a drop-in replacement.

## 9. Security (planned)

- JWT auth issued by Spring Security; roles: `ADMIN`, `TRAINING_PROVIDER`, `EMPLOYER`, `CANDIDATE`
- API keys and DB credentials only ever live in backend `.env` / environment variables
- Role-based route guards on both the API and (lightly) in the frontend nav

## 10. Demo flow (under 3 minutes)

Dashboard → Market Intelligence (filter to an industry) → open a Data Analyst-style role → Course
Alignment (Data Analytics course) → see the gap (Python, Power BI) and AI recommendations → District
Planner (Gurugram) → see recommended seat changes → Career Guidance → generate a candidate roadmap.

## 11. What's implemented vs. planned

| Layer | Status | Notes |
|---|---|---|
| React frontend, all 9 pages, routing, charts, map | **Implemented & running** | `npm run build` verified |
| `AIService` abstraction with 7 capabilities | **Implemented** | deterministic fallback logic, provider-swappable design |
| Synthetic demo dataset (skills, jobs, courses, districts, employers) | **Implemented** | in `src/data/seedData.js`, clearly marked as synthetic |
| Spring Boot API, MySQL schema, JWT auth | **Specified, not built here** | schema and endpoints above are ready to implement against this frontend's data shapes |
| FastAPI AI microservice, real model calls | **Specified, not built here** | module layout above; swap in a real provider by implementing the adapters in `/models` |
| Deep-learning upgrades (fine-tuned BERT/Sentence-Transformer, LSTM demand model, neural ranking) | **Roadmap only** | see §12 |

## 12. Future deep-learning roadmap

1. **Skill extraction**: replace keyword/taxonomy matching with a fine-tuned NER model (spaCy custom
   pipeline or a small BERT model) trained on labeled job postings.
2. **Skill similarity**: replace the lookup table with Sentence-Transformer embeddings + cosine
   similarity over a skill-embedding index (precomputed and cached).
3. **Demand prediction**: replace trend extrapolation with XGBoost or a time-series model (or an
   LSTM/temporal-transformer once enough historical district-level data accumulates).
4. **Career/curriculum recommendation**: replace rule-based scoring with a learned ranking model trained
   on placement outcomes (`Placement`, `EmployerFeedback` tables feed this directly).
5. **Where training data goes**: `/ai-service/datasets`, versioned and separated from `seedData.js`
   demo data. Label job postings for skill extraction; log real placement/employer-feedback records as
   they accumulate for the ranking model.
6. **How to fine-tune later**: `/ai-service/training` holds scripts decoupled from `/ai-service/services`
   (inference), so training runs never block the live API; a trained model artifact is versioned and
   loaded by swapping the relevant adapter in `/ai-service/models` — no other layer changes.
