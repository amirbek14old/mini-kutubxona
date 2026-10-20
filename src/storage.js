const STORAGE_KEY = 'mini-kutubxona-books'

export function loadBooks() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function saveBooks(books) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
    return true
  } catch {
    return false
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
