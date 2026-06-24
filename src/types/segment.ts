// 세그먼트 요약 응답 타입 — GET /api/v1/segments/summary
export interface SegmentCount {
  segment: string
  count: number
}

export interface SegmentSummary {
  totalCustomers: number
  segments: SegmentCount[]
  analyzedAt: string // ISO 8601
}
