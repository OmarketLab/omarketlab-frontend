// AI 상품 추천 응답 타입 — 버튼 클릭 시 받아오는 데이터

// 추천 근거 — 왜 이 상품이 매칭됐는지 (API snake_case 그대로 유지)
export interface MatchReason {
  co_purchased_with: string
  co_purchased_with_description: string // 동시구매 상품명
  source: string
  segment_support: number // 0~1
}

export interface RecommendedProduct {
  stockCode: string
  description: string // 상품명
  similarityScore: number // 0~1
  rank: number
  match_reason: MatchReason // API snake_case 그대로 유지
}

export interface Recommendation {
  customerId: string
  rationale: string
  products: RecommendedProduct[]
  createdAt: string // ISO 8601
  // 분석 결과가 없을 때 서버가 200과 함께 내려주는 코드.
  // 이 경우 rationale/createdAt은 null, products는 []로 온다.
  code?: string | null
}

// 분석 결과가 없을 때(과거엔 404) 서버가 200 바디로 내려주는 코드
export const NO_ANALYSIS_DATA = 'NO_ANALYSIS_DATA'
