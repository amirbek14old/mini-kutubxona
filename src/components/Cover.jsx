import { useState, useEffect } from 'react'
import { paletteFor } from '../covers.js'

// Haqiqiy muqova bo'lsa — rasm; bo'lmasa yoki yuklanmasa — matndan generatsiya qilingan muqova
export default function Cover({ url, title, author, size = 'md', loading = false }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [url])

  const [from, to] = paletteFor(title || 'Kitob')

  return (
    <div className={`cover cover-${size}`}>
      {url && !failed ? (
        <img src={url} alt={`${title} muqovasi`} onError={() => setFailed(true)} />
      ) : (
        <div className="cover-generated" style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}>
          <span className="cover-title">{title || 'Kitob nomi'}</span>
          <span className="cover-author">{author || 'Muallif'}</span>
        </div>
      )}
      {loading && <div className="cover-loading">Qidirilmoqda…</div>}
    </div>
  )
}
