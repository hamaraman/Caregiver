# 요양이지 (YoYang Easy)

요양보호사 구인구직을 위한 전문 플랫폼입니다.  
구인 업체와 구직 요양보호사를 빠르고 쉽게 연결합니다.

---

## 주요 기능

### 공통
| 기능 | 설명 |
|------|------|
| 모바일 반응형 | 전 페이지 768px / 480px 브레이크포인트 대응 |
| 햄버거 메뉴 | 모바일 헤더 네비게이션 |
| 로그인 상태 분기 | 구인자 / 구직자 / 비로그인별 UI 차별화 |
| 페이지 접근 제한 | `/manage`, `/applicants`, `/jobs/post` — 구인자 계정 전용 |
| 홈 검색 연동 | 히어로 검색창·지역 다중선택 → 공고 목록 필터 자동 적용 |

### 구인자
| 기능 | 설명 |
|------|------|
| 구인공고 목록 | 지역·직종·근무형태·급여 필터, 내 구인공고 섹션 |
| 구인공고 등록 | 케어 조건, 급여, 마감일 등 상세 공고 작성 |
| 구인공고 상세 | 공고 세부 정보 확인 |
| 인재 정보 | 지역·직종·경력 필터 + 맞춤 인재 추천 (구인자 전용) |
| 인재 상세 | 자격증, 경력, 희망조건, 자기소개 확인 |
| 지원자 확인 | 공고별 지원자 목록 및 합격·불합격 상태 관리 |
| 채용 관리 | 전체·진행중·마감 필터, 마감·재개 처리 |

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 18 + Vite |
| Routing | React Router DOM v6 |
| Styling | CSS (컴포넌트별) |
| 인증 | Session 기반 (Spring Boot) + AuthContext |
| 주소검색 | 카카오 우편번호 API |
| Backend | Spring Boot + PostgreSQL |

---

## 실행 방법

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

### 백엔드
```bash
./mvnw spring-boot:run
# http://localhost:8080
```

---

## 폴더 구조

```
frontend/
├── src/
│   ├── components/     # 공통 컴포넌트 (Header, Footer, AuthGuard 등)
│   ├── contexts/       # AuthContext (전역 인증 상태)
│   ├── hooks/          # useAuth
│   ├── pages/          # 페이지 컴포넌트
│   ├── data/           # 목 데이터 (jobs, talents, applicants)
│   └── api.js          # 백엔드 API 연동
└── public/

src/
└── main/java/org/example/caregiver/   # Spring Boot 백엔드
```
