import { apiClient } from './client'
import type { SegmentSummary } from '../types/segment'

// GET /api/v1/segments/summary — 전체 고객 수와 세그먼트별 인원
export async function getSegmentSummary(): Promise<SegmentSummary> {
  const { data } = await apiClient.get<SegmentSummary>(
    '/api/v1/segments/summary',
  )
  return data
}
