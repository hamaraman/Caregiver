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

## 작업 로그

### 2026-09-14
- Header 네비게이션에 아이콘 추가 (홈/구직/구인/커뮤니티/고객센터), 로그인 버튼 border 스타일 적용 (HomeNav 스타일 통일)
- 인재정보 페이지: 히어로 섹션 추가 + 3컬럼 레이아웃(사이드바 필터·메인·알림사이드바), 카드리스트 뷰 신설
- 구인공고 목록 페이지: 히어로 섹션 추가 + 3컬럼 레이아웃(사이드바 필터·메인·알림사이드바), jlp-* 클래스 정리
- 구인자 홈(EmployerHomePage): 히어로 배너 블루 그라디언트+실제 이미지로 교체, 채용기능 섹션 8개 아이콘 수평 레이아웃으로 개편, 최근공고+채용빠른메뉴 2컬럼 레이아웃으로 개편
- 채용관리 상세 페이지(/manage/:id) 추가: 공고 요약 + 합격자 카드 목록
- 지원자확인 상세 페이지(/applicants/:id) 추가: 공고 요약 + 전체 지원자 카드 + 상태 변경
- 지원자확인 공고 탭 클릭 시 /applicants/:id 로 이동하도록 연결
- 합격자 카드 클릭 시 이력서 대신 고용 관리 모달(HiredWorkerModal) 표시 — 근무정보·연락처·계약정보·메모 포함
- ApplicantModal 공유 컴포넌트 추가: 지원자 이력서 팝업 (지원자확인/상세 페이지에서 사용)
- 채용관리 카드 구성 변경: 합격 인원 배지 표시, 카드 클릭 시 상세 페이지 이동
- 전체 앱 디자인 블루톤(#4A8FE7) 으로 통일: 기존 핑크(#e91e8c, #c01070 등) 색상 전면 교체
- 헤더·푸터 로고 그라디언트 순수 블루로 변경
- FeatureCards 다양한 컬러 팔레트 적용: 블루·틸·앰버·퍼플로 카드별 개성 부여
- 전 페이지(JobListings, TalentList, RecruitManage, Applicants 등) 잔여 핑크 색상 모두 블루 계열로 교체
- 검색창 핑크 배경/테두리 전체 블루 계열로 수정
- 채용관리 진행중 요약카드 선택 상태 색감 강화
- CTABanner·TalentList 추천뱃지 핑크 → 블루/틸로 변경
- JspFeatureCards·JspJobTable 간병인/찜한일자리 핑크 → 퍼플로 변경

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
