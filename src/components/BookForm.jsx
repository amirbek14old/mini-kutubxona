import { useEffect, useRef, useState } from 'react'
import { GENRES, STATUSES, EMPTY_FORM } from '../constants.js'
import { findCoverUrl, aiCoverUrl } from '../covers.js'
import Cover from './Cover.jsx'

export default function BookForm({ initial, onSubmit, onCancel, onInvalid }) {
  const isEditing = Boolean(initial)
  const [form, setForm] = useState(
    initial
      ? { title: initial.title, author: initial.author, genre: initial.genre, status: initial.status }
      : EMPTY_FORM
  )
  const [errors, setErrors] = useState({})
  // cover = { url, type: 'real' | 'ai' }
  const [cover, setCover] = useState(
    initial ? { url: initial.coverUrl || aiCoverUrl(initial.title), type: initial.coverType || 'ai' } : null
  )
  const [searching, setSearching] = useState(false)

  // Foydalanuvchi yozishni to'xtatgach (0.6s) muqovani qidirish
  useEffect(() => {
    const title = form.title.trim()
    const author = form.author.trim()
    if (title.length < 2) {
      setCover(null)
      setSearching(false)
      return
    }
    const controller = new AbortController()
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        // 1) haqiqiy muqova, topilmasa 2) AI rasm
        const real = await findCoverUrl(title, author, controller.signal)
        setCover(real ? { url: real, type: 'real' } : { url: aiCoverUrl(title), type: 'ai' })
      } catch (err) {
        if (err.name !== 'AbortError') setCover({ url: aiCoverUrl(title), type: 'ai' })
      } finally {
        if (!controller.signal.aborted) setSearching(false)
      }
    }, 600)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [form.title, form.author])
  const titleRef = useRef(null)
  const authorRef = useRef(null)

  useEffect(() => {
    if (isEditing) titleRef.current?.focus()
  }, [isEditing])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const title = form.title.trim()
    const author = form.author.trim()
    const newErrors = {}
    if (!title) newErrors.title = 'Kitob nomini kiriting (faqat bo‘sh joy qabul qilinmaydi).'
    if (!author) newErrors.author = 'Muallifni kiriting (faqat bo‘sh joy qabul qilinmaydi).'
    setErrors(newErrors)

    if (Object.keys(newErrors).length) {
      onInvalid()
      ;(newErrors.title ? titleRef : authorRef).current?.focus()
      return
    }

    // qidiruv tugamagan bo'lsa ham AI rasm saqlanadi
    const finalCover = !searching && cover ? cover : { url: aiCoverUrl(title), type: 'ai' }
    onSubmit({ ...form, title, author, coverUrl: finalCover.url, coverType: finalCover.type })
    setForm(EMPTY_FORM)
    setCover(null) // muvaffaqiyatli qo'shilgach forma tozalanadi
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="cover-preview">
        <Cover
          url={cover?.url}
          type={cover?.type}
          title={form.title.trim()}
          author={form.author.trim()}
          searching={searching}
        />
        <p className="hint">
          {searching
            ? 'Muqova qidirilmoqda…'
            : cover?.type === 'real'
              ? 'Haqiqiy muqova topildi'
              : cover?.type === 'ai'
                ? 'Rasm nomdan sun’iy intellekt yordamida yaratildi'
                : 'Kitob nomini yozing — rasm avtomatik yaratiladi'}
        </p>
      </div>

      <div className="field">
        <label htmlFor="title">Kitob nomi *</label>
        <input
          id="title"
          ref={titleRef}
          type="text"
          maxLength={120}
          placeholder="Masalan: O‘tkan kunlar"
          className={errors.title ? 'invalid' : ''}
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
        />
        <div className="error">{errors.title}</div>
      </div>

      <div className="field">
        <label htmlFor="author">Muallif *</label>
        <input
          id="author"
          ref={authorRef}
          type="text"
          maxLength={80}
          placeholder="Masalan: Abdulla Qodiriy"
          className={errors.author ? 'invalid' : ''}
          value={form.author}
          onChange={(e) => update('author', e.target.value)}
        />
        <div className="error">{errors.author}</div>
      </div>

      <div className="field">
        <label htmlFor="genre">Janr</label>
        <select id="genre" value={form.genre} onChange={(e) => update('genre', e.target.value)}>
          {GENRES.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="status">O‘qish holati</label>
        <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Saqlash' : 'Qo‘shish'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Bekor qilish
          </button>
        )}
      </div>
    </form>
  )
}
