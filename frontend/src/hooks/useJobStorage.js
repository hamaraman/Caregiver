const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function getRecentJobs() {
  const cutoff = Date.now() - WEEK_MS
  return JSON.parse(localStorage.getItem('recent_jobs') || '[]')
    .filter(e => e.viewedAt > cutoff)
}

export function addRecentJob(id) {
  const cutoff = Date.now() - WEEK_MS
  const prev = JSON.parse(localStorage.getItem('recent_jobs') || '[]')
    .filter(e => e.viewedAt > cutoff && e.id !== id)
  localStorage.setItem('recent_jobs', JSON.stringify([{ id, viewedAt: Date.now() }, ...prev]))
}

export function getLikedTalents() {
  return JSON.parse(localStorage.getItem('liked_talents') || '[]')
}

export function isLikedTalent(id) {
  return getLikedTalents().includes(Number(id))
}

export function toggleLikedTalent(id) {
  const numId = Number(id)
  const prev = getLikedTalents()
  const next = prev.includes(numId) ? prev.filter(x => x !== numId) : [numId, ...prev]
  localStorage.setItem('liked_talents', JSON.stringify(next))
  return next.includes(numId)
}
