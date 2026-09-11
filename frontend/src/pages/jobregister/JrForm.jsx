import { useState } from 'react'

const STEPS = ['기본정보', '경력/자격정보', '근무 희망조건', '자기소개']
const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '제주']
const WORK_TYPES = ['전체', '주간', '야간', '교대', '파트타임']
const CERTS = ['요양보호사', '간호조무사', '사회복지사', '물리치료사', '작업치료사', '기타']
const SALARIES = ['협의', '최저시급', '시급 11,000원~', '시급 12,000원~', '시급 13,000원~', '월급 협의']

export default function JrForm() {
  const [activeStep] = useState(0)
  const [form, setForm] = useState({
    name: '', phone: '', birth: '', region: '',
    workRegion: '', workTypes: [], salary: '',
    cert: '', isNew: true, expPeriod: '',
    intro: '',
  })
  const [fileName, setFileName] = useState('')

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleWorkType = (t) => {
    setForm(f => ({
      ...f,
      workTypes: f.workTypes.includes(t)
        ? f.workTypes.filter(x => x !== t)
        : [...f.workTypes, t],
    }))
  }

  return (
    <div className="jr-form-wrap">
      {/* 단계 표시 */}
      <div className="jr-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`jr-step ${i === activeStep ? 'active' : i < activeStep ? 'done' : ''}`}>
            <div className="jr-step-item">
              <span className="jr-step-num">{i + 1}</span>
              <span className="jr-step-label">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="jr-step-line" />}
          </div>
        ))}
      </div>

      {/* 기본 인적사항 */}
      <div className="jr-section">
        <h3 className="jr-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          기본 인적사항
        </h3>
        <div className="jr-row-3">
          <div className="jr-field">
            <label className="jr-label">이름 <span className="jr-req">*</span></label>
            <div className="jr-input-wrap">
              <svg className="jr-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input className="jr-input" placeholder="이름을 입력해주세요" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
          </div>
          <div className="jr-field">
            <label className="jr-label">연락처 <span className="jr-req">*</span></label>
            <div className="jr-input-wrap">
              <svg className="jr-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.5a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <input className="jr-input" placeholder="휴대폰 번호를 입력해주세요" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>
          </div>
          <div className="jr-field">
            <label className="jr-label">생년월일 <span className="jr-req">*</span></label>
            <div className="jr-input-wrap">
              <svg className="jr-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <input className="jr-input" placeholder="YYYY.MM.DD" value={form.birth} onChange={e => update('birth', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="jr-row-1">
          <div className="jr-field">
            <label className="jr-label">거주지 <span className="jr-req">*</span></label>
            <div className="jr-select-wrap">
              <svg className="jr-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <select className="jr-select" value={form.region} onChange={e => update('region', e.target.value)}>
                <option value="">거주지를 선택해주세요</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 구직 희망 정보 */}
      <div className="jr-section">
        <h3 className="jr-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          구직 희망 정보
        </h3>
        <div className="jr-row-3">
          <div className="jr-field">
            <label className="jr-label">희망 근무 지역</label>
            <div className="jr-select-wrap">
              <svg className="jr-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <select className="jr-select" value={form.workRegion} onChange={e => update('workRegion', e.target.value)}>
                <option value="">근무 희망 지역을 선택해주세요</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="jr-field">
            <label className="jr-label">희망 근무 형태</label>
            <div className="jr-type-btns">
              {WORK_TYPES.map(t => (
                <button
                  key={t}
                  className={`jr-type-btn ${form.workTypes.includes(t) ? 'active' : ''}`}
                  onClick={() => toggleWorkType(t)}
                >{t}</button>
              ))}
            </div>
          </div>
          <div className="jr-field">
            <label className="jr-label">희망 급여</label>
            <div className="jr-select-wrap">
              <svg className="jr-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <select className="jr-select" value={form.salary} onChange={e => update('salary', e.target.value)}>
                <option value="">선택해주세요</option>
                {SALARIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 자격 및 경력 */}
      <div className="jr-section">
        <h3 className="jr-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
          자격 및 경력
        </h3>
        <div className="jr-row-3">
          <div className="jr-field">
            <label className="jr-label">보유 자격증</label>
            <div className="jr-select-wrap">
              <svg className="jr-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
              <select className="jr-select" value={form.cert} onChange={e => update('cert', e.target.value)}>
                <option value="">보유 자격증을 선택해주세요</option>
                {CERTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="jr-field">
            <label className="jr-label">경력 여부</label>
            <div className="jr-radio-group">
              <label className={`jr-radio ${form.isNew ? '' : 'active'}`}>
                <input type="radio" name="exp" checked={form.isNew} onChange={() => update('isNew', true)} />
                <span>신입</span>
              </label>
              <label className={`jr-radio ${!form.isNew ? 'active' : ''}`}>
                <input type="radio" name="exp" checked={!form.isNew} onChange={() => update('isNew', false)} />
                <span>경력</span>
              </label>
            </div>
          </div>
          <div className="jr-field">
            <label className="jr-label">경력 기간</label>
            <div className="jr-input-wrap">
              <svg className="jr-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <input
                className="jr-input"
                placeholder="예) 3년 6개월"
                value={form.expPeriod}
                onChange={e => update('expPeriod', e.target.value)}
                disabled={form.isNew}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 자기소개 */}
      <div className="jr-section">
        <h3 className="jr-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          자기소개
        </h3>
        <div className="jr-field">
          <textarea
            className="jr-textarea"
            placeholder="자신을 간단히 소개해주세요. (경력, 장점, 희망 사항 등)"
            value={form.intro}
            onChange={e => update('intro', e.target.value)}
            maxLength={500}
          />
          <div className="jr-char-count">{form.intro.length} / 500</div>
        </div>
      </div>

      {/* 첨부 서류 */}
      <div className="jr-section">
        <h3 className="jr-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          첨부 서류 <span className="jr-opt">(선택)</span>
        </h3>
        <div className="jr-upload-area">
          <div className="jr-upload-content">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
            <p className="jr-upload-text">이력서, 자격증 등 서류를 첨부해주세요.</p>
            <p className="jr-upload-sub">(PDF, JPG, PNG, 최대 10MB)</p>
          </div>
          <label className="jr-upload-btn">
            파일 선택
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={e => setFileName(e.target.files[0]?.name || '')}
            />
          </label>
        </div>
        {fileName && <p className="jr-file-name">선택된 파일: {fileName}</p>}
      </div>

      {/* 제출 버튼 */}
      <div className="jr-submit-row">
        <button className="jr-submit-btn">구직 등록 완료</button>
      </div>
    </div>
  )
}
