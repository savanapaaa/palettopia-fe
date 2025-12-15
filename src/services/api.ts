import axios from "axios";

// API Configuration
// Change this to http://127.0.0.1:8000 if localhost doesn't work
const API_BASE_URL = 'http://localhost:8000';

// Set default configuration
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getCsrfCookie = () => {
  return axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

// Helper untuk membuat full URL image
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  
  // Jika sudah full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Jika path relatif, tambahkan base URL
  // Remove leading slash jika ada
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

// Export API_BASE_URL untuk digunakan di component lain
export { API_BASE_URL };

// API Endpoints Documentation
// 
// 1. POST /api/uploads/image
//    - Upload image file
//    - Returns: { url: "/storage/analyses/xxxxx.jpg" }
//
// 2. POST /api/analysis
//    - Analyze uploaded image
//    - Body: { image_url: "/storage/analyses/xxxxx.jpg" }
//    - Returns: { success: true, data: { palette_name, colors, undertone, explanation } }
//
// 3. GET /api/recommendations?palette=winter%20clear&limit=8
//    - Get product recommendations by palette
//    - Returns: { palette, total, recommendations: [...] }

export default api;
