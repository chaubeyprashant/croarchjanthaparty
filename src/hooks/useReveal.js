import { useEffect, useRef, useState } from 'react'

export function useReveal({ threshold = 0, rootMargin = '0px 0px 80px 0px' } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const node = ref.current
    if (!node) return undefined

    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, visible }
}
