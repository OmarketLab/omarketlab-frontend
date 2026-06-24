import axios from 'axios'

// 공용 axios 인스턴스 — baseURL은 .env(VITE_API_BASE_URL)에서 주입.
// Spring 측 CorsConfig가 localhost:5173 Origin·credentials를 허용하므로 직접 호출한다.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  // 추후 인증(쿠키/Authorization) 필요 시 withCredentials: true 활성화
})
