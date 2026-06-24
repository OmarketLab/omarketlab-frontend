import type { Recommendation } from '../types/recommendation'

// AI 상품 추천 mock — 추후 POST /api/v1/customers/{id}/recommendations 등으로 교체.
// 약간의 지연을 두어 실제 비동기 호출 흐름(로딩 상태)을 흉내낸다.
export function fetchMockRecommendation(
  customerId: string,
): Promise<Recommendation> {
  const data: Recommendation = {
    customerId,
    rationale:
      'VIP 고객으로 최근 홈데코 카테고리 구매 비중이 높아 연관 상품을 우선 추천합니다.',
    products: [
      {
        stockCode: '85123A',
        description: 'WHITE HANGING HEART T-LIGHT HOLDER',
        similarityScore: 0.873421,
        rank: 1,
        match_reason: {
          co_purchased_with: '85123A',
          co_purchased_with_description: 'WHITE HANGING HEART T-LIGHT HOLDER',
          source: '동시구매',
          segment_support: 0.62,
        },
      },
      {
        stockCode: '47566',
        description: 'PARTY BUNTING',
        similarityScore: 0.812004,
        rank: 2,
        match_reason: {
          co_purchased_with: '85123A',
          co_purchased_with_description: 'WHITE HANGING HEART T-LIGHT HOLDER',
          source: '동시구매',
          segment_support: 0.58,
        },
      },
      {
        stockCode: '47563',
        description: 'RETRO COFFEE MUGS ASSORTED',
        similarityScore: 0.654001,
        rank: 3,
        match_reason: {
          co_purchased_with: '85123A',
          co_purchased_with_description: 'WHITE HANGING HEART T-LIGHT HOLDER',
          source: '동시구매',
          segment_support: 0.49,
        },
      },
    ],
    createdAt: '2026-06-21T10:30:00+09:00',
  }
  return new Promise((resolve) => setTimeout(() => resolve(data), 700))
}
