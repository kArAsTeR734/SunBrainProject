# SunBrain

SunBrain — образовательная веб-платформа для подготовки школьников к ОГЭ и ЕГЭ по математике и физике. Приложение объединяет каталог заданий, проверку знаний, домашние работы, календарь занятий, профиль ученика и рейтинг. По результатам тестирования платформа может формировать персональные задания с помощью ИИ.

## Возможности

- регистрация и авторизация пользователей с JWT;
- каталог предметов, тем и экзаменационных заданий;
- диагностические тесты и разбор результатов;
- домашние работы с решениями и проверкой ответов;
- календарь заданий;
- профиль пользователя, загрузка аватара и таблица лидеров;
- генерация персональных домашних работ через DeepSeek API;
- отображение математических формул с помощью KaTeX.

## Технологии

### Frontend

- React 18 и TypeScript;
- Vite;
- React Router;
- Redux Toolkit;
- TanStack Query;
- Axios;
- React Hook Form;
- Material UI и SCSS Modules;
- Feature-Sliced Design.

### Backend

- Node.js 22;
- Express 5;
- PostgreSQL;
- JWT, bcrypt и cookie-parser;
- Multer для загрузки файлов;
- OpenAI-совместимый SDK для обращения к DeepSeek API.

### Инфраструктура

- Docker и Docker Compose;
- Nginx для production-сборки frontend;
- Makefile с командами управления окружением.

## Структура проекта

```text
SunBrainProject/
├── sun-brain-frontend/       # React-приложение
├── sun-brain-backend/        # REST API и серверная бизнес-логика
│   ├── scripts/            # Вспомогательные скрипты
│   └── src/
│       ├── controllers/    # Обработчики HTTP-запросов
│       ├── middleware/     # Авторизация, валидация и загрузка файлов
│       ├── models/         # Работа с данными PostgreSQL
│       ├── routes/         # Маршруты API
│       └── services/       # Бизнес-логика и интеграция с ИИ
├── docker-compose-dev.yml  # Окружение разработки
├── docker-compose.yml      # Production-окружение
└── Makefile                # Команды управления проектом
```

## Быстрый запуск через Docker

Требуются Docker Desktop с Docker Compose и `make`. Убедитесь, что Docker запущен, затем из корня проекта выполните:

```bash
make start
```

Команда собирает и запускает PostgreSQL, backend и frontend. Compose создаёт постоянный том базы; backend дожидается готовности PostgreSQL и применяет миграции Prisma перед запуском. Frontend запускается после проверки готовности backend. Без `make` используйте:

```bash
docker compose -p sunbrain_dev -f docker-compose-dev.yml up -d --build
```

Доступны frontend на [http://localhost:3000](http://localhost:3000), backend на [http://localhost:5000](http://localhost:5000) и [проверка backend](http://localhost:5000/health).

При первом запуске миграции создают таблицы и добавляют в каталог 36 авторских заданий с ответами и решениями по математике и физике для ОГЭ и ЕГЭ. В каждом из четырёх разделов по три темы. Для просмотра карточек зарегистрируйтесь и войдите в аккаунт. Стартового набора достаточно для практики по темам, а для полного диагностического теста потребуется больше заданий.

Для необязательной настройки backend создайте `sun-brain-backend/.env`. Например, `DEEPSEEK_API_KEY` нужен для существующей функции генерации. Для локальной разработки без этого файла приложение использует настройки по умолчанию; JWT-ключи по умолчанию предназначены только для разработки. Для генерации задайте собственный ключ, а для публичного развёртывания — безопасные JWT-ключи. Не сохраняйте секреты в Git.

### Миграции и существующая база

Структура находится в `sun-brain-backend/prisma/schema.prisma`, история миграций — в `sun-brain-backend/prisma/migrations`. Исходная миграция восстановлена из схемы прежней базы, включая SQL-объекты, которые Prisma не описывает в модели. Для новых изменений создавайте миграции через `npx prisma migrate dev --name <name>` из каталога backend с `DATABASE_URL` для отдельной базы разработки. Команда запуска автоматически применяет готовые миграции через `prisma migrate deploy`.

Если в существующем томе уже есть таблицы без истории Prisma, автоматическая миграция остановится с ошибкой, не удаляя данные. Перед подключением такой базы сохраните резервную копию и сравните её схему с исходной миграцией. Только если схемы совпадают, отметьте исходную миграцию применённой командой `npx prisma migrate resolve --applied 20261110000000_initial` с правильным `DATABASE_URL`; затем запустите проект снова. Не отмечайте миграцию применённой для непроверенной базы.

## Локальный запуск без Docker

Потребуются Node.js 22, npm и PostgreSQL. Python 3 используется дополнительным нормализатором текста заданий; если Python недоступен, backend автоматически применяет JavaScript-реализацию.

### Backend

1. Создайте пустую базу `SunBrain_dev` в PostgreSQL.
2. Создайте `sun-brain-backend/.env` с настройками подключения `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, а также `DATABASE_URL` для Prisma, например `postgresql://postgres:root@localhost:5432/SunBrain_dev?schema=public`. При необходимости задайте JWT-ключи и `DEEPSEEK_API_KEY`.
3. Установите зависимости и запустите сервер:

```bash
cd sun-brain-backend
npm ci
npm run migrate:deploy
npm run dev
```

### Frontend

При необходимости создайте `sun-brain-frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000
VITE_RUN=development
```

Затем запустите клиент:

```bash
cd sun-brain-frontend
npm ci
npm run dev
```

## Полезные команды

Команды выполняются из корня проекта:

| Команда | Назначение |
| --- | --- |
| `make start` | Собрать и запустить dev-окружение; `make dev` — тот же запуск |
| `make build` | Пересобрать frontend и backend |
| `make ps` | Показать состояние контейнеров |
| `make logs` | Открыть логи всех сервисов |
| `make logs-backend` | Открыть логи backend |
| `make logs-frontend` | Открыть логи frontend |
| `make logs-db` | Открыть логи PostgreSQL |
| `make down` | Остановить dev-окружение |
| `make restart` | Перезапустить dev-окружение |

Проверки frontend выполняются из каталога `sun-brain-frontend`:

```bash
npm run lint
npm run format:check
npm run steiger
npm run build
```

## API

Основные группы маршрутов backend:

| Префикс | Назначение |
| --- | --- |
| `/api/auth` | Регистрация, вход, обновление токенов и выход |
| `/api/profile` | Профиль пользователя и аватар |
| `/api/topics` | Предметы и темы |
| `/api/tasks` | Каталог и проверка заданий |
| `/api/test` | Диагностические тесты |
| `/api/homework` | Домашние работы |
| `/api/leaderboard` | Рейтинг пользователей |
| `/api/ai` | Генерация заданий через ИИ |

Защищённые маршруты ожидают access-токен в заголовке:

```http
Authorization: Bearer <access_token>
```

## Production

Production-конфигурация поддерживается отдельно от dev-запуска: миграции нужно применить к production-базе самостоятельно перед запуском backend. Перед production-запуском:

1. задайте безопасные значения в `sun-brain-backend/.env.production`;
2. укажите публичный адрес API в аргументе `VITE_API_URL` файла `docker-compose.yml`;
3. убедитесь, что внешний том `sunbrainproject_postgres18_data` создан и содержит актуальную базу.

Запуск:

```bash
docker compose -p sunbrain_prod -f docker-compose.yml up -d --build
```

Production frontend работает через Nginx на порту `3000`, backend — на порту `5000`.
