// 세그먼트 문자열 → 시맨틱 톤 클래스. 색이 고객 가치 단계를 인코딩한다.
// index.css 의 .seg-* 클래스와 짝을 이룬다.
const TONE: Record<string, string> = {
  우수고객: 'seg-champion',
  신규고객: 'seg-new',
  일반고객: 'seg-regular',
  이탈위험: 'seg-atrisk',
  휴면고객: 'seg-dormant',
}

export function segmentTone(segment: string): string {
  return TONE[segment] ?? 'seg-default'
}
