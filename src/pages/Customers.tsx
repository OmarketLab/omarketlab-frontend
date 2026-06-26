import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchCustomerPage } from '../api/customers'
import type { Customer, PageMeta } from '../types/customer'
import { SEGMENTS, segmentTone } from '../utils/segment'
import Pagination from '../components/Pagination'
import './Customers.css'

const PAGE_SIZE_OPTIONS = [20, 50, 100] as const // 한 번에 불러오는 고객 수(size = limit)
const MOBILE_QUERY = '(max-width: 768px)'
// 필터 선택지는 segment.ts(SEGMENTS)를 단일 출처로 사용

// 뷰포트가 모바일 폭인지 추적 — PC는 페이지네이션, 모바일은 무한 스크롤
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  )
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

function Customers() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isMobile = useIsMobile()
  const [pageNumber, setPageNumber] = useState(0)
  const [size, setSize] = useState<number>(PAGE_SIZE_OPTIONS[0])
  // 대시보드 카드 클릭 시 ?segment=... 로 들어오면 해당 세그먼트로 초기 필터링
  const [segment, setSegment] = useState<string>(
    () => searchParams.get('segment') ?? '',
  ) // '' = 전체

  // GET /api/v1/customers?page={pageNumber}&size={size}&segment={segment}
  const [content, setContent] = useState<Customer[]>([])
  const [page, setPage] = useState<PageMeta | null>(null)
  const [status, setStatus] = useState<'loading' | 'error' | 'done'>('loading') // 첫 페이지 상태
  const [loadingMore, setLoadingMore] = useState(false) // 다음 페이지 로딩 중(모바일)
  const [moreError, setMoreError] = useState(false) // 다음 페이지 로딩 실패(모바일)
  const [reloadKey, setReloadKey] = useState(0) // 재시도 트리거

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  // 더 불러올 페이지가 있는지 (현재 페이지가 마지막 페이지 이전인지)
  const hasMore = page ? page.number < page.totalPages - 1 : false

  // 페이지 로드 — 모바일에서 page>0이면 누적(무한 스크롤), 그 외엔 교체(PC 페이지네이션/필터 변경)
  useEffect(() => {
    let active = true
    const append = isMobile && pageNumber > 0
    if (append) setLoadingMore(true)
    else setStatus('loading')
    setMoreError(false)

    fetchCustomerPage(pageNumber, size, segment)
      .then((res) => {
        if (!active) return
        setContent((prev) => (append ? [...prev, ...res.content] : res.content))
        setPage(res.page)
        setStatus('done')
        setLoadingMore(false)
      })
      .catch(() => {
        if (!active) return
        if (append) setMoreError(true)
        else setStatus('error')
        setLoadingMore(false)
      })
    return () => {
      active = false
    }
    // isMobile은 모드 전환 시 아래 effect가 pageNumber를 0으로 리셋해 재실행됨
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, size, segment, reloadKey])

  // PC ↔ 모바일 전환 시 첫 페이지로 리셋 (초기 마운트는 건너뜀)
  const modeRef = useRef(isMobile)
  useEffect(() => {
    if (modeRef.current === isMobile) return
    modeRef.current = isMobile
    setPageNumber(0)
  }, [isMobile])

  // 모바일 — 화면 하단 센티넬이 보이면 다음 페이지 로드 (무한 스크롤)
  useEffect(() => {
    if (!isMobile || status !== 'done' || !hasMore || loadingMore || moreError)
      return
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPageNumber((n) => n + 1)
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isMobile, status, hasMore, loadingMore, moreError])

  // 한 번에 불러오는 개수 변경 시 첫 페이지로 리셋
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(Number(e.target.value))
    setPageNumber(0)
  }

  // 세그먼트(고객분류) 변경 시 첫 페이지로 리셋 + URL 쿼리 동기화
  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value
    setSegment(next)
    setPageNumber(0)
    setSearchParams(next ? { segment: next } : {}, { replace: true })
  }

  return (
    <div className="cust">
      <header className="cust-head">
        <span className="eyebrow">Customers</span>
        <div className="cust-title-row">
          <h1 className="cust-title">고객목록</h1>
          {page && (
            <span className="cust-count">
              전체 <strong>{page.totalElements.toLocaleString()}</strong>명
            </span>
          )}
        </div>
      </header>

      {/* 필터 컨트롤 — 스크롤 시 상단 고정(헤더 밖, .cust 기준 sticky) */}
      <div className="cust-controls">
        <label className="cust-size">
          <span className="cust-size-label">고객분류</span>
          <select
            className="cust-size-select"
            value={segment}
            onChange={handleSegmentChange}
          >
            <option value="">전체</option>
            {SEGMENTS.map((seg) => (
              <option key={seg} value={seg}>
                {seg}
              </option>
            ))}
          </select>
        </label>
        <label className="cust-size">
          <span className="cust-size-label">한번에</span>
          <select
            className="cust-size-select"
            value={size}
            onChange={handleSizeChange}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}개
              </option>
            ))}
          </select>
        </label>
      </div>

      {status === 'loading' && (
        <div className="cust-card cust-state">고객 목록을 불러오는 중…</div>
      )}

      {status === 'error' && (
        <div className="cust-card cust-state cust-state-error">
          <p>고객 목록을 불러오지 못했습니다. 서버 연결을 확인해 주세요.</p>
          <button
            type="button"
            className="cust-retry"
            onClick={() => setReloadKey((k) => k + 1)}
          >
            다시 시도
          </button>
        </div>
      )}

      {status === 'done' && content.length === 0 && (
        <div className="cust-card cust-state">
          해당 조건의 고객이 없습니다.
        </div>
      )}

      {status === 'done' && content.length > 0 && (
        <div className="cust-card">
          <div className="cust-table-wrap">
            <table className="cust-table">
              <thead>
                <tr>
                  <th>고객 ID</th>
                  <th>세그먼트</th>
                  <th className="num">Recency</th>
                  <th className="num">Frequency</th>
                  <th className="num">Monetary</th>
                  <th className="num">RFM</th>
                  <th className="num">분석일시</th>
                </tr>
              </thead>
              <tbody>
                {content.map((c) => (
                  <tr
                    key={c.customerId}
                    className="cust-row"
                    onClick={() => navigate(`/customers/${c.customerId}`)}
                  >
                    <td className="cust-id" data-label="고객 ID">
                      {c.customerId}
                    </td>
                    <td data-label="세그먼트">
                      <span className={`seg-chip ${segmentTone(c.segment)}`}>
                        {c.segment}
                      </span>
                    </td>
                    <td className="num" data-label="Recency">
                      {c.recency}일
                    </td>
                    <td className="num" data-label="Frequency">
                      {c.frequency}회
                    </td>
                    <td className="num" data-label="Monetary">
                      {c.monetary.toLocaleString()}
                    </td>
                    <td className="num cust-rfm" data-label="RFM">
                      {c.rfmScore}
                    </td>
                    <td className="num cust-date" data-label="분석일시">
                      {new Date(c.analyzedAt).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PC — 페이지네이션 */}
      {!isMobile && status === 'done' && page && (
        <Pagination
          page={page.number}
          totalPages={page.totalPages}
          onChange={setPageNumber}
        />
      )}

      {/* 모바일 — 무한 스크롤 하단 센티넬 + 상태 표시 */}
      {isMobile && status === 'done' && content.length > 0 && (
        <div className="cust-more" ref={sentinelRef}>
          {loadingMore && (
            <span className="cust-more-loading">더 불러오는 중…</span>
          )}
          {moreError && (
            <button
              type="button"
              className="cust-retry"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              더 불러오기 다시 시도
            </button>
          )}
          {!loadingMore && !moreError && !hasMore && (
            <span className="cust-more-end">
              모든 고객을 불러왔습니다 · {content.length.toLocaleString()}명
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Customers
