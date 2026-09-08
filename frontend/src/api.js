const API_BASE = 'http://localhost:8080'

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

export function register({ email, password, name }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
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
