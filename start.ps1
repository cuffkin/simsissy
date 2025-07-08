# PowerShell скрипт для запуска SissyLifeSim

# Установка заголовка консоли
$Host.UI.RawUI.WindowTitle = "SissyLifeSim - Development Server"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host "     SissyLifeSim - Development Server" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Запуск локального сервера разработки..." -ForegroundColor Green
Write-Host ""
Write-Host "Проект будет доступен по адресу:" -ForegroundColor Yellow
Write-Host "http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Для остановки сервера нажмите Ctrl+C" -ForegroundColor Red
Write-Host ""
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host ""

# Проверка наличия Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js найден: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js не найден. Установите Node.js для запуска проекта." -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

# Проверка наличия npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm найден: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm не найден. Установите npm для запуска проекта." -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

# Проверка наличия node_modules
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🚀 Запуск сервера разработки..." -ForegroundColor Green
Write-Host ""

# Запуск dev сервера
npm run dev 