# Используем Node.js как базовый образ
FROM node:14

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости фронтенда
COPY ./frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Копируем весь проект фронтенда
COPY ./frontend /app/frontend

# Проверяем содержимое public
RUN ls -la /app/frontend/public

# Сборка фронтенда
RUN npm run build

# Устанавливаем зависимости бэкенда
WORKDIR /app
COPY ./backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Создаём папку public для бэкенда и копируем сборку фронтенда
RUN mkdir -p /app/backend/public && cp -r /app/frontend/build/* /app/backend/public/

# Копируем фронтенд-сборку в бэкенд
# RUN cp -r /app/frontend/build/* /app/backend/public/

# Открываем порт 8080
EXPOSE 8080

# Запускаем сервер
CMD ["npm", "start"]
