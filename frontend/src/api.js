const API_BASE = ''

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (res.status === 204) return null

  const text = await res.text()
  const body = text ? tryParseJson(text) : null

  if (!res.ok) {
    const message = (body && body.message) || (typeof body === 'string' ? body : null) || '요청 처리 중 오류가 발생했습니다.'
    throw new Error(message)
  }

  return body
}

function tryParseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export function findId({ name, phone }) {
  return request('/api/auth/find-id', {
    method: 'POST',
    body: JSON.stringify({ name, phone }),
  })
}

export function resetPassword({ email, name, newPassword }) {
  return request('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, name, newPassword }),
  })
}

export function register({ email, password, name, userType, phone, companyName, businessNumber }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, userType, phone, companyName, businessNumber }),
  })
}

export function login({ email, password, userType }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, userType }),
  })
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' })
}

export function fetchCurrentUser() {
  return request('/api/auth/me')
}

function deriveShift(hours) {
  const m = /^(\d{1,2}):/.exec(hours || '')
  if (!m) return '주간'
  const startHour = parseInt(m[1], 10)
  return (startHour >= 18 || startHour < 6) ? '야간' : '주간'
}

function deriveDday(deadline) {
  if (!deadline) return null
  const digits = deadline.match(/\d+/g)
  if (!digits || digits.length < 3) return null
  const [y, mo, d] = digits.map(Number)
  const target = new Date(y, mo - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((target - today) / 86400000)
  return diff >= 0 ? diff : null
}

// Adapts a backend JobResponse into the richer shape the listing/detail pages render.
// Fields the backend doesn't track (dday, tags, benefits...) get a derived value or a safe fallback.
function normalizeJob(job) {
  const requirements = [job.education, job.experience, job.careGrade, ...(job.careCondition || [])].filter(Boolean)
  return {
    id: job.id,
    ownerId: job.ownerId,
    liked: !!job.liked,
    closed: !!job.closed,
    likeCount: job.likeCount || 0,
    phonePublic: job.phonePublic || null,
    title: job.title || '',
    shift: deriveShift(job.hours),
    type: job.jobType || job.title || '채용공고',
    workType: job.days || '',
    pay: job.wage || '협의',
    time: job.hours || '',
    location: job.location || '',
    address: [job.companyAddr, job.companyAddrDetail].filter(Boolean).join(' ') || job.location || '',
    facility: job.facility || job.companyName || job.postTitle || '',
    date: job.date || '',
    dday: deriveDday(job.deadline),
    experience: job.experience || '',
    employForm: job.employForm || '',
    tags: [job.employForm, job.workForm, job.education].filter(Boolean),
    desc: job.postDetail || '상세 설명이 아직 등록되지 않았습니다.',
    requirements: requirements.length ? requirements : ['등록된 지원 자격 정보가 없습니다.'],
    benefits: [],
    contact: job.managerPhone || job.companyPhone || '문의처가 등록되지 않았습니다.',
    // 상세 페이지용 원본 필드
    workForm: job.workForm || null,
    deadline: job.deadline || null,
    weekdays: job.weekdays || [],
    daysNegotiable: job.daysNegotiable || false,
    careGender: job.careGender || null,
    careAge: job.careAge || null,
    careGrade: job.careGrade || null,
    careCondition: job.careCondition || [],
    careWork: job.careWork || [],
    applyMethod: job.applyMethod || [],
    applyEmail: job.applyEmail || null,
    applyFax: job.applyFax || null,
    companyUrl: job.companyUrl || null,
    companyPhone: job.companyPhone || null,
    companyAddr: job.companyAddr || null,
    companyAddrDetail: job.companyAddrDetail || null,
    managerName: job.managerName || null,
    managerPhone: job.managerPhone || null,
    managerEmail: job.managerEmail || null,
  }
}

export async function fetchJobs(region) {
  const query = region ? `?region=${encodeURIComponent(region)}` : ''
  const jobs = await request(`/api/jobs${query}`)
  return (jobs || []).map(normalizeJob)
}

export async function createJob(payload) {
  const job = await request('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return normalizeJob(job)
}

export async function fetchJob(id) {
  const job = await request(`/api/jobs/${id}`)
  return job ? normalizeJob(job) : null
}

// 관리 화면(채용관리/지원자확인 상세)에서 badge/careGender/companyPhone 등
// normalizeJob()이 걸러내는 원본 필드가 필요할 때 쓴다.
export function fetchJobRaw(id) {
  return request(`/api/jobs/${id}`)
}

export function applyToJob(jobId) {
  return request(`/api/jobs/${jobId}/applications`, { method: 'POST' })
}

export async function fetchMyJobs() {
  const jobs = await request('/api/jobs/mine')
  return (jobs || []).map(normalizeJob)
}

// 마감 여부와 무관하게 내가 찜한 공고 전체 - fetchJobs()는 공개 검색 목록이라 마감 공고를 뺀다.
export async function fetchLikedJobs() {
  const jobs = await request('/api/jobs/liked')
  return (jobs || []).map(normalizeJob)
}

export async function likeJob(id) {
  const job = await request(`/api/jobs/${id}/like`, { method: 'POST' })
  return normalizeJob(job)
}

export async function unlikeJob(id) {
  const job = await request(`/api/jobs/${id}/like`, { method: 'DELETE' })
  return normalizeJob(job)
}

export async function closeJob(id) {
  const job = await request(`/api/jobs/${id}/close`, { method: 'PATCH' })
  return normalizeJob(job)
}

export async function reopenJob(id) {
  const job = await request(`/api/jobs/${id}/reopen`, { method: 'PATCH' })
  return normalizeJob(job)
}

export function fetchApplicantsForJob(jobId) {
  return request(`/api/jobs/${jobId}/applications`)
}

export function updateApplicationStatus(applicationId, status) {
  return request(`/api/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function updateHiredTerms(applicationId, { startDate, days, hours, workType, wage, employForm }) {
  return request(`/api/applications/${applicationId}/hired-terms`, {
    method: 'PATCH',
    body: JSON.stringify({ startDate, days, hours, workType, wage, employForm }),
  })
}

export async function fetchMyApplications() {
  const applications = await request('/api/applications/mine')
  return (applications || []).map(a => ({
    id: a.id,
    status: a.status,
    appliedAt: a.appliedAt,
    job: a.job ? normalizeJob(a.job) : null,
  }))
}

export function fetchApplicantResume(userId) {
  return request(`/api/resumes/${userId}`).catch(() => null)
}

export function fetchMyResume() {
  return request('/api/resumes/me').catch(() => null)
}

export function upsertMyResume(payload) {
  return request('/api/resumes/me', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

function deriveAge(birth) {
  const m = /^(\d{4})/.exec(birth || '')
  if (!m) return null
  return new Date().getFullYear() - Number(m[1]) + 1
}

// Adapts a backend JobSeekerProfileResponse (a self-registered resume) into the shape
// the talent listing/detail pages render. Fields the resume form doesn't collect
// (workHistory, wishDays, education...) get a safe fallback.
function normalizeJobSeeker(profile) {
  const location = profile.region || ''
  return {
    id: profile.id,
    name: profile.name || '',
    gender: profile.gender || '미상',
    age: deriveAge(profile.birth),
    region: location,
    location,
    jobType: profile.cert || '요양보호사',
    certs: profile.cert ? [profile.cert] : ['등록된 자격증 정보가 없습니다.'],
    education: '정보 없음',
    experience: profile.isNew ? '신입' : (profile.expPeriod || '경력'),
    workHistory: [],
    workType: (profile.workTypes || []).join(', ') || '협의',
    wageLabel: profile.salary || '협의',
    wishRegion: profile.workRegion || location || '전국',
    wishDays: ['협의'],
    wishHours: '협의 가능',
    intro: profile.intro || '등록된 자기소개가 없습니다.',
    status: '구직중',
    date: profile.date || '',
    phone: profile.phone || null,
  }
}

export async function fetchJobSeekers() {
  const profiles = await request('/api/resumes')
  return (profiles || []).map(normalizeJobSeeker)
}

export async function fetchJobSeeker(id) {
  const profile = await request(`/api/resumes/public/${id}`).catch(() => null)
  return profile ? normalizeJobSeeker(profile) : null
}

export function fetchAdminStats() {
  return request('/api/admin/stats')
}

export function fetchAdminUsers() {
  return request('/api/admin/users')
}

export function deleteAdminUser(id) {
  return request(`/api/admin/users/${id}`, { method: 'DELETE' })
}

export function fetchAdminJobs() {
  return request('/api/admin/jobs')
}

export function deleteAdminJob(id) {
  return request(`/api/admin/jobs/${id}`, { method: 'DELETE' })
}

export function fetchAdminApplications() {
  return request('/api/admin/applications')
}
