// Real poster images live in public/posters/<name>.jpg (license-safe Pexels, self-hosted).
// The scrim gradient keeps white labels + the play glyph legible over any photo.
const BASE = import.meta.env.BASE_URL
export const poster = (name: string) =>
  `linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.52)), url(${BASE}posters/${name}.jpg) center/cover`

// License-safe sample clips in public/clips/<name>.mp4 (Pexels). Preview only.
export const clip = (name: string) => `${BASE}clips/${name}.mp4`

