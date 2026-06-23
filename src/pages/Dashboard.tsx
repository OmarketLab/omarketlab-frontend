import { Link } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  return (
    <div className="dash">
      <header className="dash-head">
        <span className="eyebrow">Overview</span>
        <h1 className="dash-title">대시보드</h1>
        <p className="dash-sub">
          RFM 세그먼트로 고객을 읽고, AI 추천으로 다음 행동을 정합니다.
        </p>
      </header>

      <Link to="/customers" className="dash-cta">
        <div className="dash-cta-body">
          <span className="eyebrow">바로가기</span>
          <span className="dash-cta-title">고객목록 열기</span>
          <span className="dash-cta-desc">
            전체 고객의 RFM 점수와 세그먼트를 한눈에 확인합니다.
          </span>
        </div>
        <span className="dash-cta-arrow">→</span>
      </Link>
    </div>
  )
}

export default Dashboard
