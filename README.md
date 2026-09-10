# Caregiver

요양이지 - 요양보호사 관련 사이트 (백엔드 + 프론트엔드 + 모바일)

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

## 프론트엔드 / 모바일

- `frontend/` - React + Vite 웹 프론트엔드 (`npm run dev`, 3000번 포트, `/api`는 8080번 백엔드로 프록시)
- `mobile/` - Expo(React Native) 모바일 앱 (`npm start`, 기본 8081 포트가 백엔드와 겹치므로 로컬에서는 `npx expo start --port 8082`처럼 다른 포트로 띄울 것)

## 이 브랜치(`feature/backend-db-auth+WCH`)는 두 브랜치를 합친 것입니다

`WCH`(세션 기반 인증 + 구인공고/지원/찜/이력서까지 갖춘 백엔드)와 `feature/backend-db-auth`(카카오·네이버·구글 OAuth2 로그인 + React 프론트엔드 + Expo 모바일 앱)를 병합한 브랜치입니다.

- 백엔드 핵심 로직(회원/구인공고/인재정보)은 `WCH` 쪽을 그대로 채택했습니다. `feature/backend-db-auth`에 있던 중복 구현(`Member` 엔티티, `controller.AuthController`, `controller.JobController` 등)은 라우트가 겹쳐서 제거했습니다.
- OAuth2 로그인(`CustomOAuth2UserService`, `OAuth2SuccessHandler`)은 `WCH`의 `auth.User`/`UserRepository`를 그대로 사용하도록 다시 연결했습니다. 즉 이메일/비밀번호 로그인과 소셜 로그인이 같은 계정(User)으로 합쳐집니다.
- `frontend/`, `mobile/`은 `feature/backend-db-auth` 쪽 것을 그대로 채택했습니다.

### 로컬 실행 순서

1. PostgreSQL 실행 (`caregiver_db`, `application.properties` 참고)
2. 구글 OAuth2를 쓰려면 `src/main/resources/application-secret.properties`(gitignore됨, 각자 로컬 생성)에 아래처럼 채워넣기 — 없으면 서버 부팅 자체가 실패합니다:
   ```
   spring.security.oauth2.client.registration.google.client-id=...
   spring.security.oauth2.client.registration.google.client-secret=...
   ```
   구글 로그인을 당장 쓸 게 아니면 더미 값이라도 넣어야 합니다. 카카오/네이버는 `application.properties`에 키가 이미 있어 별도 설정 없이 동작합니다.
3. `.\gradlew.bat bootRun` → 백엔드 `http://localhost:8080`
4. `cd frontend && npm run dev` → 구직자 웹 `http://localhost:3000`
5. (선택) `cd mobile && npm install && npx expo start --port 8082`

### 사업자(고용주)용 프론트엔드는 이 브랜치에 없습니다

사업자용 화면(공고 등록/지원자 관리/인재 검색 등)은 별도 브랜치 `feature/frontend-ui-inhwa`에 독립적으로 개발되어 있습니다. 이 브랜치와는 별개이므로 필요하면 그 브랜치/워크트리에서 직접 `npm run dev`로 띄우세요 (기본 `http://localhost:5173`). 백엔드 `SecurityConfig`의 CORS 허용 목록에 `http://localhost:3000`과 `http://localhost:5173` 둘 다 등록해뒀으니 포트를 8080으로 맞추기만 하면(그 브랜치의 `frontend/src/api.js`의 `API_BASE`) 로그인/회원가입 API 연동이 됩니다.

### 알려진 이슈

- 카카오/네이버 OAuth2 client-secret이 `application.properties`에 평문으로 커밋되어 있습니다. 나중에 키 순환(rotate) 또는 `application-secret.properties`로 이전을 권장합니다.
- 카카오/네이버 `redirect-uri`가 `{baseUrl}`(요청 주소 기반 자동 계산)이라, 백엔드 포트를 바꾸면 카카오/네이버 개발자 콘솔에 등록된 콜백 주소도 같이 맞춰줘야 소셜 로그인이 동작합니다.
