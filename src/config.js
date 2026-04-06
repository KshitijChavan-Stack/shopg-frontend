const isProd = process.env.NODE_ENV === 'production';
export const API = isProd ? '/api' : (process.env.REACT_APP_API_URL || "http://localhost:8000/api");
