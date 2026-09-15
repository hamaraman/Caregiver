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

export function register({ email, password, name, userType }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, userType }),
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
    tags: [job.employForm, job.workForm, job.education].filter(Boolean),
    desc: job.postDetail || '상세 설명이 아직 등록되지 않았습니다.',
    requirements: requirements.length ? requirements : ['등록된 지원 자격 정보가 없습니다.'],
    benefits: [],
    contact: job.managerPhone || job.companyPhone || '문의처가 등록되지 않았습니다.',
  }
}

export async function fetchJobs(region) {
  const query = region ? `?region=${encodeURIComponent(region)}` : ''
  const jobs = await request(`/api/jobs${query}`)
  return (jobs || []).map(normalizeJob)
}

export async function fetchJob(id) {
  const job = await request(`/api/jobs/${id}`)
  return job ? normalizeJob(job) : null
}

export async function fetchMyJobs() {
  const jobs = await request('/api/jobs/mine')
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

export function fetchApplicantsForJob(jobId) {
  return request(`/api/jobs/${jobId}/applications`)
}

export function updateApplicationStatus(applicationId, status) {
  return request(`/api/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
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

// Adapts a backend CaregiverResponse into the richer shape the talent listing/detail pages render.
// Fields the backend doesn't track yet get a safe fallback.
function normalizeCaregiver(caregiver) {
  const location = caregiver.regionName || ''
  return {
    id: caregiver.id,
    name: caregiver.name || '',
    gender: caregiver.gender || '미상',
    age: caregiver.age ?? null,
    region: location ? location.split(' ')[0] : '',
    location,
    jobType: caregiver.jobType || caregiver.specialty || '요양보호사',
    certs: caregiver.certs && caregiver.certs.length ? caregiver.certs : ['등록된 자격증 정보가 없습니다.'],
    education: caregiver.education || '정보 없음',
    experience: caregiver.experience || '신입',
    workHistory: (caregiver.workHistory || []).map(h => ({ place: h.place, period: h.period, role: h.role })),
    workType: caregiver.workType || '협의',
    wageType: caregiver.wageType || '시급',
    wageAmount: caregiver.wageAmount || 0,
    wishRegion: caregiver.wishRegion || location || '전국',
    wishDays: caregiver.wishDays && caregiver.wishDays.length ? caregiver.wishDays : ['협의'],
    wishHours: caregiver.wishHours || '협의 가능',
    intro: caregiver.intro || '등록된 자기소개가 없습니다.',
    status: caregiver.status || '구직중',
    date: caregiver.date || '',
    phone: caregiver.phone || null,
  }
}

export async function fetchCaregivers(region) {
  const query = region ? `?region=${encodeURIComponent(region)}` : ''
  const caregivers = await request(`/api/caregivers${query}`)
  return (caregivers || []).map(normalizeCaregiver)
}

export async function fetchCaregiver(id) {
  const caregiver = await request(`/api/caregivers/${id}`)
  return caregiver ? normalizeCaregiver(caregiver) : null
}
