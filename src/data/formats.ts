// Format catalog — mirrors the Format QC Audit. `lock` = TestFlight-ready set.
import { poster } from '../lib/img'

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
  { id: 'review', name: 'UGC Review', category: 'UGC', fit: 'holdable · beauty/supplement/pet', roi: 3, poster: poster('ugc'), lock: 'lock' },
  { id: 'beforeafter', name: 'Before-After', category: 'Before-After', fit: 'beauty/skincare/hair', roi: 3, poster: poster('skinface'), lock: 'lock' },
  { id: 'demo', name: 'Problem-Demo', category: 'Demo', fit: 'home gadget · holdable', roi: 3, poster: poster('home'), lock: 'lock' },
  { id: 'unboxing', name: 'Unboxing', category: 'Unboxing', fit: 'gift/beauty/pet/tech', roi: 2, poster: poster('unboxing'), lock: 'lock' },
  { id: 'testimonial', name: 'Testimonial', category: 'Testimonial', fit: 'supplement/pet/baby', roi: 3, poster: poster('supplement'), lock: 'lock' },
  { id: 'hero', name: 'Hero Showcase', category: 'Product', fit: 'product-only push-in/orbit', roi: 2, poster: poster('product_hero'), lock: 'lock' },
  { id: 'turntable', name: 'Turntable 360', category: 'Product', fit: 'product-only rigid', roi: 2, poster: poster('cream'), lock: 'lock' },
  { id: 'petreaction', name: 'Pet Reaction', category: 'Pet', fit: 'pet toys/food', roi: 3, poster: poster('pet_toy'), lock: 'constrain' },
]

export const CATEGORIES = ['All', 'UGC', 'Before-After', 'Demo', 'Unboxing', 'Testimonial', 'Product', 'Pet']
