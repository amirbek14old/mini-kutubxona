# Mini Kutubxona (React)

Shaxsiy kitoblar ro‘yxati — CRUD, localStorage.

## Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda terminal ko‘rsatgan manzilni oching (odatda http://localhost:5173).

## Tuzilma

- `src/App.jsx` — asosiy holat va CRUD mantiq
- `src/components/BookForm.jsx` — qo‘shish / tahrirlash formasi
- `src/components/BookList.jsx`, `BookCard.jsx` — ro‘yxat
- `src/components/ConfirmModal.jsx` — o‘chirishni tasdiqlash
- `src/storage.js` — localStorage bilan ishlash

## Muqovalar

Kitob nomi yozilganda ilova [Open Library](https://openlibrary.org) orqali haqiqiy muqovani qidiradi
(`src/covers.js`). Topilmasa, nomdan sun’iy intellekt rasm chizadi ([Pollinations](https://pollinations.ai), kalit kerak emas).
Internet bo‘lmasa, nom va muallifdan rangli muqova ko‘rsatiladi (`src/components/Cover.jsx`).
