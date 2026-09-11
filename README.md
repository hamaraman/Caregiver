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
