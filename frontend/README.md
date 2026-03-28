# Frontend (React + Vite)

Одностраничное приложение: витрина, корзина, заказы, профиль, категории (в т.ч. админ-режим), тикеты.

## Запуск

```bash
npm ci
npm run dev
```

Сборка: `npm run build`, превью: `npm run preview`.

## State management (Zustand)

Глобальный стор сессии: [src/store/useUserContext.jsx](src/store/useUserContext.jsx).

- **`user`** — публичные данные пользователя или `null`.
- **`isInitialized`** — завершена ли первичная проверка (`restoreAuth`).
- **`login` / `logout` / `restoreAuth`** — работа с API и `localStorage` (access-токен при логине).
- **`setUserPublic`** — точечное обновление пользователя после успешного PATCH профиля.

Доступ из компонентов: `const { user, login, logout } = useStore()` (или другие поля по необходимости).

## Валидация и формы

### Общий подход

- **Чистые функции** в [src/utils/validators/auth.validator.js](src/utils/validators/auth.validator.js): проверка email через **регулярное выражение** (`EMAIL_REGEX`), правила профиля и пароля, разбор ошибок API (`formatServerError` для ответов с `fieldErrors` от Zod на бэкенде).
- **Кастомные хуки** связывают локальный state формы, клиентскую валидацию и `fetch`:
  - [useProfileForm.js](src/hooks/useProfileForm.js) — имя и email, дублирование части правил рядом с вызовом API для явных сообщений; общие константы импортируются из валидатора.
  - [usePasswordForm.js](src/hooks/usePasswordForm.js) — текущий и новый пароль; перед отправкой вызывается `validatePasswordClient`.

На клиенте **Zod не подключён**; серверная валидация строится на Zod (см. backend README). Тесты валидатора: `src/tests/unit/auth.validator.test.js` (Vitest).

## Компоненты и структура каталогов

```
src/
├── api/           # Обёртки над fetch по доменам
├── assets/
├── components/    # Переиспользуемые UI-блоки (Card, Basket, Category, OrderList, …)
├── hooks/         # Логика данных и форм
├── pages/         # Экраны маршрутизатора
├── store/         # Zustand
├── tests/         # setup, unit, integration
├── utils/         # apiBase, validators, навигация
└── main.jsx
```

### Модальные окна

Паттерн **локального state строки-режима** на странице (пример — [pages/Profile/Profile.jsx](src/pages/Profile/Profile.jsx)):

- `const [modal, setModal] = useState(null)` — значения вроде `'profile' | 'password' | null`.
- Оверлей с `onClick={closeModal}`, контент модалки с `stopPropagation`, чтобы клик по форме не закрывал окно.
- Перед открытием вызывается `reset()` соответствующего хука формы, чтобы подставить актуальные данные пользователя и сбросить ошибки.

Так UI остаётся декларативным, а вся сеть и валидация сосредоточены в хуках.

## Качество кода

| Команда | Назначение |
|---------|------------|
| `npm run lint` | ESLint (в т.ч. React Hooks) |
| `npm run test:run` | Vitest без watch |
| `npm run test:coverage` | Покрытие |

Конфигурация тестов: [vite.config.js](vite.config.js) (`setupFiles: src/tests/setup.js`).
