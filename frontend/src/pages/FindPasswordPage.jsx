import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '../api'
import AuthLeftPanel from './auth/AuthLeftPanel'
import './LoginPage.css'

export default function FindPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function validateStep1() {
    const e = {}
    if (!email.trim()) e.email = '이메일을 입력해주세요.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = '이메일 형식이 올바르지 않습니다.'
    if (!name.trim()) e.name = '이름을 입력해주세요.'
    return e
  }

  function validateStep2() {
    const e = {}
    if (!newPw) e.newPw = '새 비밀번호를 입력해주세요.'
    else if (newPw.length < 8) e.newPw = '비밀번호는 8자 이상이어야 합니다.'
    if (!confirmPw) e.confirmPw = '비밀번호 확인을 입력해주세요.'
    else if (newPw !== confirmPw) e.confirmPw = '비밀번호가 일치하지 않습니다.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (step === 1) {
      const errs = validateStep1()
      if (Object.keys(errs).length > 0) { setErrors(errs); return }
      setErrors({})
      setStep(2)
      return
    }
    const errs = validateStep2()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    try {
      await resetPassword({ email: email.trim(), name: name.trim(), newPassword: newPw })
      setDone(true)
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="lp-root">
      <AuthLeftPanel
        title={<>비밀번호를<br />재설정할게요.</>}
        desc={<>가입 시 등록한 이메일과<br />이름으로 본인 확인 후<br />새 비밀번호를 설정하세요.</>}
      />
      <div className="lp-right">
        <div className="lp-card">
          <h2 className="lp-card-title">비밀번호 찾기</h2>

          {done ? (
            <div className="lp-success">
              <div className="lp-success-icon">✓</div>
              <p>비밀번호가 변경되었습니다.</p>
              <p className="lp-success-sub">새 비밀번호로 로그인해주세요.</p>
              <Link
                to="/login"
                className="lp-submit-btn"
                style={{ marginTop: '16px', textDecoration: 'none', textAlign: 'center', display: 'block', padding: '13px' }}
              >
                로그인하기
              </Link>
            </div>
          ) : (
            <form className="lp-form" onSubmit={handleSubmit} noValidate>
              {step === 1 ? (
                <>
                  <div className="lp-field">
                    <input
                      type="email"
                      className={`lp-input ${errors.email ? 'error' : ''}`}
                      placeholder="가입한 이메일"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                    />
                    {errors.email && <span className="lp-error">{errors.email}</span>}
                  </div>
                  <div className="lp-field">
                    <input
                      className={`lp-input ${errors.name ? 'error' : ''}`}
                      placeholder="이름"
                      value={name}
                      onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                    />
                    {errors.name && <span className="lp-error">{errors.name}</span>}
                  </div>
                  {errors.form && <span className="lp-error" style={{ textAlign: 'center' }}>{errors.form}</span>}
                  <button type="submit" className="lp-submit-btn">다음</button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>
                    {email} 계정의 비밀번호를 재설정합니다.
                  </p>
                  <div className="lp-field">
                    <div className="lp-pw-wrap">
                      <input
                        type={showPw ? 'text' : 'password'}
                        className={`lp-input ${errors.newPw ? 'error' : ''}`}
                        placeholder="새 비밀번호 (8자 이상)"
                        value={newPw}
                        onChange={e => { setNewPw(e.target.value); setErrors(p => ({ ...p, newPw: '' })) }}
                      />
                      <button type="button" className="lp-pw-toggle" onClick={() => setShowPw(p => !p)} aria-label="비밀번호 보기">
                        {showPw ? (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        ) : (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.newPw && <span className="lp-error">{errors.newPw}</span>}
                  </div>
                  <div className="lp-field">
                    <input
                      type={showPw ? 'text' : 'password'}
                      className={`lp-input ${errors.confirmPw ? 'error' : ''}`}
                      placeholder="새 비밀번호 확인"
                      value={confirmPw}
                      onChange={e => { setConfirmPw(e.target.value); setErrors(p => ({ ...p, confirmPw: '' })) }}
                    />
                    {errors.confirmPw && <span className="lp-error">{errors.confirmPw}</span>}
                  </div>
                  {errors.form && <span className="lp-error" style={{ textAlign: 'center' }}>{errors.form}</span>}
                  <button type="submit" className="lp-submit-btn" disabled={submitting}>
                    {submitting ? '변경 중...' : '비밀번호 변경'}
                  </button>
                  <button type="button" className="lp-success-back" onClick={() => { setStep(1); setErrors({}) }}>
                    이전으로
                  </button>
                </>
              )}
            </form>
          )}

          <div className="lp-links">
            <Link to="/login" className="lp-link-btn">로그인</Link>
            <span className="lp-link-divider">|</span>
            <Link to="/find-id" className="lp-link-btn">아이디 찾기</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
