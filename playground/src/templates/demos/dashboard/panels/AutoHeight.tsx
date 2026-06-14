import { useRef, useEffect, useState } from 'react'

export function AutoHeight({
  children,
  defaultHeight = 200,
}: {
  children: (height: number) => React.ReactNode
  defaultHeight?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(defaultHeight)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((es) => {
      const h = Math.floor(es[0].contentRect.height)
      if (h > 0) setHeight(h)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return <div ref={ref} style={{ height: '100%' }}>{children(height)}</div>
}
