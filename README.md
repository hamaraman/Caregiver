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
