// Real poster images live in public/posters/<name>.jpg (license-safe Pexels, self-hosted).
// The scrim gradient keeps white labels + the play glyph legible over any photo.
const BASE = import.meta.env.BASE_URL
export const poster = (name: string) =>
  `linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.52)), url(${BASE}posters/${name}.jpg) center/cover`
