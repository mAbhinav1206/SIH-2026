import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MarketIntelligence from './pages/MarketIntelligence'
import JobAnalysis from './pages/JobAnalysis'
import Skills from './pages/Skills'
import CourseAlignment from './pages/CourseAlignment'
import CourseRisk from './pages/CourseRisk'
import DistrictPlanner from './pages/DistrictPlanner'
import CareerGuidance from './pages/CareerGuidance'
import EmployerValidation from './pages/EmployerValidation'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/market-intelligence" element={<MarketIntelligence />} />
        <Route path="/job-analysis" element={<JobAnalysis />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/course-alignment" element={<CourseAlignment />} />
        <Route path="/course-risk" element={<CourseRisk />} />
        <Route path="/district-planner" element={<DistrictPlanner />} />
        <Route path="/career-guidance" element={<CareerGuidance />} />
        <Route path="/employer-validation" element={<EmployerValidation />} />
      </Routes>
    </Layout>
  )
}
