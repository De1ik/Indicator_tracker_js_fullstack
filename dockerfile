# Используем Node.js версии 23
FROM node:23

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY backend/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код бэкенда в контейнер
COPY backend/ .

# Устанавливаем переменную окружения для порта
ENV PORT=8080

# Указываем команду для запуска приложения
CMD ["node", "server.js"]
