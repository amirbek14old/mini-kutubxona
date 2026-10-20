import { useEffect, useRef, useState } from 'react'
import BookForm from './components/BookForm.jsx'
import BookList from './components/BookList.jsx'
import ConfirmModal from './components/ConfirmModal.jsx'
import { loadBooks, saveBooks, generateId } from './storage.js'

export default function App() {
  const [books, setBooks] = useState(loadBooks)
  const [editingId, setEditingId] = useState(null)
  const [deletingBook, setDeletingBook] = useState(null)
  const [message, setMessage] = useState(null) // { text, type }
  const timer = useRef(null)
  const formRef = useRef(null)

  // Har bir o'zgarish localStorage'ga yoziladi
  useEffect(() => {
    if (!saveBooks(books)) showMessage('Ma’lumotni saqlab bo‘lmadi.', 'fail')
  }, [books])

  useEffect(() => () => clearTimeout(timer.current), [])

  function showMessage(text, type = 'success') {
    setMessage({ text, type })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(null), 3000)
  }

  const editingBook = books.find((b) => b.id === editingId) || null

  // CREATE / UPDATE
  function handleSubmit(data) {
    if (editingId) {
      setBooks((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...data } : b)))
      setEditingId(null)
      showMessage('Kitob ma’lumotlari saqlandi.')
    } else {
      setBooks((prev) => [{ id: generateId(), ...data }, ...prev])
      showMessage('Kitob muvaffaqiyatli qo‘shildi.')
    }
  }

  function handleEdit(id) {
    setEditingId(id)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleCancelEdit() {
    setEditingId(null)
    showMessage('Tahrirlash bekor qilindi.')
  }

  // DELETE (tasdiq bilan)
  function confirmDelete() {
    const id = deletingBook.id
    setBooks((prev) => prev.filter((b) => b.id !== id))
    if (editingId === id) setEditingId(null)
    setDeletingBook(null)
    showMessage('Kitob o‘chirildi.')
  }

  return (
    <div className="container">
      <header>
        <h1>MINI KUTUBXONA</h1>
        <p>Shaxsiy kitoblar ro‘yxati</p>
      </header>

      <div className="layout">
        <section className="panel" ref={formRef}>
          <h2>{editingBook ? 'Kitobni tahrirlash' : 'Yangi kitob qo‘shish'}</h2>
          {message && (
            <div className={`message ${message.type}`} role="status">
              {message.text}
            </div>
          )}
          <BookForm
            key={editingId || 'new'}
            initial={editingBook}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            onInvalid={() => showMessage('Iltimos, majburiy maydonlarni to‘g‘ri to‘ldiring.', 'fail')}
          />
        </section>

        <section className="panel">
          <div className="list-head">
            <h2>Kitoblar ro‘yxati</h2>
            {books.length > 0 && <span className="count">{books.length} ta kitob</span>}
          </div>
          <BookList
            books={books}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={(id) => setDeletingBook(books.find((b) => b.id === id))}
          />
        </section>
      </div>

      {deletingBook && (
        <ConfirmModal
          title="Kitobni o‘chirish"
          text={`“${deletingBook.title}” kitobini o‘chirishni xohlaysizmi?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingBook(null)}
        />
      )}
    </div>
  )
}
