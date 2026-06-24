import { apiClient } from './client'
import type {
  Customer,
  CustomerDetail,
  PagedResponse,
} from '../types/customer'
import type { Recommendation } from '../types/recommendation'

// GET /api/v1/customers?page={pageNumber}&size={size}&segment={segment}
// segment='' 이면 전체 조회, 특정 세그먼트면 해당 세그먼트만 필터링한다(항상 전송).
// 응답은 Spring Boot PagedModel 형태({ content, page })로 PagedResponse<Customer>와 일치한다.
export async function fetchCustomerPage(
  pageNumber: number,
  size: number,
  segment: string = '', // '' = 전체
): Promise<PagedResponse<Customer>> {
  const { data } = await apiClient.get<PagedResponse<Customer>>(
    '/api/v1/customers',
    { params: { page: pageNumber, size, segment } },
  )
  return data
}

// GET /api/v1/customers/{customerId}
// 응답은 mock(CustomerDetail) 타입과 동일한 { customerId, result, purchaseSummary } 형태.
export async function fetchCustomerDetail(
  customerId: string,
): Promise<CustomerDetail> {
  const { data } = await apiClient.get<CustomerDetail>(
    `/api/v1/customers/${customerId}`,
  )
  return data
}

// GET /api/v1/customers/{customerId}/recommendations — 기존 추천 조회
// 200이면 추천(Recommendation)을 그대로 표시, 404면 아직 추천 없음(버튼 노출).
export async function getRecommendation(
  customerId: string,
): Promise<Recommendation> {
  const { data } = await apiClient.get<Recommendation>(
    `/api/v1/customers/${customerId}/recommendations`,
  )
  return data
}

// POST /api/v1/customers/{customerId}/recommendations — 추천 생성
// 버튼 클릭 시 호출. 응답에 생성된 추천이 담겨오면 그대로 표시한다.
export async function createRecommendation(
  customerId: string,
): Promise<Recommendation> {
  const { data } = await apiClient.post<Recommendation>(
    `/api/v1/customers/${customerId}/recommendations`,
  )
  return data
}
