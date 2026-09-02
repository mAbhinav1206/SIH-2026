// ---------------------------------------------------------------------------
// SkillAlign AI — Demo Seed Data
// This is SYNTHETIC demo data clearly separated from any production source.
// In production this is replaced by data ingested via the Spring Boot API
// (backed by MySQL) which in turn is populated by the labour-market ETL jobs.
// ---------------------------------------------------------------------------

export const INDUSTRIES = [
  'Information Technology', 'Manufacturing', 'Renewable Energy', 'Healthcare',
  'Retail & E-commerce', 'BFSI', 'Logistics', 'Construction',
]

export const DISTRICTS = [
  { id: 'ggn', name: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { id: 'blr', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { id: 'hyd', name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { id: 'chn', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { id: 'noi', name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
  { id: 'ahm', name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { id: 'jai', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { id: 'bho', name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { id: 'coi', name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
]

export const SKILLS = [
  { id: 'sk1', name: 'Python', demand: 'HIGH', growth: 38, industries: ['Information Technology', 'BFSI', 'Manufacturing'], jobs: ['Data Analyst', 'Backend Developer', 'ML Engineer'], proficiency: 'Intermediate', related: ['SQL', 'Pandas', 'Machine Learning'] },
  { id: 'sk2', name: 'SQL', demand: 'HIGH', growth: 22, industries: ['Information Technology', 'BFSI', 'Retail & E-commerce'], jobs: ['Data Analyst', 'BI Developer'], proficiency: 'Intermediate', related: ['Power BI', 'Python', 'Excel'] },
  { id: 'sk3', name: 'Power BI', demand: 'VERY HIGH', growth: 44, industries: ['BFSI', 'Retail & E-commerce', 'Manufacturing'], jobs: ['Data Analyst', 'BI Developer'], proficiency: 'Intermediate', related: ['SQL', 'Data Visualization', 'Excel'] },
  { id: 'sk4', name: 'Excel', demand: 'MEDIUM', growth: 4, industries: ['BFSI', 'Retail & E-commerce', 'Construction'], jobs: ['Data Analyst', 'Operations Executive'], proficiency: 'Basic', related: ['SQL', 'Power BI'] },
  { id: 'sk5', name: 'Cloud Computing (AWS/Azure)', demand: 'VERY HIGH', growth: 41, industries: ['Information Technology', 'BFSI'], jobs: ['Cloud Engineer', 'DevOps Engineer'], proficiency: 'Advanced', related: ['Linux', 'DevOps', 'Kubernetes'] },
  { id: 'sk6', name: 'Solar PV Installation', demand: 'HIGH', growth: 52, industries: ['Renewable Energy', 'Construction'], jobs: ['Solar Technician', 'Site Electrician'], proficiency: 'Intermediate', related: ['Electrical Wiring', 'Safety Compliance'] },
  { id: 'sk7', name: 'Industrial Automation (PLC/SCADA)', demand: 'HIGH', growth: 29, industries: ['Manufacturing'], jobs: ['Automation Technician', 'Maintenance Engineer'], proficiency: 'Advanced', related: ['Robotics', 'Electrical Wiring'] },
  { id: 'sk8', name: 'Digital Marketing', demand: 'MEDIUM', growth: 18, industries: ['Retail & E-commerce', 'BFSI'], jobs: ['Marketing Executive', 'Growth Associate'], proficiency: 'Basic', related: ['SEO', 'Content Strategy'] },
  { id: 'sk9', name: 'Machine Learning', demand: 'VERY HIGH', growth: 47, industries: ['Information Technology', 'BFSI'], jobs: ['ML Engineer', 'Data Analyst'], proficiency: 'Advanced', related: ['Python', 'Statistics'] },
  { id: 'sk10', name: 'Warehouse Management Systems', demand: 'MEDIUM', growth: 15, industries: ['Logistics', 'Retail & E-commerce'], jobs: ['Logistics Coordinator', 'Supply Chain Executive'], proficiency: 'Basic', related: ['Inventory Planning', 'ERP'] },
  { id: 'sk11', name: 'Basic Data Entry', demand: 'LOW', growth: -42, industries: ['BFSI', 'Retail & E-commerce'], jobs: ['Data Entry Operator'], proficiency: 'Basic', related: ['Excel'] },
  { id: 'sk12', name: 'Manual Bookkeeping', demand: 'LOW', growth: -31, industries: ['BFSI'], jobs: ['Accounts Assistant'], proficiency: 'Basic', related: ['Tally', 'Excel'] },
  { id: 'sk13', name: 'Tally / GST Compliance', demand: 'MEDIUM', growth: 9, industries: ['BFSI', 'Retail & E-commerce'], jobs: ['Accounts Assistant'], proficiency: 'Intermediate', related: ['Manual Bookkeeping'] },
  { id: 'sk14', name: 'Electric Vehicle Maintenance', demand: 'VERY HIGH', growth: 58, industries: ['Manufacturing', 'Renewable Energy'], jobs: ['EV Technician'], proficiency: 'Intermediate', related: ['Battery Systems', 'Electrical Wiring'] },
  { id: 'sk15', name: 'Cybersecurity Fundamentals', demand: 'HIGH', growth: 36, industries: ['Information Technology', 'BFSI'], jobs: ['Security Analyst', 'Cloud Engineer'], proficiency: 'Advanced', related: ['Networking', 'Cloud Computing (AWS/Azure)'] },
]

export const JOB_ROLES = [
  { id: 'jr1', title: 'Data Analyst', industry: 'Information Technology', demand: 'HIGH', growth: 34, skills: ['Excel', 'SQL', 'Python', 'Power BI'], avgSalary: '₹5.2L', openings: 1840 },
  { id: 'jr2', title: 'Cloud Engineer', industry: 'Information Technology', demand: 'VERY HIGH', growth: 41, skills: ['Cloud Computing (AWS/Azure)', 'Cybersecurity Fundamentals'], avgSalary: '₹9.6L', openings: 1120 },
  { id: 'jr3', title: 'Solar Technician', industry: 'Renewable Energy', demand: 'HIGH', growth: 52, skills: ['Solar PV Installation'], avgSalary: '₹3.6L', openings: 960 },
  { id: 'jr4', title: 'Automation Technician', industry: 'Manufacturing', demand: 'HIGH', growth: 29, skills: ['Industrial Automation (PLC/SCADA)'], avgSalary: '₹4.4L', openings: 780 },
  { id: 'jr5', title: 'EV Technician', industry: 'Manufacturing', demand: 'VERY HIGH', growth: 58, skills: ['Electric Vehicle Maintenance'], avgSalary: '₹3.9L', openings: 1310 },
  { id: 'jr6', title: 'Logistics Coordinator', industry: 'Logistics', demand: 'MEDIUM', growth: 15, skills: ['Warehouse Management Systems'], avgSalary: '₹3.4L', openings: 640 },
  { id: 'jr7', title: 'Data Entry Operator', industry: 'BFSI', demand: 'LOW', growth: -42, skills: ['Basic Data Entry'], avgSalary: '₹2.1L', openings: 210 },
  { id: 'jr8', title: 'Accounts Assistant', industry: 'BFSI', demand: 'MEDIUM', growth: 9, skills: ['Tally / GST Compliance', 'Excel'], avgSalary: '₹2.8L', openings: 520 },
]

export const COURSES = [
  {
    id: 'c1', name: 'Data Analytics', industry: 'Information Technology', seats: 400, placementRate: 61,
    curriculum: ['Excel', 'SQL', 'Statistics'],
    industryRequirement: ['Excel', 'SQL', 'Statistics', 'Python', 'Power BI'],
  },
  {
    id: 'c2', name: 'Cloud & DevOps Fundamentals', industry: 'Information Technology', seats: 220, placementRate: 74,
    curriculum: ['Linux Basics', 'Cloud Computing (AWS/Azure)'],
    industryRequirement: ['Cloud Computing (AWS/Azure)', 'Cybersecurity Fundamentals', 'DevOps'],
  },
  {
    id: 'c3', name: 'Solar Technician Certification', industry: 'Renewable Energy', seats: 80, placementRate: 82,
    curriculum: ['Electrical Wiring', 'Solar PV Installation', 'Safety Compliance'],
    industryRequirement: ['Solar PV Installation', 'Electrical Wiring', 'Safety Compliance'],
  },
  {
    id: 'c4', name: 'Industrial Automation', industry: 'Manufacturing', seats: 150, placementRate: 58,
    curriculum: ['Electrical Wiring', 'Robotics Basics'],
    industryRequirement: ['Industrial Automation (PLC/SCADA)', 'Robotics', 'Electrical Wiring'],
  },
  {
    id: 'c5', name: 'Basic Data Entry & Office Tools', industry: 'BFSI', seats: 320, placementRate: 31,
    curriculum: ['Basic Data Entry', 'Excel Basics'],
    industryRequirement: ['Tally / GST Compliance', 'Excel'],
  },
  {
    id: 'c6', name: 'EV Maintenance & Repair', industry: 'Manufacturing', seats: 60, placementRate: 79,
    curriculum: ['Electrical Wiring', 'Battery Systems'],
    industryRequirement: ['Electric Vehicle Maintenance', 'Battery Systems', 'Electrical Wiring'],
  },
  {
    id: 'c7', name: 'Manual Bookkeeping', industry: 'BFSI', seats: 140, placementRate: 27,
    curriculum: ['Manual Bookkeeping'],
    industryRequirement: ['Tally / GST Compliance', 'Excel'],
  },
]

export const DISTRICT_TRAINING = {
  ggn: {
    demand: [{ industry: 'Information Technology', level: 'HIGH' }, { industry: 'Manufacturing', level: 'MEDIUM' }, { industry: 'Renewable Energy', level: 'HIGH' }],
    capacity: [{ course: 'Data Analytics', seats: 400 }, { course: 'Cloud & DevOps Fundamentals', seats: 100 }, { course: 'Solar Technician Certification', seats: 80 }],
    recommendations: [
      { action: 'Increase Cloud & DevOps seats', change: '+40%', priority: 'HIGH' },
      { action: 'Increase Solar Technician seats', change: '+60%', priority: 'HIGH' },
      { action: 'Reduce Basic Data Entry seats', change: '-20%', priority: 'MEDIUM' },
    ],
    trainers: 34, equipment: ['Solar PV rigs (x6)', 'Cloud lab workstations (x25)'],
  },
  pune: {
    demand: [{ industry: 'Manufacturing', level: 'HIGH' }, { industry: 'Information Technology', level: 'HIGH' }, { industry: 'Logistics', level: 'MEDIUM' }],
    capacity: [{ course: 'Industrial Automation', seats: 150 }, { course: 'Data Analytics', seats: 180 }],
    recommendations: [
      { action: 'Increase Industrial Automation seats', change: '+25%', priority: 'HIGH' },
      { action: 'Add EV Maintenance batch', change: 'new: 60 seats', priority: 'HIGH' },
    ],
    trainers: 28, equipment: ['PLC training kits (x10)', 'EV diagnostic tools (x8)'],
  },
}

export const EMPLOYERS = [
  { id: 'e1', name: 'Northbridge Analytics', industry: 'Information Technology', validated: [{ skill: 'Power BI', important: true, proficiency: 'Intermediate', taught: false }] },
  { id: 'e2', name: 'Suryoday Renewables', industry: 'Renewable Energy', validated: [{ skill: 'Solar PV Installation', important: true, proficiency: 'Intermediate', taught: true }] },
]

export const DASHBOARD_STATS = {
  jobsAnalyzed: 24580,
  skillsDetected: 1284,
  highDemandSkills: 128,
  skillGaps: 46,
  coursesAtRisk: 18,
  alignmentScore: 68,
}

export const SKILL_DEMAND_TREND = [
  { month: 'Mar', Python: 52, PowerBI: 40, SolarPV: 30 },
  { month: 'Apr', Python: 55, PowerBI: 44, SolarPV: 33 },
  { month: 'May', Python: 58, PowerBI: 49, SolarPV: 38 },
  { month: 'Jun', Python: 63, PowerBI: 55, SolarPV: 44 },
  { month: 'Jul', Python: 67, PowerBI: 60, SolarPV: 49 },
  { month: 'Aug', Python: 71, PowerBI: 66, SolarPV: 55 },
]

export const INDUSTRY_DISTRIBUTION = INDUSTRIES.map((name, i) => ({
  name, value: [3400, 2800, 1600, 2100, 2600, 3100, 1900, 1400][i],
}))
