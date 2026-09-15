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

### 2026-09-14
- 고객센터 페이지(`/support`) 신규 생성: 공지사항·FAQ·1:1 문의 탭 구성
- 구인공고 등록 페이지 약관 동의 섹션 체크박스 UI 개선 (박스 중첩 제거, 일반 체크박스로 변경)
- 공고 상세 페이지(`/job/:id`) 추가: NavBar 연결, 뒤로가기 버튼, 찜하기 기능
- `/listings` 공고 링크 경로 오류 수정 (`/jobs/:id` → `/job/:id`)
- 구인공고 등록 페이지(`/jobs/post`) 히어로 배너 추가, 레이아웃 개선

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
