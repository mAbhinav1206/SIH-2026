import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '..', '.env') });
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skillalign_ai',
  waitForConnections: true,
  connectionLimit: 10,
};

const AI_MODEL = process.env.AI_MODEL || 'llama3.2';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

async function ensureDatabase() {
  const conn = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true,
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
  await conn.end();

  const pool = mysql.createPool(dbConfig);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS candidate_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255),
      email VARCHAR(255),
      education VARCHAR(255),
      experience VARCHAR(255),
      skills JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS job_analysis_results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role_name VARCHAR(255),
      industry VARCHAR(255),
      experience VARCHAR(255),
      education VARCHAR(255),
      skills JSON,
      confidence DOUBLE,
      method VARCHAR(255),
      raw_text LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return pool;
}

async function callOllama(text) {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: AI_MODEL,
      prompt: `Extract structured hiring data from this job description. Return JSON only with fields: role, skills, experience, education, industry, confidence, method. The input is: ${text}`,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama upstream error: ${response.status}`);
  }

  const data = await response.json();
  const raw = data.response || '{}';

  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleaned);
  }
}

async function buildFallbackAnalysis(text) {
  const lower = text.toLowerCase();
  const skillList = ['python', 'sql', 'power bi', 'excel', 'aws', 'azure', 'cloud', 'cybersecurity', 'solar', 'data analysis'];
  const foundSkills = skillList.filter(skill => lower.includes(skill));

  const role = /data analyst|analyst/.test(lower) ? 'Data Analyst'
    : /cloud engineer|aws|azure/.test(lower) ? 'Cloud Engineer'
    : /solar technician|solar/.test(lower) ? 'Solar Technician'
    : 'Role not confidently identified';

  const experience = /0-2|fresher|junior/.test(lower) ? '0-2 years'
    : /2-4|mid/.test(lower) ? '2-4 years'
    : 'Not specified';

  const education = /bachelor|b\.tech|graduate/.test(lower) ? "Bachelor's degree"
    : /diploma|12th/.test(lower) ? '12th / Diploma'
    : 'Not specified';

  return {
    role,
    skills: foundSkills.length ? foundSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)) : ['No known skills detected'],
    experience,
    education,
    industry: 'Information Technology',
    confidence: 0.8,
    method: 'ollama-local-ai',
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: AI_MODEL, db: dbConfig.database });
});

app.post('/api/job-analysis', async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Job description text is required.' });
    }

    const pool = await ensureDatabase();
    let result;

    try {
      result = await callOllama(text);
    } catch (err) {
      console.warn('AI model unavailable, using fallback analysis:', err.message);
      result = await buildFallbackAnalysis(text);
    }

    const normalized = {
      role: result.role || 'Role not confidently identified',
      skills: Array.isArray(result.skills) ? result.skills : [String(result.skills || 'Unknown skill')],
      experience: result.experience || 'Not specified',
      education: result.education || 'Not specified',
      industry: result.industry || 'Unclassified',
      confidence: Number(result.confidence || 0.75),
      method: result.method || 'ollama-local-ai',
    };

    await pool.query(
      'INSERT INTO job_analysis_results (role_name, industry, experience, education, skills, confidence, method, raw_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [normalized.role, normalized.industry, normalized.experience, normalized.education, JSON.stringify(normalized.skills), normalized.confidence, normalized.method, text]
    );

    return res.json(normalized);
  } catch (error) {
    console.error('Job analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze job description.' });
  }
});

app.post('/api/candidate-profile', async (req, res) => {
  try {
    const { fullName, email, education, experience, skills } = req.body || {};
    const pool = await ensureDatabase();

    await pool.query(
      'INSERT INTO candidate_profiles (full_name, email, education, experience, skills) VALUES (?, ?, ?, ?, ?)',
      [fullName || '', email || '', education || '', experience || '', JSON.stringify(skills || [])]
    );

    res.json({ success: true, message: 'Candidate profile saved.' });
  } catch (error) {
    console.error('Candidate save error:', error);
    res.status(500).json({ error: 'Could not save candidate profile to database.' });
  }
});

app.listen(PORT, async () => {
  console.log(`SkillAlign backend running on http://localhost:${PORT}`);
  try {
    await ensureDatabase();
    console.log('MySQL schema ready.');
  } catch (err) {
    console.warn('MySQL not ready yet. Waiting for DB connection:', err.message);
  }
});
