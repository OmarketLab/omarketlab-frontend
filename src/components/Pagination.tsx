import './Pagination.css'

const BLOCK_SIZE = 10 // 한 번에 노출할 최대 페이지 버튼 수

interface PaginationProps {
  page: number // 현재 페이지 (0-based, API page.number)
  totalPages: number // 전체 페이지 수 (API page.totalPages)
  onChange: (pageNumber: number) => void
}

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // 10개 단위 블록 — 현재 페이지가 속한 블록의 번호만 노출
  const block = Math.floor(page / BLOCK_SIZE)
  const blockStart = block * BLOCK_SIZE
  const blockEnd = Math.min(blockStart + BLOCK_SIZE, totalPages)
  const pages = Array.from(
    { length: blockEnd - blockStart },
    (_, i) => blockStart + i,
  )

  const hasPrevBlock = blockStart > 0 // 이전 블록 존재
  const hasNextBlock = blockEnd < totalPages // 다음 블록 존재

  return (
    <nav className="pagination" aria-label="페이지네이션">
      <button
        type="button"
        className="pagination-btn pagination-arrow"
        onClick={() => onChange(blockStart - 1)} // 이전 블록의 마지막 페이지로
        disabled={!hasPrevBlock}
        aria-label="이전 페이지 묶음"
      >
        ‹
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
        className="pagination-btn pagination-arrow"
        onClick={() => onChange(blockEnd)} // 다음 블록의 첫 페이지로
        disabled={!hasNextBlock}
        aria-label="다음 페이지 묶음"
      >
        ›
      </button>
    </nav>
  )
}

export default Pagination
