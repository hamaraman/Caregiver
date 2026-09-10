# Caregiver
요양이지 웹사이트 프로젝트

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
- `react-router-dom` 설치
- `main.jsx`에 `BrowserRouter` 적용
- `App.jsx`를 `Routes` / `Route` 기반으로 교체
- URL-컴포넌트 매핑 확정: `/` → Home, `/login` → Login, `/signup` → Signup, `/jobseeker` → JobSeeker
- 모든 페이지·하위 컴포넌트에서 `onNavigate` prop 제거 → `useNavigate` 훅으로 전환
- `LoginPage`의 하드코딩된 `window.location.href` 제거, `navigate('/')` 로 통일
- 로고 이니셜 `YN` → `YE` 전체 교체 (`HomeNav`, `JspHeader`, `AuthLeftPanel`, `Header`, `Footer`)
- 로고 문구 `요양보호사 구인구직 국내 1위 / 서비스 No.1` → `전국 요양·돌봄 일자리 플랫폼` 전체 통일
- HomeNav 로고 SVG에서 붉은 점(핑크 하트 path) 제거
- 전 페이지 로고 배지 스타일 통일: 38×38, `border-radius: 10px`, 파란 그라디언트(`#4A8FE7→#3A7FD7`), `font-size: 13px bold` (`Header`, `Footer`, `AuthLeftPanel` 수정)
- JspHeader 배지를 CSS span → SVG로 교체해 YE 위치를 HomeNav와 완전히 통일
- JspHeader 로고 텍스트 스타일 맞춤: 로고명 `18px→19px`, 태그라인 `font-weight: 500` / `letter-spacing: 0.1px` / `line-height: 1` 추가, 텍스트 wrap `gap: 1px`
- 네비게이션 방식 전환: `useNavigate` + button → `<Link>` (Ctrl+클릭·우클릭 새 탭 지원), 폼 제출 후 리다이렉트는 navigate() 유지
- 구직 페이지 전면 리디자인 (홈 화면 연계):
  - Hero: 제목 2줄(두 번째 줄 파란 강조), 검색버튼 원형 아이콘화, 인기지역 레이블 추가
  - JspFeatureCards → 직종별 일자리 8종 카테고리 그리드 (요양보호사/간병인/돌봄교사 등)
  - JspJobTable → 2컬럼 레이아웃: 추천 일자리 테이블(주간·야간·단기 배지) + 맞춤 일자리 사이드바 + 이력서 등록 CTA 박스
  - CTA 배너: 문구·아이콘 업데이트
- 전체 페이지 공통 헤더 통일 (HomeNav 기준):
  - HomeNav를 자기 완결형으로 리팩터: `useLocation`으로 활성 메뉴 자동 감지, `fetchCurrentUser`/`logout` 내장, `HomePage.css` 직접 import
  - HomePage에서 유저 상태 관리 코드 제거 (HomeNav가 담당)
  - JobSeekerPage에서 JspHeader 제거 → HomeNav 재사용
  - 로그인/회원가입 페이지는 헤더 없으므로 예외
- nav 메뉴 클릭 시 페이지 이동 연결 (홈↔구직, `useNavigate` 추가)
- 구직 히어로 배경 이미지 교체: 이모지 캐릭터 → `caregiver-hero.png` 실제 사진 (홈과 동일 스타일)
- 구직 등록 페이지 신규 생성 (`/job-register`):
  - JrHero: 홈 그라디언트 배경 + 타이틀 + 캐릭터 말풍선
  - JrForm: 4단계 표시 + 기본정보/희망정보/자격경력/자기소개/첨부서류 폼
  - JrSidebar: 구직 등록 안내 / 일자리 찾기 배너 / 자주 묻는 질문
  - App.jsx에 `/job-register` 라우트 추가
- impeccable 플러그인 비활성화 (`~/.claude/settings.json`)
- 구직 페이지 이력서 등록 버튼 → `/job-register` 연결 (사이드바 + 하단 CTA 배너)
