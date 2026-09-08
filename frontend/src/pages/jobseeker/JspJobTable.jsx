import { useState } from 'react'

const JOB_LIST = [
  { id: 1, type: '요양보호사(주간)', badge: '급구', company: '행복한요양원', location: '서울 강남구', pay: '시급 14,000원', time: '09:00~15:00', days: '주 5일', date: '09.06', liked: false },
  { id: 2, type: '요양보호사(야간)', badge: null, company: '햇살케어센터', location: '경기 성남시', pay: '시급 13,500원', time: '16:00~22:00', days: '주 5일', date: '09.05', liked: false },
  { id: 3, type: '방문요양사', badge: '인기', company: '사랑나눔재가센터', location: '인천 부평구', pay: '시급 12,500원', time: '08:00~13:00', days: '주 3일', date: '09.05', liked: true },
  { id: 4, type: '재가요양보호사', badge: null, company: '서울노인복지센터', location: '서울 송파구', pay: '월 2,200,000원', time: '09:00~18:00', days: '주 5일', date: '09.04', liked: false },
  { id: 5, type: '간호보조(야간)', badge: '급구', company: '인천케어홈', location: '인천 남동구', pay: '시급 15,000원', time: '22:00~06:00', days: '주 5일', date: '09.03', liked: false },
  { id: 6, type: '요양보호사(주간)', badge: null, company: '경기복지재단', location: '경기 수원시', pay: '시급 12,000원', time: '09:00~17:00', days: '주 5일', date: '09.02', liked: false },
  { id: 7, type: '방문요양사', badge: null, company: '대구복지센터', location: '대구 달서구', pay: '시급 11,500원', time: '10:00~15:00', days: '주 3일', date: '09.01', liked: false },
]

const HeartFilled = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#e04444" stroke="#e04444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const HeartEmpty = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

export default function JspJobTable() {
  const [likes, setLikes] = useState(() =>
    Object.fromEntries(JOB_LIST.map(j => [j.id, j.liked]))
  )

  function toggleLike(id) {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      <section className="jsp-section">
        <div className="jsp-inner">
          <div className="jsp-section-header">
            <h2 className="jsp-section-title">최근 등록된 구직 공고</h2>
            <button className="jsp-more-btn">더보기 ›</button>
          </div>

          <table className="jsp-table">
            <thead>
              <tr>
                <th>직종</th><th>업체명</th><th>지역</th><th>급여</th>
                <th>근무시간</th><th>근무형태</th><th>등록일</th><th></th>
              </tr>
            </thead>
            <tbody>
              {JOB_LIST.map(job => (
                <tr key={job.id}>
                  <td>
                    <div className="jsp-job-type-cell">
                      {job.badge && (
                        <span className={`jsp-badge jsp-badge--${job.badge === '급구' ? 'urgent' : 'popular'}`}>
                          {job.badge}
                        </span>
                      )}
                      <span className="jsp-job-type-name">{job.type}</span>
                    </div>
                  </td>
                  <td className="jsp-company-name">{job.company}</td>
                  <td>{job.location}</td>
                  <td className="jsp-pay">{job.pay}</td>
                  <td>{job.time}</td>
                  <td>{job.days}</td>
                  <td className="jsp-date">{job.date}</td>
                  <td>
                    <button
                      className={`jsp-like-btn ${likes[job.id] ? 'liked' : ''}`}
                      onClick={() => toggleLike(job.id)}
                      aria-label="찜하기"
                    >
                      {likes[job.id] ? <HeartFilled /> : <HeartEmpty />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="jsp-cta">
        <div className="jsp-inner jsp-cta-inner">
          <div>
            <p className="jsp-cta-eyebrow">이력서를 등록하면</p>
            <h3 className="jsp-cta-title">업체가 먼저 연락해요!</h3>
            <p className="jsp-cta-desc">지금 이력서를 등록하고 맞춤 일자리 제안을 받아보세요.</p>
          </div>
          <button className="jsp-cta-btn">이력서 등록하기 →</button>
        </div>
      </section>
    </>
  )
}
