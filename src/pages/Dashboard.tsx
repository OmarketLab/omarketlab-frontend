import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSegmentSummary } from '../api/segments'
import type { SegmentCount, SegmentSummary } from '../types/segment'
import { SEGMENTS, segmentTone } from '../utils/segment'
import './Dashboard.css'

type Status = 'loading' | 'error' | 'done'

// 가치 단계(SEGMENTS) 순서로 정렬 — 정의에 없는 세그먼트는 뒤로
function segIndex(seg: string): number {
  const i = SEGMENTS.indexOf(seg as (typeof SEGMENTS)[number])
  return i === -1 ? SEGMENTS.length : i
}

function Dashboard() {
  const [summary, setSummary] = useState<SegmentSummary | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    getSegmentSummary()
      .then((data) => {
        if (!active) return
        setSummary(data)
        setStatus('done')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="dash">
      <header className="dash-head">
        <span className="eyebrow">Overview</span>
        <div className="dash-title-row">
          <h1 className="dash-title">대시보드</h1>
          {status === 'done' && summary && (
            <span className="dash-analyzed">
              분석{' '}
              {new Date(summary.analyzedAt).toLocaleString('ko-KR', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          )}
        </div>
        <p className="dash-sub">
          RFM 세그먼트로 고객을 읽고, AI 추천으로 다음 행동을 정합니다.
        </p>
      </header>

      {status === 'loading' && (
        <div className="dash-card dash-state">세그먼트 요약을 불러오는 중…</div>
      )}

      {status === 'error' && (
        <div className="dash-card dash-state">
          세그먼트 요약을 불러오지 못했습니다. 서버 연결을 확인해 주세요.
        </div>
      )}

      {status === 'done' && summary && (
        <SegmentOverview summary={summary} />
      )}

      {/* 조회 전(로딩/에러)에도 CTA는 노출 — done이면 좌측 컬럼 안에 들어감 */}
      {status !== 'done' && <CustomersCta />}
    </div>
  )
}

// 고객목록 바로가기 CTA
function CustomersCta() {
  return (
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
  )
}

function SegmentOverview({ summary }: { summary: SegmentSummary }) {
  // 비율은 세그먼트 합계 기준 — 누적 바가 항상 100%를 채우고 카드 비율과 일치
  const total = summary.segments.reduce((acc, s) => acc + s.count, 0) || 1
  const ordered = [...summary.segments].sort(
    (a, b) => segIndex(a.segment) - segIndex(b.segment),
  )

  return (
    <div className="dash-grid">
      {/* 좌측 — 구성 누적 바 + 세그먼트 카드 */}
      <div className="dash-left">
        <section className="comp">
          <div className="comp-top">
            <span className="eyebrow">Segment Composition</span>
            <div className="comp-total">
              <span className="comp-total-num">
                {summary.totalCustomers.toLocaleString()}
              </span>
              <span className="comp-total-label">전체 고객</span>
            </div>
          </div>

          <div className="comp-bar" role="img" aria-label="세그먼트 구성 비율">
            {ordered.map((s) => (
              <div
                key={s.segment}
                className={`comp-seg ${segmentTone(s.segment)}`}
                style={{ width: `${(s.count / total) * 100}%` }}
                title={`${s.segment} · ${s.count.toLocaleString()}명`}
              />
            ))}
          </div>
        </section>

        <div className="seg-grid">
          {ordered.map((s) => {
            const pct = (s.count / total) * 100
            return (
              <div
                key={s.segment}
                className={`seg-card ${segmentTone(s.segment)}`}
              >
                <span className="seg-chip seg-card-chip">{s.segment}</span>
                <span className="seg-card-count">
                  {s.count.toLocaleString()}
                  <em>명</em>
                </span>
                <div className="seg-card-foot">
                  <div className="seg-card-bar">
                    <span style={{ width: `${pct}%` }} />
                  </div>
                  <span className="seg-card-pct">{pct.toFixed(1)}%</span>
                </div>
              </div>
            )
          })}
        </div>

        <CustomersCta />
      </div>

      {/* 우측 — 큰 도넛 차트 패널 */}
      <aside className="donut-panel">
        <span className="eyebrow">Distribution</span>
        <div className="donut-wrap">
          <Donut
            segments={ordered}
            total={total}
            centerValue={summary.totalCustomers}
            size={264}
            stroke={36}
          />
        </div>
      </aside>
    </div>
  )
}

// SVG 도넛 차트 — 세그먼트 톤 색으로 비율을 원형으로 (외부 라이브러리 없이)
function Donut({
  segments,
  total,
  centerValue,
  size = 184,
  stroke = 26,
}: {
  segments: SegmentCount[]
  total: number
  centerValue: number
  size?: number
  stroke?: number
}) {
  const radius = (size - stroke) / 2
  const cx = size / 2
  const circumference = 2 * Math.PI * radius
  const gap = 2 // 세그먼트 사이 미세 간격
  let cumulative = 0

  return (
    <svg
      className="donut"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="세그먼트 비율 도넛 차트"
    >
      <g transform={`rotate(-90 ${cx} ${cx})`}>
        <circle
          cx={cx}
          cy={cx}
          r={radius}
          fill="none"
          stroke="var(--line-2)"
          strokeWidth={stroke}
        />
        {segments.map((s) => {
          const len = (s.count / total) * circumference
          const visible = Math.max(len - gap, 0)
          const dashoffset = -cumulative
          cumulative += len
          return (
            <circle
              key={s.segment}
              className={`donut-seg ${segmentTone(s.segment)}`}
              cx={cx}
              cy={cx}
              r={radius}
              fill="none"
              stroke="var(--seg)"
              strokeWidth={stroke}
              strokeDasharray={`${visible} ${circumference - visible}`}
              strokeDashoffset={dashoffset}
            >
              <title>{`${s.segment} · ${s.count.toLocaleString()}명`}</title>
            </circle>
          )
        })}
      </g>
      <text
        className="donut-num"
        x={cx}
        y={cx - 7}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {centerValue.toLocaleString()}
      </text>
      <text
        className="donut-label"
        x={cx}
        y={cx + 22}
        textAnchor="middle"
        dominantBaseline="central"
      >
        전체 고객
      </text>
    </svg>
  )
}

export default Dashboard
