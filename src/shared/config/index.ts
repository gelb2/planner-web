export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const APP_CONFIG = {
  name: 'Planner App',
  version: '1.0.0',
  apiTimeout: 10000,
} as const