import { useRef, type ReactNode, type CSSProperties } from 'react'

// Poster tile that crossfades to a muted looping clip on hover (Runway-style).
// preload="none" so a clip only loads when actually hovered.
export default function HoverVideo({
  poster, src, className, style, children, cta,
}: { poster: string; src?: string; className?: string; style?: CSSProperties; children?: ReactNode; cta?: ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null)
  const enter = () => { const v = ref.current; if (v) v.play().catch(() => {}) }
  const leave = () => { const v = ref.current; if (v) { v.pause(); v.currentTime = 0 } }
  return (
    <div
      className={className}
      style={{ background: poster, ...style }}
      onMouseEnter={src ? enter : undefined}
      onMouseLeave={src ? leave : undefined}
    >
      {src && <video ref={ref} className="hovvid" src={src} muted loop playsInline preload="none" />}
      {src && <span className="hovscrim" />}
      {children}
      {cta && <span className="hovcta">{cta}</span>}
    </div>
  )
}
