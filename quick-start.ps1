# 의료 진단 플랫폼 - 빠른 시작 스크립트
# 사용법: .\quick-start.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  의료 진단 플랫폼 빠른 시작" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot

# 1. 백엔드 의존성 설치
Write-Host "`n[1/3] 백엔드 의존성 설치..." -ForegroundColor Yellow
Set-Location "$rootDir\backend"
if (-not (Test-Path "node_modules")) { npm install }
Write-Host "  완료!" -ForegroundColor Green

# 2. 환자 포털 의존성 설치
Write-Host "`n[2/3] 환자 포털 의존성 설치..." -ForegroundColor Yellow
Set-Location "$rootDir\patient-portal"
if (-not (Test-Path "node_modules")) { npm install }
Write-Host "  완료!" -ForegroundColor Green

# 3. 관리자 대시보드 의존성 설치
Write-Host "`n[3/3] 관리자 대시보드 의존성 설치..." -ForegroundColor Yellow
Set-Location "$rootDir\admin-dashboard"
if (-not (Test-Path "node_modules")) { npm install }
Write-Host "  완료!" -ForegroundColor Green

# 서버 시작
Write-Host "`n====================================" -ForegroundColor Cyan
Write-Host "  모든 의존성 설치 완료!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "`n서버 시작:" -ForegroundColor Yellow
Write-Host "  .\start-server.ps1" -ForegroundColor White
Write-Host "`n접속 URL:" -ForegroundColor Yellow
Write-Host "  환자 포털:         http://localhost:3000" -ForegroundColor White
Write-Host "  관리자 대시보드:  http://localhost:3001" -ForegroundColor White
Write-Host "  백엔드 API:       http://localhost:5000" -ForegroundColor White

Set-Location $rootDir
