export const appEnv = {
  aiProvider: import.meta.env.VITE_AI_PROVIDER || 'mock',
  aiBaseUrl: import.meta.env.VITE_AI_BASE_URL || 'http://localhost:8080/api',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  aiModel: import.meta.env.VITE_AI_MODEL || 'llama3.2',
}
