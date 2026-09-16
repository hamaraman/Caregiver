// 내가 등록한 공고 (jobs.js에서 일부 사용)
export const myJobIds = [1, 4, 7, 9]

// 공고별 지원자 (talent id 참조)
export const applicants = [
  { id: 1,  jobId: 1, talentId: 2,  applyDate: '09.06', status: '검토중' },
  { id: 2,  jobId: 1, talentId: 5,  applyDate: '09.06', status: '검토중' },
  { id: 3,  jobId: 1, talentId: 9,  applyDate: '09.05', status: '합격'   },
  { id: 4,  jobId: 1, talentId: 12, applyDate: '09.04', status: '불합격' },
  { id: 5,  jobId: 4, talentId: 1,  applyDate: '09.04', status: '검토중' },
  { id: 6,  jobId: 4, talentId: 8,  applyDate: '09.03', status: '검토중' },
  { id: 7,  jobId: 4, talentId: 11, applyDate: '09.02', status: '합격'   },
  { id: 8,  jobId: 7, talentId: 3,  applyDate: '09.01', status: '검토중' },
  { id: 9,  jobId: 7, talentId: 6,  applyDate: '08.31', status: '검토중' },
  { id: 10, jobId: 9, talentId: 4,  applyDate: '09.05', status: '검토중' },
  { id: 11, jobId: 9, talentId: 7,  applyDate: '09.04', status: '불합격' },
  { id: 12, jobId: 9, talentId: 10, applyDate: '09.03', status: '검토중' },
]
