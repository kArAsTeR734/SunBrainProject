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
├── SunBrainFrontend/       # React-приложение
├── SunBrainBackend/        # REST API и серверная бизнес-логика
│   ├── scripts/            # Вспомогательные скрипты
│   └── src/
│       ├── controllers/    # Обработчики HTTP-запросов
│       ├── middleware/     # Авторизация, валидация и загрузка файлов
│       ├── models/         # Работа с данными PostgreSQL
│       ├── routes/         # Маршруты API
│       └── services/       # Бизнес-логика и интеграция с ИИ
├── SunBrain_dev.backup     # Резервная копия базы для разработки
├── docker-compose-dev.yml  # Окружение разработки
├── docker-compose.yml      # Production-окружение
└── Makefile                # Команды управления проектом
```

## Быстрый запуск через Docker

### Требования

- Docker Desktop с поддержкой Docker Compose;
- `make` — необязательно, но упрощает запуск и восстановление базы.

### 1. Настройте backend

Создайте файл `SunBrainBackend/.env`:

```dotenv
NODE_ENV=development
PORT=5000

DB_HOST=db
DB_PORT=5432
DB_NAME=SunBrain_dev
DB_USER=postgres
DB_PASSWORD=root

JWT_ACCESS_SECRET=replace-with-a-long-random-string
JWT_REFRESH_SECRET=replace-with-another-long-random-string
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

CORS_ORIGIN=http://localhost:3000

# Необязательно: требуется только для генерации заданий через ИИ
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
```

Не добавляйте `.env` и реальные секреты в репозиторий.

### 2. Создайте том PostgreSQL

Compose-конфигурация использует внешний Docker-том, поэтому перед первым запуском создайте его:

```bash
docker volume create sunbrainproject_postgres18_data
```

### 3. Запустите приложение

С помощью Makefile:

```bash
make dev
```

Или напрямую через Docker Compose:

```bash
docker compose -p sunbrain_dev -f docker-compose-dev.yml up -d --build
```

### 4. Восстановите тестовые данные

Для работы каталога, тестов и домашних заданий восстановите базу из `SunBrain_dev.backup`:

```bash
make restore-db
```

После запуска доступны:

- frontend: [http://localhost:3000](http://localhost:3000);
- backend API: [http://localhost:5000](http://localhost:5000);
- проверка состояния backend: [http://localhost:5000/health](http://localhost:5000/health).

## Локальный запуск без Docker

Потребуются Node.js 22, npm и PostgreSQL. Python 3 используется дополнительным нормализатором текста заданий; если Python недоступен, backend автоматически применяет JavaScript-реализацию.

### Backend

1. Создайте базу `SunBrain_dev` и при необходимости восстановите в неё `SunBrain_dev.backup` с помощью `pg_restore`.
2. Создайте `SunBrainBackend/.env` по примеру выше, заменив `DB_HOST=db` на `DB_HOST=localhost`.
3. Установите зависимости и запустите сервер:

```bash
cd SunBrainBackend
npm ci
npm run dev
```

### Frontend

При необходимости создайте `SunBrainFrontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000
VITE_RUN=development
```

Затем запустите клиент:

```bash
cd SunBrainFrontend
npm ci
npm run dev
```

## Полезные команды

Команды выполняются из корня проекта:

| Команда | Назначение |
| --- | --- |
| `make dev` | Запустить dev-окружение |
| `make build` | Пересобрать frontend и backend |
| `make restore-db` | Восстановить базу из резервной копии |
| `make ps` | Показать состояние контейнеров |
| `make logs` | Открыть логи всех сервисов |
| `make logs-backend` | Открыть логи backend |
| `make logs-frontend` | Открыть логи frontend |
| `make logs-db` | Открыть логи PostgreSQL |
| `make down` | Остановить dev-окружение |
| `make restart` | Перезапустить dev-окружение |

Проверки frontend выполняются из каталога `SunBrainFrontend`:

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

Перед production-запуском:

1. задайте безопасные значения в `SunBrainBackend/.env.production`;
2. укажите публичный адрес API в аргументе `VITE_API_URL` файла `docker-compose.yml`;
3. убедитесь, что внешний том `sunbrainproject_postgres18_data` создан и содержит актуальную базу.

Запуск:

```bash
docker compose -p sunbrain_prod -f docker-compose.yml up -d --build
```

Production frontend работает через Nginx на порту `3000`, backend — на порту `5000`.
