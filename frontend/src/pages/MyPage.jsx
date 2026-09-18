import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HomeNav from './home/HomeNav'
import AuthGuard from '../components/AuthGuard'
import { useAuthContext } from '../contexts/AuthContext'
import { logout, updateMyProfile, changePassword } from '../api'
import './MyPage.css'

const PERSONAL_LINKS = [
  { label: '내 이력서', sub: '구직 정보 등록 · 수정', path: '/job-register' },
  { label: '지원 현황', sub: '내가 지원한 공고 목록', path: '/my-applications' },
  { label: '찜한 공고', sub: '저장해둔 일자리', path: '/wishlist' },
  { label: '최근 본 공고', sub: '최근 조회한 공고', path: '/recent-jobs' },
]

const BUSINESS_LINKS = [
  { label: '채용 관리', sub: '등록한 공고 현황', path: '/manage' },
  { label: '지원자 확인', sub: '공고별 지원자 목록', path: '/applicants' },
  { label: '공고 등록', sub: '새 구인공고 올리기', path: '/jobs/post' },
  { label: '인재 찾기', sub: '맞춤 인재 추천', path: '/talents' },
]

export default function MyPage() {
  const { user, setUser } = useAuthContext()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ text: '', ok: false })

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState({ text: '', ok: false })

  const handleEditStart = () => {
    setProfileForm({ name: user.name || '', phone: user.phone || '', companyName: user.companyName || '' })
    setEditing(true)
    setProfileMsg({ text: '', ok: false })
  }

  const handleProfileSave = async () => {
    setProfileSaving(true)
    setProfileMsg({ text: '', ok: false })
    try {
      const updated = await updateMyProfile(profileForm)
      setUser(updated)
      setEditing(false)
      setProfileMsg({ text: '저장되었습니다.', ok: true })
    } catch (e) {
      setProfileMsg({ text: e.message, ok: false })
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePwSubmit = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwMsg({ text: '새 비밀번호가 일치하지 않습니다.', ok: false })
      return
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({ text: '비밀번호는 8자 이상이어야 합니다.', ok: false })
      return
    }
    setPwSaving(true)
    setPwMsg({ text: '', ok: false })
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
      setPwMsg({ text: '비밀번호가 변경되었습니다.', ok: true })
    } catch (e) {
      setPwMsg({ text: e.message, ok: false })
    } finally {
      setPwSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout().catch(() => {})
    setUser(null)
    navigate('/')
  }

  if (!user) return null

  const isBusiness = user.userType === 'business'
  const links = isBusiness ? BUSINESS_LINKS : PERSONAL_LINKS

  return (
    <>
      <HomeNav />
      <AuthGuard>
        <div className="mp-page">
          <div className="mp-inner">

            {/* 프로필 헤더 */}
            <div className="mp-header">
              <div className="mp-avatar">
                {(user.name || user.email || '?')[0].toUpperCase()}
              </div>
              <div className="mp-header-info">
                <p className="mp-header-name">{user.name || user.email}님</p>
                <span className="mp-badge">{isBusiness ? '사업자' : '일반회원'}</span>
              </div>
              <button className="mp-logout-btn" onClick={handleLogout}>로그아웃</button>
            </div>

            {/* 빠른 메뉴 */}
            <section className="mp-section">
              <h2 className="mp-section-title">{isBusiness ? '사업자 메뉴' : '내 활동'}</h2>
              <div className="mp-links-grid">
                {links.map(l => (
                  <Link key={l.path} to={l.path} className="mp-link-card">
                    <div className="mp-link-text">
                      <p className="mp-link-label">{l.label}</p>
                      <p className="mp-link-sub">{l.sub}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </section>

            {/* 계정 정보 */}
            <section className="mp-section">
              <div className="mp-section-header-row">
                <h2 className="mp-section-title">계정 정보</h2>
                {!editing && <button className="mp-edit-btn" onClick={handleEditStart}>수정</button>}
              </div>

              {editing ? (
                <div className="mp-profile-form">
                  <div className="jp-row">
                    <label className="jp-label jp-label--required">이름</label>
                    <input
                      className="jp-input jp-input--md"
                      value={profileForm.name}
                      onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="jp-row">
                    <label className="jp-label">연락처</label>
                    <input
                      className="jp-input jp-input--md"
                      value={profileForm.phone}
                      placeholder="010-0000-0000"
                      onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  {isBusiness && (
                    <div className="jp-row">
                      <label className="jp-label">업체명</label>
                      <input
                        className="jp-input jp-input--md"
                        value={profileForm.companyName}
                        onChange={e => setProfileForm(f => ({ ...f, companyName: e.target.value }))}
                      />
                    </div>
                  )}
                  <div className="jp-row">
                    <label className="jp-label">이메일</label>
                    <span className="mp-info-value mp-info-value--muted">{user.email}</span>
                  </div>
                  {profileMsg.text && <p className={`mp-msg${profileMsg.ok ? ' mp-msg--ok' : ''}`}>{profileMsg.text}</p>}
                  <div className="jp-actions" style={{ marginTop: 8 }}>
                    <button className="jp-btn jp-btn--cancel" onClick={() => setEditing(false)}>취소</button>
                    <button className="jp-btn jp-btn--submit" onClick={handleProfileSave} disabled={profileSaving}>
                      {profileSaving ? '저장 중...' : '저장'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mp-info-list">
                  <div className="mp-info-row"><span className="mp-info-label">이름</span><span className="mp-info-value">{user.name || '-'}</span></div>
                  <div className="mp-info-row"><span className="mp-info-label">이메일</span><span className="mp-info-value">{user.email}</span></div>
                  <div className="mp-info-row"><span className="mp-info-label">연락처</span><span className="mp-info-value">{user.phone || '-'}</span></div>
                  {isBusiness && <div className="mp-info-row"><span className="mp-info-label">업체명</span><span className="mp-info-value">{user.companyName || '-'}</span></div>}
                  {isBusiness && <div className="mp-info-row"><span className="mp-info-label">사업자번호</span><span className="mp-info-value">{user.businessNumber || '-'}</span></div>}
                  {profileMsg.text && <p className={`mp-msg${profileMsg.ok ? ' mp-msg--ok' : ''}`}>{profileMsg.text}</p>}
                </div>
              )}
            </section>

            {/* 비밀번호 변경 */}
            <section className="mp-section">
              <h2 className="mp-section-title">비밀번호 변경</h2>
              <form className="mp-profile-form" onSubmit={handlePwSubmit} noValidate>
                <div className="jp-row">
                  <label className="jp-label jp-label--required">현재 비밀번호</label>
                  <input
                    className="jp-input jp-input--md"
                    type="password"
                    value={pwForm.currentPassword}
                    onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                  />
                </div>
                <div className="jp-row">
                  <label className="jp-label jp-label--required">새 비밀번호</label>
                  <input
                    className="jp-input jp-input--md"
                    type="password"
                    placeholder="8자 이상"
                    value={pwForm.newPassword}
                    onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                  />
                </div>
                <div className="jp-row">
                  <label className="jp-label jp-label--required">새 비밀번호 확인</label>
                  <input
                    className="jp-input jp-input--md"
                    type="password"
                    value={pwForm.confirm}
                    onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                  />
                </div>
                {pwMsg.text && <p className={`mp-msg${pwMsg.ok ? ' mp-msg--ok' : ''}`}>{pwMsg.text}</p>}
                <div className="jp-actions" style={{ marginTop: 8 }}>
                  <button type="submit" className="jp-btn jp-btn--submit" disabled={pwSaving}>
                    {pwSaving ? '변경 중...' : '비밀번호 변경'}
                  </button>
                </div>
              </form>
            </section>

          </div>
        </div>
      </AuthGuard>
    </>
  )
}
