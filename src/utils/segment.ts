// 세그먼트 정의의 단일 출처 — 목록 페이지 필터 선택지와 톤 매핑이 모두 여기서 파생된다.
// 세그먼트는 총 5개 — 우수고객, 충성고객, 신규고객, 일반고객, 이탈위험.
export const SEGMENTS = [
  '우수고객',
  '충성고객',
  '신규고객',
  '일반고객',
  '이탈위험',
] as const

export type Segment = (typeof SEGMENTS)[number]

// 세그먼트 문자열 → 시맨틱 톤 클래스. 색이 고객 가치 단계를 인코딩한다.
// index.css 의 .seg-* 클래스와 짝을 이룬다.
const TONE: Record<Segment, string> = {
  우수고객: 'seg-champion',
  충성고객: 'seg-loyal',
  신규고객: 'seg-new',
  일반고객: 'seg-regular',
  이탈위험: 'seg-atrisk',
}

export function segmentTone(segment: string): string {
  return TONE[segment as Segment] ?? 'seg-default'
}
