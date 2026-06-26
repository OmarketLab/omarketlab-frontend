import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './Sidebar.css'

// 로고 마크 — 상단바/사이드바 두 곳에서 사용. gradient id 충돌 방지를 위해 idSuffix로 구분
function BrandMark({ idSuffix }: { idSuffix: string }) {
  const gradId = `omBag-${idSuffix}`
  return (
    <svg className="sidebar-mark" viewBox="0 0 256 256" aria-label="OMarketLab 로고">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F9A94B" />
          <stop offset="1" stopColor="#ED7A14" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="256" height="256" rx="56" fill="#23272F" />
      <path d="M96 80 a16 30 0 0 1 32 0" fill="none" stroke={`url(#${gradId})`} strokeWidth="13" strokeLinecap="round" />
      <path d="M128 80 a16 30 0 0 1 32 0" fill="none" stroke={`url(#${gradId})`} strokeWidth="13" strokeLinecap="round" />
      <rect x="62" y="74" width="132" height="116" rx="26" fill={`url(#${gradId})`} />
      <circle cx="128" cy="132" r="34" fill="#23272F" />
    </svg>
  )
}

function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* 모바일 전용 상단바 — 데스크톱에서는 숨김 */}
      <header className="header">
        {/* 로고 클릭 시 대시보드로 이동 */}
        <Link to="/" className="header-brand" aria-label="대시보드로 이동">
          <BrandMark idSuffix="top" />
          <span className="header-word">OMarketLab</span>
        </Link>
        <button type="button" className="header-logout" onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      {/* 데스크톱 사이드바 — 모바일에서는 숨김 */}
      <aside className="sidebar">
        {/* 로고 클릭 시 대시보드로 이동 */}
        <Link to="/" className="sidebar-brand" aria-label="대시보드로 이동">
          <BrandMark idSuffix="side" />
          <span className="sidebar-word">
            OMarketLab
            <span className="sidebar-tag">AI 고객 인텔리전스</span>
          </span>
        </Link>

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

      {/* 모바일 전용 하단 탭 바 — 데스크톱에서는 숨김 */}
      <nav className="nav">
        <NavLink to="/" end className="nav-link">
          <svg
            className="nav-ic"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.6" />
            <rect x="14" y="3" width="7" height="7" rx="1.6" />
            <rect x="3" y="14" width="7" height="7" rx="1.6" />
            <rect x="14" y="14" width="7" height="7" rx="1.6" />
          </svg>
          <span className="nav-text">대시보드</span>
        </NavLink>
        <NavLink to="/customers" className="nav-link">
          <svg
            className="nav-ic"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="nav-text">고객목록</span>
        </NavLink>
      </nav>
    </>
  )
}

export default Sidebar
