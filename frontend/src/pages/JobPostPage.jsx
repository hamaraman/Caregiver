import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './JobPostPage.css'

const regionTree = {
  '서울': ['강남구','서초구','송파구','강동구','마포구','영등포구','종로구','중구','용산구','성동구','광진구','노원구','강북구','도봉구','은평구','서대문구','동대문구','중랑구','성북구','강서구','양천구','구로구','금천구','관악구','동작구'],
  '경기': ['수원시','성남시','고양시','용인시','부천시','안산시','화성시','남양주시','안양시','평택시','시흥시','파주시','의정부시','김포시','광명시','광주시','하남시','군포시','오산시','이천시','안성시','양주시','구리시','포천시','의왕시','여주시','동두천시','과천시','가평군','양평군','연천군'],
  '인천': ['미추홀구','연수구','남동구','부평구','계양구','서구','중구','동구','강화군','옹진군'],
  '강원': ['춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군','영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'],
  '충북': ['청주시','충주시','제천시','보은군','옥천군','영동군','증평군','진천군','괴산군','음성군','단양군'],
  '충남': ['천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시','금산군','부여군','서천군','청양군','홍성군','예산군','태안군'],
  '대전': ['동구','중구','서구','유성구','대덕구'],
  '세종': ['세종시'],
  '전북': ['전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군','장수군','임실군','순창군','고창군','부안군'],
  '전남': ['목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군','보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군','장성군','완도군','진도군','신안군'],
  '광주': ['동구','서구','남구','북구','광산구'],
  '경북': ['포항시','경주시','김천시','안동시','구미시','영주시','영천시','상주시','문경시','경산시','군위군','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군','예천군','봉화군','울진군','울릉군'],
  '경남': ['창원시','진주시','통영시','사천시','김해시','밀양시','거제시','양산시','의령군','함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'],
  '대구': ['중구','동구','서구','남구','북구','수성구','달서구','달성군'],
  '부산': ['중구','서구','동구','영도구','부산진구','동래구','남구','북구','해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'],
  '울산': ['중구','남구','동구','북구','울주군'],
  '제주': ['제주시','서귀포시'],
}

const jobTypes = ['요양보호사','간병인','가사도우미','사회복지사','간호사','간호조무사','물리치료사','활동지원사','조리원','영양사','시설장','사무원','운전원']
const facilityTypes = ['방문요양','요양원','너싱홈','노인요양공동생활가정','방문목욕','방문간호','주야간보호','단기보호','요양병원','복지관','양로원','기타']
const workForms = ['출·퇴근형','입주형','재택형','협의후결정']
const employForms = ['정규직','계약직','임시직','아르바이트','협의후결정']
const educations = ['학력무관','중졸','고졸','대학재학','대졸','대학원졸']
const experiences = ['경력무관','신입','1년 이상','2년 이상','3년 이상','5년 이상','7년 이상','10년 이상']
const weekdays = ['월','화','수','목','금','토','일']
const careConditions = ['치매','와상(누워계신분)','거동불편','뇌졸중','파킨슨','투석','욕창','기타']
const careWorks = ['식사보조','목욕보조','이동보조','배변보조','청소·세탁','병원동행','말벗·정서지원']
const applyMethods = ['바로지원','방문접수','이메일','전화','팩스','홈페이지']

const SECTIONS = ['근무 조건','케어 대상자 정보','공고 내용','업체 정보','담당자 정보','약관 동의']

export default function JobPostPage() {
  // 근무 조건
  const [sido, setSido] = useState('')
  const [sigu, setSigu] = useState('')
  const [jobType, setJobType] = useState('')
  const [facility, setFacility] = useState('')
  const [workForm, setWorkForm] = useState('')
  const [employForm, setEmployForm] = useState('')
  const [education, setEducation] = useState('')
  const [experience, setExperience] = useState('')
  const [selectedDays, setSelectedDays] = useState([])
  const [dayNegotiable, setDayNegotiable] = useState(false)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('18:00')
  const [wageType, setWageType] = useState('')
  const [wageAmount, setWageAmount] = useState('')

  const dateAfterDays = (days) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().slice(0, 10)
  }

  const [deadline, setDeadline] = useState(dateAfterDays(30))
  const [deadlineType, setDeadlineType] = useState('date')

  // 케어 대상자
  const [careGender, setCareGender] = useState('')
  const [careAge, setCareAge] = useState('')
  const [birthYear, setBirthYear] = useState('')

  const handleBirthYear = (val) => {
    setBirthYear(val)
    const year = parseInt(val, 10)
    if (val.length === 4 && year >= 1900 && year <= new Date().getFullYear()) {
      setCareAge(String(new Date().getFullYear() - year + 1))
    } else {
      setCareAge('')
    }
  }

  const handleCareAge = (val) => {
    setCareAge(val)
    setBirthYear('')
  }
  const [careGrade, setCareGrade] = useState('')
  const [careCondition, setCareCondition] = useState([])
  const [careWork, setCareWork] = useState([])

  // 공고 내용
  const [postTitle, setPostTitle] = useState('')
  const [postDetail, setPostDetail] = useState('')
  const [applyMethod, setApplyMethod] = useState(['바로지원'])
  const [companyUrl, setCompanyUrl] = useState('')

  // 업체 정보
  const [companyName, setCompanyName] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyAddr, setCompanyAddr] = useState('')
  const [companyAddrDetail, setCompanyAddrDetail] = useState('')

  const openAddressSearch = () => {
    if (!window.daum?.Postcode) {
      const script = document.createElement('script')
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
      script.onload = () => launchPostcode()
      document.head.appendChild(script)
    } else {
      launchPostcode()
    }
  }

  const launchPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setCompanyAddr(data.roadAddress || data.jibunAddress)
        setCompanyAddrDetail('')
      }
    }).open()
  }
  const [phonePublic, setPhonePublic] = useState('로그인 후 확인')

  // 담당자 정보
  const [managerName, setManagerName] = useState('')
  const [managerPhone, setManagerPhone] = useState('')
  const [sameAsCompany, setSameAsCompany] = useState(false)
  const [managerEmail, setManagerEmail] = useState('')

  // 약관
  const [agreed, setAgreed] = useState(false)

  const toggleArr = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  const toggleDay = (d) => {
    if (dayNegotiable) return
    toggleArr(selectedDays, setSelectedDays, d)
  }

  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 11)
    if (digits.startsWith('02')) {
      if (digits.length <= 2) return digits
      if (digits.length <= 5) return `${digits.slice(0,2)}-${digits.slice(2)}`
      if (digits.length <= 9) return `${digits.slice(0,2)}-${digits.slice(2,5)}-${digits.slice(5)}`
      return `${digits.slice(0,2)}-${digits.slice(2,6)}-${digits.slice(6)}`
    }
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0,3)}-${digits.slice(3)}`
    if (digits.length <= 10) return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`
    return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`
  }

  const handleCompanyPhone = (val) => {
    const formatted = formatPhone(val)
    setCompanyPhone(formatted)
    if (sameAsCompany) setManagerPhone(formatted)
  }

  const handleSameAsCompany = (checked) => {
    setSameAsCompany(checked)
    if (checked) setManagerPhone(companyPhone)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('구인공고가 등록되었습니다.')
  }

  const siList = sido ? regionTree[sido] || [] : []

  return (
    <div className="app">
      <Header />
      <main className="jp-page">
        <div className="container">
          <div className="jp-top">
            <div className="jp-breadcrumb"><Link to="/">홈</Link> › 구인공고 등록</div>
            <h2 className="jp-title">구인공고 등록</h2>
          </div>

          {/* 진행 단계 */}
          <div className="jp-steps">
            {SECTIONS.map((s, i) => (
              <div key={s} className="jp-step">
                <div className="jp-step-num">{i + 1}</div>
                <span className="jp-step-label">{s}</span>
                {i < SECTIONS.length - 1 && <div className="jp-step-line" />}
              </div>
            ))}
          </div>

          <form className="jp-form" onSubmit={handleSubmit}>

            {/* ① 근무 조건 */}
            <div className="jp-section">
              <div className="jp-section-header">
                <span className="jp-section-num">1</span>
                <h3 className="jp-section-title">근무 조건</h3>
              </div>
              <div className="jp-section-body">

                <div className="jp-row">
                  <label className="jp-label jp-label--required">근무지역</label>
                  <div className="jp-field-group">
                    <select className="jp-select" value={sido} onChange={e => { setSido(e.target.value); setSigu('') }} required>
                      <option value="">시/도 선택</option>
                      {Object.keys(regionTree).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select className="jp-select" value={sigu} onChange={e => setSigu(e.target.value)} disabled={!sido}>
                      <option value="">구/군 선택</option>
                      {siList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">직종</label>
                  <select className="jp-select jp-select--md" value={jobType} onChange={e => setJobType(e.target.value)} required>
                    <option value="">직종 선택</option>
                    {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">시설종류</label>
                  <select className="jp-select jp-select--md" value={facility} onChange={e => setFacility(e.target.value)} required>
                    <option value="">시설 선택</option>
                    {facilityTypes.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">근무형태</label>
                  <div className="jp-radio-group">
                    {workForms.map(w => (
                      <label key={w} className="jp-radio">
                        <input type="radio" name="workForm" value={w} checked={workForm === w} onChange={() => setWorkForm(w)} required />
                        {w}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">고용형태</label>
                  <div className="jp-radio-group">
                    {employForms.map(e => (
                      <label key={e} className="jp-radio">
                        <input type="radio" name="employForm" value={e} checked={employForm === e} onChange={() => setEmployForm(e)} required />
                        {e}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">희망학력</label>
                  <select className="jp-select jp-select--md" value={education} onChange={e => setEducation(e.target.value)} required>
                    <option value="">학력 선택</option>
                    {educations.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">희망경력</label>
                  <select className="jp-select jp-select--md" value={experience} onChange={e => setExperience(e.target.value)} required>
                    <option value="">경력 선택</option>
                    {experiences.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">근무요일</label>
                  <div className="jp-check-group">
                    {weekdays.map(d => (
                      <label key={d} className={`jp-check ${dayNegotiable ? 'jp-check--disabled' : ''}`}>
                        <input type="checkbox" checked={selectedDays.includes(d)} onChange={() => toggleDay(d)} disabled={dayNegotiable} />
                        {d}
                      </label>
                    ))}
                    <label className="jp-check jp-check--neg">
                      <input type="checkbox" checked={dayNegotiable} onChange={e => { setDayNegotiable(e.target.checked); setSelectedDays([]) }} />
                      협의후결정
                    </label>
                  </div>
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">근무시간</label>
                  <div className="jp-time-group">
                    <input className="jp-input jp-input--time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                    <span className="jp-time-sep">~</span>
                    <input className="jp-input jp-input--time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                  </div>
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">급여</label>
                  <div className="jp-field-group">
                    <select className="jp-select jp-select--sm" value={wageType} onChange={e => setWageType(e.target.value)} required>
                      <option value="">유형</option>
                      {['시급','일급','월급'].map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    <input
                      className="jp-input jp-input--wage"
                      type="number"
                      placeholder="금액 입력"
                      value={wageAmount}
                      min="0"
                      onChange={e => setWageAmount(e.target.value)}
                    />
                    <span className="jp-unit">원</span>
                  </div>
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">모집 마감일</label>
                  <div className="jp-field-group">
                    {deadlineType === '상시'
                      ? <span className="jp-always-badge">상시모집 · 직접 마감 처리</span>
                      : <input
                          className="jp-input jp-input--date"
                          type="date"
                          value={deadline}
                          onChange={e => { setDeadline(e.target.value); setDeadlineType('date') }}
                          required
                        />
                    }
                    <span className="jp-chip-tip-wrap" data-tip="마감일을 7일 후로 자동 설정합니다">
                      <button
                        type="button"
                        className={`jp-deadline-chip${deadlineType === '급구' ? ' jp-deadline-chip--active jp-deadline-chip--urgent' : ''}`}
                        onClick={() => { setDeadlineType('급구'); setDeadline(dateAfterDays(7)) }}
                      >급구</button>
                    </span>
                    <span className="jp-chip-tip-wrap" data-tip="날짜 없이 직접 마감 처리합니다">
                      <button
                        type="button"
                        className={`jp-deadline-chip${deadlineType === '상시' ? ' jp-deadline-chip--active jp-deadline-chip--always' : ''}`}
                        onClick={() => { setDeadlineType('상시'); setDeadline('') }}
                      >상시</button>
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* ② 케어 대상자 정보 */}
            <div className="jp-section">
              <div className="jp-section-header">
                <span className="jp-section-num">2</span>
                <h3 className="jp-section-title">케어 대상자 정보 <span className="jp-optional">선택</span></h3>
              </div>
              <div className="jp-section-body">

                <div className="jp-row">
                  <label className="jp-label">성별</label>
                  <div className="jp-radio-group">
                    {['남','여'].map(g => (
                      <label key={g} className="jp-radio">
                        <input type="radio" name="careGender" value={g} checked={careGender === g} onChange={() => setCareGender(g)} />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="jp-row">
                  <label className="jp-label">나이</label>
                  <div className="jp-field-group">
                    <input
                      className="jp-input jp-input--sm"
                      type="number"
                      placeholder="출생연도"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={birthYear}
                      onChange={e => handleBirthYear(e.target.value)}
                    />
                    <span className="jp-unit">년생</span>
                    <span className="jp-age-sep">/</span>
                    <input
                      className="jp-input jp-input--sm"
                      type="number"
                      placeholder="나이"
                      min="0"
                      max="120"
                      value={careAge}
                      onChange={e => handleCareAge(e.target.value)}
                    />
                    <span className="jp-unit">세</span>
                  </div>
                </div>

                <div className="jp-row">
                  <label className="jp-label">요양등급</label>
                  <select className="jp-select jp-select--sm" value={careGrade} onChange={e => setCareGrade(e.target.value)}>
                    <option value="">선택</option>
                    {['1등급','2등급','3등급','4등급','5등급','인지지원등급'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="jp-row jp-row--top">
                  <label className="jp-label">대상자 상태</label>
                  <div className="jp-check-group jp-check-group--wrap">
                    {careConditions.map(c => (
                      <label key={c} className="jp-check">
                        <input type="checkbox" checked={careCondition.includes(c)} onChange={() => toggleArr(careCondition, setCareCondition, c)} />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="jp-row jp-row--top">
                  <label className="jp-label">업무내용</label>
                  <div className="jp-check-group jp-check-group--wrap">
                    {careWorks.map(w => (
                      <label key={w} className="jp-check">
                        <input type="checkbox" checked={careWork.includes(w)} onChange={() => toggleArr(careWork, setCareWork, w)} />
                        {w}
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ③ 공고 내용 */}
            <div className="jp-section">
              <div className="jp-section-header">
                <span className="jp-section-num">3</span>
                <h3 className="jp-section-title">공고 내용</h3>
              </div>
              <div className="jp-section-body">

                <div className="jp-row">
                  <label className="jp-label jp-label--required">채용 제목</label>
                  <input
                    className="jp-input jp-input--full"
                    type="text"
                    placeholder="예) 강남구 요양보호사 구인 (주간, 출퇴근)"
                    value={postTitle}
                    onChange={e => setPostTitle(e.target.value)}
                    maxLength={50}
                    required
                  />
                </div>

                <div className="jp-row jp-row--top">
                  <label className="jp-label jp-label--required">상세 내용</label>
                  <textarea
                    className="jp-textarea"
                    placeholder="근무 환경, 복리후생, 특이사항 등을 자유롭게 작성해주세요."
                    value={postDetail}
                    onChange={e => setPostDetail(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div className="jp-row jp-row--top">
                  <label className="jp-label jp-label--required">접수방법</label>
                  <div className="jp-field-group--col">
                    <div className="jp-check-group jp-check-group--wrap">
                      {applyMethods.map(m => (
                        <label key={m} className={`jp-check${m === '바로지원' ? ' jp-check--direct' : ''}`}>
                          <input type="checkbox" checked={applyMethod.includes(m)} onChange={() => toggleArr(applyMethod, setApplyMethod, m)} />
                          {m === '바로지원' ? '⚡ 바로지원 (요양나라)' : m}
                        </label>
                      ))}
                    </div>
                    {applyMethod.includes('홈페이지') && (
                      <div className="jp-field-group" style={{ marginTop: '8px' }}>
                        <span className="jp-unit">업체 홈페이지 URL</span>
                        <input
                          className="jp-input jp-input--full"
                          type="url"
                          placeholder="https://example.com"
                          value={companyUrl}
                          onChange={e => setCompanyUrl(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* ④ 업체 정보 */}
            <div className="jp-section">
              <div className="jp-section-header">
                <span className="jp-section-num">4</span>
                <h3 className="jp-section-title">업체 정보</h3>
              </div>
              <div className="jp-section-body">

                <div className="jp-row">
                  <label className="jp-label jp-label--required">업체명</label>
                  <input className="jp-input jp-input--md" type="text" placeholder="업체명 입력" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                </div>

                <div className="jp-row">
                  <label className="jp-label jp-label--required">전화번호</label>
                  <input className="jp-input jp-input--md" type="tel" placeholder="예) 02-1234-5678" value={companyPhone} onChange={e => handleCompanyPhone(e.target.value)} required />
                </div>

                <div className="jp-row jp-row--top">
                  <label className="jp-label jp-label--required">주소</label>
                  <div className="jp-field-group--col">
                    <div className="jp-field-group">
                      <input
                        className="jp-input"
                        type="text"
                        placeholder="주소 검색을 클릭하세요"
                        value={companyAddr}
                        readOnly
                        required
                        style={{ flex: 1 }}
                      />
                      <button type="button" className="jp-addr-btn" onClick={openAddressSearch}>주소 검색</button>
                    </div>
                    <input
                      className="jp-input jp-input--full"
                      type="text"
                      placeholder="상세주소 입력 (동, 호수 등)"
                      value={companyAddrDetail}
                      onChange={e => setCompanyAddrDetail(e.target.value)}
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                </div>

                <div className="jp-row">
                  <label className="jp-label">연락처 공개</label>
                  <div className="jp-radio-group">
                    {['로그인 후 확인','바로 확인'].map(p => (
                      <label key={p} className="jp-radio">
                        <input type="radio" name="phonePublic" value={p} checked={phonePublic === p} onChange={() => setPhonePublic(p)} />
                        {p}
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ⑤ 담당자 정보 */}
            <div className="jp-section">
              <div className="jp-section-header">
                <span className="jp-section-num">5</span>
                <h3 className="jp-section-title">담당자 정보</h3>
              </div>
              <div className="jp-section-body">

                <div className="jp-row">
                  <label className="jp-label jp-label--required">담당자명</label>
                  <input className="jp-input jp-input--md" type="text" placeholder="담당자 이름" value={managerName} onChange={e => setManagerName(e.target.value)} required />
                </div>

                <div className="jp-row">
                  <label className="jp-label">담당자 연락처</label>
                  <div className="jp-field-group jp-field-group--col">
                    <div className="jp-field-group">
                      <input
                        className="jp-input jp-input--md"
                        type="tel"
                        placeholder="예) 010-1234-5678"
                        value={managerPhone}
                        onChange={e => { setManagerPhone(formatPhone(e.target.value)); setSameAsCompany(false) }}
                      />
                    </div>
                    <label className="jp-check jp-check--same">
                      <input type="checkbox" checked={sameAsCompany} onChange={e => handleSameAsCompany(e.target.checked)} />
                      업체 전화번호와 동일
                    </label>
                  </div>
                </div>

                <div className="jp-row">
                  <label className="jp-label">이메일 <span className="jp-optional">선택</span></label>
                  <input className="jp-input jp-input--md" type="email" placeholder="example@email.com" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} />
                </div>

              </div>
            </div>

            {/* ⑥ 약관 동의 */}
            <div className="jp-section">
              <div className="jp-section-header">
                <span className="jp-section-num">6</span>
                <h3 className="jp-section-title">약관 동의</h3>
              </div>
              <div className="jp-section-body">
                <div className="jp-agree-box">
                  <p className="jp-agree-text">
                    수집된 개인정보는 구인공고 서비스 제공 목적으로만 사용되며,
                    관련 법령에 따라 안전하게 보호됩니다.
                    구인공고 등록 시 입력하신 업체·담당자 정보는 구직자에게 공개될 수 있습니다.
                  </p>
                  <label className="jp-check jp-check--agree" style={{ alignSelf: 'flex-end' }}>
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required />
                    개인정보 수집·이용에 동의합니다 <span className="jp-label--required-star">*</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="jp-actions">
              <Link to="/" className="jp-btn jp-btn--cancel">취소</Link>
              <button type="submit" className="jp-btn jp-btn--submit" disabled={!agreed}>공고 등록하기</button>
            </div>

          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
