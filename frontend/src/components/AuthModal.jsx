import { useState } from 'react'
import './AuthModal.css'
import { login, register } from '../api'

export default function AuthModal({ mode: initialMode, onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isRegister = mode === 'register'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = isRegister
        ? await register({ email, password, name })
        : await login({ email, password })
      onSuccess(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="닫기">×</button>

        <div className="auth-modal-tabs">
          <button
            className={`auth-modal-tab ${!isRegister ? 'auth-modal-tab--active' : ''}`}
            onClick={() => setMode('login')}
            type="button"
          >
            로그인
          </button>
          <button
            className={`auth-modal-tab ${isRegister ? 'auth-modal-tab--active' : ''}`}
            onClick={() => setMode('register')}
            type="button"
          >
            회원가입
          </button>
        </div>

        <form className="auth-modal-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />

          {error && <p className="auth-modal-error">{error}</p>}

          <button type="submit" className="auth-modal-submit" disabled={submitting}>
            {submitting ? '처리 중...' : isRegister ? '가입하기' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
