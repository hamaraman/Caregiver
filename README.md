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
