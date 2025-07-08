#!/bin/bash

# Заголовок терминала
echo "=========================================="
echo "     SissyLifeSim - Development Server"
echo "=========================================="
echo ""
echo "Запуск локального сервера разработки..."
echo ""
echo "Проект будет доступен по адресу:"
echo "http://localhost:5173"
echo ""
echo "Для остановки сервера нажмите Ctrl+C"
echo ""
echo "=========================================="
echo ""

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js для запуска проекта."
    exit 1
fi

# Проверка наличия npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не найден. Установите npm для запуска проекта."
    exit 1
fi

# Проверка наличия node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
fi

# Запуск dev сервера
npm run dev 