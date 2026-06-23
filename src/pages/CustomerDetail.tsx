import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMockCustomerDetail } from '../mocks/customers'
import { fetchMockRecommendation } from '../mocks/recommendations'
import type { Recommendation } from '../types/recommendation'
import { segmentTone } from '../utils/segment'
import './CustomerDetail.css'

// R/F/M 점수를 5단 미터로 — 추상적 점수를 물리적으로 읽히게 (시그니처)
function Meter({
  letter,
  label,
  score,
  raw,
}: {
  letter: string
  label: string
  score: number
  raw: string
}) {
  return (
    <div className="meter">
      <div className="meter-top">
        <span className="meter-letter">{letter}</span>
        <span className="meter-score">{score}</span>
      </div>
      <div className="meter-bar" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= score ? 'seg on' : 'seg'} />
        ))}
      </div>
      <div className="meter-foot">
        <span className="meter-label">{label}</span>
        <span className="meter-raw">{raw}</span>
      </div>
    </div>
  )
}

type RecStatus = 'idle' | 'loading' | 'done'

function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const detail = id ? getMockCustomerDetail(id) : undefined

  const [recStatus, setRecStatus] = useState<RecStatus>('idle')
  const [rec, setRec] = useState<Recommendation | null>(null)

  const runRecommendation = async () => {
    if (!id) return
    setRecStatus('loading')
    // 추후 실제 API 호출로 교체될 부분
    const result = await fetchMockRecommendation(id)
    setRec(result)
    setRecStatus('done')
  }

  if (!detail) {
    return (
      <div className="detail">
        <button type="button" className="detail-back" onClick={() => navigate(-1)}>
          ← 고객목록
        </button>
        <div className="detail-empty">
          <h1>고객을 찾을 수 없습니다</h1>
          <p>
            ID <code>{id}</code> 에 해당하는 고객이 없습니다. 목록에서 다시
            선택해 주세요.
          </p>
        </div>
      </div>
    )
  }

  const { customerId, result, purchaseSummary } = detail

  return (
    <div className="detail">
      <button type="button" className="detail-back" onClick={() => navigate(-1)}>
        ← 고객목록
      </button>

      <div className="detail-grid">
        {/* 좌측 — 고객 상세 정보 카드 */}
        <div className="detail-main">
          {/* 헤더 — 식별 정보 */}
          <header className="detail-header">
            <div className="detail-id-area">
              <span className="eyebrow">Customer</span>
              <h1 className="detail-id">{customerId}</h1>
              <span className={`seg-chip ${segmentTone(result.segment)}`}>
                {result.segment}
              </span>
            </div>
            <div className="detail-analyzed">
              <span className="eyebrow">분석일시</span>
              <time>{new Date(result.analyzedAt).toLocaleString('ko-KR')}</time>
            </div>
          </header>

          {/* RFM 프로필 — 시그니처 */}
          <section className="rfm">
            <div className="rfm-head">
              <span className="eyebrow">RFM Profile</span>
              <span className="rfm-code">
                {result.rScore}
                <i>·</i>
                {result.fScore}
                <i>·</i>
                {result.mScore}
              </span>
            </div>
            <div className="rfm-meters">
              <Meter
                letter="R"
                label="Recency"
                score={result.rScore}
                raw={`${result.recency}일`}
              />
              <Meter
                letter="F"
                label="Frequency"
                score={result.fScore}
                raw={`${result.frequency}회`}
              />
              <Meter
                letter="M"
                label="Monetary"
                score={result.mScore}
                raw={result.monetary.toLocaleString()}
              />
            </div>

            {/* 분류 근거 — 강조 콜아웃 (서버 문자열 그대로) */}
            <div className="rationale-box">
              <div className="rationale-head">
                <span className="rationale-icon">✦</span>
                <span className="rationale-label">AI 분류 근거</span>
              </div>
              <p className="rationale-text">{result.rationale}</p>
            </div>
          </section>

          {/* 구매 요약 */}
          <section className="summary">
            <span className="eyebrow summary-eyebrow">Purchase Summary</span>
            <div className="summary-grid">
              <div className="summary-cell">
                <span className="summary-label">주문 건수</span>
                <span className="summary-value">
                  {purchaseSummary.invoiceCount.toLocaleString()}
                  <em>건</em>
                </span>
              </div>
              <div className="summary-cell">
                <span className="summary-label">총 수량</span>
                <span className="summary-value">
                  {purchaseSummary.totalQuantity.toLocaleString()}
                </span>
              </div>
              <div className="summary-cell">
                <span className="summary-label">총 구매액</span>
                <span className="summary-value">
                  {purchaseSummary.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="summary-cell">
                <span className="summary-label">최근 주문일</span>
                <span className="summary-value summary-date">
                  {new Date(purchaseSummary.lastInvoiceDate).toLocaleDateString(
                    'ko-KR',
                  )}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* 우측 — AI 상품 추천 영역 */}
        <aside className="detail-side">
          <div className="recommend-panel">
            <div className="recommend-top">
              <span className="eyebrow">AI Recommendation</span>
              <span className="recommend-spark">✦</span>
            </div>

            {recStatus === 'idle' && (
              <div className="recommend-center">
                <button
                  type="button"
                  className="recommend-btn"
                  onClick={runRecommendation}
                >
                  AI로 상품 추천하기
                </button>
                <p className="recommend-hint">
                  {customerId} 고객의 RFM 프로필을 바탕으로 어울리는 상품을
                  추천합니다.
                </p>
              </div>
            )}

            {recStatus === 'loading' && (
              <div className="recommend-center">
                <span className="recommend-spinner" aria-hidden="true" />
                <p className="recommend-hint">추천을 생성하는 중…</p>
              </div>
            )}

            {recStatus === 'done' && rec && (
              <div className="recommend-result">
                <ol className="rec-list">
                  {rec.products.map((p) => (
                    <li className="rec-item" key={p.stockCode}>
                      <span className="rec-rank">{p.rank}</span>
                      <div className="rec-body">
                        <div className="rec-row">
                          <span className="rec-code">{p.stockCode}</span>
                          <span className="rec-score">
                            {(p.similarityScore * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="rec-bar" aria-hidden="true">
                          <span
                            style={{ width: `${p.similarityScore * 100}%` }}
                          />
                        </div>
                        <div className="rec-reason">
                          <span className="rec-reason-tag">
                            {p.match_reason.source}
                          </span>
                          <span className="rec-reason-text">
                            {p.match_reason.co_purchased_with} 기준 · 지지도{' '}
                            {(p.match_reason.segment_support * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="rec-why">
                  <span className="rec-why-icon">✦</span>
                  <div className="rec-why-body">
                    <span className="rec-why-label">추천 이유</span>
                    <p className="rec-why-text">{rec.rationale}</p>
                  </div>
                </div>

                <div className="recommend-result-foot">
                  <span>
                    {new Date(rec.createdAt).toLocaleString('ko-KR')} 생성
                  </span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CustomerDetail
