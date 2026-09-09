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
