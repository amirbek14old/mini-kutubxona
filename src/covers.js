// Open Library orqali kitob muqovasini qidirish (kalit talab qilinmaydi)
const cache = new Map()

export async function findCoverUrl(title, author, signal) {
  const key = `${title}|${author}`.toLowerCase()
  if (cache.has(key)) return cache.get(key)

  const params = new URLSearchParams({ title, limit: '1', fields: 'cover_i' })
  if (author) params.set('author', author)

  const res = await fetch(`https://openlibrary.org/search.json?${params}`, { signal })
  if (!res.ok) throw new Error('Qidiruv xatosi')
  const data = await res.json()
  const coverId = data.docs?.[0]?.cover_i
  const url = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null
  cache.set(key, url)
  return url
}

// Sarlavhaga qarab barqaror rang tanlash (generatsiya qilingan muqova uchun)
const PALETTES = [
  ['#1b2f4b', '#12908e'],
  ['#5b2a86', '#c0398a'],
  ['#8a3b12', '#e0892b'],
  ['#14532d', '#3fa66b'],
  ['#7f1d1d', '#d64545'],
  ['#1e3a8a', '#4f8ef7'],
  ['#3f3f46', '#a1a1aa'],
]
export function paletteFor(text) {
  let h = 0
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)) >>> 0
  return PALETTES[h % PALETTES.length]
}

// Sun'iy intellekt yordamida nomdan rasm yaratish (Pollinations — bepul, kalit talab qilinmaydi)
// Bir xil nom har doim bir xil rasm beradi (seed).
export function aiCoverUrl(title) {
  const text = (title || '').trim()
  if (!text) return null
  let seed = 0
  for (const ch of text.toLowerCase()) seed = (seed * 31 + ch.codePointAt(0)) % 1000000
  const prompt = `${text}, colorful book cover illustration, no text, no letters`
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=360&height=540&nologo=true&seed=${seed}`
}
