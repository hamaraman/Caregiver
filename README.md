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

- `frontend/` - React + Vite 웹 프론트엔드 (`npm run dev`, 3000번 포트, `/api`는 8081번 백엔드로 프록시)
- `mobile/` - Expo(React Native) 모바일 앱
