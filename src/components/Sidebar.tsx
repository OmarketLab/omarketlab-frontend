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
        <span className="sidebar-mark">om</span>
        <span className="sidebar-word">
          omarketlab
          <span className="sidebar-tag">고객 인텔리전스</span>
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
