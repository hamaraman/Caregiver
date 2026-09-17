import { useState } from 'react'
import { Link } from 'react-router-dom'
import { findId } from '../api'
import AuthLeftPanel from './auth/AuthLeftPanel'
import './LoginPage.css'

function formatPhone(val) {
  const d = val.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

export default function FindIdPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  function validate() {
    const e = {}
    if (!name.trim()) e.name = '이름을 입력해주세요.'
    if (!phone.trim()) e.phone = '휴대폰 번호를 입력해주세요.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    try {
      const data = await findId({ name: name.trim(), phone: phone.trim() })
      setResult(data.maskedEmail)
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="lp-root">
      <AuthLeftPanel
        title={<>아이디를<br />찾아드릴게요.</>}
        desc={<>가입 시 등록한 이름과<br />휴대폰 번호를 입력해주세요.</>}
      />
      <div className="lp-right">
        <div className="lp-card">
          <h2 className="lp-card-title">아이디 찾기</h2>

          {result ? (
            <div className="lp-success">
              <div className="lp-success-icon">✓</div>
              <p>가입하신 이메일 주소입니다.</p>
              <p style={{ fontSize: '18px', fontWeight: 800, color: '#4A8FE7', margin: '8px 0' }}>{result}</p>
              <p className="lp-success-sub">이 이메일로 로그인하세요.</p>
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
              <div className="lp-field">
                <input
                  className={`lp-input ${errors.name ? 'error' : ''}`}
                  placeholder="이름"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                />
                {errors.name && <span className="lp-error">{errors.name}</span>}
              </div>
              <div className="lp-field">
                <input
                  className={`lp-input ${errors.phone ? 'error' : ''}`}
                  placeholder="휴대폰 번호"
                  value={phone}
                  onChange={e => { setPhone(formatPhone(e.target.value)); setErrors(p => ({ ...p, phone: '' })) }}
                />
                {errors.phone && <span className="lp-error">{errors.phone}</span>}
              </div>
              {errors.form && <span className="lp-error" style={{ textAlign: 'center' }}>{errors.form}</span>}
              <button type="submit" className="lp-submit-btn" disabled={submitting}>
                {submitting ? '확인 중...' : '아이디 찾기'}
              </button>
            </form>
          )}

          <div className="lp-links">
            <Link to="/login" className="lp-link-btn">로그인</Link>
            <span className="lp-link-divider">|</span>
            <Link to="/find-password" className="lp-link-btn">비밀번호 찾기</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
