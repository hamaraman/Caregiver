# 요양이지 (YoYang Easy)

요양보호사 구인구직을 위한 전문 플랫폼입니다.  
구인 업체와 구직 요양보호사를 빠르고 쉽게 연결합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 구인공고 목록 | 지역·직종·근무형태 필터로 원하는 공고 탐색 |
| 구인공고 등록 | 케어 조건, 급여, 마감일 등 상세 공고 작성 |
| 구인공고 상세 | 공고 세부 정보 확인 및 바로지원 |
| 인재 정보 | 지역·직종·경력 필터로 구직자 탐색 |
| 인재 상세 | 자격증, 경력, 희망조건, 자기소개 확인 |
| 지원자 확인 | 공고별 지원자 목록 및 합격·불합격 상태 관리 |
| 채용 관리 | 등록 공고 현황 및 마감·재개 처리 |

---

## 화면 구성

### 홈
![홈](docs/screenshots/home.png)

### 구인공고 목록
![구인공고 목록](docs/screenshots/jobs.png)

### 구인공고 등록
![구인공고 등록](docs/screenshots/post.png)

### 인재 정보
![인재 정보](docs/screenshots/talents.png)

### 지원자 확인
![지원자 확인](docs/screenshots/applicants.png)

### 채용 관리
![채용 관리](docs/screenshots/manage.png)

---

## 기술 스택

- **Frontend** : React 18 + Vite
- **Routing** : React Router DOM v6
- **Styling** : CSS (컴포넌트별 모듈)
- **주소검색** : 카카오 우편번호 API
- **Backend** : Spring Boot (별도 레포)

---

## 실행 방법

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 폴더 구조

```
frontend/
├── src/
│   ├── components/     # 공통 컴포넌트 (Header, Footer, CTABanner 등)
│   ├── pages/          # 페이지 컴포넌트
│   ├── data/           # 목 데이터 (jobs, talents, applicants)
│   └── api.js          # 백엔드 API 연동
└── public/
```
