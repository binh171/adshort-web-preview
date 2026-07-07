// Format catalog — mirrors the Format QC Audit. `lock` = TestFlight-ready set.
export type FormatDef = {
  id: string
  name: string
  category: string
  fit: string
  roi: 1 | 2 | 3
  poster: string
  lock: 'lock' | 'constrain' | 'defer'
}

export const FORMATS: FormatDef[] = [
  { id: 'review', name: 'UGC Review', category: 'UGC', fit: 'holdable · beauty/supplement/pet', roi: 3, poster: 'linear-gradient(160deg,#c98a6a,#7a4a38)', lock: 'lock' },
  { id: 'beforeafter', name: 'Before-After', category: 'Before-After', fit: 'beauty/skincare/hair', roi: 3, poster: 'linear-gradient(160deg,#7ab98f,#2f6a4a)', lock: 'lock' },
  { id: 'demo', name: 'Problem-Demo', category: 'Demo', fit: 'home gadget · holdable', roi: 3, poster: 'linear-gradient(160deg,#6a92c9,#2f4f7a)', lock: 'lock' },
  { id: 'unboxing', name: 'Unboxing', category: 'Unboxing', fit: 'gift/beauty/pet/tech', roi: 2, poster: 'linear-gradient(160deg,#c96a9e,#7a2f5a)', lock: 'lock' },
  { id: 'testimonial', name: 'Testimonial', category: 'Testimonial', fit: 'supplement/pet/baby', roi: 3, poster: 'linear-gradient(160deg,#c9b46a,#7a682f)', lock: 'lock' },
  { id: 'hero', name: 'Hero Showcase', category: 'Product', fit: 'product-only push-in/orbit', roi: 2, poster: 'linear-gradient(160deg,#8f6ac9,#4a2f7a)', lock: 'lock' },
  { id: 'turntable', name: 'Turntable 360', category: 'Product', fit: 'product-only rigid', roi: 2, poster: 'linear-gradient(160deg,#6ac9c0,#2f7a72)', lock: 'lock' },
  { id: 'petreaction', name: 'Pet Reaction', category: 'Pet', fit: 'pet toys/food', roi: 3, poster: 'linear-gradient(160deg,#c97a6a,#7a382f)', lock: 'constrain' },
]

export const CATEGORIES = ['All', 'UGC', 'Before-After', 'Demo', 'Unboxing', 'Testimonial', 'Product', 'Pet']
