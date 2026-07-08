import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { DetectResult, Variant } from './be'
import { poster } from './img'

export type GenOpts = { aspect: '9:16' | '4:5' | '1:1'; length: 8 | 10 | 15; hook: string; music: boolean }
export type AdStatus = 'scaling' | 'fresh' | 'fatigued'
export type LibraryItem = {
  id: string; format: string; product: string; poster: string; date: string
  winRate?: number; category?: string; ctr?: number; spend?: number; status?: AdStatus
}

type AppState = {
  product: DetectResult | null
  formatId: string | null
  brief: string
  opts: GenOpts
  variants: Variant[]
  selected: string | null
  library: LibraryItem[]
  credits: number
  plan: string
  metaConnected: boolean
  demo: boolean
  setDemo: (v: boolean) => void
  setProduct: (p: DetectResult | null) => void
  setFormat: (id: string) => void
  setBrief: (b: string) => void
  setOpts: (o: Partial<GenOpts>) => void
  setVariants: (v: Variant[]) => void
  setSelected: (id: string | null) => void
  saveToLibrary: (item: LibraryItem) => void
  spend: (n: number) => void
  setPlan: (p: string) => void
  setMetaConnected: (v: boolean) => void
}

const Ctx = createContext<AppState | null>(null)

const seedLibrary: LibraryItem[] = [
  { id: 'l1', format: 'UGC Review', product: 'Vitamin C Serum', poster: poster('serum'), winRate: 82, date: 'Jun 28', category: 'Beauty', ctr: 2.8, spend: 640, status: 'scaling' },
  { id: 'l2', format: 'Before-After', product: 'Retinol Night Cream', poster: poster('cream'), winRate: 74, date: 'Jun 24', category: 'Beauty', ctr: 2.3, spend: 410, status: 'scaling' },
  { id: 'l4', format: 'Testimonial', product: 'Collagen Peptides', poster: poster('supplement'), winRate: 77, date: 'Jun 15', category: 'Supplement', ctr: 2.4, spend: 520, status: 'scaling' },
  { id: 'l3', format: 'Problem-Demo', product: 'Spice Organizer', poster: poster('home'), winRate: 61, date: 'Jun 12', category: 'Home', ctr: 1.5, spend: 230, status: 'fatigued' },
  { id: 'l5', format: 'Unboxing', product: 'Pet Grooming Kit', poster: poster('pet_grooming'), winRate: 58, date: 'Jun 08', category: 'Pet', ctr: 1.4, spend: 180, status: 'fatigued' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<DetectResult | null>(null)
  const [formatId, setFormatId] = useState<string | null>(null)
  const [brief, setBrief] = useState('')
  const [opts, setOptsState] = useState<GenOpts>({ aspect: '9:16', length: 10, hook: '"Ever notice…"', music: true })
  const [variants, setVariants] = useState<Variant[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [library, setLibrary] = useState<LibraryItem[]>(seedLibrary)
  const [credits, setCredits] = useState(20)
  const [plan, setPlan] = useState('trial')
  const [metaConnected, setMetaConnected] = useState(false)
  const [demo, setDemoState] = useState<boolean>(() => {
    try { return localStorage.getItem('adshort_demo') === '1' } catch { return false }
  })
  const setDemo = (v: boolean) => {
    setDemoState(v)
    try { localStorage.setItem('adshort_demo', v ? '1' : '0') } catch { /* ignore */ }
  }

  const value = useMemo<AppState>(() => ({
    product, formatId, brief, opts, variants, selected, library, credits, plan, metaConnected, demo,
    setDemo,
    setProduct,
    setFormat: setFormatId,
    setBrief,
    setOpts: (o) => setOptsState((prev) => ({ ...prev, ...o })),
    setVariants,
    setSelected,
    saveToLibrary: (item) => setLibrary((prev) => [item, ...prev]),
    spend: (n) => setCredits((c) => Math.max(0, c - n)),
    setPlan,
    setMetaConnected,
  }), [product, formatId, brief, opts, variants, selected, library, credits, plan, metaConnected, demo])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used within AppProvider')
  return v
}
