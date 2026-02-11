# Simple Server Start Script

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Starting Servers" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
Write-Host "[1/4] Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    if ($mongoService.Status -ne 'Running') {
        Write-Host "   Starting MongoDB..." -ForegroundColor Gray
        Start-Service MongoDB
    }
    Write-Host "   MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "   MongoDB service not found" -ForegroundColor Yellow
}

Write-Host ""

# Start Backend Server
Write-Host "[2/4] Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm start"
Write-Host "   Backend: http://localhost:5000" -ForegroundColor Green

Write-Host ""

# Start Patient Portal
Write-Host "[3/4] Starting Patient Portal..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\patient-portal'; npm start"
Write-Host "   Patient Portal: http://localhost:3000" -ForegroundColor Green

Write-Host ""

# Start Admin Dashboard
Write-Host "[4/4] Starting Admin Dashboard..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\admin-dashboard'; npm start"
Write-Host "   Admin Dashboard: http://localhost:3001" -ForegroundColor Green

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "All Servers Started!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "   - Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "   - Patient Portal: http://localhost:3000" -ForegroundColor White
Write-Host "   - Admin Dashboard: http://localhost:3001" -ForegroundColor White
Write-Host ""

# Open Browser
$openBrowser = Read-Host "Open browser? (Y/n)"
if ($openBrowser -ne "n" -and $openBrowser -ne "N") {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:3000"
    Start-Process "http://localhost:3001"
}

Write-Host ""
Write-Host "To stop: Close each PowerShell window" -ForegroundColor Gray
