import { STATUSES } from '../constants.js'
import Cover from './Cover.jsx'
import { aiCoverUrl } from '../covers.js'

const STATUS_CLASS = {
  [STATUSES[0]]: 'status-todo',
  [STATUSES[1]]: 'status-reading',
  [STATUSES[2]]: 'status-done',
}

export default function BookCard({ book, isEditing, onEdit, onDelete }) {
  return (
    <article className={`book ${isEditing ? 'editing' : ''}`}>
      <Cover
        url={book.coverUrl || aiCoverUrl(book.title)}
        type={book.coverUrl ? book.coverType || 'real' : 'ai'}
        title={book.title}
        author={book.author}
        size="sm"
      />
      <div className="book-body">
        <div className="book-info">
          <div className="book-title">{book.title}</div>
          <div className="book-author">{book.author}</div>
          <div className="tags">
            <span className="tag">{book.genre}</span>
            <span className={`tag ${STATUS_CLASS[book.status] || ''}`}>{book.status}</span>
          </div>
        </div>
        <div className="book-actions">
          <button className="btn btn-secondary btn-sm" onClick={onEdit}>
            Tahrirlash
          </button>
          <button className="btn btn-danger btn-sm" onClick={onDelete}>
            O‘chirish
          </button>
        </div>
      </div>
    </article>
  )
}
