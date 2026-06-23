// AI 상품 추천 응답 타입 — 버튼 클릭 시 받아오는 데이터

// 추천 근거 — 왜 이 상품이 매칭됐는지 (API snake_case 그대로 유지)
export interface MatchReason {
  co_purchased_with: string
  source: string
  segment_support: number // 0~1
}

export interface RecommendedProduct {
  stockCode: string
  similarityScore: number // 0~1
  rank: number
  match_reason: MatchReason
}

export interface Recommendation {
  customerId: string
  rationale: string
  products: RecommendedProduct[]
  createdAt: string // ISO 8601
}
