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
