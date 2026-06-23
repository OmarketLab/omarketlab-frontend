import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './AppLayout.css'

// 사이드바 + 본문(Outlet) 공통 레이아웃 — 로그인 이후 화면들이 공유
function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
