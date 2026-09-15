import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchJobs } from '../../api'

function todayLabel() {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

const FAQS = [
  { q: '구직 등록은 어떻게 하나요?', a: '상단 메뉴의 "구직 등록"에서 기본정보와 희망 근무조건을 입력하면 바로 등록됩니다.' },
  { q: '급여는 어떻게 결정되나요?', a: '급여는 공고를 등록한 업체가 직접 정하며, 공고 상세 페이지에서 확인하실 수 있습니다.' },
  { q: '4대보험 가입이 필수인가요?', a: '근무 형태와 업체 정책에 따라 다릅니다. 공고의 "혜택" 항목이나 업체에 직접 문의해주세요.' },
  { q: '허위 공고 신고 방법이 궁금해요', a: '공고 목록 상단의 신고 연락처(1588-0000)로 전화 주시면 확인 후 조치해드립니다.' },
]

export default function JsSidebar() {
  const [popularJobTypes, setPopularJobTypes] = useState([])
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    fetchJobs().then(jobs => {
      const counts = {}
      jobs.forEach(j => { if (j.type) counts[j.type] = (counts[j.type] || 0) + 1 })
      const ranked = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([keyword, count], i) => ({ rank: i + 1, keyword, count }))
      setPopularJobTypes(ranked)
    }).catch(() => setPopularJobTypes([]))
  }, [])

  const notifyComingSoon = () => alert('준비 중인 기능입니다. 조금만 기다려주세요!')

  return (
    <aside className="js-sidebar">

      {/* 인기 직종 */}
      <div className="js-sidebar-card">
        <div className="js-sidebar-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
          인기 직종 TOP 5
        </div>
        <ul className="js-popular-list">
          {popularJobTypes.length === 0
            ? <li className="js-popular-item">등록된 공고가 없습니다.</li>
            : popularJobTypes.map(item => (
              <li key={item.rank} className="js-popular-item">
                <span className={`js-rank-num ${item.rank <= 3 ? 'top' : ''}`}>{item.rank}</span>
                <span className="js-rank-kw">{item.keyword}</span>
                <span className="js-rank-change">{item.count}건</span>
              </li>
            ))
          }
        </ul>
        <p className="js-popular-updated">{todayLabel()} 기준 · 등록된 공고 수 기준</p>
      </div>

      {/* 추천 일자리 알림 */}
      <div className="js-sidebar-card js-sidebar-card--blue">
        <div className="js-sidebar-card-title" style={{ color: '#fff' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          맞춤 일자리 알림 받기
        </div>
        <p className="js-sidebar-blue-desc">조건에 맞는 새 공고가 등록되면 바로 알려드려요!</p>
        <div className="js-sidebar-blue-fields">
          <input className="js-sidebar-input" placeholder="이메일 주소 입력" />
          <button className="js-sidebar-alert-btn" onClick={notifyComingSoon}>알림 신청</button>
        </div>
      </div>

      {/* 빠른 이력서 등록 */}
      <div className="js-sidebar-card">
        <div className="js-sidebar-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          이력서 등록하고 취업 성공!
        </div>
        <p className="js-sidebar-desc">이력서를 등록하면 구인업체가 먼저 연락해와요.</p>
        <Link to="/job-register" className="js-sidebar-register-btn">이력서 등록하기 →</Link>
      </div>

      {/* 궁금한 점 상담 */}
      <div className="js-sidebar-card">
        <div className="js-sidebar-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          궁금한 점이 있으신가요?
        </div>
        <ul className="js-faq-list">
          {FAQS.map((f, i) => (
            <li className="js-faq-item" key={f.q}>
              <button className="js-faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>{f.q}</button>
              {openFaq === i && <p className="js-faq-answer">{f.a}</p>}
            </li>
          ))}
        </ul>
        <a href="#" className="js-sidebar-more">고객센터 바로가기 →</a>
      </div>

    </aside>
  )
}
