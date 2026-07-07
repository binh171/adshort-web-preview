// Seasonal calendar + category→format affordance — mirrors research/MARKET_TIMING_SEASONAL.
// formatIds reference FORMATS (only LOCK-set formats are startable; extra = ideas outside the set).

export type Season = { month: string; surging: string[]; angle: string; formatIds: string[]; extra?: string }

export const SEASONS: Season[] = [
  { month: 'January',   surging: ['Fitness', 'Wellness', 'Organizers'],       angle: '"New Year New Me" transformation', formatIds: ['testimonial', 'beforeafter'] },
  { month: 'February',  surging: ['Jewelry', 'Self-care', 'Romance'],         angle: "Valentine's gifting",              formatIds: ['unboxing'], extra: 'couple moment' },
  { month: 'March',     surging: ['Spring cleaning', 'Garden', 'Allergy'],    angle: 'chaos → calm freshness',           formatIds: ['demo', 'beforeafter'] },
  { month: 'April',     surging: ['Easter', 'Eco', 'Outdoor'],                angle: 'joy + sustainability',             formatIds: ['unboxing', 'demo', 'petreaction'] },
  { month: 'May',       surging: ["Mother's Day", 'Travel prep'],             angle: 'appreciation, parent & child',    formatIds: ['testimonial', 'unboxing'] },
  { month: 'June',      surging: ["Father's Day", 'Grilling', 'Summer'],      angle: '"dad will love this"',             formatIds: ['demo', 'beforeafter', 'hero'] },
  { month: 'July',      surging: ['July 4th', 'Travel', 'Camping'],           angle: 'summer / freedom lifestyle',       formatIds: ['hero', 'review'], extra: 'on-location montage' },
  { month: 'August',    surging: ['Back-to-School ($80B)', 'Dorm', 'Tech'],   angle: '"be ready", parent & student',    formatIds: ['testimonial', 'beforeafter', 'unboxing'], extra: 'room makeover' },
  { month: 'September', surging: ['Fall', 'Back-to-office', 'Winter prep'],   angle: 'organize for autumn',              formatIds: ['beforeafter', 'demo'] },
  { month: 'October',   surging: ['Halloween', 'Pet costumes', 'Immune'],     angle: 'spooky fun',                       formatIds: ['petreaction', 'unboxing'] },
  { month: 'November',  surging: ['BFCM', 'Gifting', 'Bundles'],              angle: 'urgency + gifting',                formatIds: ['unboxing', 'review'], extra: 'flash carousel' },
  { month: 'December',  surging: ['Christmas', 'Last-minute', 'Bundles'],     angle: '"last-minute saver" + family',     formatIds: ['unboxing', 'testimonial'] },
]

// category → recommended (LOCK format ids) + suppressed (low-ROI combo, with reason)
export const PRODUCT_CATS = ['Beauty', 'Skincare', 'Pet', 'Supplement', 'Home', 'Fitness', 'Baby', 'Fashion']

export const AFFORDANCE: Record<string, { rec: string[]; sup: [string, string][] }> = {
  Beauty:     { rec: ['beforeafter', 'testimonial', 'review'], sup: [['petreaction', 'reaction ít hợp beauty'], ['turntable', 'sản phẩm cầm-được, không cần 360 tĩnh']] },
  Skincare:   { rec: ['beforeafter', 'review', 'testimonial'], sup: [['turntable', 'không cần 360 tĩnh']] },
  Pet:        { rec: ['petreaction', 'unboxing', 'demo'],      sup: [['beforeafter', 'pet khó thể hiện before-after tin cậy']] },
  Supplement: { rec: ['testimonial', 'review'],                sup: [['beforeafter', 'tránh before-after "kết quả", Meta reject health claims']] },
  Home:       { rec: ['demo', 'beforeafter', 'hero'],          sup: [['testimonial', 'home gadget yếu với testimonial đơn']] },
  Fitness:    { rec: ['testimonial', 'beforeafter'],           sup: [['petreaction', 'reaction đơn ít hợp']] },
  Baby:       { rec: ['testimonial', 'unboxing', 'petreaction'], sup: [] },
  Fashion:    { rec: [], sup: [['*', 'try-on / VTON desktop-heavy → DEFER (chưa trong bộ LOCK real-footage)']] },
}
