import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './Login.css'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // if (!username.trim() || !password.trim()) {
    //   setError('아이디와 비밀번호를 모두 입력해 주세요.')
    //   return
    // }
    // mock 로그인 — 데모 계정만 통과, 그 외 401 처리
    // if (username.trim() === 'marketer01' && password.trim() === 'P@ssw0rd!') {
    //   setError('')
    //   login()
    //   navigate('/', { replace: true })
    // } else {
    //   setError('아이디 또는 비밀번호가 일치하지 않습니다.')
    // }
      login()
      navigate('/', { replace: true })
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <svg className="login-logo" viewBox="0 0 256 256" aria-label="OMarketLab 로고">
            <defs>
              <linearGradient id="omBag" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#F9A94B" />
                <stop offset="1" stopColor="#ED7A14" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="256" height="256" rx="40" fill="#23272F" />
            <path d="M96 78 a32 28 0 0 1 64 0" fill="none" stroke="url(#omBag)" strokeWidth="13" strokeLinecap="round" />
            <rect x="62" y="74" width="132" height="116" rx="26" fill="url(#omBag)" />
            <circle cx="128" cy="132" r="34" fill="#23272F" />
          </svg>
          <span className="login-name">OMarketLab</span>
        </div>

        <div className="login-intro">
          <span className="eyebrow">고객 인텔리전스 콘솔</span>
          <h1 className="login-title">마케터 콘솔 로그인</h1>
        </div>

        {error && (
          <div className="login-error" role="alert">
            <span aria-hidden>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <label className="login-field">
          <span className="login-label">사원 아이디</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="marketer01"
            autoComplete="username"
          />
        </label>

        <label className="login-field">
          <span className="login-label">비밀번호</span>
          <div className="login-pw-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-pw-toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label="비밀번호 표시"
            >
              {showPw ? '🙈' : '👁'}
            </button>
          </div>
        </label>

        <button type="submit" className="login-submit">
          로그인
        </button>

        <p className="login-hint">데모 계정 marketer01 / P@ssw0rd!</p>
      </form>
    </div>
  )
}

export default Login
