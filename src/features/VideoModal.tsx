import { useEffect } from 'react'

// Lightweight video preview overlay. Plays a license-safe sample clip.
export default function VideoModal({ src, onClose }: { src: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!src) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [src, onClose])

  if (!src) return null
  return (
    <div className="vmodal" onClick={onClose}>
      <div className="vmbody" onClick={(e) => e.stopPropagation()}>
        <video className="vmvid" src={src} autoPlay loop controls playsInline />
        <div className="vmnote">Sample footage · your real product renders here <span className="betag">⧗ BE render</span></div>
        <button className="vmclose" onClick={onClose} aria-label="Close preview">✕</button>
      </div>
    </div>
  )
}
