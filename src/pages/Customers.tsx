import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCustomerPage } from '../api/customers'
import type { Customer, PageMeta } from '../types/customer'
import { SEGMENTS, segmentTone } from '../utils/segment'
import Pagination from '../components/Pagination'
import './Customers.css'

const PAGE_SIZE_OPTIONS = [20, 50, 100] as const // 페이지당 고객 수(size = limit)
// 필터 선택지는 segment.ts(SEGMENTS)를 단일 출처로 사용

function Customers() {
  const navigate = useNavigate()
  const [pageNumber, setPageNumber] = useState(0)
  const [size, setSize] = useState<number>(PAGE_SIZE_OPTIONS[0])
  const [segment, setSegment] = useState<string>('') // '' = 전체

  // GET /api/v1/customers?page={pageNumber}&size={size}&segment={segment}
  const [content, setContent] = useState<Customer[]>([])
  const [page, setPage] = useState<PageMeta | null>(null)
  const [status, setStatus] = useState<'loading' | 'error' | 'done'>('loading')
  const [reloadKey, setReloadKey] = useState(0) // 재시도 트리거

  useEffect(() => {
    let active = true
    setStatus('loading')
    fetchCustomerPage(pageNumber, size, segment)
      .then((res) => {
        if (!active) return
        setContent(res.content)
        setPage(res.page)
        setStatus('done')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [pageNumber, size, segment, reloadKey])

  // 페이지당 개수 변경 시 첫 페이지로 리셋
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(Number(e.target.value))
    setPageNumber(0)
  }

  // 세그먼트(고객분류) 변경 시 첫 페이지로 리셋
  const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSegment(e.target.value)
    setPageNumber(0)
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
              <span className="cust-size-label">페이지당</span>
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
        </div>
      </header>

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
                <td className="cust-id">{c.customerId}</td>
                <td>
                  <span className={`seg-chip ${segmentTone(c.segment)}`}>
                    {c.segment}
                  </span>
                </td>
                <td className="num">{c.recency}일</td>
                <td className="num">{c.frequency}회</td>
                <td className="num">{c.monetary.toLocaleString()}</td>
                <td className="num cust-rfm">{c.rfmScore}</td>
                <td className="num cust-date">
                  {new Date(c.analyzedAt).toLocaleDateString('ko-KR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {status === 'done' && page && (
        <Pagination
          page={page.number}
          totalPages={page.totalPages}
          onChange={setPageNumber}
        />
      )}
    </div>
  )
}

export default Customers
