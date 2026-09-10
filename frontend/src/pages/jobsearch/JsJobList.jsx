import { useState } from 'react'

const SORT_TABS = ['최신순', '마감임박순', '급여높은순', '인기순']

const MOCK_JOBS = [
  { id: 1, company: '서울 노인복지센터', title: '요양보호사 (주간)', location: '서울 강남구', time: '주 5일 09:00~18:00', salary: '시급 11,500원', tags: ['주간', '경력무관', '4대보험'], dday: 3, logo: '🏥' },
  { id: 2, company: '경기 행복요양원', title: '간호조무사 모집', location: '경기 수원시', time: '주 5일 08:00~17:00', salary: '월 2,200,000원', tags: ['야간 없음', '주차 가능', '식사 제공'], dday: 7, logo: '🏨' },
  { id: 3, company: '인천 사랑돌봄센터', title: '돌봄교사 (파트타임)', location: '인천 남동구', time: '주 3일 10:00~15:00', salary: '시급 12,000원', tags: ['파트타임', '신입 가능'], dday: 12, logo: '💙' },
  { id: 4, company: '부산 햇살요양병원', title: '사회복지사 정규직', location: '부산 해운대구', time: '주 5일 09:00~18:00', salary: '월 2,500,000원', tags: ['정규직', '경력 2년 이상', '복리후생 우수'], dday: 1, logo: '☀️' },
  { id: 5, company: '대구 미래복지관', title: '물리치료사 채용', location: '대구 수성구', time: '주 5일 09:00~17:00', salary: '월 2,800,000원', tags: ['자격증 필수', '4대보험', '퇴직금'], dday: 15, logo: '🏃' },
  { id: 6, company: '광주 늘봄요양원', title: '요양보호사 야간 전담', location: '광주 서구', time: '야간 19:00~07:00', salary: '시급 13,000원', tags: ['야간', '야간수당', '숙식 제공'], dday: 5, logo: '🌙' },
]

function JobCard({ job }) {
  const ddayColor = job.dday <= 3 ? '#e74c3c' : job.dday <= 7 ? '#f39c12' : '#4A8FE7'
  return (
    <div className="js-job-card">
      <div className="js-job-card-top">
        <div className="js-job-logo">{job.logo}</div>
        <div className="js-job-info">
          <p className="js-job-company">{job.company}</p>
          <p className="js-job-title">{job.title}</p>
          <div className="js-job-meta">
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {job.location}
            </span>
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {job.time}
            </span>
          </div>
          <p className="js-job-salary">{job.salary}</p>
          <div className="js-job-tags">
            {job.tags.map(t => <span key={t} className="js-job-tag">{t}</span>)}
          </div>
        </div>
        <div className="js-job-card-right">
          <span className="js-job-dday" style={{ color: ddayColor, borderColor: ddayColor }}>D-{job.dday}</span>
          <button className="js-job-apply-btn">지원하기</button>
          <button className="js-job-bookmark" aria-label="북마크">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function JsJobList() {
  const [sort, setSort] = useState('최신순')
  const [page, setPage] = useState(1)
  const total = MOCK_JOBS.length

  return (
    <section className="js-joblist">
      {/* 공지 배너 */}
      <div className="js-notice-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>요양이지 서비스 이용 안내: 허위 구인공고 신고는 고객센터로 연락주세요.</span>
      </div>

      {/* 리스트 헤더 */}
      <div className="js-list-header">
        <span className="js-list-count">총 <strong>{total}</strong>개의 일자리</span>
        <div className="js-sort-tabs">
          {SORT_TABS.map(t => (
            <button
              key={t}
              className={`js-sort-tab ${sort === t ? 'active' : ''}`}
              onClick={() => setSort(t)}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* 카드 목록 */}
      <div className="js-cards">
        {MOCK_JOBS.map(job => <JobCard key={job.id} job={job} />)}
      </div>

      {/* 페이지네이션 */}
      <div className="js-pagination">
        <button className="js-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} className={`js-page-num ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
        ))}
        <button className="js-page-btn" onClick={() => setPage(p => p + 1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </section>
  )
}
