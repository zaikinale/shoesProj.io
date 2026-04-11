# E&D — Full-stack E-commerce Platform
[![CI](https://github.com/zaikinale/shoesProj.io/actions/workflows/ci.yml/badge.svg)](https://github.com/zaikinale/shoesProj.io/actions/workflows/ci.yml)

Современная платформа для онлайн-ритейла с архитектурой монорепозитория. Проект включает в себя полнофункциональный интернет-магазин, систему управления заказами, многоуровневую модель доступа (RBAC) и модуль техподдержки в реальном времени.

## Основные возможности

- **E-commerce Core:** Полный цикл покупки — каталог с фильтрацией по категориям, динамическая корзина, оформление заказов, избранное и система отзывов.
- **RBAC (Role-Based Access Control):** Три уровня доступа (`Client`, `Manager`, `Admin`) с физическим разделением прав на уровне UI и защитой эндпоинтов на стороне API.
- **Real-time Support:** Модуль тикетов на **Socket.IO** с поддержкой изолированных комнат, индикацией набора текста и мгновенным обменом сообщениями.
- **Security:** Авторизация через **JWT (Access/Refresh)** в HttpOnly Cookie, шифрование паролей через bcrypt и защита заголовков Helmet.
- **Data Integrity:** Строгая типизация схем БД через **Prisma ORM** и валидация всех входящих запросов с помощью **Zod**.

## Технологический стек

| Слой | Технологии |
|------|------------|
| **Frontend** | React 18, Vite, React Router 7, Zustand, CSS Modules / BEM |
| **Backend** | Node.js, Express 5, Prisma ORM, PostgreSQL, Socket.IO |
| **Testing** | Vitest, MSW (Frontend) / Jest, Supertest (Backend) |
| **DevOps** | Docker Compose, GitHub Actions (CI/CD) |

## Архитектура

Проект организован как **монорепозиторий**:

- **`/frontend`**: Single Page Application с упором на переиспользование логики. Бизнес-логика, формы и запросы инкапсулированы в **кастомных хуках**, а состояние сессии вынесено в облегченный стор **Zustand**.
- **`/backend`**: RESTful API с централизованной обработкой ошибок. Для тестирования используется подмена БД через `jest-mock-extended`, что позволяет прогонять тесты без привязки к рантайму PostgreSQL.

## Качество и CI/CD

В репозитории настроен автоматизированный пайплайн **GitHub Actions**, который выполняется при каждом пуше в ветку `main`:
1. **Linting:** Проверка статического анализатора (ESLint).
2. **Type Check:** Валидация типов данных TypeScript.
3. **Testing:** Запуск Unit и Integration тестов для фронтенда и бэкенда.
4. **Build:** Проверка корректности сборки артефактов.

## Быстрый старт

### Требования
- Node.js 20+ (LTS)
- Docker & Docker Compose

### 1. Подготовка и запуск БД
```bash
docker compose up -d
```

### 2. Настройка и запуск Backend
```bash

cd backend
cp .env.example .env
# Укажите DATABASE_URL и JWT секреты в .env
npm ci
npx prisma migrate dev
npm run dev
```

### 3. Настройка и запуск Frontend
```Bash

cd frontend
npm ci
npm run dev
```

## Структура проекта
```plaintext

├── frontend/     # SPA клиентское приложение
├── backend/      # REST API и WebSocket сервер
├── docker-compose.yml
└── .github/      # Конфигурация CI/CD пайплайнов
```