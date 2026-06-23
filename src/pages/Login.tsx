import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './Login.css'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // mock 로그인 — 입력값 검증 없이 통과 처리 후 대시보드로 이동
    login()
    navigate('/', { replace: true })
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <span className="login-mark">om</span>
          <span className="login-name">omarketlab</span>
        </div>

        <div className="login-intro">
          <span className="eyebrow">고객 인텔리전스 콘솔</span>
          <h1 className="login-title">OMarket 로그인</h1>
        </div>

        <label className="login-field">
          <span className="login-label">아이디</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="analyst@omarketlab"
            autoComplete="username"
          />
        </label>

        <label className="login-field">
          <span className="login-label">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="login-submit">
          로그인
        </button>
      </form>
    </div>
  )
}

export default Login
