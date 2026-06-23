// 고객 목록 응답 타입 — API 명세서 기준
export interface Customer {
  customerId: string
  segment: string
  recency: number
  frequency: number
  monetary: number
  rfmScore: number
  analyzedAt: string // ISO 8601 (예: "2026-06-20T03:00:00+09:00")
}

// 고객 상세 응답 타입 — GET /api/v1/customers/{customerId}
export interface CustomerRfmResult {
  segment: string
  recency: number
  frequency: number
  monetary: number
  rScore: number
  fScore: number
  mScore: number
  rfmScore: number
  rationale: string
  analyzedAt: string
}

export interface PurchaseSummary {
  invoiceCount: number
  totalQuantity: number
  totalAmount: number
  lastInvoiceDate: string
}

export interface CustomerDetail {
  customerId: string
  result: CustomerRfmResult
  purchaseSummary: PurchaseSummary
}

// Spring Data 스타일 페이지 메타
export interface PageMeta {
  number: number
  size: number
  totalElements: number
  totalPages: number
}

// 페이지네이션 응답 공통 래퍼
export interface PagedResponse<T> {
  content: T[]
  page: PageMeta
}
