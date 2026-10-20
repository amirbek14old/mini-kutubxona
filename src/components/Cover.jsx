import { useState, useEffect } from 'react'
import { paletteFor } from '../covers.js'

// Qatlamlar: 1) nomdan rangli muqova (doim), 2) ustida rasm (yuklangach ko'rinadi),
// 3) AI rasm bo'lsa — pastida nom yozuvi.
export default function Cover({ url, type, title, author, size = 'md', searching = false }) {
  const [state, setState] = useState('loading') // loading | loaded | failed
  useEffect(() => setState(url ? 'loading' : 'failed'), [url])

  const [from, to] = paletteFor(title || 'Kitob')
  const showImg = url && state === 'loaded'

  return (
    <div className={`cover cover-${size}`}>
      <div className="cover-generated" style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}>
        <span className="cover-title">{title || 'Kitob nomi'}</span>
        <span className="cover-author">{author || 'Muallif'}</span>
      </div>

      {url && state !== 'failed' && (
        <img
          src={url}
          alt={`${title} muqovasi`}
          className={showImg ? 'visible' : ''}
          onLoad={() => setState('loaded')}
          onError={() => setState('failed')}
        />
      )}

      {showImg && type === 'ai' && (
        <div className="cover-caption">
          <span className="cover-title">{title}</span>
          <span className="cover-author">{author}</span>
        </div>
      )}

      {size === 'md' && (searching || (url && state === 'loading')) && (
        <div className="cover-loading">
          <span className="spinner" />
          {searching ? 'Qidirilmoqda…' : type === 'ai' ? 'Rasm chizilmoqda…' : 'Yuklanmoqda…'}
        </div>
      )}
    </div>
  )
}
