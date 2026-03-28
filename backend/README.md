# Backend (Express + Prisma)

Серверная часть: REST API, JWT в cookie, Prisma + PostgreSQL, валидация Zod, real-time события Socket.IO (тикеты).

## Запуск

```bash
cp .env.example .env
npm ci
npx prisma migrate dev
npm run dev
```

Production-сборка: `npm run build`, старт: `npm start` (точка входа `dist/server.js`).

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | Строка подключения PostgreSQL |
| `JWT_ACCESS_SECRET` | Секрет подписи access-токена |
| `JWT_REFRESH_SECRET` | Секрет подписи refresh-токена |
| `PORT` | Порт HTTP/Socket.IO (по умолчанию в коде конфигурации — 3001, если не задан) |
| `NODE_ENV` | `development` / `production` |

Файл-пример: [.env.example](.env.example).

## API Endpoints (префикс `/api`)

### Auth (`/api/auth`)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/register` | Регистрация |
| POST | `/login` | Вход, выдача токенов |
| POST | `/refresh` | Обновление access по refresh |
| GET | `/me` | Текущий пользователь (защищено) |
| PATCH | `/profile` | Обновление профиля (защищено) |
| POST | `/change-password` | Смена пароля (защищено) |
| POST | `/logout` | Выход (защищено) |

### Товары (`/api/goods`)

CRUD и список; создание/изменение/удаление — роли менеджер (2) и администратор (3).

### Корзина (`/api/basket`)

Просмотр, добавление, изменение количества, удаление позиций, очистка (аутентифицированный пользователь).

### Заказы (`/api/orders`)

Создание, «мои заказы», детали; смена статуса и список всех — для ролей 2 и 3.

### Избранное (`/api/saves`)

Список, проверка по `goodId`, добавление, удаление по `goodId`.

### Отзывы (`/api/reviews`)

По товару, создание, проверка «оставлял ли пользователь отзыв».

### Категории (`/api/categories`)

Список, по id, товары категории; админские POST/PUT/DELETE и привязка товаров — роль администратора (3).

### Тикеты (`/api/tickets`)

Список, создание, сообщения, закрытие (аутентифицированный пользователь).

### Персонал (`/api/staff`)

Управление сотрудниками и ролями — только администратор (3).

Сводка маршрутов в коде: [src/routes/index.ts](src/routes/index.ts).

## Security

- **JWT:** access и refresh; access проверяется в middleware `authenticateToken` (чтение cookie, верификация через `jsonwebtoken` и секрет из `config/env`).
- **Аутентификация:** после `authenticateToken` в `req` доступен объект пользователя или `null`; цепочка `requireAuth` возвращает 401, если пользователь не найден.
- **Типизация:** для обработчиков, где нужен гарантированно заполненный пользователь, используется интерфейс **`AuthenticatedRequest`** ([src/types/auth.ts](src/types/auth.ts)) и приведение `req as AuthenticatedRequest` в контроллерах и middleware ролей.
- **Роли:** `authorizeRoles(...roleIDs)` проверяет `roleID` пользователя из БД (403 при недостаточных правах).
- **HTTP:** Helmet, CORS с учётом credentials, ограничение размера JSON.

Схемы валидации входящих тел запросов (например, auth) — в `src/validators/` на **Zod**; ошибки `ZodError` приводятся к ответу клиента в [middleware/errorHandler.ts](src/middleware/errorHandler.ts).

## Database (Prisma)

- Схема: [prisma/schema.prisma](prisma/schema.prisma).
- Основные сущности: `User`, `Role`, `Token`, `Good`, `ProductImage`, `Category`, `Basket` / `BasketItem`, `Order` / `OrderItem`, `Save`, `Reviews`, `Ticket`, `Message`.

### Миграции

После изменения `schema.prisma`:

```bash
npx prisma migrate dev --name описание_изменения
```

Применить существующие миграции на чистой БД:

```bash
npx prisma migrate deploy
```

Генерация клиента (в CI выполняется перед `tsc`):

```bash
npx prisma generate
```

Опционально: `npx prisma studio` — GUI для данных.

## Тесты

```bash
JWT_ACCESS_SECRET=test JWT_REFRESH_SECRET=test DATABASE_URL="postgresql://user:pass@localhost:5432/db" npm test
```

Используются **Jest**, **Supertest** и мок Prisma (`jest-mock-extended`). В CI переменные задаются в workflow.
