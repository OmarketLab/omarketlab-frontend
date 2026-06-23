import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMockCustomerPage } from '../mocks/customers'
import { segmentTone } from '../utils/segment'
import Pagination from '../components/Pagination'
import './Customers.css'

const PAGE_SIZE = 5

function Customers() {
  const navigate = useNavigate()
  const [pageNumber, setPageNumber] = useState(0)

  // 추후 axios 호출로 교체될 부분 (현재는 mock이 서버 페이징을 흉내냄)
  const { content, page } = getMockCustomerPage(pageNumber, PAGE_SIZE)

  return (
    <div className="cust">
      <header className="cust-head">
        <span className="eyebrow">Customers</span>
        <div className="cust-title-row">
          <h1 className="cust-title">고객목록</h1>
          <span className="cust-count">
            전체 <strong>{page.totalElements.toLocaleString()}</strong>명
          </span>
        </div>
      </header>

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

      <Pagination
        page={page.number}
        totalPages={page.totalPages}
        onChange={setPageNumber}
      />
    </div>
  )
}

export default Customers
