# 의료 진단 플랫폼 - 서버 시작 스크립트
# 사용법: .\start-server.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  의료 진단 플랫폼 서버 시작" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# 백엔드 서버 시작
Write-Host "`n백엔드 서버를 시작합니다..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\backend"

# 환경 변수 확인
if (Test-Path ".env") {
    Write-Host ".env 파일 확인됨" -ForegroundColor Green
} else {
    Write-Host ".env 파일이 없습니다! backend/.env 를 생성하세요." -ForegroundColor Red
    exit 1
}

# 의존성 설치 확인
if (-not (Test-Path "node_modules")) {
    Write-Host "의존성 설치 중..." -ForegroundColor Yellow
    npm install
}

# 서버 실행
Write-Host "`n서버 시작 중... (http://localhost:5000)" -ForegroundColor Green
node server.js
