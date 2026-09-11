# 요양이지 (YoYang Easy)

요양보호사 구인구직을 위한 전문 플랫폼입니다.  
구인 업체와 구직 요양보호사를 빠르고 쉽게 연결합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 구인공고 목록 | 지역·직종·근무형태·급여 필터, 내 구인공고 섹션 |
| 구인공고 등록 | 케어 조건, 급여, 마감일 등 상세 공고 작성 |
| 구인공고 상세 | 공고 세부 정보 확인 및 바로지원 |
| 인재 정보 | 지역·직종·경력 필터 + 맞춤 인재 추천 |
| 인재 상세 | 자격증, 경력, 희망조건, 자기소개 확인 |
| 지원자 확인 | 공고별 지원자 목록 및 합격·불합격 상태 관리 |
| 채용 관리 | 전체·진행중·마감 필터, 마감·재개 처리 |
| 페이지 접근 제한 | 구인자 전용 페이지 AuthGuard 적용 |
| 로그인 상태 분기 | 사용자 타입별 UI 차별화 |
| 모바일 반응형 | 전 페이지 햄버거 메뉴 포함 반응형 레이아웃 |
| 홈 검색 연동 | 히어로 검색·지역 다중선택 → 공고 목록 필터 자동 적용 |

---

## 화면 구성

### 홈
![홈](docs/screenshots/home.png)

### 구인공고 목록
![구인공고 목록](docs/screenshots/jobs.png)

### 구인공고 상세
![구인공고 상세](docs/screenshots/job-detail.png)

### 구인공고 등록
![구인공고 등록](docs/screenshots/job-post.png)

### 인재 정보
![인재 정보](docs/screenshots/talents.png)

### 인재 상세
![인재 상세](docs/screenshots/talent-detail.png)

### 지원자 확인
![지원자 확인](docs/screenshots/applicants.png)

### 채용 관리
![채용 관리](docs/screenshots/manage.png)

### 모바일
| 홈 | 공고 목록 |
|---|---|
| ![모바일 홈](docs/screenshots/mobile-home.png) | ![모바일 공고 목록](docs/screenshots/mobile-jobs.png) |

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 18 + Vite |
| Routing | React Router DOM v6 |
| Styling | CSS (컴포넌트별) |
| 인증 상태 | AuthContext (전역 공유) |
| 주소검색 | 카카오 우편번호 API |

---

## 실행 방법

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속  
백엔드 API는 `http://localhost:8080` 에서 실행 필요

---

## 백엔드 API

### 인증 (`/api/auth`)
- `POST /register` - 회원가입 (개인/사업자)
- `POST /login` - 로그인 (계정 유형 불일치 시 거부)
- `POST /logout` - 로그아웃
- `GET /me` - 현재 로그인 사용자 조회

### 구인공고 (`/api/jobs`)
- `GET /` - 목록 조회 (`?region=서울`처럼 지역 접두어로 필터링 가능)
- `GET /{id}` - 상세 조회
- `POST /` - 등록 (사업자 계정만)
- `GET /mine` - 내가 등록한 공고 목록
- `POST /{id}/like`, `DELETE /{id}/like` - 찜하기/찜 해제

### 지원자 (`/api/jobs/{jobId}/applications`)
- `POST /api/jobs/{jobId}/applications` - 공고 지원
- `GET /api/jobs/{jobId}/applications` - 지원자 목록 (공고 소유 사업자만)
- `PATCH /api/applications/{id}/status` - 지원 상태 변경 (검토중/합격/불합격)

### 구직자 이력서 (`/api/resumes/me`)
- `POST /me` - 이력서 등록/수정
- `GET /me` - 내 이력서 조회

### 인재 정보 (`/api/caregivers`)
- `GET /` - 목록 조회 (`?region=경기`처럼 지역 필터링 가능)

---

## 작업 로그

### 2026-09-10
- 원격 브랜치 전체 통합: WCH(백엔드 API) → backend-db-auth(OAuth2) → frontend-ui-inhwa(인재정보·구인관리) 순차 머지
- AuthProvider, ScrollToTop, AuthGuard, TalentListPage, TalentDetailPage, ApplicantsPage, RecruitManagePage 등 inhwa 작업 통합
- App.jsx 라우트 통합: `/jobs`=JobSearchPage, `/job/:id`=JobDetailPage(juhyun 버전) 유지
- `JobSearchPage` 신규 생성 (`/jobs` 라우트): JsHero, JsFilter, JsJobList, JsSidebar 컴포넌트 구성
- `App.jsx`에 `/jobs` 라우트 추가
- `JobDetailPage` 신규 생성 (`/job/:id`): 일자리 상세 페이지 (모집내용, 자격, 복리후생, 지원하기)
- `jobs.js` 공유 데이터 파일 생성 (30개 일자리 데이터), JspJobTable·JsJobList·JobDetailPage 공유
- 추천 일자리 더보기 → `/jobs` 연결, 직종명 클릭 → 상세 페이지 연결
- `/jobs` 페이지 전면 리디자인: 이모지 제거, 홈/구직 화면 스타일 통일 (행 리스트, 인기지역 칩)
- 홈 히어로 검색창 왼쪽 돋보기 아이콘 추가, 인기지역 줄바꿈 방지
- CLAUDE.md 존댓말 규칙 추가
- 홈 히어로 카드 레이아웃 개선: 아이콘+타이틀을 `hp-hcard-header`로 묶고, 화살표를 `hp-hcard-footer`로 이동
- `HomeNav` 활성 메뉴 폰트 굵기 전환 시 레이아웃 이동 방지 (`hp-nav-label` + `data-text` 트릭 적용)

### 2026-09-09
- 인재정보 리스트뷰 결과바와 컬럼 헤더 사이 여백 추가
- 헤더 '구직' 메뉴 클릭 시 /jobseeker 페이지로 연결

---

## 폴더 구조

```
frontend/src/
├── components/     # 공통 컴포넌트 (Header, Footer, AuthGuard 등)
├── contexts/       # AuthContext (전역 인증 상태)
├── hooks/          # useAuth
├── pages/          # 페이지 컴포넌트
├── data/           # 목 데이터 (jobs, talents, applicants)
└── api.js          # 백엔드 API 연동
```
