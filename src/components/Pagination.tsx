import './Pagination.css'

interface PaginationProps {
  page: number // 현재 페이지 (0-based, API page.number)
  totalPages: number // 전체 페이지 수 (API page.totalPages)
  onChange: (pageNumber: number) => void
}

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)

  return (
    <nav className="pagination" aria-label="페이지네이션">
      <button
        type="button"
        className="pagination-btn"
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
      >
        이전
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`pagination-btn${p === page ? ' active' : ''}`}
          onClick={() => onChange(p)}
        >
          {p + 1}
        </button>
      ))}

      <button
        type="button"
        className="pagination-btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        다음
      </button>
    </nav>
  )
}

export default Pagination
