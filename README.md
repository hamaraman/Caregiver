# Caregiver

요양이지 - 요양보호사 관련 사이트

## API

### 인증 (`/api/auth`)
- `POST /register` - 회원가입 (개인/사업자)
- `POST /login` - 로그인 (계정 유형 불일치 시 거부)
- `POST /logout` - 로그아웃
- `GET /me` - 현재 로그인 사용자 조회
- `GET /oauth2/authorization/{kakao|naver|google}` - 소셜 로그인 시작 (세션 기반 로그인과 동일한 사용자로 연동됨)

### 구인공고 (`/api/jobs`)
- `GET /` - 목록 조회 (`?region=서울`처럼 지역 접두어로 필터링 가능, 생략 시 전체 조회)
- `GET /{id}` - 상세 조회
- `POST /` - 등록 (사업자 계정만 가능, 등록자가 owner로 저장됨)
- `GET /mine` - 내가 등록한 공고 목록 (사업자)
- `POST /{id}/like`, `DELETE /{id}/like` - 찜하기/찜 해제

Job 엔티티는 기본 정보(title/location/wage/hours/days/date/companyName/postTitle) 외에
근무조건 상세(jobType/facility/workForm/employForm/education/experience/deadline/weekdays 등),
케어 대상자 정보(careGender/careAge/careGrade/careCondition/careWork),
공고 내용(postDetail/applyMethod/companyUrl/applyEmail/applyFax),
업체·담당자 정보(companyPhone/companyAddr/managerName 등)까지 저장 가능 (모두 선택 필드).

### 지원자 (`/api/jobs/{jobId}/applications`, `/api/applications/{id}/status`)
- `POST /api/jobs/{jobId}/applications` - 공고 지원 (중복 지원 불가)
- `GET /api/jobs/{jobId}/applications` - 지원자 목록 조회 (공고 소유 사업자만)
- `PATCH /api/applications/{id}/status` - 지원 상태 변경 (검토중/합격/불합격, 공고 소유 사업자만)

### 구직자 이력서 (`/api/resumes/me`)
- `POST /me` - 이력서 등록/수정 (upsert)
- `GET /me` - 내 이력서 조회

### 인재 정보 (`/api/caregivers`)
- `GET /` - 목록 조회 (연락처 phone 필드 포함, `?region=경기`처럼 지역 접두어로 필터링 가능)

## 백엔드 구조

- 회원/구인공고/인재정보/지원/이력서 로직은 `feature/backend-db-auth+WCH` 브랜치의 통합 백엔드를 채택했습니다.
- `Caregiver`는 이제 (구버전에 있던 별도의 `Member` 엔티티 대신) `auth.User`를 owner로 참조합니다. `Member`/`MemberRepository`는 중복 구현이라 제거했습니다.
- OAuth2 로그인(`CustomOAuth2UserService`, `OAuth2SuccessHandler`)은 `auth.User`/`UserRepository`를 사용해서, 이메일/비밀번호 로그인과 소셜 로그인이 같은 계정(User)으로 합쳐집니다.

### 로컬 실행 순서

1. PostgreSQL 실행 (`caregiver_db`, `application.properties` 참고)
2. `src/main/resources/application-secret.properties`(gitignore됨, 각자 로컬 생성)에 실제 값을 채워넣기 — 없으면 서버 부팅 자체가 실패합니다:
   ```
   spring.datasource.username=...
   spring.datasource.password=...
   spring.security.oauth2.client.registration.naver.client-id=...
   spring.security.oauth2.client.registration.naver.client-secret=...
   spring.security.oauth2.client.registration.kakao.client-id=...
   spring.security.oauth2.client.registration.kakao.client-secret=...
   spring.security.oauth2.client.registration.google.client-id=...
   spring.security.oauth2.client.registration.google.client-secret=...
   ```
   당장 쓰지 않는 소셜 로그인은 더미 값이라도 넣어야 부팅이 됩니다.
3. `.\gradlew.bat bootRun` → 백엔드 `http://localhost:8081`

### 프론트엔드 연동

백엔드 `SecurityConfig`의 CORS 허용 목록에 `http://localhost:3000`, `http://localhost:3001`, `http://localhost:5173`을 등록해뒀습니다. 다른 포트를 쓰는 프론트엔드를 붙이려면 이 목록에 추가해야 합니다.

### 알려진 이슈

- 카카오/네이버/구글 `redirect-uri`가 `{baseUrl}`(요청 주소 기반 자동 계산)이라, 백엔드 포트를 바꾸면 각 서비스 개발자 콘솔에 등록된 콜백 주소도 같이 맞춰줘야 소셜 로그인이 동작합니다. 현재 8081로 고정한 이유가 이것입니다.
- 과거 커밋 히스토리에 DB 비밀번호와 카카오/네이버 client-secret이 평문으로 남아있습니다. 지금부터는 `application-secret.properties`로 관리되지만, 해당 자격증명은 회전(rotate)을 권장합니다.

## 작업 로그

### 2026-09-18
- 마이페이지 기능 추가: 일반회원/사업자 조건 분기, 계정 정보 수정, 비밀번호 변경, 빠른 메뉴 허브 (`/mypage`)
- 백엔드 `PATCH /api/auth/me`, `PATCH /api/auth/me/password` 엔드포인트 추가
- HomeNav 로그인 상태에서 이름 클릭 시 마이페이지로 이동하도록 변경
- 구직 등록 페이지에 구인공고 등록과 동일한 스텝퍼 UI 및 스크롤 추적 효과 적용 (JrForm.jsx에 jp-steps 스텝퍼 + 섹션 ID + 스크롤 리스너 추가)
- 찜 기능 확장: 구인공고목록(개인 회원)·인재추천(사업자) 하트 버튼 추가, 백엔드 `resume_likes` 테이블 및 `/api/resumes/{id}/like`, `/api/resumes/liked` 엔드포인트 신규 구현 (localStorage 임시 구현 → 백엔드 API로 교체)
- WishlistPage 사용자 유형별 분기: 개인 회원은 찜한 일자리, 사업자는 찜한 인재만 표시
- 사업자 구인 화면(EhpFeatureCards): 구인공고목록 카드 제거, 찜한 인재 카드 추가
- 네비게이션 구인 드롭다운에서 구인공고 목록 항목 제거

### 2026-09-17 (32)
- 브라우저 탭 제목을 기본값 "frontend"에서 "요양이지"로 수정 (`index.html` `<title>`)

### 2026-09-17 (31)
- 헤더·로그인 화면에 남아있던 "YE" 텍스트 placeholder 로고를 새 로고 이미지(`/favicon.png`)로 교체: `HomeNav`(데스크탑·모바일), `JspHeader`, `AuthLeftPanel`

### 2026-09-17 (30)
- 일자리 목록 모바일 카드 레이아웃 개선: 카드 세로 배치, 시설명 숨김, 메타 한 줄 처리, 급여·날짜 하단 행으로 분리

### 2026-09-17 (29)
- 구직 등록 페이지 전면 재설계: 4단계 스텝 폼 → 구인공고 양식처럼 한 페이지 스크롤 폼으로 변경
- JobPostPage.css의 jp-* 클래스를 재사용해 섹션 헤더·행 레이아웃 통일, 모바일에서 라벨+입력값 상하 배치

### 2026-09-17 (28)
- README에 기술 스택(Frontend/Backend) 섹션 추가
- 파비콘을 새 로고 이미지로 교체: `frontend/public/favicon.svg` → `favicon.png` (기존 svg 삭제)

### 2026-09-17 (27)
- `ApplicantsPage.jsx` 지원 상태 변경(`changeStatus`) 실패 시 이전 상태로 롤백 + 알림 표시 추가
- 더 이상 참조하지 않는 `frontend/src/data/mockManage.js` 삭제

### 2026-09-17 (26)
- 구직 등록 jr-row-3 기본값 3열→1열로 변경, 스텝 라벨 기본 숨김(모바일 공간 확보)

### 2026-09-17 (25)
- 구직 등록 페이지 레이아웃 전략 변경: max-width 미디어쿼리 → 기본값 모바일, min-width 1200px에서만 데스크탑 복원. 사이드바 기본 숨김, 섹션 카드 border-radius/box-shadow 기본 제거. 뷰포트 물리픽셀 이슈에 무관하게 모바일 레이아웃 보장

### 2026-09-17 (24)
- MainActivity.kt: useWideViewPort false→true, loadWithOverviewMode false→true — viewport meta 태그를 무시하던 문제 수정 (CSS @media 모바일 쿼리가 물리픽셀 기준으로 판단되어 모바일 스타일이 아예 안 적용되던 근본 원인)
- 구직 등록 페이지 모바일 미디어쿼리 브레이크포인트 768→1024px로 확장 (안전망)

### 2026-09-17 (23)
- 인재 상세 페이지(`/talents/:id`) 디자인을 다른 페이지와 통일: Header → HomeNav 교체, 카드 스타일(파란 테두리 제거·중립 그림자), 사이드바 레이아웃 추가, 모바일 반응형(768px·480px) 추가

### 2026-09-17 (22)
- 상단 네비 고객센터 드롭다운 항목(공지사항·FAQ·1:1 문의)을 각 탭 URL로 연결: `/support?tab=notice`, `/support?tab=faq`, `/support?tab=contact`

### 2026-09-17 (21)
- 맞춤인재 카드 모바일(680px 이하) overflow 수정: 성별 뱃지·나이 숨김, meta 텍스트 말줄임, 우측 급여 영역 축소

### 2026-09-17 (20)
- 공고 목록 필터에 "내 공고만 보기" 토글 추가: 사업자 계정 로그인 시에만 표시, 활성화하면 본인이 등록한 공고만 필터링

### 2026-09-17 (19)
- 홈 히어로 지역 칩 크기를 구직/구인 페이지 칩과 통일: font-size 12→13px, padding 5px 12px→6px 16px

### 2026-09-17 (18)
- 구인홈 모바일 Hero 폰트·패딩 축소 (제목 38→26px, 상단 패딩 56→36px)
- 구인홈 CTA 배너 모바일에서 세로 배치로 수정 (flex-direction: column, 버튼 전체 너비)

### 2026-09-17 (17)
- 구직 등록 페이지(`/job-register`) 모바일 레이아웃 개선: 카드 좌우 여백 제거, 섹션 카드 border-radius·box-shadow 제거 후 구분선으로 대체, 전체 너비 사용

### 2026-09-17 (16)
- Job.java 컬렉션 필드(weekdays/careCondition/careWork/applyMethod)에 `@Fetch(FetchMode.SUBSELECT)` 추가: 공고 목록 조회 시 건당 반복되던 N+1 쿼리를 컬렉션당 1회로 축소
- `JobApplication`에 근무 시작일/일정/시간/근무형태/임금/고용형태(hired*) 컬럼 추가, `PATCH /api/applications/{id}/hired-terms` 신설 — `HiredWorkerModal`의 "저장"이 컴포넌트 state에만 남고 실제로는 DB에 저장되지 않던 문제 해결
- `RecruitManagePage`/`RecruitDetailPage`/`ApplicantsPage`/`ApplicantDetailPage`가 `mockManage.js` 가짜 데이터로 되돌아가 있던 것을 실제 API로 재전환. mock ID로 실제 백엔드를 호출하던 `updateApplicationStatus`가 거의 항상 실패하면서도 에러를 삼켜(`.catch(() => {})`) 화면만 바뀌고 저장 안 되던 문제도 함께 해결(실패 시 롤백 + 안내)

### 2026-09-17 (15)
- 카카오맵이 안 보이던 문제 수정: `frontend/index.html`에 하드코딩된 카카오 앱키(`ed28b894...`)가 지도 제품이 비활성화된 다른 카카오 앱 키였음. 실제로 지도 제품이 활성화된 앱의 키(`ea8448ff...`)로 교체

### 2026-09-17 (14)
- 지원자확인·채용관리 AuthGuard 복원
- LoginPage 아이디 찾기/비밀번호 찾기 링크 수정: `/support` → `/find-id`, `/find-password`

### 2026-09-17 (13)
- 지원자확인 공고 탭 카드 크기 축소: 패딩 14→10px, min-width 160→120px, 폰트 1px 감소

### 2026-09-17 (12)
- 채용관리 상세 공고 요약 카드 "공고 보기" 버튼을 모바일에서도 우측 고정되도록 수정 (flex-direction: column 제거, 제목 행 flex: 1)

### 2026-09-17 (11)
- 채용인원 모달 모바일에서 그리드 1열 → 2열 유지: 우측 빈 공간 제거

### 2026-09-17 (10)
- 지원자확인 요약 바 모바일에서 오른쪽 빈 공간 수정: ap-summary-link margin-left: auto 복원
- 채용관리 480px에서 요약 카드 4열 한 줄 유지, 폰트·패딩 축소

### 2026-09-17 (9)
- 채용관리 CSS 480px 브레이크포인트 추가 (요약 카드 2×2 그리드, 버튼 크기 축소)
- 반응형 확인을 위해 지원자확인·채용관리 AuthGuard 임시 제거 (확인 후 복원 예정)

### 2026-09-17 (8)
- 푸터 고객센터 링크를 `/support?tab=contact`(1:1 문의 탭)으로 수정

### 2026-09-17 (7)
- 푸터 FAQ 클릭 시 고객센터 FAQ 탭으로 이동: SupportPage가 searchParams 변화를 감지하지 못하던 문제를 useEffect로 수정

### 2026-09-17 (6)
- 고객센터 공지사항 행에 `cursor: pointer` 추가

### 2026-09-17 (5)
- 야간 배지 색상 변경이 일부 페이지에 미반영되던 문제 수정: 각 페이지마다 색상을 따로 정의하던 것을 `data/shiftStyles.js` 하나로 통일, 야간 색상 `#7c3aed`(진보라)로 적용

### 2026-09-17 (4)
- JobRegisterPage·JobPostPage에서 HomeNav를 AuthGuard 바깥으로 이동 — 로그인 guard 화면에서도 헤더가 항상 표시되도록 통일

### 2026-09-17 (3)
- 공고 목록 야간 배지 색상 변경: 어두운 네이비 → 연보라/진보라(#f3eeff / #7c3aed)

### 2026-09-17 (2)
- 지원자확인·채용관리 페이지에 `AuthGuard(require="business")` 복원 — 디버깅 목적으로 임시 제거했던 것을 원래대로 되돌림
- 구인홈 "내 공고 관리 더보기" 링크를 `/listings` → `/manage`(채용관리 페이지)로 수정

### 2026-09-17
- `deploy.yml`에 `concurrency` 그룹 추가: main에 짧은 간격으로 여러 커밋이 push되면 배포 워크플로우가 겹쳐 실행되어(레이스 컨디션) 서버에서 백엔드 프로세스가 중복 기동되고 `/api`가 502를 반환하는 문제를 실제로 확인, 겹치는 배포가 순차 큐잉되도록 수정

### 2026-09-16
- 지원자확인 페이지(`/applicants`) 카드 클릭 시 상세 페이지(`/applicants/:id`)로 이동하도록 연결 (이전엔 아무 곳에서도 안 걸려있던 고아 라우트였음). 이름/상태 변경/이력서 토글 버튼은 `stopPropagation`으로 카드 클릭과 분리
- 지원자확인 페이지(`/applicants`)를 임시로 넣어뒀던 mock 데이터(`MOCK_JOBS`/`MOCK_APPLICANTS`/`MOCK_RESUMES`)에서 실제 API(`fetchMyJobs`, `fetchApplicantsForJob`, `fetchApplicantResume`, `updateApplicationStatus`)로 다시 되돌림, `AuthGuard`(사업자 전용)도 복원. 카드에 표시하던 나이/직종 등 mock 전용 필드는 실제 이력서 스키마(성별/생년월일/근무형태/경력/희망급여)로 대체
- `DataInitializer`에 샘플 지원자 4명(이력서 포함) + 지원 내역 시드 추가 — `job_applications` 테이블이 비어있을 때만 실행되어, 실제 API로 되돌린 지원자확인 페이지에서 바로 확인할 수 있는 예시 데이터 제공
- 채용관리 상세(`/manage/:id`), 지원자확인 상세(`/applicants/:id`) 페이지가 mock 데이터(`data/jobs.js`/`data/applicants.js`/`data/talents.js`)를 쓰던 것을 실제 API(`fetchJobRaw`, `fetchApplicantsForJob`, `fetchApplicantResume`, `updateApplicationStatus`)로 교체. 실제 DB ID와 mock ID가 달라 상세 페이지 진입 시 거의 항상 "공고를 찾을 수 없습니다"가 뜨던 문제, 지원 상태 변경이 저장 안 되던 문제 수정. `HiredWorkerModal`/`ApplicantModal`의 mock 연락처·시작일도 실제 이력서 스키마 필드로 정리. 공고 상세 링크 오탈자(`/jobs/:id` → `/job/:id`)도 같이 수정
- 배포 서버 백엔드가 포트 충돌(구 프로세스가 8081을 계속 점유)로 재시작 실패하던 문제 수정: 구 프로세스 강제 종료, `jobs` 테이블에 `closed` 컬럼이 없어서(기존 30개 행 때문에 NOT NULL 컬럼 추가가 매번 실패) Hibernate 스키마 갱신이 실패하던 문제도 `DEFAULT false`로 컬럼 직접 추가해 해결
- `.github/workflows/deploy.yml` 재시작 로직을 pidfile 기준 kill → 포트(8081) 기준 kill로 변경. pidfile이 실제 프로세스와 어긋나면(수동 재시작 등으로) 옛 프로세스가 안 죽고 새 프로세스가 포트 충돌로 계속 실패하던 근본 원인 수정. 재시작 후 실제로 포트가 열렸는지 확인해서, 백엔드가 못 뜨면 배포 자체를 실패 처리하도록 헬스체크도 추가 (전엔 백엔드가 죽어도 워크플로우는 항상 "성공"으로 찍혔음)
- 로그인 후 세션 미반영 버그 수정: navigate('/') → window.location.href='/' (풀 리로드로 AuthContext 재초기화)
- Vite 프록시에 /oauth2/, /login/oauth2/ 추가 → 로컬에서 소셜 로그인 창 정상 오픈
- HomeTodayStats 상단 알림 영역(벨 아이콘 + 오늘 확인해보세요) 제거
- HomeQuickMenu 구인 섹션 색상 복원: 파란색 → 핑크(#e91e8c), 구직 섹션 배경 흰색으로 통일
- HomeQuickMenu 그라디언트 제거, 아이콘 배경 흰색으로 대비 개선
- 홈 nav 로그인/회원가입 버튼 간격 개선
- Job @ElementCollection(weekdays/careCondition/careWork/applyMethod) FetchType.EAGER 변경 → /api/jobs 500 오류 수정
- 공고 상세 페이지에 카카오 지도 추가: 근무지 주소를 지오코딩해 마커 표시 (Kakao Maps JS SDK)
- 공고 상세 페이지 섹션 추가: 근무 조건 상세, 케어 대상자 정보, 지원 방법, 근무지 위치(지도), 업체 정보
- api.js normalizeJob에 상세 페이지용 원본 필드 노출 (weekdays, careCondition, careWork, applyMethod 등)
- DataInitializer에 샘플 구인공고 30개 추가: 서울·경기·인천·부산·대구·대전·광주·울산 지역 다양화, 기업 5개 확장, 야간·입주·오전·오후 등 근무형태 다양화 (배포 서버 재시작 시 자동 반영)
- LoginPage 소셜 로그인 버튼 버그 수정: `API_BASE` 문자열이 홑따옴표로 감싸져 있어 `${API_BASE}`가 실제로 치환되지 않고 깨진 URL로 이동하던 문제 (백틱으로 수정)
- 구인공고 목록 필터 데스크탑에서 "필터" 헤더 제거, 필터 섹션 항상 표시, 활성 필터 있을 때만 초기화 버튼 노출
- 구인공고 목록 필터 모바일 접기/펼치기 토글 추가
- 필터 근무시간대와 공고검색 버튼 사이 여백 증가 (margin-top 4px → 16px)
- 필터 패널 디자인 개선: 섹션 간격·구분선 정비, 셀렉트·지역·근무시간대 칩 hover/스타일 개선
- 구인공고 상세 페이지(`/job/:id`) 모바일 반응형 CSS 추가: 720px 이하에서 1열 레이아웃 전환, 지원하기 카드 상단 배치
- 구인공고 상세 페이지 상단 여백 축소: 데스크탑 32px → 12px, 모바일 24px → 8px
- 공고 등록 페이지(`/jobs/post`) AuthGuard 임시 제거 후 복원
- 지원자확인 페이지(`/applicants`) AuthGuard 임시 제거 + 예시 데이터 주입 (디자인 확인용)
- 공고 등록 페이지 모바일 디자인 개선: 히어로 여백·폰트 축소, 섹션 헤더 패딩 조정, 지역 선택 select 전체 너비, 근무시간 입력 균등 분할
- 공고 등록 페이지 모바일 select 너비 수정: 직종·시설·학력 등 단일 select가 전체 너비로 늘어나던 문제 → width: auto로 변경
- 급여 입력 모바일 레이아웃 수정: 금액 input이 전체 너비로 늘어나 "원" 텍스트가 다음 줄로 밀리던 문제 → flex: 1로 같은 줄 유지
- 공고 등록 페이지 진행 단계 표시 추가: 원형 숫자 스타일, 스크롤에 따라 현재 단계 파랑 하이라이트·완료 단계 초록 체크, 모바일 상단 sticky 고정
- 모바일 진행 단계 바 하단 테두리 선 제거
- 공고 등록 필수값 미입력 시 브라우저 기본 알럿 → 커스텀 토스트로 교체, 첫 번째 미입력 항목 섹션으로 자동 스크롤
- 구인공고 목록(`/listings`) 모바일 필터 토글 추가: 680px 이하에서 필터 접기/펼치기 버튼 표시, 활성 필터 수 뱃지 표시
- 구인공고 목록 마감된 공고에 "마감" 배지 및 opacity 표시
- 인기직종 칩 가로 스크롤 처리(`overflow-x: auto`)로 소형 화면 overflow 방지
- CI/CD 워크플로우 수정: `git pull origin main` → `git fetch origin && git checkout main && git reset --hard origin/main` (서버가 android-app 브랜치에 고정되어 배포가 반영되지 않던 문제 해결)
- 일자리 목록 빈 상태 UI 개선: 박스 제거, 아이콘+안내 문구로 교체, 로딩 스피너 추가
- JrForm 성별 필드 JSX 구조 오류 수정 (jr-section 밖에 있던 div 위치 교정)
- AuthGuard 로그인 필요 화면 핑크 → 블루 전환 (버튼·아이콘·테두리·배경 전체)
- TalentDetailPage(인재 상세) 핑크 → 블루 전환 (카드 테두리·섹션바·경력·급여 강조색·SVG 아이콘 전체)
- 프론트엔드 UI 전반 개선: JrForm 스텝퍼 UX 수정, JobDetailPage 지원하기 버튼 연결, HomeHero·JspHero 검색바 개선, MyApplicationsPage UI 리팩토링
- 로그인 페이지·구직자 페이지·공고 목록 등 다수 페이지 스타일 정비
- 네비게이션 버튼 간격 개선 (로그인·회원가입 버튼 spacing 추가)
- shiftStyles.js, useDragScroll.js 신규 추가

### 2026-09-14
- 고객센터 페이지(`/support`) 신규 생성: 공지사항·FAQ·1:1 문의 탭 구성
- 구인공고 등록 페이지 약관 동의 섹션 체크박스 UI 개선 (박스 중첩 제거, 일반 체크박스로 변경)
- 공고 상세 페이지(`/job/:id`) 추가: NavBar 연결, 뒤로가기 버튼, 찜하기 기능
- `/listings` 공고 링크 경로 오류 수정 (`/jobs/:id` → `/job/:id`)
- 구인공고 등록 페이지(`/jobs/post`) 히어로 배너 추가, 레이아웃 개선

### 2026-09-16
- 채용관리 상세 페이지(/manage/:id) 추가: 공고 요약 + 합격자 카드 목록 + HiredWorkerModal
- 지원자확인 상세 페이지(/applicants/:id) 추가: 공고 요약 + 전체 지원자 카드 + 상태 변경
- ApplicantModal 공유 컴포넌트 추가 (지원자 이력서 팝업)
- HiredWorkerModal 공유 컴포넌트 추가 (합격자 고용 관리 모달)
- 채용관리 카드 클릭 시 상세 페이지(/manage/:id)로 이동하도록 연결
- 전체 앱 핑크(#e91e8c) → 블루(#4A8FE7) 전면 교체: Header, HeroBanner, CTABanner, FeatureCards, JobListings, ApplicantsPage, TalentListPage, HomePage, 홈 섹션 컴포넌트 등
- JrForm.jsx 성별 필드 JSX 구조 오류(adjacent elements) 수정 → 빌드 실패 해결

### 2026-09-15
- 프론트엔드 구인공고 목록/상세 화면이 mock 데이터(`data/jobs.js` 등) 대신 실제 백엔드 API(`/api/jobs`)를 사용하도록 연동
- `api.js`에 `normalizeJob` 어댑터를 추가해 `JobResponse` 필드를 프론트 UI가 기대하던 형태(shift/dday/tags 등)로 변환
- 지원자 관리, 내 지원 내역, 공고 관리, 최근 본/찜한 일자리 페이지도 실제 API 응답 기반으로 전환
- 백엔드에 `GET /api/applications/mine`(`MyApplicationResponse`) 추가
- 구인공고 목록 상단의 인기지역 칩과 사이드바 지역 필터가 실제로 `/api/jobs?region=` 필터링을 호출하도록 연동
- 인재 목록/상세 화면도 mock(`data/talents.js`) 대신 `/api/caregivers`로 연동. UI가 필요로 하는 성별/나이/자격증/희망근무조건/근무이력 등 필드가 `Caregiver` 엔티티에 없어서 전부 선택 필드로 추가하고 `GET /api/caregivers/{id}` 단건 조회도 신설
- `JobPostPage`(구인공고 등록)가 `alert`만 띄우고 아무 데도 저장하지 않던 것을 실제 `POST /api/jobs` 호출로 교체, `AuthGuard`로 사업자 계정만 접근하도록 제한
- `JobRegisterPage`/`JrForm`(구직 등록)도 실제 `POST /api/resumes/me`로 연동, 기존 이력서가 있으면 불러와서 수정 가능하도록 함
- 홈/구직자 페이지 히어로 검색창·인기지역 칩이 실제로 `/jobs`, `/talents`로 이동하며 지역/키워드 쿼리파라미터를 검색 결과 페이지가 읽어서 반영하도록 연동
- `JsFilter`의 직무/근무형태/급여/경력 필터를 전부 실제로 동작하게 구현(클라이언트 사이드 필터링)
- 홈 화면 "오늘 확인해보세요" 통계와 구인공고 사이드바 "인기 검색어"의 하드코딩된 가짜 숫자를 실제 API 데이터 기반으로 교체, 동작하지 않던 알림 신청/FAQ 버튼에 최소한의 반응 추가
- `origin/main`의 배포 파이프라인·고객센터 페이지·JobPostPage 히어로 배너 등을 `main-merged`에 병합
- 공고 상세 페이지의 "지원하기"/"전화 문의" 버튼에 onClick이 없어서 아무 동작도 안 하던 것을 실제 `POST /api/jobs/{jobId}/applications` 호출과 `tel:` 링크로 연결
- 상단 네비게이션 검색 아이콘 버튼이 아무 반응 없던 것을 `/jobs`로 이동하도록 연결
- `SupportPage`에 `?tab=` 쿼리파라미터 지원 추가, `Footer`/`HomeContentGrid`/`JsSidebar`의 공지사항·FAQ·고객센터 링크(`href="#"` 또는 미연결 버튼)를 전부 `/support`로 연결. `JobListingsPage` 사이드바 "알림 신청" 버튼도 "준비 중" 안내로 연결
- `HomeContentGrid`의 "지역별 인기 정보"(서울 1,245건 등)와 홈 화면 공지사항 목록이 하드코딩된 가짜 데이터였던 것을 실제 `/api/jobs`·`/api/caregivers` 지역 분포로 교체. "최근 등록된 정보"의 "인재정보" 탭을 눌러도 구인공고만 계속 보이던 버그, `/jobs/{id}`로 링크가 잘못 나가던 버그(정확한 경로는 `/job/{id}`)도 같이 수정. 공지사항 목록은 `SupportPage`와 내용이 서로 다르게 중복 관리되던 것을 `data/notices.js`로 일원화
- `HomeContentGrid`의 지역 탭("전체"/"서울"/"경기"...)이 눌러도 순위에 반영이 안 됐던 것을 연결: "전체"는 시/도 단위 랭킹, 특정 시/도를 선택하면 그 안의 구/군 단위로 드릴다운되도록 구현
- 나머지 미연결 버튼 정리: `JrSidebar`의 배너/FAQ 더보기를 `/jobs`, `/support?tab=faq`로 연결. `SignupPage`의 약관 "보기" 3개, `LoginPage`의 "아이디 찾기"/"비밀번호 찾기"는 실제 문서·기능이 없어서 Footer와 같은 "준비 중" 안내로 처리. 히어로 4곳(`HomeHero`/`JsHero`/`JspHero`/`EhpHero`)의 인기지역 "더보기(›)" 화살표가 아무 반응 없던 것을 실제로 나머지 8개 지역(강원·충북·충남·전북·전남·경북·경남·제주)을 펼쳐 보여주도록 구현. `JsHero`의 검색창은 지금까지 완전히 붕 떠 있었는데 `JobSearchPage`의 keyword state와 연결해 `JsJobList` 필터링에 실제로 반영되도록 함
- **찜하기 이원화 버그 수정**: `JobDetailPage`의 하트 버튼이 브라우저 localStorage(`useJobStorage`)에만 저장하고 있어서, `WishlistPage`/`JspJobTable`이 쓰는 실제 DB 기반(`/api/jobs/{id}/like`) 찜 목록과 전혀 연동되지 않던 버그를 수정 — 상세 페이지에서 찜해도 "찜한 일자리" 목록엔 안 나타나는 상태였음. `JobDetailPage`도 동일한 백엔드 API를 쓰도록 통일하고, 이제 아무도 안 쓰는 localStorage 찜 함수(`getWishlist`/`toggleWishlist`/`isWishlisted`)는 `useJobStorage.js`에서 제거. `HomeTodayStats`의 "찜한 일자리" 카운트도 같은 localStorage를 참조하고 있었어서 실제 서버 데이터 기준으로 같이 수정
- **공고 마감 기능 신설**: `RecruitManagePage`의 "마감처리"/"재개하기"가 순수 React state(`closedJobs`)라 새로고침하면 리셋되고 실제로는 구직자가 계속 지원할 수 있던 버그를 백엔드 기능으로 만듦. `Job` 엔티티에 `closed` 필드 추가, 소유자 전용 `PATCH /api/jobs/{id}/close`·`/reopen` 신설, 마감된 공고는 공개 목록(`GET /api/jobs`)에서 제외하고 지원 시도도 서버에서 거부하도록 `JobApplicationService`에도 반영. `JobDetailPage`도 마감 시 지원 버튼을 비활성화하고 "마감" 배지를 표시. (배포 중 기존 공고 39건의 `closed` 컬럼이 NULL이라 500 에러가 났던 것도 `false`로 백필하고 NOT NULL 제약을 걸어 재발 방지)
- `ApplicantsPage`/`RecruitManagePage`가 `AuthGuard`를 import만 하고 실제로 씌우지 않아서(`JobPostPage`에서 있었던 것과 같은 실수) 로그인·사업자 확인 없이 빈 화면만 보이던 것을 `require="business"`로 감쌈. `MyApplicationsPage`도 로그인 없이 접근하면 "지원 내역 없음"으로만 보이던 것을 `AuthGuard`로 감싸서 로그인 안내가 뜨도록 수정
- **구조적 문제 발견 및 수정: "구직 등록"과 "인재 목록"이 서로 다른 테이블을 쓰고 있었음.** `JrForm`(구직 등록)은 `JobSeekerProfile`(`/api/resumes/me`)에 저장되는데, `TalentListPage`(인재 목록)는 `Caregiver`(`/api/caregivers`)를 읽고 있어서 — 구직자가 아무리 등록해도 인재 목록엔 절대 안 나타나는 상태였음(`Caregiver`는 등록 API 자체가 없어서 `DataInitializer` 시드 3건에서 영원히 안 늘어남). `JobSeekerProfile`에 `gender`/`date`(최초 등록일) 필드 추가, `JrForm`에 성별 입력 추가, 공개 조회용 `GET /api/resumes`(목록)·`GET /api/resumes/public/{id}`(단건) 신설. `TalentListPage`/`TalentDetailPage`가 이제 실제 등록된 구직자를 보여줌. 이력서 폼이 안 걷는 항목(근무이력, 희망요일, 학력)은 안전한 기본값으로 대체, 급여는 `wageType`+숫자 조합 대신 자유 텍스트(`wageLabel`)로 통일. 기존 `Caregiver`/`CaregiverController` 백엔드 코드는 삭제하지 않고 그대로 둠(더 이상 프론트에서 호출하지 않음)
- `Header.jsx`(TalentDetailPage에서 쓰는 별도 헤더)의 "고객센터" 메뉴가 `href="#"`였던 것을 `/support`로 연결. `EhpMainContent`(사업자 홈 대시보드)의 "내 공고 관리" 표 상태가 마감 여부와 무관하게 항상 "모집중"으로 고정돼 있던 것을 실제 `job.closed` 값에 따라 "마감"/"모집중"으로 표시하도록 수정
- 구인공고 목록(`/jobs`)의 정렬 탭 4개(최신순/마감임박순/급여높은순/인기순) 중 "최신순" 외에는 눌러도 정렬이 전혀 안 되던 것을 수정. "인기순"을 계산할 좋아요 집계 자체가 없어서 백엔드에 `JobResponse.likeCount`(공고별 찜 수 집계, `JobLikeRepository.likeCounts`)를 새로 추가하고 프론트에서 마감임박순(D-day)·급여높은순(파싱된 급여)·인기순(찜 수) 정렬을 실제로 구현
- 회원가입 시 사업자 계정은 업체명/사업자등록번호를 입력받아 검증까지 하는데, 실제 제출할 때는 이 값들을 전혀 안 보내고 있었음(`User` 엔티티에 저장할 필드 자체가 없었음). `User`에 `phone`/`companyName`/`businessNumber` 필드 추가하고 회원가입 시 실제로 저장·조회되도록 연결
- **공고 마감의 파급 효과 수정**: 마감된 공고는 공개 목록(`GET /api/jobs`)에서 빠지도록 만들었는데, `WishlistPage`/`JspJobTable`의 찜 목록·`HomeTodayStats`의 찜 카운트·`RecentJobsPage`의 최근 본 목록이 전부 이 공개 목록을 데이터 소스로 쓰고 있어서 — 찜해두거나 최근에 본 공고가 마감되면 별다른 안내 없이 목록에서 조용히 사라지는 문제가 있었음. 마감 여부와 무관하게 내가 찜한 공고를 전부 반환하는 `GET /api/jobs/liked`를 신설하고, 찜 목록/최근 본 목록 모두 이제 마감된 공고도 "마감" 배지와 함께 계속 보여주도록 수정
- `JobPostPage`에 "연락처 공개"(로그인 후 확인/바로 확인) 설정이 있는데 `JobDetailPage`가 이 값을 아예 안 읽어서, 사업자가 "로그인 후 확인"을 선택해도 비로그인 방문자에게 연락처가 그냥 다 보이던 것을 수정. `normalizeJob`에 `phonePublic` 노출, 비로그인 상태에서 "로그인 후 확인"으로 설정된 공고는 연락처 대신 로그인 유도 문구를 보여주도록 연결

### 2026-09-17
- `/applicants`(지원자 확인), `/manage`(채용 관리) 페이지에서 `AuthGuard`를 임시 제거 — 구조 확인 및 디버깅 목적
- 두 페이지에 mock 데이터 주입: 공고 4개(서울·부산·대전), 지원자 9명(이력서 포함) — 로그인 없이 UI 확인 가능
- 지원자확인 탭 클릭 시 `/manage/:id`(공고요약 페이지)로 이동하도록 변경
- 지원자 카드/이력서 버튼 클릭 시 `ApplicantModal`로 이력서 모달 표시 (인라인 펼치기 제거)
- 지원자확인 탭 클릭 → `/applicants/:id` (전체 지원자), 채용관리 카드 클릭 → `/manage/:id` (합격 인원)으로 각각 분리
- 두 상세 페이지(`ApplicantDetailPage`, `RecruitDetailPage`) mock 데이터로 교체, `Header` → `HomeNav`로 통일
- 공유 mock 데이터 파일(`src/data/mockManage.js`) 추가
- 오라클 서버 백엔드가 `nohup`으로만 떠 있어 재부팅·크래시 시 자동 복구가 안 되는 문제 발견 → `caregiver.service` systemd 유닛 등록(부팅 시 자동 시작, 크래시 시 자동 재시작)
- `deploy.yml`의 배포 스크립트가 `sudo fuser -k`+`nohup`으로 재시작하던 것을 `sudo systemctl restart caregiver`로 변경 — 이전 방식은 배포할 때마다 systemd 관리 밖의 프로세스를 새로 띄워서 방금 등록한 자동 복구 효과를 무력화시켰음### 2026-09-18
- 구직 등록 페이지에 구인공고 등록과 동일한 스텝퍼 UI 및 스크롤 추적 효과 적용 (JrForm.jsx에 jp-steps 스텝퍼 + 섹션 ID + 스크롤 리스너 추가)
- 인재 목록·상세 페이지에 관심 인재(하트) 기능 추가 — localStorage 기반, 하트 버튼 텍스트 제거·아이콘 전용으로 변경
- 인재 목록·상세 페이지에 관심 인재(하트) 기능 추가 — localStorage 기반, 하트 버튼 텍스트 제거·아이콘 전용으로 변경

### 2026-09-17 (24)
- MainActivity.kt: useWideViewPort false→true, loadWithOverviewMode false→true — viewport meta 태그를 무시하던 문제 수정 (CSS @media 모바일 쿼리가 물리픽셀 기준으로 판단되어 모바일 스타일이 아예 안 적용되던 근본 원인)
- 구직 등록 페이지 모바일 미디어쿼리 브레이크포인트 768→1024px로 확장 (안전망)

### 2026-09-17 (23)
- 인재 상세 페이지(`/talents/:id`) 디자인을 다른 페이지와 통일: Header → HomeNav 교체, 카드 스타일(파란 테두리 제거·중립 그림자), 사이드바 레이아웃 추가, 모바일 반응형(768px·480px) 추가

### 2026-09-17 (22)
- 상단 네비 고객센터 드롭다운 항목(공지사항·FAQ·1:1 문의)을 각 탭 URL로 연결: `/support?tab=notice`, `/support?tab=faq`, `/support?tab=contact`

### 2026-09-17 (21)
- 맞춤인재 카드 모바일(680px 이하) overflow 수정: 성별 뱃지·나이 숨김, meta 텍스트 말줄임, 우측 급여 영역 축소

### 2026-09-17 (20)
- 공고 목록 필터에 "내 공고만 보기" 토글 추가: 사업자 계정 로그인 시에만 표시, 활성화하면 본인이 등록한 공고만 필터링

### 2026-09-17 (19)
- 홈 히어로 지역 칩 크기를 구직/구인 페이지 칩과 통일: font-size 12→13px, padding 5px 12px→6px 16px

### 2026-09-17 (18)
- 구인홈 모바일 Hero 폰트·패딩 축소 (제목 38→26px, 상단 패딩 56→36px)
- 구인홈 CTA 배너 모바일에서 세로 배치로 수정 (flex-direction: column, 버튼 전체 너비)

### 2026-09-17 (17)
- 구직 등록 페이지(`/job-register`) 모바일 레이아웃 개선: 카드 좌우 여백 제거, 섹션 카드 border-radius·box-shadow 제거 후 구분선으로 대체, 전체 너비 사용

### 2026-09-17 (16)
- Job.java 컬렉션 필드(weekdays/careCondition/careWork/applyMethod)에 `@Fetch(FetchMode.SUBSELECT)` 추가: 공고 목록 조회 시 건당 반복되던 N+1 쿼리를 컬렉션당 1회로 축소
- `JobApplication`에 근무 시작일/일정/시간/근무형태/임금/고용형태(hired*) 컬럼 추가, `PATCH /api/applications/{id}/hired-terms` 신설 — `HiredWorkerModal`의 "저장"이 컴포넌트 state에만 남고 실제로는 DB에 저장되지 않던 문제 해결
- `RecruitManagePage`/`RecruitDetailPage`/`ApplicantsPage`/`ApplicantDetailPage`가 `mockManage.js` 가짜 데이터로 되돌아가 있던 것을 실제 API로 재전환. mock ID로 실제 백엔드를 호출하던 `updateApplicationStatus`가 거의 항상 실패하면서도 에러를 삼켜(`.catch(() => {})`) 화면만 바뀌고 저장 안 되던 문제도 함께 해결(실패 시 롤백 + 안내)

### 2026-09-17 (15)
- 카카오맵이 안 보이던 문제 수정: `frontend/index.html`에 하드코딩된 카카오 앱키(`ed28b894...`)가 지도 제품이 비활성화된 다른 카카오 앱 키였음. 실제로 지도 제품이 활성화된 앱의 키(`ea8448ff...`)로 교체

### 2026-09-17 (14)
- 지원자확인·채용관리 AuthGuard 복원
- LoginPage 아이디 찾기/비밀번호 찾기 링크 수정: `/support` → `/find-id`, `/find-password`

### 2026-09-17 (13)
- 지원자확인 공고 탭 카드 크기 축소: 패딩 14→10px, min-width 160→120px, 폰트 1px 감소

### 2026-09-17 (12)
- 채용관리 상세 공고 요약 카드 "공고 보기" 버튼을 모바일에서도 우측 고정되도록 수정 (flex-direction: column 제거, 제목 행 flex: 1)

### 2026-09-17 (11)
- 채용인원 모달 모바일에서 그리드 1열 → 2열 유지: 우측 빈 공간 제거

### 2026-09-17 (10)
- 지원자확인 요약 바 모바일에서 오른쪽 빈 공간 수정: ap-summary-link margin-left: auto 복원
- 채용관리 480px에서 요약 카드 4열 한 줄 유지, 폰트·패딩 축소

### 2026-09-17 (9)
- 채용관리 CSS 480px 브레이크포인트 추가 (요약 카드 2×2 그리드, 버튼 크기 축소)
- 반응형 확인을 위해 지원자확인·채용관리 AuthGuard 임시 제거 (확인 후 복원 예정)

### 2026-09-17 (8)
- 푸터 고객센터 링크를 `/support?tab=contact`(1:1 문의 탭)으로 수정

### 2026-09-17 (7)
- 푸터 FAQ 클릭 시 고객센터 FAQ 탭으로 이동: SupportPage가 searchParams 변화를 감지하지 못하던 문제를 useEffect로 수정

### 2026-09-17 (6)
- 고객센터 공지사항 행에 `cursor: pointer` 추가

### 2026-09-17 (5)
- 야간 배지 색상 변경이 일부 페이지에 미반영되던 문제 수정: 각 페이지마다 색상을 따로 정의하던 것을 `data/shiftStyles.js` 하나로 통일, 야간 색상 `#7c3aed`(진보라)로 적용

### 2026-09-17 (4)
- JobRegisterPage·JobPostPage에서 HomeNav를 AuthGuard 바깥으로 이동 — 로그인 guard 화면에서도 헤더가 항상 표시되도록 통일

### 2026-09-17 (3)
- 공고 목록 야간 배지 색상 변경: 어두운 네이비 → 연보라/진보라(#f3eeff / #7c3aed)

### 2026-09-17 (2)
- 지원자확인·채용관리 페이지에 `AuthGuard(require="business")` 복원 — 디버깅 목적으로 임시 제거했던 것을 원래대로 되돌림
- 구인홈 "내 공고 관리 더보기" 링크를 `/listings` → `/manage`(채용관리 페이지)로 수정

### 2026-09-17
- `deploy.yml`에 `concurrency` 그룹 추가: main에 짧은 간격으로 여러 커밋이 push되면 배포 워크플로우가 겹쳐 실행되어(레이스 컨디션) 서버에서 백엔드 프로세스가 중복 기동되고 `/api`가 502를 반환하는 문제를 실제로 확인, 겹치는 배포가 순차 큐잉되도록 수정

### 2026-09-16
- 지원자확인 페이지(`/applicants`) 카드 클릭 시 상세 페이지(`/applicants/:id`)로 이동하도록 연결 (이전엔 아무 곳에서도 안 걸려있던 고아 라우트였음). 이름/상태 변경/이력서 토글 버튼은 `stopPropagation`으로 카드 클릭과 분리
- 지원자확인 페이지(`/applicants`)를 임시로 넣어뒀던 mock 데이터(`MOCK_JOBS`/`MOCK_APPLICANTS`/`MOCK_RESUMES`)에서 실제 API(`fetchMyJobs`, `fetchApplicantsForJob`, `fetchApplicantResume`, `updateApplicationStatus`)로 다시 되돌림, `AuthGuard`(사업자 전용)도 복원. 카드에 표시하던 나이/직종 등 mock 전용 필드는 실제 이력서 스키마(성별/생년월일/근무형태/경력/희망급여)로 대체
- `DataInitializer`에 샘플 지원자 4명(이력서 포함) + 지원 내역 시드 추가 — `job_applications` 테이블이 비어있을 때만 실행되어, 실제 API로 되돌린 지원자확인 페이지에서 바로 확인할 수 있는 예시 데이터 제공
- 채용관리 상세(`/manage/:id`), 지원자확인 상세(`/applicants/:id`) 페이지가 mock 데이터(`data/jobs.js`/`data/applicants.js`/`data/talents.js`)를 쓰던 것을 실제 API(`fetchJobRaw`, `fetchApplicantsForJob`, `fetchApplicantResume`, `updateApplicationStatus`)로 교체. 실제 DB ID와 mock ID가 달라 상세 페이지 진입 시 거의 항상 "공고를 찾을 수 없습니다"가 뜨던 문제, 지원 상태 변경이 저장 안 되던 문제 수정. `HiredWorkerModal`/`ApplicantModal`의 mock 연락처·시작일도 실제 이력서 스키마 필드로 정리. 공고 상세 링크 오탈자(`/jobs/:id` → `/job/:id`)도 같이 수정
- 배포 서버 백엔드가 포트 충돌(구 프로세스가 8081을 계속 점유)로 재시작 실패하던 문제 수정: 구 프로세스 강제 종료, `jobs` 테이블에 `closed` 컬럼이 없어서(기존 30개 행 때문에 NOT NULL 컬럼 추가가 매번 실패) Hibernate 스키마 갱신이 실패하던 문제도 `DEFAULT false`로 컬럼 직접 추가해 해결
- `.github/workflows/deploy.yml` 재시작 로직을 pidfile 기준 kill → 포트(8081) 기준 kill로 변경. pidfile이 실제 프로세스와 어긋나면(수동 재시작 등으로) 옛 프로세스가 안 죽고 새 프로세스가 포트 충돌로 계속 실패하던 근본 원인 수정. 재시작 후 실제로 포트가 열렸는지 확인해서, 백엔드가 못 뜨면 배포 자체를 실패 처리하도록 헬스체크도 추가 (전엔 백엔드가 죽어도 워크플로우는 항상 "성공"으로 찍혔음)
- 로그인 후 세션 미반영 버그 수정: navigate('/') → window.location.href='/' (풀 리로드로 AuthContext 재초기화)
- Vite 프록시에 /oauth2/, /login/oauth2/ 추가 → 로컬에서 소셜 로그인 창 정상 오픈
- HomeTodayStats 상단 알림 영역(벨 아이콘 + 오늘 확인해보세요) 제거
- HomeQuickMenu 구인 섹션 색상 복원: 파란색 → 핑크(#e91e8c), 구직 섹션 배경 흰색으로 통일
- HomeQuickMenu 그라디언트 제거, 아이콘 배경 흰색으로 대비 개선
- 홈 nav 로그인/회원가입 버튼 간격 개선
- Job @ElementCollection(weekdays/careCondition/careWork/applyMethod) FetchType.EAGER 변경 → /api/jobs 500 오류 수정
- 공고 상세 페이지에 카카오 지도 추가: 근무지 주소를 지오코딩해 마커 표시 (Kakao Maps JS SDK)
- 공고 상세 페이지 섹션 추가: 근무 조건 상세, 케어 대상자 정보, 지원 방법, 근무지 위치(지도), 업체 정보
- api.js normalizeJob에 상세 페이지용 원본 필드 노출 (weekdays, careCondition, careWork, applyMethod 등)
- DataInitializer에 샘플 구인공고 30개 추가: 서울·경기·인천·부산·대구·대전·광주·울산 지역 다양화, 기업 5개 확장, 야간·입주·오전·오후 등 근무형태 다양화 (배포 서버 재시작 시 자동 반영)
- LoginPage 소셜 로그인 버튼 버그 수정: `API_BASE` 문자열이 홑따옴표로 감싸져 있어 `${API_BASE}`가 실제로 치환되지 않고 깨진 URL로 이동하던 문제 (백틱으로 수정)
- 구인공고 목록 필터 데스크탑에서 "필터" 헤더 제거, 필터 섹션 항상 표시, 활성 필터 있을 때만 초기화 버튼 노출
- 구인공고 목록 필터 모바일 접기/펼치기 토글 추가
- 필터 근무시간대와 공고검색 버튼 사이 여백 증가 (margin-top 4px → 16px)
- 필터 패널 디자인 개선: 섹션 간격·구분선 정비, 셀렉트·지역·근무시간대 칩 hover/스타일 개선
- 구인공고 상세 페이지(`/job/:id`) 모바일 반응형 CSS 추가: 720px 이하에서 1열 레이아웃 전환, 지원하기 카드 상단 배치
- 구인공고 상세 페이지 상단 여백 축소: 데스크탑 32px → 12px, 모바일 24px → 8px
- 공고 등록 페이지(`/jobs/post`) AuthGuard 임시 제거 후 복원
- 지원자확인 페이지(`/applicants`) AuthGuard 임시 제거 + 예시 데이터 주입 (디자인 확인용)
- 공고 등록 페이지 모바일 디자인 개선: 히어로 여백·폰트 축소, 섹션 헤더 패딩 조정, 지역 선택 select 전체 너비, 근무시간 입력 균등 분할
- 공고 등록 페이지 모바일 select 너비 수정: 직종·시설·학력 등 단일 select가 전체 너비로 늘어나던 문제 → width: auto로 변경
- 급여 입력 모바일 레이아웃 수정: 금액 input이 전체 너비로 늘어나 "원" 텍스트가 다음 줄로 밀리던 문제 → flex: 1로 같은 줄 유지
- 공고 등록 페이지 진행 단계 표시 추가: 원형 숫자 스타일, 스크롤에 따라 현재 단계 파랑 하이라이트·완료 단계 초록 체크, 모바일 상단 sticky 고정
- 모바일 진행 단계 바 하단 테두리 선 제거
- 공고 등록 필수값 미입력 시 브라우저 기본 알럿 → 커스텀 토스트로 교체, 첫 번째 미입력 항목 섹션으로 자동 스크롤
- 구인공고 목록(`/listings`) 모바일 필터 토글 추가: 680px 이하에서 필터 접기/펼치기 버튼 표시, 활성 필터 수 뱃지 표시
- 구인공고 목록 마감된 공고에 "마감" 배지 및 opacity 표시
- 인기직종 칩 가로 스크롤 처리(`overflow-x: auto`)로 소형 화면 overflow 방지
- CI/CD 워크플로우 수정: `git pull origin main` → `git fetch origin && git checkout main && git reset --hard origin/main` (서버가 android-app 브랜치에 고정되어 배포가 반영되지 않던 문제 해결)
- 일자리 목록 빈 상태 UI 개선: 박스 제거, 아이콘+안내 문구로 교체, 로딩 스피너 추가
- JrForm 성별 필드 JSX 구조 오류 수정 (jr-section 밖에 있던 div 위치 교정)
- AuthGuard 로그인 필요 화면 핑크 → 블루 전환 (버튼·아이콘·테두리·배경 전체)
- TalentDetailPage(인재 상세) 핑크 → 블루 전환 (카드 테두리·섹션바·경력·급여 강조색·SVG 아이콘 전체)
- 프론트엔드 UI 전반 개선: JrForm 스텝퍼 UX 수정, JobDetailPage 지원하기 버튼 연결, HomeHero·JspHero 검색바 개선, MyApplicationsPage UI 리팩토링
- 로그인 페이지·구직자 페이지·공고 목록 등 다수 페이지 스타일 정비
- 네비게이션 버튼 간격 개선 (로그인·회원가입 버튼 spacing 추가)
- shiftStyles.js, useDragScroll.js 신규 추가

### 2026-09-14
- 고객센터 페이지(`/support`) 신규 생성: 공지사항·FAQ·1:1 문의 탭 구성
- 구인공고 등록 페이지 약관 동의 섹션 체크박스 UI 개선 (박스 중첩 제거, 일반 체크박스로 변경)
- 공고 상세 페이지(`/job/:id`) 추가: NavBar 연결, 뒤로가기 버튼, 찜하기 기능
- `/listings` 공고 링크 경로 오류 수정 (`/jobs/:id` → `/job/:id`)
- 구인공고 등록 페이지(`/jobs/post`) 히어로 배너 추가, 레이아웃 개선

### 2026-09-16
- 채용관리 상세 페이지(/manage/:id) 추가: 공고 요약 + 합격자 카드 목록 + HiredWorkerModal
- 지원자확인 상세 페이지(/applicants/:id) 추가: 공고 요약 + 전체 지원자 카드 + 상태 변경
- ApplicantModal 공유 컴포넌트 추가 (지원자 이력서 팝업)
- HiredWorkerModal 공유 컴포넌트 추가 (합격자 고용 관리 모달)
- 채용관리 카드 클릭 시 상세 페이지(/manage/:id)로 이동하도록 연결
- 전체 앱 핑크(#e91e8c) → 블루(#4A8FE7) 전면 교체: Header, HeroBanner, CTABanner, FeatureCards, JobListings, ApplicantsPage, TalentListPage, HomePage, 홈 섹션 컴포넌트 등
- JrForm.jsx 성별 필드 JSX 구조 오류(adjacent elements) 수정 → 빌드 실패 해결

### 2026-09-15
- 프론트엔드 구인공고 목록/상세 화면이 mock 데이터(`data/jobs.js` 등) 대신 실제 백엔드 API(`/api/jobs`)를 사용하도록 연동
- `api.js`에 `normalizeJob` 어댑터를 추가해 `JobResponse` 필드를 프론트 UI가 기대하던 형태(shift/dday/tags 등)로 변환
- 지원자 관리, 내 지원 내역, 공고 관리, 최근 본/찜한 일자리 페이지도 실제 API 응답 기반으로 전환
- 백엔드에 `GET /api/applications/mine`(`MyApplicationResponse`) 추가
- 구인공고 목록 상단의 인기지역 칩과 사이드바 지역 필터가 실제로 `/api/jobs?region=` 필터링을 호출하도록 연동
- 인재 목록/상세 화면도 mock(`data/talents.js`) 대신 `/api/caregivers`로 연동. UI가 필요로 하는 성별/나이/자격증/희망근무조건/근무이력 등 필드가 `Caregiver` 엔티티에 없어서 전부 선택 필드로 추가하고 `GET /api/caregivers/{id}` 단건 조회도 신설
- `JobPostPage`(구인공고 등록)가 `alert`만 띄우고 아무 데도 저장하지 않던 것을 실제 `POST /api/jobs` 호출로 교체, `AuthGuard`로 사업자 계정만 접근하도록 제한
- `JobRegisterPage`/`JrForm`(구직 등록)도 실제 `POST /api/resumes/me`로 연동, 기존 이력서가 있으면 불러와서 수정 가능하도록 함
- 홈/구직자 페이지 히어로 검색창·인기지역 칩이 실제로 `/jobs`, `/talents`로 이동하며 지역/키워드 쿼리파라미터를 검색 결과 페이지가 읽어서 반영하도록 연동
- `JsFilter`의 직무/근무형태/급여/경력 필터를 전부 실제로 동작하게 구현(클라이언트 사이드 필터링)
- 홈 화면 "오늘 확인해보세요" 통계와 구인공고 사이드바 "인기 검색어"의 하드코딩된 가짜 숫자를 실제 API 데이터 기반으로 교체, 동작하지 않던 알림 신청/FAQ 버튼에 최소한의 반응 추가
- `origin/main`의 배포 파이프라인·고객센터 페이지·JobPostPage 히어로 배너 등을 `main-merged`에 병합
- 공고 상세 페이지의 "지원하기"/"전화 문의" 버튼에 onClick이 없어서 아무 동작도 안 하던 것을 실제 `POST /api/jobs/{jobId}/applications` 호출과 `tel:` 링크로 연결
- 상단 네비게이션 검색 아이콘 버튼이 아무 반응 없던 것을 `/jobs`로 이동하도록 연결
- `SupportPage`에 `?tab=` 쿼리파라미터 지원 추가, `Footer`/`HomeContentGrid`/`JsSidebar`의 공지사항·FAQ·고객센터 링크(`href="#"` 또는 미연결 버튼)를 전부 `/support`로 연결. `JobListingsPage` 사이드바 "알림 신청" 버튼도 "준비 중" 안내로 연결
- `HomeContentGrid`의 "지역별 인기 정보"(서울 1,245건 등)와 홈 화면 공지사항 목록이 하드코딩된 가짜 데이터였던 것을 실제 `/api/jobs`·`/api/caregivers` 지역 분포로 교체. "최근 등록된 정보"의 "인재정보" 탭을 눌러도 구인공고만 계속 보이던 버그, `/jobs/{id}`로 링크가 잘못 나가던 버그(정확한 경로는 `/job/{id}`)도 같이 수정. 공지사항 목록은 `SupportPage`와 내용이 서로 다르게 중복 관리되던 것을 `data/notices.js`로 일원화
- `HomeContentGrid`의 지역 탭("전체"/"서울"/"경기"...)이 눌러도 순위에 반영이 안 됐던 것을 연결: "전체"는 시/도 단위 랭킹, 특정 시/도를 선택하면 그 안의 구/군 단위로 드릴다운되도록 구현
- 나머지 미연결 버튼 정리: `JrSidebar`의 배너/FAQ 더보기를 `/jobs`, `/support?tab=faq`로 연결. `SignupPage`의 약관 "보기" 3개, `LoginPage`의 "아이디 찾기"/"비밀번호 찾기"는 실제 문서·기능이 없어서 Footer와 같은 "준비 중" 안내로 처리. 히어로 4곳(`HomeHero`/`JsHero`/`JspHero`/`EhpHero`)의 인기지역 "더보기(›)" 화살표가 아무 반응 없던 것을 실제로 나머지 8개 지역(강원·충북·충남·전북·전남·경북·경남·제주)을 펼쳐 보여주도록 구현. `JsHero`의 검색창은 지금까지 완전히 붕 떠 있었는데 `JobSearchPage`의 keyword state와 연결해 `JsJobList` 필터링에 실제로 반영되도록 함
- **찜하기 이원화 버그 수정**: `JobDetailPage`의 하트 버튼이 브라우저 localStorage(`useJobStorage`)에만 저장하고 있어서, `WishlistPage`/`JspJobTable`이 쓰는 실제 DB 기반(`/api/jobs/{id}/like`) 찜 목록과 전혀 연동되지 않던 버그를 수정 — 상세 페이지에서 찜해도 "찜한 일자리" 목록엔 안 나타나는 상태였음. `JobDetailPage`도 동일한 백엔드 API를 쓰도록 통일하고, 이제 아무도 안 쓰는 localStorage 찜 함수(`getWishlist`/`toggleWishlist`/`isWishlisted`)는 `useJobStorage.js`에서 제거. `HomeTodayStats`의 "찜한 일자리" 카운트도 같은 localStorage를 참조하고 있었어서 실제 서버 데이터 기준으로 같이 수정
- **공고 마감 기능 신설**: `RecruitManagePage`의 "마감처리"/"재개하기"가 순수 React state(`closedJobs`)라 새로고침하면 리셋되고 실제로는 구직자가 계속 지원할 수 있던 버그를 백엔드 기능으로 만듦. `Job` 엔티티에 `closed` 필드 추가, 소유자 전용 `PATCH /api/jobs/{id}/close`·`/reopen` 신설, 마감된 공고는 공개 목록(`GET /api/jobs`)에서 제외하고 지원 시도도 서버에서 거부하도록 `JobApplicationService`에도 반영. `JobDetailPage`도 마감 시 지원 버튼을 비활성화하고 "마감" 배지를 표시. (배포 중 기존 공고 39건의 `closed` 컬럼이 NULL이라 500 에러가 났던 것도 `false`로 백필하고 NOT NULL 제약을 걸어 재발 방지)
- `ApplicantsPage`/`RecruitManagePage`가 `AuthGuard`를 import만 하고 실제로 씌우지 않아서(`JobPostPage`에서 있었던 것과 같은 실수) 로그인·사업자 확인 없이 빈 화면만 보이던 것을 `require="business"`로 감쌈. `MyApplicationsPage`도 로그인 없이 접근하면 "지원 내역 없음"으로만 보이던 것을 `AuthGuard`로 감싸서 로그인 안내가 뜨도록 수정
- **구조적 문제 발견 및 수정: "구직 등록"과 "인재 목록"이 서로 다른 테이블을 쓰고 있었음.** `JrForm`(구직 등록)은 `JobSeekerProfile`(`/api/resumes/me`)에 저장되는데, `TalentListPage`(인재 목록)는 `Caregiver`(`/api/caregivers`)를 읽고 있어서 — 구직자가 아무리 등록해도 인재 목록엔 절대 안 나타나는 상태였음(`Caregiver`는 등록 API 자체가 없어서 `DataInitializer` 시드 3건에서 영원히 안 늘어남). `JobSeekerProfile`에 `gender`/`date`(최초 등록일) 필드 추가, `JrForm`에 성별 입력 추가, 공개 조회용 `GET /api/resumes`(목록)·`GET /api/resumes/public/{id}`(단건) 신설. `TalentListPage`/`TalentDetailPage`가 이제 실제 등록된 구직자를 보여줌. 이력서 폼이 안 걷는 항목(근무이력, 희망요일, 학력)은 안전한 기본값으로 대체, 급여는 `wageType`+숫자 조합 대신 자유 텍스트(`wageLabel`)로 통일. 기존 `Caregiver`/`CaregiverController` 백엔드 코드는 삭제하지 않고 그대로 둠(더 이상 프론트에서 호출하지 않음)
- `Header.jsx`(TalentDetailPage에서 쓰는 별도 헤더)의 "고객센터" 메뉴가 `href="#"`였던 것을 `/support`로 연결. `EhpMainContent`(사업자 홈 대시보드)의 "내 공고 관리" 표 상태가 마감 여부와 무관하게 항상 "모집중"으로 고정돼 있던 것을 실제 `job.closed` 값에 따라 "마감"/"모집중"으로 표시하도록 수정
- 구인공고 목록(`/jobs`)의 정렬 탭 4개(최신순/마감임박순/급여높은순/인기순) 중 "최신순" 외에는 눌러도 정렬이 전혀 안 되던 것을 수정. "인기순"을 계산할 좋아요 집계 자체가 없어서 백엔드에 `JobResponse.likeCount`(공고별 찜 수 집계, `JobLikeRepository.likeCounts`)를 새로 추가하고 프론트에서 마감임박순(D-day)·급여높은순(파싱된 급여)·인기순(찜 수) 정렬을 실제로 구현
- 회원가입 시 사업자 계정은 업체명/사업자등록번호를 입력받아 검증까지 하는데, 실제 제출할 때는 이 값들을 전혀 안 보내고 있었음(`User` 엔티티에 저장할 필드 자체가 없었음). `User`에 `phone`/`companyName`/`businessNumber` 필드 추가하고 회원가입 시 실제로 저장·조회되도록 연결
- **공고 마감의 파급 효과 수정**: 마감된 공고는 공개 목록(`GET /api/jobs`)에서 빠지도록 만들었는데, `WishlistPage`/`JspJobTable`의 찜 목록·`HomeTodayStats`의 찜 카운트·`RecentJobsPage`의 최근 본 목록이 전부 이 공개 목록을 데이터 소스로 쓰고 있어서 — 찜해두거나 최근에 본 공고가 마감되면 별다른 안내 없이 목록에서 조용히 사라지는 문제가 있었음. 마감 여부와 무관하게 내가 찜한 공고를 전부 반환하는 `GET /api/jobs/liked`를 신설하고, 찜 목록/최근 본 목록 모두 이제 마감된 공고도 "마감" 배지와 함께 계속 보여주도록 수정
- `JobPostPage`에 "연락처 공개"(로그인 후 확인/바로 확인) 설정이 있는데 `JobDetailPage`가 이 값을 아예 안 읽어서, 사업자가 "로그인 후 확인"을 선택해도 비로그인 방문자에게 연락처가 그냥 다 보이던 것을 수정. `normalizeJob`에 `phonePublic` 노출, 비로그인 상태에서 "로그인 후 확인"으로 설정된 공고는 연락처 대신 로그인 유도 문구를 보여주도록 연결

### 2026-09-17
- `/applicants`(지원자 확인), `/manage`(채용 관리) 페이지에서 `AuthGuard`를 임시 제거 — 구조 확인 및 디버깅 목적
- 두 페이지에 mock 데이터 주입: 공고 4개(서울·부산·대전), 지원자 9명(이력서 포함) — 로그인 없이 UI 확인 가능
- 지원자확인 탭 클릭 시 `/manage/:id`(공고요약 페이지)로 이동하도록 변경
- 지원자 카드/이력서 버튼 클릭 시 `ApplicantModal`로 이력서 모달 표시 (인라인 펼치기 제거)
- 지원자확인 탭 클릭 → `/applicants/:id` (전체 지원자), 채용관리 카드 클릭 → `/manage/:id` (합격 인원)으로 각각 분리
- 두 상세 페이지(`ApplicantDetailPage`, `RecruitDetailPage`) mock 데이터로 교체, `Header` → `HomeNav`로 통일
- 공유 mock 데이터 파일(`src/data/mockManage.js`) 추가
- 오라클 서버 백엔드가 `nohup`으로만 떠 있어 재부팅·크래시 시 자동 복구가 안 되는 문제 발견 → `caregiver.service` systemd 유닛 등록(부팅 시 자동 시작, 크래시 시 자동 재시작)
- `deploy.yml`의 배포 스크립트가 `sudo fuser -k`+`nohup`으로 재시작하던 것을 `sudo systemctl restart caregiver`로 변경 — 이전 방식은 배포할 때마다 systemd 관리 밖의 프로세스를 새로 띄워서 방금 등록한 자동 복구 효과를 무력화시켰음

### 2026-09-18
- **관리자 페이지 신설**: 배포된 사이트에 관리자 기능이 아예 없어서 새로 추가. `User.userType`에 `admin`을 새 값으로 추가(스키마 변경 없이 기존 문자열 필드 재사용, 계정은 DB에서 수동 지정), `/api/admin/**`(통계·회원 목록/삭제·공고 목록/삭제·지원 내역 조회)을 담당하는 `AdminController` 신설
- 회원 삭제 시 해당 회원이 등록한 공고가 있으면 FK 제약으로 실패하는데, 이를 500 에러 대신 "공고를 먼저 삭제해주세요" 409 응답으로 처리
- `JobService`에 관리자용 전체 공고 조회(`getAllJobsForAdmin`)·삭제(`deleteJob`) 추가, `JobApplicationResponse`에 공고 제목(`jobTitle`) 필드 추가(관리자 화면에서 지원 내역에 공고명을 보여주기 위함)
- 프론트에 `/admin` 라우트(`AdminPage`) 추가 — 통계 카드 + 회원/공고/지원내역 탭 테이블. 일반 사용자에게 노출되지 않도록 내비게이션에는 링크를 걸지 않고 URL 직접 접근만 허용
- `AuthGuard`가 `business` 계정 타입만 처리하던 것을 임의의 `userType`(이번엔 `admin`)을 받도록 일반화
