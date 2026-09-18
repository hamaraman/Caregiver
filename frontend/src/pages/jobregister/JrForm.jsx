import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyResume, upsertMyResume } from '../../api'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '제주']
const WORK_TYPES = ['전체', '주간', '야간', '교대', '파트타임']
const CERTS = ['요양보호사', '간호조무사', '사회복지사', '물리치료사', '작업치료사', '기타']
const SALARIES = ['협의', '최저시급', '시급 11,000원~', '시급 12,000원~', '시급 13,000원~', '월급 협의']
const SECTIONS = ['기본 인적사항', '자격 및 경력', '구직 희망 정보', '자기소개']

export default function JrForm() {
  const [form, setForm] = useState({
    name: '', phone: '', birth: '', gender: '여', region: '',
    workRegions: [], workTypes: [], salary: '',
    cert: '', isNew: true, expPeriod: '',
    intro: '',
  })
  const [fileName, setFileName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState('')
  const [currentStep, setCurrentStep] = useState(0)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    const handleScroll = () => {
      const navH = 80
      let best = 0
      SECTIONS.forEach((_, i) => {
        const el = document.getElementById(`jp-section-${i}`)
        if (!el) return
        if (el.getBoundingClientRect().top <= navH + 20) best = i
      })
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60)
        best = SECTIONS.length - 1
      setCurrentStep(best)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetchMyResume().then(resume => {
      if (!resume) return
      setForm(f => ({
        ...f,
        name: resume.name || '',
        phone: resume.phone || '',
        birth: resume.birth || '',
        gender: resume.gender || '여',
        region: resume.region || '',
        workRegions: resume.workRegion ? resume.workRegion.split(',').map(s => s.trim()).filter(Boolean) : [],
        workTypes: resume.workTypes || [],
        salary: resume.salary || '',
        cert: resume.cert || '',
        isNew: resume.isNew ?? true,
        expPeriod: resume.expPeriod || '',
        intro: resume.intro || '',
      }))
    })
  }, [])

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addWorkRegion = (r) => {
    if (!r || form.workRegions.includes(r)) return
    setForm(f => ({ ...f, workRegions: [...f.workRegions, r] }))
  }

  const removeWorkRegion = (r) =>
    setForm(f => ({ ...f, workRegions: f.workRegions.filter(x => x !== r) }))

  const toggleWorkType = (t) =>
    setForm(f => ({
      ...f,
      workTypes: f.workTypes.includes(t)
        ? f.workTypes.filter(x => x !== t)
        : [...f.workTypes, t],
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = '이름을 입력해주세요.'
    if (!form.phone.trim()) errs.phone = '연락처를 입력해주세요.'
    if (!form.birth.trim()) errs.birth = '생년월일을 입력해주세요.'
    if (!form.region) errs.region = '거주지를 선택해주세요.'
    if (Object.keys(errs).length) {
      setErrors(errs)
      showToast('필수 항목을 입력해주세요.')
      return
    }
    setSubmitError('')
    setSubmitting(true)
    try {
      await upsertMyResume({
        name: form.name,
        phone: form.phone,
        birth: form.birth,
        gender: form.gender,
        region: form.region,
        workRegion: form.workRegions.join(', '),
        workTypes: form.workTypes,
        salary: form.salary,
        cert: form.cert,
        isNew: form.isNew,
        expPeriod: form.isNew ? '' : form.expPeriod,
        intro: form.intro,
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message || '구직 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="jr-success">
        <div className="jr-success-icon">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h2 className="jr-success-title">구직 등록이 완료되었습니다!</h2>
        <p className="jr-success-desc">등록된 정보를 기반으로 맞춤 일자리를 추천해 드립니다.</p>
        <Link to="/jobs" className="jr-submit-btn" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
          일자리 보러가기 →
        </Link>
      </div>
    )
  }

  return (
    <form className="jr-form-wrap" onSubmit={handleSubmit} noValidate>
      {toast && (
        <div className="jp-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {toast}
        </div>
      )}

      {/* 진행 단계 */}
      <div className="jp-steps">
        {SECTIONS.map((s, i) => (
          <div key={s} className="jp-step-item">
            <button
              type="button"
              className={`jp-step-circle${i < currentStep ? ' jp-step-circle--done' : i === currentStep ? ' jp-step-circle--active' : ''}`}
              onClick={() => document.getElementById(`jp-section-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <span className="jp-step-n">
                {i < currentStep
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : i + 1
                }
              </span>
              <span className="jp-step-label">{s}</span>
            </button>
            {i < SECTIONS.length - 1 && (
              <div className={`jp-step-line${i < currentStep ? ' jp-step-line--done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* ① 기본 인적사항 */}
      <div id="jp-section-0" className="jp-section">
        <div className="jp-section-header">
          <span className="jp-section-num">1</span>
          <h3 className="jp-section-title">기본 인적사항</h3>
        </div>
        <div className="jp-section-body">

          <div className="jp-row jp-row--top">
            <label className="jp-label jp-label--required">이름</label>
            <div className="jp-field-group--col">
              <input
                className={`jp-input jp-input--md${errors.name ? ' jp-input--error' : ''}`}
                placeholder="이름을 입력해주세요"
                value={form.name}
                onChange={e => { update('name', e.target.value); setErrors(p => ({ ...p, name: '' })) }}
              />
              {errors.name && <p className="jp-error-msg">{errors.name}</p>}
            </div>
          </div>

          <div className="jp-row jp-row--top">
            <label className="jp-label jp-label--required">연락처</label>
            <div className="jp-field-group--col">
              <input
                className={`jp-input jp-input--md${errors.phone ? ' jp-input--error' : ''}`}
                placeholder="휴대폰 번호를 입력해주세요"
                value={form.phone}
                onChange={e => { update('phone', e.target.value); setErrors(p => ({ ...p, phone: '' })) }}
              />
              {errors.phone && <p className="jp-error-msg">{errors.phone}</p>}
            </div>
          </div>

          <div className="jp-row jp-row--top">
            <label className="jp-label jp-label--required">생년월일</label>
            <div className="jp-field-group--col">
              <input
                className={`jp-input jp-input--md${errors.birth ? ' jp-input--error' : ''}`}
                placeholder="YYYY.MM.DD"
                value={form.birth}
                onChange={e => { update('birth', e.target.value); setErrors(p => ({ ...p, birth: '' })) }}
              />
              {errors.birth && <p className="jp-error-msg">{errors.birth}</p>}
            </div>
          </div>

          <div className="jp-row jp-row--top">
            <label className="jp-label jp-label--required">거주지</label>
            <div className="jp-field-group--col">
              <select
                className={`jp-select jp-select--md${errors.region ? ' jp-input--error' : ''}`}
                value={form.region}
                onChange={e => { update('region', e.target.value); setErrors(p => ({ ...p, region: '' })) }}
              >
                <option value="">거주지를 선택해주세요</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.region && <p className="jp-error-msg">{errors.region}</p>}
            </div>
          </div>

          <div className="jp-row">
            <label className="jp-label jp-label--required">성별</label>
            <div className="jp-radio-group">
              {['여', '남'].map(g => (
                <label key={g} className="jp-radio">
                  <input type="radio" name="gender" checked={form.gender === g} onChange={() => update('gender', g)} />
                  {g === '여' ? '여성' : '남성'}
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ② 자격 및 경력 */}
      <div id="jp-section-1" className="jp-section">
        <div className="jp-section-header">
          <span className="jp-section-num">2</span>
          <h3 className="jp-section-title">자격 및 경력</h3>
        </div>
        <div className="jp-section-body">

          <div className="jp-row">
            <label className="jp-label">보유 자격증</label>
            <select className="jp-select jp-select--md" value={form.cert} onChange={e => update('cert', e.target.value)}>
              <option value="">자격증을 선택해주세요</option>
              {CERTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="jp-row">
            <label className="jp-label">경력 여부</label>
            <div className="jp-radio-group">
              <label className="jp-radio">
                <input type="radio" name="exp" checked={form.isNew} onChange={() => update('isNew', true)} />
                신입
              </label>
              <label className="jp-radio">
                <input type="radio" name="exp" checked={!form.isNew} onChange={() => update('isNew', false)} />
                경력
              </label>
            </div>
          </div>

          <div className="jp-row">
            <label className="jp-label">경력 기간</label>
            <input
              className="jp-input jp-input--md"
              placeholder="예) 3년 6개월"
              value={form.expPeriod}
              onChange={e => update('expPeriod', e.target.value)}
              disabled={form.isNew}
            />
          </div>

        </div>
      </div>

      {/* ③ 구직 희망 정보 */}
      <div id="jp-section-2" className="jp-section">
        <div className="jp-section-header">
          <span className="jp-section-num">3</span>
          <h3 className="jp-section-title">구직 희망 정보</h3>
        </div>
        <div className="jp-section-body">

          <div className="jp-row jp-row--top">
            <label className="jp-label">희망 근무 지역</label>
            <div className="jp-field-group--col">
              <select className="jp-select jp-select--md" value="" onChange={e => addWorkRegion(e.target.value)}>
                <option value="">지역 선택 (복수 가능)</option>
                {REGIONS.filter(r => !form.workRegions.includes(r)).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {form.workRegions.length > 0 && (
                <div className="jr-region-tags">
                  {form.workRegions.map(r => (
                    <span key={r} className="jr-region-tag">
                      {r}
                      <button type="button" onClick={() => removeWorkRegion(r)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="jp-row jp-row--top">
            <label className="jp-label">희망 근무 형태</label>
            <div className="jp-check-group jp-check-group--wrap">
              {WORK_TYPES.map(t => (
                <label key={t} className="jp-check">
                  <input type="checkbox" checked={form.workTypes.includes(t)} onChange={() => toggleWorkType(t)} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div className="jp-row">
            <label className="jp-label">희망 급여</label>
            <select className="jp-select jp-select--md" value={form.salary} onChange={e => update('salary', e.target.value)}>
              <option value="">선택해주세요</option>
              {SALARIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* ④ 자기소개 */}
      <div id="jp-section-3" className="jp-section">
        <div className="jp-section-header">
          <span className="jp-section-num">4</span>
          <h3 className="jp-section-title">자기소개 <span className="jp-optional">선택</span></h3>
        </div>
        <div className="jp-section-body">

          <div className="jp-row jp-row--top">
            <label className="jp-label">자기소개</label>
            <div style={{ flex: 1, width: '100%' }}>
              <textarea
                className="jp-textarea"
                style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                placeholder="자신을 간단히 소개해주세요. (경력, 장점, 희망 사항 등)"
                value={form.intro}
                onChange={e => update('intro', e.target.value)}
                maxLength={500}
                rows={5}
              />
              <div className="jr-char-count">{form.intro.length} / 500</div>
            </div>
          </div>

          <div className="jp-row jp-row--top">
            <label className="jp-label">첨부 서류</label>
            <div style={{ flex: 1, width: '100%' }}>
              <div className="jr-upload-area">
                <div className="jr-upload-content">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                  <div>
                    <p className="jr-upload-text">이력서, 자격증 등 서류를 첨부해주세요.</p>
                    <p className="jr-upload-sub">(PDF, JPG, PNG, 최대 10MB)</p>
                  </div>
                </div>
                <label className="jr-upload-btn">
                  파일 선택
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                    onChange={e => setFileName(e.target.files[0]?.name || '')} />
                </label>
              </div>
              {fileName && <p className="jr-file-name">선택된 파일: {fileName}</p>}
            </div>
          </div>

        </div>
      </div>

      {submitError && <p style={{ color: '#e74c3c', textAlign: 'right', marginTop: 8 }}>{submitError}</p>}

      <div className="jp-actions">
        <Link to="/jobs" className="jp-btn jp-btn--cancel">취소</Link>
        <button type="submit" className="jp-btn jp-btn--submit" disabled={submitting}>
          {submitting ? '등록 중...' : '구직 등록하기'}
        </button>
      </div>
    </form>
  )
}
