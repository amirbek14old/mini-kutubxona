import BookCard from './BookCard.jsx'

export default function BookList({ books, editingId, onEdit, onDelete }) {
  if (books.length === 0) {
    return <div className="empty">Hozircha kitob qo‘shilmagan</div>
  }
  return (
    <div className="books">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isEditing={book.id === editingId}
          onEdit={() => onEdit(book.id)}
          onDelete={() => onDelete(book.id)}
        />
      ))}
    </div>
  )
}
