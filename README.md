#  Store

Интернет-магазин.

## Технологии

**Frontend:**
- React 18 + Vite
- React Router DOM
- Zustand (state management)
- CSS (BEM)

**Backend:**
- Node.js + Express (TypeScript)
- Prisma ORM
- PostgreSQL
- JWT (HttpOnly cookies)
- bcryptjs

## Установка

### Требования
- Node.js 18+
- PostgreSQL 14+

### Backend
```bash
cd backend
npm install

# Настройте .env файл
cp .env.example .env

# Примените миграции
npx prisma migrate dev

# Запуск
npm run dev
```

### Frontend
```bash
cd frontend
npm install

# Запуск
npm run dev
```

## Переменные окружения

**backend/.env:**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/bestgames"
JWT_ACCESS_SECRET="your-secret"
JWT_REFRESH_SECRET="your-secret"
PORT=3000
NODE_ENV=development
```

## Структура проекта

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── create-admin.ts
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── utils/
│       ├── app.ts
│       └── server.ts
│
└── frontend/
    └── src/
        ├── api/
        ├── assets/
        ├── components/
        ├── pages/
        ├── store/
        ├── utils/
        └── main.jsx
```

## API Endpoints

**Auth:**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/refresh

**Products:**
- GET /api/goods
- GET /api/goods/:id
- POST /api/goods (admin)
- PUT /api/goods/:id (admin)
- DELETE /api/goods/:id (admin)

**Basket:**
- GET /api/basket
- POST /api/basket/add-good
- PUT /api/basket/update-good/:id
- DELETE /api/basket/delete-good/:id

**Orders:**
- GET /api/orders/my
- GET /api/orders (manager+)
- POST /api/orders
- PUT /api/orders/:id/status (manager+)
- DELETE /api/orders/:id/cancel

## Роли пользователей

- **User (roleID: 1)** - просмотр товаров, корзина, заказы, отзывы
- **Manager (roleID: 2)** - все функции пользователя + просмотр всех заказов
- **Admin (roleID: 3)** - все функции менеджера + управление товарами

## Безопасность

- JWT токены хранятся в HttpOnly cookies
- Access token: 15 минут
- Refresh token: 7 дней
- Пароли хешируются через bcrypt
- Все API запросы используют credentials: 'include'

## Разработка

```bash
# Backend (TypeScript)
npm run dev

# Frontend (Vite)
npm run dev

# Prisma Studio (GUI для БД)
npx prisma studio
```
