# Caregiver
요양이지 웹사이트 프로젝트

---

## 작업 로그

### 2026-09-09
- `react-router-dom` 설치
- `main.jsx`에 `BrowserRouter` 적용
- `App.jsx`를 `Routes` / `Route` 기반으로 교체
- URL-컴포넌트 매핑 확정:
  - `/` → `HomePage`
  - `/login` → `LoginPage`
  - `/signup` → `SignupPage`
  - `/jobseeker` → `JobSeekerPage`
  - 그 외 → `/` 리다이렉트
- 모든 페이지·하위 컴포넌트에서 `onNavigate` prop 제거 → `useNavigate` 훅으로 전환 (`HomeNav`, `HomeHero`, `JspHeader`, `LoginPage`, `SignupPage`)
- `LoginPage`의 하드코딩된 `window.location.href` 제거, `navigate('/')` 로 통일
