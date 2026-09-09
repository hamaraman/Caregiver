# Caregiver
요양이지 웹사이트 프로젝트

---

## 작업 로그

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
