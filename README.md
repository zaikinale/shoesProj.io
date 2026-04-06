![CI Status](https://github.com/zaikinale/e7d/actions/workflows/ci.yml/badge.svg)

# E7D - интернет-магазин и лояльность

Монорепозиторий клиент–сервер: каталог обуви, корзина, заказы, избранное, отзывы, категории, тикеты поддержки в реальном времени (Socket.IO) и роли пользователей (клиент, менеджер, администратор).

## Технологический стек

| Слой | Технологии |
|------|------------|
| **Frontend** | React 18, Vite, React Router, Zustand, CSS Modules / BEM, Vitest, Testing Library, MSW |
| **Backend** | Node.js, **Express 5** (TypeScript), Prisma ORM, PostgreSQL, Zod, JWT (access/refresh), bcrypt, Helmet, Socket.IO |

> На бэкенде используется **Express**, а не FastAPI — весь HTTP API реализован на Node.js.

## Архитектура

- **Монорепозиторий:** каталоги `frontend/` и `backend/` с отдельными `package.json` и зависимостями.
- **Клиент–сервер:** SPA на Vite обращается к REST API под префиксом `/api`; для тикетов дополнительно используется WebSocket.
- **Frontend:** формы и запросы инкапсулированы в **кастомных хуках** (`useProfileForm`, `usePasswordForm`, `useCategories` и др.), глобальное состояние сессии — **Zustand** (`src/store/useUserContext.jsx`).
- **Backend:** маршруты Express, контроллеры и сервисы; типизация запросов с **`AuthenticatedRequest`** для защищённых эндпоинтов; валидация входных данных через **Zod** и централизованный `errorHandler`.

Подробности по API и безопасности — в [backend/README.md](backend/README.md). По фронтенду — в [frontend/README.md](frontend/README.md).

## Требования

- Node.js 20+ (LTS)
- Docker и Docker Compose (для PostgreSQL) **или** локально установленный PostgreSQL 14+

## Быстрый старт

### 1. База данных (Docker)

Из корня репозитория:

```bash
docker compose up -d
```

Строка подключения для `backend/.env`:

```env
DATABASE_URL="postgresql://e7d:e7d@localhost:5432/e7ddb"
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Укажите DATABASE_URL и секреты JWT в .env

npm ci
npx prisma migrate dev
npm run dev
```

HTTP API и Socket.IO поднимаются через `src/server.ts`; порт задаётся `PORT` в `.env` (см. `backend/src/config/env.ts` и `server.ts`).

### 3. Frontend

```bash
cd frontend
npm ci
npm run dev
```

Vite dev-server: `http://localhost:5173`. В `frontend` при необходимости задайте прокси или базовый URL API в конфигурации проекта (см. `src/utils/apiBase`).

## Скрипты качества (локально)

| Команда | Где | Назначение |
|---------|-----|------------|
| `npm run lint` | `frontend/` | ESLint |
| `npm run test:run` | `frontend/` | Vitest (unit/integration) |
| `npm run build` | `frontend/`, `backend/` | Production-сборка |
| `npm test` | `backend/` | Jest + Supertest |

При пуше в ветку `main` те же шаги выполняются в **GitHub Actions** (файл [.github/workflows/ci.yml](.github/workflows/ci.yml)).
