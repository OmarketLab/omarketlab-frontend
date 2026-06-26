# OMarketLab Frontend

**AI 고객 인텔리전스 콘솔** — RFM 세그먼트로 고객을 읽고, AI 상품 추천으로 다음 행동을 정하는 마케터용 웹 콘솔입니다.

Spring Boot 백엔드(`/api/v1`)와 연동되는 React 단일 페이지 애플리케이션(SPA)입니다.

## 주요 기능

- **로그인** — 마케터 콘솔 진입 (현재 mock 인증, `localStorage` 기반 세션 유지)
- **대시보드** — 전체 고객 수와 세그먼트 구성 비율을 카드·누적 바·SVG 도넛 차트로 시각화 (외부 차트 라이브러리 없이 구현)
- **고객목록** — 고객별 RFM 점수(Recency·Frequency·Monetary)와 세그먼트 표시
  - 세그먼트(고객분류) 필터, 한 번에 불러올 개수 선택(20/50/100)
  - **반응형 페이징** — PC는 페이지네이션, 모바일은 무한 스크롤(IntersectionObserver)
- **고객 상세** — RFM 프로필 미터, 분류 근거, 구매 요약
  - **AI 상품 추천** — 버튼 클릭 시 고객의 RFM 프로필을 바탕으로 추천 상품 생성/조회, 추천 근거(동시구매·유사도·지지도) 표시
  - 이탈위험 고객 강조 표시
- **반응형 UI** — 데스크톱 사이드바 / 모바일 상단바 + 하단 탭 바

## RFM 세그먼트

고객은 RFM 분석 결과에 따라 5개 세그먼트로 분류됩니다.

| 세그먼트 | 설명 |
| --- | --- |
| 우수고객 | 최고 가치 고객 |
| 충성고객 | 반복 구매 고객 |
| 신규고객 | 최근 유입 고객 |
| 일반고객 | 평균 수준 고객 |
| 이탈위험 | 이탈 가능성이 높은 고객 |

세그먼트 정의는 `src/utils/segment.ts`를 단일 출처로 사용하며, 색상 톤(`.seg-*`)이 고객 가치 단계를 인코딩합니다.

## 기술 스택

- **React 19** + **TypeScript**
- **Vite 8** — 개발 서버 / 번들러
- **React Router 7** — 클라이언트 라우팅
- **Axios** — API 통신 (공용 인스턴스 `src/api/client.ts`)
- **ESLint** — 정적 분석

## 시작하기

### 요구 사항

- Node.js 20+ 권장
- 백엔드 API 서버 (기본: 로컬 Spring 서버 `http://localhost:8080`)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (기본 http://localhost:5173)
npm run dev
```

### 환경 변수

루트에 `.env` 파일을 만들고 백엔드 base URL을 설정합니다. (`.env.example` 참고)

```bash
# API 서버 base URL
VITE_API_BASE_URL=http://localhost:8080
```

### 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (HMR) |
| `npm run build` | 타입 체크(`tsc -b`) 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과물 로컬 미리보기 |
| `npm run lint` | ESLint 실행 |

## API 연동

백엔드는 Spring Boot 기준이며, 주요 엔드포인트는 다음과 같습니다.

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| `GET` | `/api/v1/segments/summary` | 전체 고객 수 및 세그먼트별 인원 |
| `GET` | `/api/v1/customers?page={n}&size={size}&segment={segment}` | 고객 목록 (페이지네이션) |
| `GET` | `/api/v1/customers/{customerId}` | 고객 상세 (RFM 결과 + 구매 요약) |
| `GET` | `/api/v1/customers/{customerId}/recommendations` | 기존 AI 추천 조회 |
| `POST` | `/api/v1/customers/{customerId}/recommendations` | AI 추천 생성 |

> 고객 목록 응답은 Spring Data 스타일 페이지 형태(`{ content, page }`)를 따릅니다.
> 분석 결과가 없을 때는 200 응답 + `code: "NO_ANALYSIS_DATA"`로 처리합니다.

## 프로젝트 구조

```
src/
├── api/              # Axios 클라이언트 및 API 호출 함수
│   ├── client.ts     # 공용 axios 인스턴스 (baseURL은 .env에서 주입)
│   ├── customers.ts  # 고객 목록/상세/추천 API
│   └── segments.ts   # 세그먼트 요약 API
├── auth/             # 인증 컨텍스트 (AuthProvider, useAuth)
├── components/       # 공용 컴포넌트 (Sidebar, Pagination, ProtectedRoute)
├── layouts/          # 공통 레이아웃 (AppLayout)
├── pages/            # 화면 (Login, Dashboard, Customers, CustomerDetail)
├── types/            # API 응답 타입 정의
├── utils/            # 세그먼트 정의·톤 매핑 등 유틸
├── mocks/            # 목업 데이터
├── App.tsx           # 라우팅 정의
└── main.tsx          # 진입점
```

## 라우팅

| 경로 | 화면 | 보호 여부 |
| --- | --- | --- |
| `/login` | 로그인 | 공개 |
| `/` | 대시보드 | 인증 필요 |
| `/customers` | 고객목록 | 인증 필요 |
| `/customers/:id` | 고객 상세 | 인증 필요 |

보호된 경로는 `ProtectedRoute`로 감싸 미인증 시 `/login`으로 리다이렉트됩니다.

## 개발 연혁

커밋 내역을 기준으로 한 주요 개발 흐름입니다. (2026-06-23 ~ 2026-06-26)

| 일자 | 내용 |
| --- | --- |
| 2026-06-23 | 프로젝트 초기 셋업, 더미 데이터 기반 프론트 전체 화면 작업 |
| 2026-06-24 | Axios 연동 및 API 연결, 대시보드·세그먼트 분포 생성, UI 재구성 |
| 2026-06-24 | 로그인 인증 제거(mock 처리), 파비콘·로고 변경 |
| 2026-06-24 | 추천 상품 `description`이 `stockCode`로 표시되던 문제 수정 |
| 2026-06-24 | 추천 상품 부재 시 404를 2회 호출하던 로직을 1회로 최적화 |
| 2026-06-24 | 대시보드 세그먼트 카드 클릭 시 고객목록 필터 이동 추가 |
| 2026-06-25 | 로고 이미지 교체 (`style(ui)`) |
| 2026-06-25 | 이탈위험 고객 강조 / AI 상품 추천 강조 / 로딩 상태 강조 |
| 2026-06-26 | 반응형 웹 기능 추가 (PC 페이지네이션 ↔ 모바일 무한 스크롤) |

## 기여자

| 이름 | 커밋 수 |
| --- | --- |
| jwhyeon | 6 |
| yeongwon | 5 |
| yerin | 4 |
| ssk | 2 |
| syw928 | 1 |
| SamK5678 | 1 |

## 참고

- 현재 로그인은 mock 구현으로, 입력 값과 무관하게 통과합니다. 실제 인증 연동 시 `src/auth/AuthContext.tsx`와 `src/pages/Login.tsx`를 수정하면 됩니다.
- 쿠키/토큰 기반 인증이 필요하면 `src/api/client.ts`에서 `withCredentials: true`를 활성화합니다.
