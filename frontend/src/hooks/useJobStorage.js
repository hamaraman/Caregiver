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

export function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist_jobs') || '[]')
}

export function toggleWishlist(id) {
  const prev = getWishlist()
  const liked = !prev.includes(id)
  localStorage.setItem('wishlist_jobs', JSON.stringify(
    liked ? [...prev, id] : prev.filter(x => x !== id)
  ))
  return liked
}

export function isWishlisted(id) {
  return getWishlist().includes(id)
}
