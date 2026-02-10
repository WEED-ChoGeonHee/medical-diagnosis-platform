# 의료 진단 플랫폼 - 네트워크 설정 자동화 스크립트
# 관리자 권한으로 실행 필요

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  의료 진단 플랫폼 - 네트워크 설정" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 관리자 권한 확인
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ 이 스크립트는 관리자 권한이 필요합니다." -ForegroundColor Red
    Write-Host "PowerShell을 관리자 권한으로 실행한 후 다시 시도하세요." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "방법: PowerShell 아이콘 우클릭 > '관리자 권한으로 실행'" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "✅ 관리자 권한 확인됨" -ForegroundColor Green
Write-Host ""

# 1. 방화벽 규칙 추가
Write-Host "1. Windows 방화벽 규칙 추가 중..." -ForegroundColor Yellow

$ports = @(
    @{Name="Medical Diagnosis Backend"; Port=5000},
    @{Name="Medical Diagnosis Patient Portal"; Port=3000},
    @{Name="Medical Diagnosis Admin Dashboard"; Port=3001}
)

foreach ($rule in $ports) {
    $existingRule = Get-NetFirewallRule -DisplayName $rule.Name -ErrorAction SilentlyContinue
    
    if ($existingRule) {
        Write-Host "   ⏭️  '$($rule.Name)' 규칙이 이미 존재합니다." -ForegroundColor Gray
    } else {
        try {
            New-NetFirewallRule -DisplayName $rule.Name -Direction Inbound -Protocol TCP -LocalPort $rule.Port -Action Allow -ErrorAction Stop | Out-Null
            Write-Host "   ✅ '$($rule.Name)' 규칙 추가됨 (포트 $($rule.Port))" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ '$($rule.Name)' 규칙 추가 실패: $_" -ForegroundColor Red
        }
    }
}

Write-Host ""

# 2. 로컬 IP 확인
Write-Host "2. 네트워크 정보 확인 중..." -ForegroundColor Yellow

$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress

if ($localIP) {
    Write-Host "   📍 로컬 IP: $localIP" -ForegroundColor Cyan
} else {
    Write-Host "   ⚠️  로컬 IP를 찾을 수 없습니다." -ForegroundColor Yellow
}

# 3. 공인 IP 확인
try {
    $publicIP = (Invoke-WebRequest -Uri "http://ifconfig.me/ip" -TimeoutSec 5 -UseBasicParsing).Content.Trim()
    Write-Host "   🌐 공인 IP: $publicIP" -ForegroundColor Cyan
} catch {
    Write-Host "   ⚠️  공인 IP를 확인할 수 없습니다." -ForegroundColor Yellow
    $publicIP = "확인 필요"
}

Write-Host ""

# 4. 포트 상태 확인
Write-Host "3. 포트 사용 상태 확인 중..." -ForegroundColor Yellow

$portsToCheck = @(5000, 3000, 3001, 27017)

foreach ($port in $portsToCheck) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($connection) {
        $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        Write-Host "   ⚠️  포트 $port 사용 중 (프로세스: $($process.ProcessName))" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ 포트 $port 사용 가능" -ForegroundColor Green
    }
}

Write-Host ""

# 5. MongoDB 서비스 확인
Write-Host "4. MongoDB 서비스 확인 중..." -ForegroundColor Yellow

$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService) {
    if ($mongoService.Status -eq "Running") {
        Write-Host "   ✅ MongoDB 서비스 실행 중" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  MongoDB 서비스 중지됨. 시작 중..." -ForegroundColor Yellow
        try {
            Start-Service MongoDB
            Write-Host "   ✅ MongoDB 서비스 시작됨" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ MongoDB 서비스 시작 실패: $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ❌ MongoDB 서비스를 찾을 수 없습니다." -ForegroundColor Red
    Write-Host "      MongoDB를 설치하세요: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
}

Write-Host ""

# 6. 설정 요약
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  설정 완료 요약" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📍 로컬 접속 주소:" -ForegroundColor White
Write-Host "   Backend API:     http://localhost:5000" -ForegroundColor Gray
Write-Host "   Patient Portal:  http://localhost:3000" -ForegroundColor Gray
Write-Host "   Admin Dashboard: http://localhost:3001" -ForegroundColor Gray
Write-Host ""

if ($localIP) {
    Write-Host "📍 같은 네트워크 내 접속 주소:" -ForegroundColor White
    Write-Host "   Backend API:     http://${localIP}:5000" -ForegroundColor Gray
    Write-Host "   Patient Portal:  http://${localIP}:3000" -ForegroundColor Gray
    Write-Host "   Admin Dashboard: http://${localIP}:3001" -ForegroundColor Gray
    Write-Host ""
}

if ($publicIP -ne "확인 필요") {
    Write-Host "🌐 외부 접속 주소 (포트 포워딩 설정 후):" -ForegroundColor White
    Write-Host "   Backend API:     http://${publicIP}:5000" -ForegroundColor Gray
    Write-Host "   Patient Portal:  http://${publicIP}:3000" -ForegroundColor Gray
    Write-Host "   Admin Dashboard: http://${publicIP}:3001" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "⚙️  다음 단계:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 공유기에서 포트 포워딩 설정" -ForegroundColor White
Write-Host "   - 공유기 관리 페이지 접속 (보통 http://192.168.0.1 또는 192.168.1.1)" -ForegroundColor Gray
Write-Host "   - 포트 5000, 3000, 3001을 현재 PC($localIP)로 포워딩" -ForegroundColor Gray
Write-Host ""

Write-Host "2. 환경 변수 파일 설정" -ForegroundColor White
Write-Host "   - backend/.env 파일 생성 (backend/.env.example 참조)" -ForegroundColor Gray
Write-Host "   - patient-portal/.env 파일 생성" -ForegroundColor Gray
Write-Host "   - admin-dashboard/.env 파일 생성" -ForegroundColor Gray
Write-Host ""

Write-Host "3. 서버 시작" -ForegroundColor White
Write-Host "   - .\start-server.ps1 실행" -ForegroundColor Gray
Write-Host ""

Write-Host "자세한 내용은 LOCAL_SERVER_SETUP.md 파일을 참조하세요." -ForegroundColor Cyan
Write-Host ""

# 설정 정보를 파일로 저장
$configFile = "server-config.txt"
$configContent = @"
의료 진단 플랫폼 서버 설정 정보
생성 시간: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

========================================
네트워크 정보
========================================
로컬 IP: $localIP
공인 IP: $publicIP

========================================
접속 주소
========================================
로컬:
  - Backend API:     http://localhost:5000
  - Patient Portal:  http://localhost:3000
  - Admin Dashboard: http://localhost:3001

같은 네트워크:
  - Backend API:     http://${localIP}:5000
  - Patient Portal:  http://${localIP}:3000
  - Admin Dashboard: http://${localIP}:3001

외부 (포트 포워딩 설정 후):
  - Backend API:     http://${publicIP}:5000
  - Patient Portal:  http://${publicIP}:3000
  - Admin Dashboard: http://${publicIP}:3001

========================================
환경 변수 설정
========================================
patient-portal/.env:
REACT_APP_API_URL=http://${publicIP}:5000

admin-dashboard/.env:
REACT_APP_API_URL=http://${publicIP}:5000

backend/.env:
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-diagnosis
JWT_SECRET=[랜덤 문자열로 변경]
OPENAI_API_KEY=[OpenAI API 키 입력]
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://${publicIP}:3000,http://${publicIP}:3001

========================================
포트 포워딩 설정 (공유기)
========================================
외부 포트 | 내부 IP       | 내부 포트 | 프로토콜
---------|--------------|----------|----------
5000     | $localIP     | 5000     | TCP
3000     | $localIP     | 3000     | TCP
3001     | $localIP     | 3001     | TCP

"@

$configContent | Out-File -FilePath $configFile -Encoding UTF8

Write-Host "💾 설정 정보가 '$configFile' 파일에 저장되었습니다." -ForegroundColor Green
Write-Host ""

pause
