# 의료 진단 플랫폼 - 서버 시작 스크립트

param(
    [switch]$Production,
    [switch]$Dev
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  의료 진단 플랫폼 서버 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 프로젝트 루트 디렉토리
$rootDir = $PSScriptRoot

# 모드 확인
$mode = if ($Production) { "production" } else { "development" }
Write-Host "🚀 모드: $mode" -ForegroundColor Cyan
Write-Host ""

# 1. MongoDB 서비스 확인
Write-Host "1. MongoDB 서비스 확인 중..." -ForegroundColor Yellow

$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService) {
    if ($mongoService.Status -eq "Running") {
        Write-Host "   ✅ MongoDB 실행 중" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  MongoDB 시작 중..." -ForegroundColor Yellow
        try {
            Start-Service MongoDB -ErrorAction Stop
            Start-Sleep -Seconds 2
            Write-Host "   ✅ MongoDB 시작됨" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ MongoDB 시작 실패. 수동 시작이 필요할 수 있습니다." -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ⚠️  MongoDB 서비스를 찾을 수 없습니다." -ForegroundColor Yellow
    Write-Host "   💡 MongoDB가 설치되지 않았다면: https://www.mongodb.com/try/download/community" -ForegroundColor Gray
}

Write-Host ""

# 2. 환경 변수 파일 확인
Write-Host "2. 환경 변수 파일 확인 중..." -ForegroundColor Yellow

$envFiles = @(
    "$rootDir\backend\.env",
    "$rootDir\patient-portal\.env",
    "$rootDir\admin-dashboard\.env"
)

$allEnvExists = $true
foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $(Split-Path (Split-Path $file -Parent) -Leaf)/.env 존재" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $(Split-Path (Split-Path $file -Parent) -Leaf)/.env 없음" -ForegroundColor Red
        $allEnvExists = $false
    }
}

if (-not $allEnvExists) {
    Write-Host ""
    Write-Host "⚠️  일부 환경 변수 파일이 없습니다." -ForegroundColor Yellow
    Write-Host "   backend/.env.example을 참조하여 .env 파일을 생성하세요." -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "계속 진행하시겠습니까? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "종료합니다." -ForegroundColor Yellow
        exit
    }
}

Write-Host ""

# 3. 의존성 확인 및 설치
Write-Host "3. 의존성 확인 중..." -ForegroundColor Yellow

$modules = @(
    @{Path="$rootDir\backend"; Name="Backend"},
    @{Path="$rootDir\patient-portal"; Name="Patient Portal"},
    @{Path="$rootDir\admin-dashboard"; Name="Admin Dashboard"}
)

foreach ($module in $modules) {
    if (Test-Path "$($module.Path)\node_modules") {
        Write-Host "   ✅ $($module.Name) 의존성 존재" -ForegroundColor Green
    } else {
        Write-Host "   📦 $($module.Name) 의존성 설치 중..." -ForegroundColor Yellow
        Push-Location $module.Path
        npm install --silent
        Pop-Location
        Write-Host "   ✅ $($module.Name) 의존성 설치 완료" -ForegroundColor Green
    }
}

Write-Host ""

# 4. Production 빌드 (Production 모드인 경우)
if ($Production) {
    Write-Host "4. Production 빌드 중..." -ForegroundColor Yellow
    
    # Patient Portal 빌드
    if (-not (Test-Path "$rootDir\patient-portal\build")) {
        Write-Host "   🔨 Patient Portal 빌드 중..." -ForegroundColor Yellow
        Push-Location "$rootDir\patient-portal"
        npm run build --silent
        Pop-Location
        Write-Host "   ✅ Patient Portal 빌드 완료" -ForegroundColor Green
    } else {
        Write-Host "   ⏭️  Patient Portal 빌드 폴더 존재 (재빌드하려면 build 폴더 삭제)" -ForegroundColor Gray
    }
    
    # Admin Dashboard 빌드
    if (-not (Test-Path "$rootDir\admin-dashboard\build")) {
        Write-Host "   🔨 Admin Dashboard 빌드 중..." -ForegroundColor Yellow
        Push-Location "$rootDir\admin-dashboard"
        npm run build --silent
        Pop-Location
        Write-Host "   ✅ Admin Dashboard 빌드 완료" -ForegroundColor Green
    } else {
        Write-Host "   ⏭️  Admin Dashboard 빌드 폴더 존재 (재빌드하려면 build 폴더 삭제)" -ForegroundColor Gray
    }
    
    Write-Host ""
}

# 5. PM2 확인
Write-Host "5. PM2 확인 중..." -ForegroundColor Yellow

$pm2Installed = $null -ne (Get-Command pm2 -ErrorAction SilentlyContinue)

if ($pm2Installed) {
    Write-Host "   ✅ PM2 설치됨" -ForegroundColor Green
    $usePM2 = $true
} else {
    Write-Host "   ⚠️  PM2가 설치되지 않았습니다." -ForegroundColor Yellow
    Write-Host "   💡 PM2 설치: npm install -g pm2" -ForegroundColor Gray
    $usePM2 = $false
}

Write-Host ""

# 6. 서버 시작
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  서버 시작 중..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($usePM2 -and $Production) {
    # PM2로 시작 (Production)
    Write-Host "PM2를 사용하여 서비스 시작 중..." -ForegroundColor Cyan
    Write-Host ""
    
    # Backend 시작
    Push-Location "$rootDir\backend"
    pm2 delete medical-backend -s 2>$null
    pm2 start server.js --name medical-backend --log-date-format="YYYY-MM-DD HH:mm:ss"
    Pop-Location
    Write-Host "   ✅ Backend 시작됨 (PM2)" -ForegroundColor Green
    
    # Patient Portal 시작 (정적 파일 서빙)
    Push-Location "$rootDir\patient-portal"
    pm2 delete medical-patient-portal -s 2>$null
    pm2 start "npx serve -s build -l 3000" --name medical-patient-portal
    Pop-Location
    Write-Host "   ✅ Patient Portal 시작됨 (PM2)" -ForegroundColor Green
    
    # Admin Dashboard 시작 (정적 파일 서빙)
    Push-Location "$rootDir\admin-dashboard"
    pm2 delete medical-admin-dashboard -s 2>$null
    pm2 start "npx serve -s build -l 3001" --name medical-admin-dashboard
    Pop-Location
    Write-Host "   ✅ Admin Dashboard 시작됨 (PM2)" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "PM2 프로세스 목록:" -ForegroundColor Cyan
    pm2 list
    
    Write-Host ""
    Write-Host "📋 PM2 명령어:" -ForegroundColor Yellow
    Write-Host "   - 로그 보기:    pm2 logs" -ForegroundColor Gray
    Write-Host "   - 상태 확인:    pm2 list" -ForegroundColor Gray
    Write-Host "   - 재시작:       pm2 restart all" -ForegroundColor Gray
    Write-Host "   - 중지:         pm2 stop all" -ForegroundColor Gray
    Write-Host "   - 모니터링:     pm2 monit" -ForegroundColor Gray
    
} else {
    # 일반 모드로 시작 (별도 터미널)
    Write-Host "새 터미널 창에서 서비스를 시작합니다..." -ForegroundColor Cyan
    Write-Host ""
    
    # Backend 시작
    Write-Host "   🚀 Backend 시작 중 (포트 5000)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; Write-Host '=== Backend Server ===' -ForegroundColor Cyan; node server.js"
    Start-Sleep -Seconds 2
    
    if ($Production) {
        # Production 모드: 빌드된 파일 서빙
        Write-Host "   🚀 Patient Portal 시작 중 (포트 3000)..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\patient-portal'; Write-Host '=== Patient Portal (Production) ===' -ForegroundColor Cyan; npx serve -s build -l 3000"
        Start-Sleep -Seconds 2
        
        Write-Host "   🚀 Admin Dashboard 시작 중 (포트 3001)..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\admin-dashboard'; Write-Host '=== Admin Dashboard (Production) ===' -ForegroundColor Cyan; npx serve -s build -l 3001"
    } else {
        # Development 모드: React 개발 서버
        Write-Host "   🚀 Patient Portal 시작 중 (포트 3000)..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\patient-portal'; `$env:PORT=3000; Write-Host '=== Patient Portal (Development) ===' -ForegroundColor Cyan; npm start"
        Start-Sleep -Seconds 2
        
        Write-Host "   🚀 Admin Dashboard 시작 중 (포트 3001)..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\admin-dashboard'; `$env:PORT=3001; Write-Host '=== Admin Dashboard (Development) ===' -ForegroundColor Cyan; npm start"
    }
    
    Write-Host ""
    Write-Host "   ✅ 모든 서비스가 별도 터미널에서 시작되었습니다." -ForegroundColor Green
    Write-Host "   💡 각 터미널을 닫으면 해당 서비스가 중지됩니다." -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  서버 실행 완료!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 접속 정보 표시
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress

Write-Host "🌐 접속 주소:" -ForegroundColor White
Write-Host ""
Write-Host "   로컬 (이 PC):" -ForegroundColor Cyan
Write-Host "   - Backend API:     http://localhost:5000" -ForegroundColor Gray
Write-Host "   - Patient Portal:  http://localhost:3000" -ForegroundColor Gray
Write-Host "   - Admin Dashboard: http://localhost:3001" -ForegroundColor Gray
Write-Host ""

if ($localIP) {
    Write-Host "   같은 네트워크 (공유기 내부):" -ForegroundColor Cyan
    Write-Host "   - Backend API:     http://${localIP}:5000" -ForegroundColor Gray
    Write-Host "   - Patient Portal:  http://${localIP}:3000" -ForegroundColor Gray
    Write-Host "   - Admin Dashboard: http://${localIP}:3001" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "⚠️  외부 접속을 위해서는:" -ForegroundColor Yellow
Write-Host "   1. 공유기 포트 포워딩 설정 필요 (5000, 3000, 3001 포트)" -ForegroundColor Gray
Write-Host "   2. 환경 변수에 공인 IP 또는 도메인 설정 필요" -ForegroundColor Gray
Write-Host "   3. LOCAL_SERVER_SETUP.md 파일 참조" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 추가 정보:" -ForegroundColor Yellow
Write-Host "   - 초기 의사 계정 생성: cd backend && node create-doctor.js" -ForegroundColor Gray
Write-Host "   - 데이터베이스 리셋:   cd backend && node reset-db.js" -ForegroundColor Gray
Write-Host ""

# 웹 브라우저 자동 열기
$openBrowser = Read-Host "웹 브라우저를 여시겠습니까? (Y/n)"
if ($openBrowser -ne "n" -and $openBrowser -ne "N") {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:3000"
    Start-Process "http://localhost:3001"
}

Write-Host ""
Write-Host "✅ 서버가 실행 중입니다!" -ForegroundColor Green
Write-Host ""
