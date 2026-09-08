import { useState } from 'react'
import './SignupPage.css'
import AuthLeftPanel from './auth/AuthLeftPanel'

const STEPS = ['기본 정보', '약관 동의']

export default function SignupPage({ onNavigate }) {
  const [step, setStep] = useState(0)
  const [userType, setUserType] = useState('personal')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [phone, setPhone] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)

  const [companyName, setCompanyName] = useState('')
  const [bizNumber, setBizNumber] = useState('')

  const [terms, setTerms] = useState({ all: false, service: false, privacy: false, marketing: false })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function toggleTerm(key) {
    if (key === 'all') {
      const v = !terms.all
      setTerms({ all: v, service: v, privacy: v, marketing: v })
    } else {
      const next = { ...terms, [key]: !terms[key] }
      next.all = next.service && next.privacy && next.marketing
      setTerms(next)
    }
  }

  function formatBizNum(val) {
    const d = val.replace(/\D/g, '').slice(0, 10)
    if (d.length <= 3) return d
    if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
  }

  function formatPhone(val) {
    const d = val.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 3) return d
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
  }

  function validateStep0() {
    const e = {}
    if (userType === 'business') {
      if (!companyName.trim()) e.companyName = '기관/업체명을 입력해주세요.'
      const rawBiz = bizNumber.replace(/-/g, '')
      if (!rawBiz) e.bizNumber = '사업자등록번호를 입력해주세요.'
      else if (rawBiz.length !== 10) e.bizNumber = '10자리 사업자등록번호를 입력해주세요.'
    }
    if (!name.trim() || name.trim().length < 2) e.name = '이름을 2자 이상 입력해주세요.'
    if (!email.trim()) e.email = '이메일을 입력해주세요.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = '이메일 형식이 올바르지 않습니다.'
    if (!password) e.password = '비밀번호를 입력해주세요.'
    else if (password.length < 8) e.password = '비밀번호는 8자 이상이어야 합니다.'
    if (!confirmPw) e.confirmPw = '비밀번호 확인을 입력해주세요.'
    else if (password !== confirmPw) e.confirmPw = '비밀번호가 일치하지 않습니다.'
    return e
  }

  function handleNext() {
    const e = validateStep0()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(1)
    window.scrollTo(0, 0)
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!terms.service || !terms.privacy) {
      setErrors({ terms: '필수 약관에 모두 동의해주세요.' })
      return
    }
    setErrors({})
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    setSubmitting(false)
    setDone(true)
  }

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
  const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )

  return (
    <div className="sp-root">
      <AuthLeftPanel
        title={<>요양이지 회원으로<br />새로운 시작을<br />만들어보세요.</>}
        desc={<>가입 후 전국 요양·간호 일자리를 한 곳에서.<br />이력서 등록부터 지원 관리까지<br />모두 해결하세요.</>}
      />

      {/* ── Right panel ── */}
      <div className="sp-right">
        <div className="sp-card">
          {done ? (
            <div className="sp-done">
              <div className="sp-done-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="#eff4ff"/>
                  <circle cx="12" cy="12" r="9" stroke="#4A8FE7" strokeWidth="1.5"/>
                  <path d="M7 12l3.5 3.5L17 8.5" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="sp-done-title">가입이 완료되었습니다!</h2>
              <p className="sp-done-sub">요양이지 회원이 되신 것을 환영합니다.<br />지금 바로 서비스를 이용해보세요.</p>
              <button className="sp-done-btn" onClick={() => onNavigate('login')}>로그인 하러 가기</button>
              <button className="sp-done-home" onClick={() => onNavigate('home')}>홈으로 가기</button>
            </div>
          ) : (
            <>
              <h2 className="sp-card-title">회원가입</h2>

              {/* Step indicator */}
              <div className="sp-steps">
                {STEPS.map((s, i) => (
                  <div key={s} className="sp-step-wrap">
                    <div className={`sp-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                      <div className="sp-step-dot">
                        {i < step
                          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : i + 1}
                      </div>
                      <span className="sp-step-label">{s}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className={`sp-step-line ${i < step ? 'done' : ''}`} />}
                  </div>
                ))}
              </div>

              {/* ── STEP 0: 기본 정보 ── */}
              {step === 0 && (
                <>
                  <p className="sp-section-label">회원 유형을 선택해주세요.</p>
                  <div className="sp-type-tabs">
                    <button
                      className={`sp-type-tab ${userType === 'personal' ? 'active' : ''}`}
                      onClick={() => { setUserType('personal'); setErrors({}) }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                      <span className="sp-type-name">개인회원</span>
                      <span className="sp-type-desc">구직자·요양보호사</span>
                    </button>
                    <button
                      className={`sp-type-tab ${userType === 'business' ? 'active' : ''}`}
                      onClick={() => { setUserType('business'); setErrors({}) }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                      <span className="sp-type-name">사업자용</span>
                      <span className="sp-type-desc">요양원·기관·업체</span>
                    </button>
                  </div>

                  <div className="sp-form">
                    {userType === 'business' && (
                      <>
                        <div className="sp-field">
                          <label className="sp-label">기관/업체명 <span className="sp-req">*</span></label>
                          <input className={`sp-input ${errors.companyName ? 'error' : ''}`}
                            placeholder="기관 또는 업체명을 입력해주세요"
                            value={companyName}
                            onChange={e => { setCompanyName(e.target.value); setErrors(p => ({ ...p, companyName: '' })) }}
                          />
                          {errors.companyName && <span className="sp-error">{errors.companyName}</span>}
                        </div>
                        <div className="sp-field">
                          <label className="sp-label">사업자등록번호 <span className="sp-req">*</span></label>
                          <input className={`sp-input ${errors.bizNumber ? 'error' : ''}`}
                            placeholder="000-00-00000"
                            value={bizNumber}
                            onChange={e => { setBizNumber(formatBizNum(e.target.value)); setErrors(p => ({ ...p, bizNumber: '' })) }}
                          />
                          {errors.bizNumber && <span className="sp-error">{errors.bizNumber}</span>}
                        </div>
                      </>
                    )}

                    <div className="sp-field">
                      <label className="sp-label">{userType === 'business' ? '담당자 이름' : '이름'} <span className="sp-req">*</span></label>
                      <input className={`sp-input ${errors.name ? 'error' : ''}`}
                        placeholder="이름을 입력해주세요"
                        value={name}
                        onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                      />
                      {errors.name && <span className="sp-error">{errors.name}</span>}
                    </div>

                    <div className="sp-field">
                      <label className="sp-label">이메일 <span className="sp-req">*</span></label>
                      <input type="email" className={`sp-input ${errors.email ? 'error' : ''}`}
                        placeholder="이메일 주소를 입력해주세요"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                      />
                      {errors.email && <span className="sp-error">{errors.email}</span>}
                    </div>

                    <div className="sp-field">
                      <label className="sp-label">비밀번호 <span className="sp-req">*</span></label>
                      <div className="sp-pw-wrap">
                        <input type={showPw ? 'text' : 'password'}
                          className={`sp-input ${errors.password ? 'error' : ''}`}
                          placeholder="8자 이상 입력해주세요"
                          value={password}
                          onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                        />
                        <button type="button" className="sp-pw-toggle" onClick={() => setShowPw(p => !p)} aria-label="비밀번호 보기">
                          {showPw ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                      {errors.password && <span className="sp-error">{errors.password}</span>}
                    </div>

                    <div className="sp-field">
                      <label className="sp-label">비밀번호 확인 <span className="sp-req">*</span></label>
                      <div className="sp-pw-wrap">
                        <input type={showPw2 ? 'text' : 'password'}
                          className={`sp-input ${errors.confirmPw ? 'error' : ''} ${confirmPw && password === confirmPw ? 'valid' : ''}`}
                          placeholder="비밀번호를 다시 입력해주세요"
                          value={confirmPw}
                          onChange={e => { setConfirmPw(e.target.value); setErrors(p => ({ ...p, confirmPw: '' })) }}
                        />
                        <button type="button" className="sp-pw-toggle" onClick={() => setShowPw2(p => !p)} aria-label="비밀번호 확인 보기">
                          {showPw2 ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                      {errors.confirmPw && <span className="sp-error">{errors.confirmPw}</span>}
                      {confirmPw && password === confirmPw && !errors.confirmPw && (
                        <span className="sp-valid">비밀번호가 일치합니다.</span>
                      )}
                    </div>

                    <div className="sp-field">
                      <label className="sp-label">연락처 <span className="sp-opt">(선택)</span></label>
                      <input className="sp-input"
                        placeholder="010-0000-0000"
                        value={phone}
                        onChange={e => setPhone(formatPhone(e.target.value))}
                      />
                    </div>

                    <button type="button" className="sp-next-btn" onClick={handleNext}>
                      다음 단계
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 1: 약관 동의 ── */}
              {step === 1 && (
                <form onSubmit={handleSubmit}>
                  <p className="sp-section-label">서비스 이용을 위해 약관에 동의해주세요.</p>

                  <div className="sp-terms-box">
                    <label className="sp-term-all">
                      <input type="checkbox" checked={terms.all} onChange={() => toggleTerm('all')} />
                      <span>전체 동의합니다</span>
                    </label>
                    <div className="sp-term-divider" />
                    <div className="sp-term-list">
                      <label className="sp-term-item">
                        <input type="checkbox" checked={terms.service} onChange={() => toggleTerm('service')} />
                        <span><strong className="sp-req">[필수]</strong> 이용약관 동의</span>
                        <button type="button" className="sp-term-view">보기</button>
                      </label>
                      <label className="sp-term-item">
                        <input type="checkbox" checked={terms.privacy} onChange={() => toggleTerm('privacy')} />
                        <span><strong className="sp-req">[필수]</strong> 개인정보처리방침 동의</span>
                        <button type="button" className="sp-term-view">보기</button>
                      </label>
                      <label className="sp-term-item">
                        <input type="checkbox" checked={terms.marketing} onChange={() => toggleTerm('marketing')} />
                        <span><span className="sp-opt">[선택]</span> 마케팅 정보 수신 동의</span>
                        <button type="button" className="sp-term-view">보기</button>
                      </label>
                    </div>
                  </div>

                  {errors.terms && <p className="sp-error sp-error-block">{errors.terms}</p>}

                  <div className="sp-summary">
                    <p className="sp-summary-title">가입 정보 확인</p>
                    <div className="sp-summary-row"><span>유형</span><span>{userType === 'personal' ? '개인회원' : '사업자용'}</span></div>
                    {userType === 'business' && companyName && <div className="sp-summary-row"><span>업체명</span><span>{companyName}</span></div>}
                    <div className="sp-summary-row"><span>이름</span><span>{name}</span></div>
                    <div className="sp-summary-row"><span>이메일</span><span>{email}</span></div>
                    {phone && <div className="sp-summary-row"><span>연락처</span><span>{phone}</span></div>}
                  </div>

                  <div className="sp-btn-row">
                    <button type="button" className="sp-back-btn" onClick={() => { setStep(0); setErrors({}) }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                      </svg>
                      이전
                    </button>
                    <button type="submit" className="sp-submit-btn" disabled={submitting}>
                      {submitting ? '처리 중...' : '가입하기'}
                    </button>
                  </div>
                </form>
              )}

              <div className="sp-login-row">
                <span>이미 계정이 있으신가요?</span>
                <button className="sp-login-link" onClick={() => onNavigate('login')}>로그인 하기 →</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
