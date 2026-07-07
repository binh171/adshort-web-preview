import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { DetectResult, Variant } from './be'

export type GenOpts = { aspect: '9:16' | '4:5' | '1:1'; length: 8 | 10 | 15; hook: string; music: boolean }
export type LibraryItem = { id: string; format: string; product: string; poster: string; winRate?: number; date: string }

type AppState = {
  product: DetectResult | null
  formatId: string | null
  brief: string
  opts: GenOpts
  variants: Variant[]
  selected: string | null
  library: LibraryItem[]
  credits: number
  setProduct: (p: DetectResult | null) => void
  setFormat: (id: string) => void
  setBrief: (b: string) => void
  setOpts: (o: Partial<GenOpts>) => void
  setVariants: (v: Variant[]) => void
  setSelected: (id: string | null) => void
  saveToLibrary: (item: LibraryItem) => void
  spend: (n: number) => void
}

const Ctx = createContext<AppState | null>(null)

const seedLibrary: LibraryItem[] = [
  { id: 'l1', format: 'UGC Review', product: 'Vitamin C Serum', poster: 'linear-gradient(160deg,#c98a6a,#7a4a38)', winRate: 82, date: 'Jun 28' },
  { id: 'l2', format: 'Before-After', product: 'Retinol Night Cream', poster: 'linear-gradient(160deg,#7ab98f,#2f6a4a)', winRate: 71, date: 'Jun 24' },
  { id: 'l3', format: 'Problem-Demo', product: 'Spice Organizer', poster: 'linear-gradient(160deg,#6a92c9,#2f4f7a)', winRate: 64, date: 'Jun 19' },
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

  const value = useMemo<AppState>(() => ({
    product, formatId, brief, opts, variants, selected, library, credits,
    setProduct,
    setFormat: setFormatId,
    setBrief,
    setOpts: (o) => setOptsState((prev) => ({ ...prev, ...o })),
    setVariants,
    setSelected,
    saveToLibrary: (item) => setLibrary((prev) => [item, ...prev]),
    spend: (n) => setCredits((c) => Math.max(0, c - n)),
  }), [product, formatId, brief, opts, variants, selected, library, credits])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used within AppProvider')
  return v
}
