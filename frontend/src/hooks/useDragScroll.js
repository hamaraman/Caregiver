import { useRef, useCallback } from 'react'

export function useDragScroll() {
  const ref = useRef(null)
  const origin = useRef({ x: 0, left: 0, active: false })

  const onMouseDown = useCallback((e) => {
    if (!ref.current) return
    origin.current = { x: e.pageX, left: ref.current.scrollLeft, active: true }
    ref.current.style.cursor = 'grabbing'
    ref.current.style.userSelect = 'none'
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!origin.current.active || !ref.current) return
    e.preventDefault()
    ref.current.scrollLeft = origin.current.left - (e.pageX - origin.current.x)
  }, [])

  const stopDrag = useCallback(() => {
    if (!ref.current) return
    origin.current.active = false
    ref.current.style.cursor = 'grab'
    ref.current.style.userSelect = ''
  }, [])

  return { ref, onMouseDown, onMouseMove, onMouseLeave: stopDrag, onMouseUp: stopDrag }
}
