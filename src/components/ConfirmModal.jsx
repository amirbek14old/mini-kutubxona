import { useEffect, useRef } from 'react'

export default function ConfirmModal({ title, text, onConfirm, onCancel }) {
  const cancelRef = useRef(null)

  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h3 id="confirm-title">{title}</h3>
        <p>{text}</p>
        <div className="form-actions">
          <button ref={cancelRef} className="btn btn-secondary" onClick={onCancel}>
            Bekor qilish
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            O‘chirish
          </button>
        </div>
      </div>
    </div>
  )
}
