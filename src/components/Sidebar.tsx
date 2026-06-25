import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './Sidebar.css'

function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <svg className="sidebar-mark" viewBox="0 0 256 256" aria-label="OMarketLab 로고">
          <defs>
            <linearGradient id="omSidebarBag" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F9A94B" />
              <stop offset="1" stopColor="#ED7A14" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="256" height="256" rx="56" fill="#23272F" />
          <path d="M96 80 a16 30 0 0 1 32 0" fill="none" stroke="url(#omSidebarBag)" strokeWidth="13" strokeLinecap="round" />
          <path d="M128 80 a16 30 0 0 1 32 0" fill="none" stroke="url(#omSidebarBag)" strokeWidth="13" strokeLinecap="round" />
          <rect x="62" y="74" width="132" height="116" rx="26" fill="url(#omSidebarBag)" />
          <circle cx="128" cy="132" r="34" fill="#23272F" />
        </svg>
        <span className="sidebar-word">
          OMarketLab
          <span className="sidebar-tag">AI 고객 인텔리전스</span>
        </span>
      </div>

      <nav className="sidebar-nav">
        <span className="eyebrow sidebar-section">Menu</span>
        <NavLink to="/" end className="sidebar-link">
          대시보드
        </NavLink>
        <NavLink to="/customers" className="sidebar-link">
          고객목록
        </NavLink>
      </nav>

      <button type="button" className="sidebar-logout" onClick={handleLogout}>
        로그아웃
      </button>
    </aside>
  )
}

export default Sidebar
