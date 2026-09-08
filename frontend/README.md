# 요양이지 Frontend

요양보호사 구인구직 플랫폼 **요양이지**의 React 프론트엔드입니다.

---

## 브랜치 안내

| 브랜치 | 내용 |
|---|---|
| `feature/frontend-ui` | 전체 UI 기반 설계 |
| `feature/frontend-pages-juhyun` | 홈·로그인·구직 페이지 + 공통 컴포넌트 (주현 작업) |

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
| `http://localhost:5173?page=home` | 홈 화면 |

---

## 구현된 페이지

### 홈 페이지 (`/src/pages/HomePage.jsx`)
- 상단 네비게이션 바 (홈·구직·구인·커뮤니티·고객센터 + hover 드롭다운)
- 히어로 섹션: 검색창, 지역 필터 칩(10개), 구직하기·구인공고 등록 카드
- 플랫폼 현황 통계 4종 (등록 구직자·업체·진행 공고·이번달 매칭)
- 퀵 메뉴 8종 (일자리 찾기·구직 등록·이력서 등록 등)
- 지역별 인기 직종 순위 테이블
- 최근 구인 등록 목록 (긴급·인기 뱃지)
- 요양이지 자격증관 (요양보호사·사회복지사·간호조무사·물리치료사)
- 하단 푸터

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

## 공통 컴포넌트

| 컴포넌트 | 파일 | 설명 |
|---|---|---|
| Header | `components/Header.jsx` | 공통 헤더. 네비게이션, 구인 드롭다운 메뉴, 로그인/로그아웃 상태 처리 |
| AuthModal | `components/AuthModal.jsx` | 로그인·회원가입 모달. 백엔드 API(`api.js`) 연동 |
| HeroBanner | `components/HeroBanner.jsx` | 구인 포커스 히어로 배너. 키워드 검색 + 지역 필터 탭 |
| FeatureCards | `components/FeatureCards.jsx` | 기능 소개 카드 4종 (구인 등록·지원자 확인·채용 관리·맞춤 인재 추천) |
| JobListings | `components/JobListings.jsx` | 최근 구인 공고 목록. 찜하기(하트) 토글 |
| CTABanner | `components/CTABanner.jsx` | 구인공고 등록·맞춤인재추천 CTA 배너 |
| Footer | `components/Footer.jsx` | 공통 푸터. 사업자 정보·링크 |

---

## 파일 구조

```
frontend/
├── public/
│   ├── caregiver-hero.png       # 로그인/홈 히어로 사진
│   └── login-hero.png
├── src/
│   ├── App.jsx                  # 페이지 라우팅 (URL 쿼리 기반)
│   ├── api.js                   # 백엔드 API 연동 (login·register·fetchCurrentUser·logout)
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── HomePage.css
│   │   ├── LoginPage.jsx
│   │   ├── LoginPage.css
│   │   ├── JobSeekerPage.jsx
│   │   └── JobSeekerPage.css
│   └── components/
│       ├── AuthModal.jsx / .css
│       ├── CTABanner.jsx / .css
│       ├── FeatureCards.jsx / .css
│       ├── Footer.jsx / .css
│       ├── Header.jsx / .css
│       ├── HeroBanner.jsx / .css
│       └── JobListings.jsx / .css
```

---

## 기술 스택

- React 19 + Vite 8
- CSS (컴포넌트별 네임스페이스: `hp-` / `lp-` / `jsp-`)
- 백엔드 부분 연동 — `AuthModal`은 API 연결, 나머지는 목업 데이터 사용 중
- home
<img width="1899" height="943" alt="image" src="https://github.com/user-attachments/assets/5b7aba9c-e6d1-46fa-93b8-ede445fa343f" />

- login
- <img width="1903" height="936" alt="image" src="https://github.com/user-attachments/assets/6df97cb2-bf83-4616-807e-130d890485ce" />
- account create
- <img width="1915" height="944" alt="image" src="https://github.com/user-attachments/assets/244fa326-3d16-4738-8ecb-4c3d7394a9d8" />


