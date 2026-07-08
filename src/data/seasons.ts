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
  Beauty:     { rec: ['beforeafter', 'testimonial', 'review'], sup: [['petreaction', 'pet reactions do not fit beauty'], ['turntable', 'holdable product, no static 360 needed']] },
  Skincare:   { rec: ['beforeafter', 'review', 'testimonial'], sup: [['turntable', 'no static 360 needed']] },
  Pet:        { rec: ['petreaction', 'unboxing', 'demo'],      sup: [['beforeafter', 'pets rarely show a credible before-after']] },
  Supplement: { rec: ['testimonial', 'review'],                sup: [['beforeafter', 'avoid before-after "results", Meta rejects health claims']] },
  Home:       { rec: ['demo', 'beforeafter', 'hero'],          sup: [['testimonial', 'home gadgets are weak with a lone testimonial']] },
  Fitness:    { rec: ['testimonial', 'beforeafter'],           sup: [['petreaction', 'a lone reaction does not fit']] },
  Baby:       { rec: ['testimonial', 'unboxing', 'petreaction'], sup: [] },
  Fashion:    { rec: [], sup: [['*', 'try-on / VTON is desktop-heavy, deferred (not in the real-footage lock set)']] },
}
