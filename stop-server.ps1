# 의료 진단 플랫폼 - 서버 중지 스크립트

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  의료 진단 플랫폼 서버 중지" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# PM2 확인
$pm2Installed = $null -ne (Get-Command pm2 -ErrorAction SilentlyContinue)

if ($pm2Installed) {
    Write-Host "1. PM2 프로세스 확인 중..." -ForegroundColor Yellow
    
    $pm2List = pm2 jlist | ConvertFrom-Json
    $medicalProcesses = $pm2List | Where-Object { $_.name -like "medical-*" }
    
    if ($medicalProcesses.Count -gt 0) {
        Write-Host ""
        Write-Host "   발견된 PM2 프로세스:" -ForegroundColor Cyan
        foreach ($proc in $medicalProcesses) {
            Write-Host "   - $($proc.name) (PID: $($proc.pid))" -ForegroundColor Gray
        }
        Write-Host ""
        
        $stopPM2 = Read-Host "PM2 프로세스를 중지하시겠습니까? (Y/n)"
        if ($stopPM2 -ne "n" -and $stopPM2 -ne "N") {
            pm2 stop medical-backend medical-patient-portal medical-admin-dashboard 2>$null
            pm2 delete medical-backend medical-patient-portal medical-admin-dashboard 2>$null
            Write-Host "   ✅ PM2 프로세스 중지됨" -ForegroundColor Green
        }
    } else {
        Write-Host "   ℹ️  실행 중인 PM2 프로세스가 없습니다." -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "2. 포트 사용 중인 프로세스 확인 중..." -ForegroundColor Yellow

$ports = @(5000, 3000, 3001)
$processesToKill = @()

foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($connection) {
        $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   📍 포트 $port : $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
            $processesToKill += @{Port=$port; Process=$process}
        }
    }
}

if ($processesToKill.Count -gt 0) {
    Write-Host ""
    $killProcesses = Read-Host "위의 프로세스를 종료하시겠습니까? (Y/n)"
    
    if ($killProcesses -ne "n" -and $killProcesses -ne "N") {
        foreach ($item in $processesToKill) {
            try {
                Stop-Process -Id $item.Process.Id -Force -ErrorAction Stop
                Write-Host "   ✅ $($item.Process.ProcessName) 종료됨 (포트 $($item.Port))" -ForegroundColor Green
            } catch {
                Write-Host "   ❌ $($item.Process.ProcessName) 종료 실패: $_" -ForegroundColor Red
            }
        }
    }
} else {
    Write-Host "   ℹ️  포트 5000, 3000, 3001을 사용 중인 프로세스가 없습니다." -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  완료" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# MongoDB 중지 여부 확인
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService -and $mongoService.Status -eq "Running") {
    Write-Host "💡 MongoDB 서비스가 실행 중입니다." -ForegroundColor Yellow
    $stopMongo = Read-Host "MongoDB도 중지하시겠습니까? (y/N)"
    
    if ($stopMongo -eq "y" -or $stopMongo -eq "Y") {
        try {
            Stop-Service MongoDB -ErrorAction Stop
            Write-Host "   ✅ MongoDB 서비스 중지됨" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ MongoDB 서비스 중지 실패 (관리자 권한 필요)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "✅ 서버 중지 완료" -ForegroundColor Green
Write-Host ""
pause
