import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import HomeNav from './home/HomeNav'
import { NOTICES } from '../data/notices'
import './SupportPage.css'

const VALID_TABS = ['notice', 'faq', 'contact']

const FAQS = [
  {
    q: '회원가입은 어떻게 하나요?',
    a: '상단 메뉴의 "회원가입" 버튼을 클릭하여 이메일과 비밀번호를 입력하면 가입할 수 있습니다. 구직자와 구인자 유형을 선택하여 가입해 주세요.',
  },
  {
    q: '구인공고는 어떻게 등록하나요?',
    a: '"구인" 메뉴에서 "구인 공고 등록"을 클릭하세요. 로그인 후 근무 조건, 케어 대상자 정보, 공고 내용 등을 입력하고 등록할 수 있습니다.',
  },
  {
    q: '구직 등록(이력서)은 어떻게 하나요?',
    a: '"구직" 메뉴에서 "구직 등록"을 클릭하세요. 자격증 정보, 희망 근무 조건 등을 입력하면 구인 업체에 노출됩니다.',
  },
  {
    q: '게시한 구인공고를 수정하거나 삭제할 수 있나요?',
    a: '"구인" → "채용 관리" 메뉴에서 등록한 공고를 수정하거나 마감 처리할 수 있습니다.',
  },
  {
    q: '지원 현황은 어디서 확인하나요?',
    a: '"구직" → "지원 현황" 메뉴에서 내가 지원한 공고의 진행 상황을 확인할 수 있습니다.',
  },
  {
    q: '비밀번호를 잊어버렸어요.',
    a: '로그인 페이지에서 "비밀번호 찾기"를 클릭하고 가입 시 사용한 이메일을 입력하면 재설정 링크를 받을 수 있습니다.',
  },
]

export default function SupportPage() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')
  const [tab, setTab] = useState(VALID_TABS.includes(initialTab) ? initialTab : 'notice')
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', category: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="sp-page">
      <HomeNav />

      <section className="sp-hero">
        <div className="sp-hero-inner">
          <p className="sp-hero-eyebrow">언제든지 도움을 드리겠습니다.</p>
          <h1 className="sp-hero-title">고객센터</h1>
          <p className="sp-hero-desc">
            공지사항, 자주 묻는 질문, 1:1 문의를 통해<br />
            빠르게 답변 드리겠습니다.
          </p>
        </div>
      </section>

      <div className="sp-body">
        <div className="sp-tabs">
          {[
            { key: 'notice', label: '공지사항' },
            { key: 'faq', label: 'FAQ' },
            { key: 'contact', label: '1:1 문의' },
          ].map(t => (
            <button
              key={t.key}
              className={`sp-tab${tab === t.key ? ' sp-tab--active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="sp-content">

          {tab === 'notice' && (
            <div className="sp-section">
              <table className="sp-notice-table">
                <thead>
                  <tr>
                    <th className="sp-th-num">번호</th>
                    <th className="sp-th-title">제목</th>
                    <th className="sp-th-date">등록일</th>
                  </tr>
                </thead>
                <tbody>
                  {NOTICES.map((n, i) => (
                    <tr key={n.id} className="sp-notice-row">
                      <td className="sp-td-num">{n.important ? <span className="sp-badge">공지</span> : NOTICES.length - i}</td>
                      <td className="sp-td-title">
                        {n.important && <span className="sp-dot" />}
                        {n.title}
                      </td>
                      <td className="sp-td-date">{n.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'faq' && (
            <div className="sp-section">
              {FAQS.map((faq, i) => (
                <div key={i} className={`sp-faq-item${openFaq === i ? ' sp-faq-item--open' : ''}`}>
                  <button className="sp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="sp-faq-q-label">Q</span>
                    <span>{faq.q}</span>
                    <span className="sp-faq-arrow">{openFaq === i ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="sp-faq-a">
                      <span className="sp-faq-a-label">A</span>
                      <span>{faq.a}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'contact' && (
            <div className="sp-section">
              {submitted ? (
                <div className="sp-submitted">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <p className="sp-submitted-title">문의가 접수되었습니다.</p>
                  <p className="sp-submitted-desc">영업일 기준 1~2일 내 입력하신 이메일로 답변 드리겠습니다.</p>
                  <button className="sp-submit-again" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', category: '', message: '' }) }}>
                    추가 문의하기
                  </button>
                </div>
              ) : (
                <form className="sp-form" onSubmit={handleSubmit}>
                  <div className="sp-form-row">
                    <label className="sp-label">이름 <span className="sp-required">*</span></label>
                    <input className="sp-input" type="text" placeholder="이름을 입력해주세요" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div className="sp-form-row">
                    <label className="sp-label">이메일 <span className="sp-required">*</span></label>
                    <input className="sp-input" type="email" placeholder="답변 받으실 이메일" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <div className="sp-form-row">
                    <label className="sp-label">문의 유형 <span className="sp-required">*</span></label>
                    <select className="sp-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                      <option value="">유형 선택</option>
                      {['회원/계정', '구인공고', '구직등록', '결제/환불', '서비스 오류', '기타'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sp-form-row sp-form-row--top">
                    <label className="sp-label">문의 내용 <span className="sp-required">*</span></label>
                    <textarea className="sp-textarea" placeholder="문의 내용을 상세히 입력해주세요." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={6} required />
                  </div>
                  <button type="submit" className="sp-submit-btn">문의 접수하기</button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
