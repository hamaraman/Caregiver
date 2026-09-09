import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './LoginPage.css'
import { login } from '../api'
import AuthLeftPanel from './auth/AuthLeftPanel'

export default function LoginPage() {
  const navigate = useNavigate()
  const [userType, setUserType] = useState('personal') // 'personal' | 'business'
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const e = {}
    if (!id.trim()) e.id = '아이디(이메일)를 입력해주세요.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) e.id = '이메일 형식이 올바르지 않습니다.'
    if (!password) e.password = '비밀번호를 입력해주세요.'
    else if (password.length < 6) e.password = '비밀번호는 6자 이상이어야 합니다.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await login({ email: id, password, userType })
      navigate('/')
    } catch (err) {
      setErrors({ password: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  function handleSocial(provider) {
    alert(`${provider} 로그인은 서버 연동 후 사용 가능합니다.`)
  }

  return (
    <div className="lp-root">
      <AuthLeftPanel
        title={<>요양이지에서<br />새로운 시작을<br />만나보세요.</>}
        desc={<>전국 요양·간호 일자리를 한 곳에서.<br />간편한 등록으로, 빠르고 정확하게<br />원하는 일자리를 찾을 수 있습니다.</>}
      />

      {/* ── Right panel ── */}
      <div className="lp-right">
        <div className="lp-card">
          <h2 className="lp-card-title">
            로그인하고<br />
            맞춤 서비스를 이용해보세요.
          </h2>

          {/* 사용자 유형 탭 */}
          <p className="lp-type-label">어떤 목적으로 이용하시나요?</p>
          <div className="lp-type-tabs">
            <button
              className={`lp-type-tab ${userType === 'personal' ? 'active' : ''}`}
              onClick={() => setUserType('personal')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span className="lp-type-name">개인회원</span>
              <span className="lp-type-desc">구직자·요양보호사</span>
            </button>
            <button
              className={`lp-type-tab ${userType === 'business' ? 'active' : ''}`}
              onClick={() => setUserType('business')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <span className="lp-type-name">사업자용</span>
              <span className="lp-type-desc">요양원·기관·업체</span>
            </button>
          </div>

          {/* 간편 로그인 — 개인회원만 */}
          {userType === 'personal' && (
            <>
              <p className="lp-section-label">간편 로그인</p>
              <div className="lp-social-btns">
                <button className="lp-social-btn lp-social-naver" onClick={() => handleSocial('네이버')}>
                  <span className="lp-social-logo">N</span>
                  네이버 로그인
                </button>
                <button className="lp-social-btn lp-social-kakao" onClick={() => handleSocial('카카오')}>
                  <span className="lp-social-logo">K</span>
                  카카오 로그인
                </button>
                <button className="lp-social-btn lp-social-google" onClick={() => handleSocial('구글')}>
                  <span className="lp-social-logo lp-social-logo--g">G</span>
                  구글 로그인
                </button>
              </div>
              <div className="lp-divider"><span>또는</span></div>
            </>
          )}

          {/* 폼 */}
          <form className="lp-form" onSubmit={handleSubmit} noValidate>
              <div className="lp-field">
                <input
                  type="email"
                  className={`lp-input ${errors.id ? 'error' : ''}`}
                  placeholder="아이디 (이메일)"
                  value={id}
                  onChange={e => { setId(e.target.value); setErrors(p => ({ ...p, id: '' })) }}
                />
                {errors.id && <span className="lp-error">{errors.id}</span>}
              </div>

              <div className="lp-field">
                <div className="lp-pw-wrap">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className={`lp-input ${errors.password ? 'error' : ''}`}
                    placeholder="비밀번호"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                  />
                  <button
                    type="button"
                    className="lp-pw-toggle"
                    onClick={() => setShowPw(p => !p)}
                    aria-label="비밀번호 보기"
                  >
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
                {errors.password && <span className="lp-error">{errors.password}</span>}
              </div>

              <button type="submit" className="lp-submit-btn" disabled={submitting}>
                {submitting ? '로그인 중...' : '로그인'}
              </button>
          </form>

          <div className="lp-links">
            <button className="lp-link-btn">아이디 찾기</button>
            <span className="lp-link-divider">|</span>
            <button className="lp-link-btn">비밀번호 찾기</button>
          </div>

          <div className="lp-signup">
            <span>아직 계정이 없으신가요?</span>
            <Link to="/signup" className="lp-signup-btn">회원가입 하기 →</Link>
          </div>

          <p className="lp-privacy">
            로그인 시 요양이지의 <u>이용약관</u> 및 <u>개인정보처리방침</u>에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
