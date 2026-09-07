# 요양나라 Frontend

요양보호사 구인구직 플랫폼 **요양나라**의 React 프론트엔드입니다.

---

## 브랜치 안내

| 브랜치 | 내용 |
|---|---|
| `feature/frontend-ui` | 전체 UI 기반 설계 |
| `feature/frontend-pages-juhyun` | 로그인 페이지 + 구직 페이지 (주현 작업) |

---

## 실행 방법

```bash
cd frontend
npm install
npm run dev
```

> 기본 주소: `http://localhost:5173`

---

## 페이지 전환

URL 쿼리로 원하는 화면을 바로 확인할 수 있습니다.

| URL | 화면 |
|---|---|
| `http://localhost:5173` | 로그인 화면 (기본) |
| `http://localhost:5173?page=login` | 로그인 화면 |
| `http://localhost:5173?page=jobseeker` | 구직 화면 |

---

## 구현된 페이지

### 로그인 페이지 (`/src/pages/LoginPage.jsx`)
- 개인회원 / 사업자용 탭 전환
- 개인회원: 네이버·카카오·구글 간편 로그인 + 아이디/비밀번호 입력
- 사업자용: 아이디/비밀번호 입력만
- 비밀번호 표시/숨김 토글
- 유효성 검사 (이메일 형식, 비밀번호 6자 이상)
- 왼쪽 패널: 요양보호사 사진 (`/public/caregiver-hero.png`)

### 구직 페이지 (`/src/pages/JobSeekerPage.jsx`)
- 지역 필터 칩 (서울·경기·인천 등 10개 지역)
- 키워드 검색
- 일자리 카드 (일자리 찾기·이력서 등록·지원 현황·맞춤 추천)
- 구직 공고 목록 테이블 (하트 찜하기 토글)
- 헤더 hover 드롭다운 메뉴

---

## 파일 구조

```
frontend/
├── public/
│   ├── caregiver-hero.png   # 로그인 왼쪽 패널 사진
│   └── login-hero.png
├── src/
│   ├── App.jsx              # 페이지 라우팅 (URL 쿼리 기반)
│   └── pages/
│       ├── LoginPage.jsx
│       ├── LoginPage.css
│       ├── JobSeekerPage.jsx
│       └── JobSeekerPage.css
```

---

## 기술 스택

- React 18 + Vite
- CSS (컴포넌트별 네임스페이스: `lp-` / `jsp-`)
- 백엔드 미연동 — 목업 데이터 사용 중
