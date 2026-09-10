import { useState } from 'react'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '제주']
const JOBS = ['요양보호사', '간호조무사', '사회복지사', '물리치료사', '작업치료사', '간병인', '돌봄교사']
const WORK_TYPES = ['전체', '주간', '야간', '교대', '파트타임']
const SALARIES = ['전체', '시급 10,000원~', '시급 11,000원~', '시급 12,000원~', '월급 1,000,000원~', '월급 1,500,000원~']
const CAREERS = ['전체 선택', '신입 가능', '1년 미만', '1년 이상', '3년 이상', '5년 이상']

export default function JsFilter({ onSearch }) {
  const [region, setRegion] = useState('')
  const [job, setJob] = useState('')
  const [workTypes, setWorkTypes] = useState(['전체'])
  const [salary, setSalary] = useState('')
  const [career, setCareer] = useState('')

  const toggleWorkType = (t) => {
    if (t === '전체') { setWorkTypes(['전체']); return }
    const next = workTypes.includes(t)
      ? workTypes.filter(x => x !== t)
      : [...workTypes.filter(x => x !== '전체'), t]
    setWorkTypes(next.length ? next : ['전체'])
  }

  const reset = () => {
    setRegion(''); setJob(''); setWorkTypes(['전체']); setSalary(''); setCareer('')
  }

  return (
    <aside className="js-filter">
      <div className="js-filter-header">
        <span className="js-filter-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          조건으로 찾기
        </span>
        <button className="js-filter-reset" onClick={reset}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
          </svg>
          초기화
        </button>
      </div>

      {/* 근무지역 */}
      <div className="js-filter-section">
        <button className="js-filter-sec-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          근무지역
          <svg className="js-filter-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div className="js-filter-select-wrap">
          <select className="js-filter-select" value={region} onChange={e => setRegion(e.target.value)}>
            <option value="">지역을 선택해주세요</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* 직무 */}
      <div className="js-filter-section">
        <button className="js-filter-sec-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          직무
          <svg className="js-filter-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div className="js-filter-select-wrap">
          <select className="js-filter-select" value={job} onChange={e => setJob(e.target.value)}>
            <option value="">직무를 선택해주세요</option>
            {JOBS.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
      </div>

      {/* 근무형태 */}
      <div className="js-filter-section">
        <button className="js-filter-sec-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          근무형태
          <svg className="js-filter-caret js-filter-caret--up" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <div className="js-filter-checks">
          {WORK_TYPES.map(t => (
            <label key={t} className="js-filter-check">
              <input
                type="checkbox"
                checked={workTypes.includes(t)}
                onChange={() => toggleWorkType(t)}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 급여 */}
      <div className="js-filter-section">
        <button className="js-filter-sec-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          급여
          <svg className="js-filter-caret js-filter-caret--up" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <div className="js-filter-select-wrap">
          <select className="js-filter-select" value={salary} onChange={e => setSalary(e.target.value)}>
            <option value="">급여를 선택해주세요</option>
            {SALARIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* 경력 */}
      <div className="js-filter-section">
        <button className="js-filter-sec-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
          경력
          <svg className="js-filter-caret js-filter-caret--up" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <div className="js-filter-select-wrap">
          <select className="js-filter-select" value={career} onChange={e => setCareer(e.target.value)}>
            {CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <button className="js-filter-search-btn" onClick={onSearch}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        검색하기
      </button>
    </aside>
  )
}
