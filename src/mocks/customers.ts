import type {
  Customer,
  CustomerDetail,
  PagedResponse,
} from '../types/customer'

// 임시 mock 데이터 — 실제 상세 API 응답(CustomerDetail) 형태 그대로 저장한다.
// 합성/가공 없이 이 값을 그대로 화면에 노출한다.
// 실제 백엔드 연결 시 이 데이터 대신 axios 호출로 교체하면 화면 코드는 그대로 재사용된다.
const customerDetails: CustomerDetail[] = [
  {
    customerId: 'C0001',
    result: {
      segment: '우수고객',
      recency: 12,
      frequency: 8,
      monetary: 1530.5,
      rScore: 5,
      fScore: 4,
      mScore: 5,
      rfmScore: 545,
      rationale: '최근 12일 내 구매, 높은 빈도·구매액으로 우수고객으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 8,
      totalQuantity: 134,
      totalAmount: 1530.5,
      lastInvoiceDate: '2026-06-08T14:22:00+09:00',
    },
  },
  {
    customerId: 'C0002',
    result: {
      segment: '신규고객',
      recency: 3,
      frequency: 1,
      monetary: 89.0,
      rScore: 5,
      fScore: 1,
      mScore: 1,
      rfmScore: 511,
      rationale: '최근 3일 내 첫 구매, 낮은 빈도·구매액으로 신규고객으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 1,
      totalQuantity: 9,
      totalAmount: 89.0,
      lastInvoiceDate: '2026-06-17T10:05:00+09:00',
    },
  },
  {
    customerId: 'C0003',
    result: {
      segment: '이탈위험',
      recency: 95,
      frequency: 2,
      monetary: 240.75,
      rScore: 1,
      fScore: 1,
      mScore: 2,
      rfmScore: 112,
      rationale: '95일간 미구매, 낮은 빈도로 이탈위험으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 2,
      totalQuantity: 21,
      totalAmount: 240.75,
      lastInvoiceDate: '2026-03-17T09:00:00+09:00',
    },
  },
  {
    customerId: 'C0004',
    result: {
      segment: '우수고객',
      recency: 5,
      frequency: 12,
      monetary: 2840.0,
      rScore: 5,
      fScore: 5,
      mScore: 5,
      rfmScore: 555,
      rationale: '최근 5일 내 구매, 매우 높은 빈도·구매액으로 우수고객으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 12,
      totalQuantity: 256,
      totalAmount: 2840.0,
      lastInvoiceDate: '2026-06-15T16:40:00+09:00',
    },
  },
  {
    customerId: 'C0005',
    result: {
      segment: '일반고객',
      recency: 30,
      frequency: 4,
      monetary: 560.25,
      rScore: 3,
      fScore: 3,
      mScore: 3,
      rfmScore: 333,
      rationale: '보통 수준의 최근성·빈도·구매액으로 일반고객으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 4,
      totalQuantity: 48,
      totalAmount: 560.25,
      lastInvoiceDate: '2026-05-21T11:20:00+09:00',
    },
  },
  {
    customerId: 'C0006',
    result: {
      segment: '신규고객',
      recency: 1,
      frequency: 1,
      monetary: 45.9,
      rScore: 5,
      fScore: 1,
      mScore: 1,
      rfmScore: 511,
      rationale: '어제 첫 구매, 낮은 빈도·구매액으로 신규고객으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 1,
      totalQuantity: 5,
      totalAmount: 45.9,
      lastInvoiceDate: '2026-06-19T13:10:00+09:00',
    },
  },
  {
    customerId: 'C0007',
    result: {
      segment: '이탈위험',
      recency: 120,
      frequency: 3,
      monetary: 310.0,
      rScore: 1,
      fScore: 1,
      mScore: 1,
      rfmScore: 111,
      rationale: '120일간 미구매로 이탈위험으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 3,
      totalQuantity: 28,
      totalAmount: 310.0,
      lastInvoiceDate: '2026-02-20T08:45:00+09:00',
    },
  },
  {
    customerId: 'C0008',
    result: {
      segment: '우수고객',
      recency: 8,
      frequency: 10,
      monetary: 1980.75,
      rScore: 5,
      fScore: 5,
      mScore: 4,
      rfmScore: 554,
      rationale: '최근 8일 내 구매, 높은 빈도·구매액으로 우수고객으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 10,
      totalQuantity: 198,
      totalAmount: 1980.75,
      lastInvoiceDate: '2026-06-12T15:30:00+09:00',
    },
  },
  {
    customerId: 'C0009',
    result: {
      segment: '일반고객',
      recency: 45,
      frequency: 5,
      monetary: 720.5,
      rScore: 2,
      fScore: 3,
      mScore: 3,
      rfmScore: 233,
      rationale: '최근성은 다소 낮으나 보통 수준의 빈도·구매액으로 일반고객으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 5,
      totalQuantity: 61,
      totalAmount: 720.5,
      lastInvoiceDate: '2026-05-06T12:00:00+09:00',
    },
  },
  {
    customerId: 'C0010',
    result: {
      segment: '휴면고객',
      recency: 200,
      frequency: 1,
      monetary: 60.0,
      rScore: 1,
      fScore: 1,
      mScore: 1,
      rfmScore: 111,
      rationale: '200일간 미구매, 낮은 빈도·구매액으로 휴면고객으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 1,
      totalQuantity: 7,
      totalAmount: 60.0,
      lastInvoiceDate: '2025-12-02T09:15:00+09:00',
    },
  },
  {
    customerId: 'C0011',
    result: {
      segment: '일반고객',
      recency: 22,
      frequency: 6,
      monetary: 935.4,
      rScore: 3,
      fScore: 3,
      mScore: 4,
      rfmScore: 334,
      rationale: '최근 22일 내 구매, 보통 수준의 빈도·구매액으로 일반고객으로 분류',
      analyzedAt: '2026-06-20T03:00:00+09:00',
    },
    purchaseSummary: {
      invoiceCount: 6,
      totalQuantity: 73,
      totalAmount: 935.4,
      lastInvoiceDate: '2026-05-29T17:50:00+09:00',
    },
  },
]

// 상세 데이터에서 리스트 항목(Customer)으로 투영 — 리스트는 상세의 부분집합.
function toListItem(d: CustomerDetail): Customer {
  return {
    customerId: d.customerId,
    segment: d.result.segment,
    recency: d.result.recency,
    frequency: d.result.frequency,
    monetary: d.result.monetary,
    rfmScore: d.result.rfmScore,
    analyzedAt: d.result.analyzedAt,
  }
}

// 실제 서버 페이징을 흉내 — pageNumber(0-based), size 만큼 잘라서 반환.
// 추후 이 함수를 axios 호출로 교체하면 화면 코드는 그대로 재사용된다.
export function getMockCustomerPage(
  pageNumber: number,
  size: number,
): PagedResponse<Customer> {
  const totalElements = customerDetails.length
  const totalPages = Math.max(1, Math.ceil(totalElements / size))
  const start = pageNumber * size
  const content = customerDetails.slice(start, start + size).map(toListItem)
  return {
    content,
    page: { number: pageNumber, size, totalElements, totalPages },
  }
}

// 상세 응답 mock — 저장된 CustomerDetail을 그대로 반환 (합성 없음).
// 추후 GET /api/v1/customers/{id} (axios)로 교체하면 화면 코드는 그대로 재사용된다.
export function getMockCustomerDetail(id: string): CustomerDetail | undefined {
  return customerDetails.find((d) => d.customerId === id)
}
