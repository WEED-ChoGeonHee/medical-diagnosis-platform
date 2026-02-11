# ?˜ë£Œ ì§„ë‹¨ ?Œë«??- ?œë²„ ì¤‘ì? ?¤í¬ë¦½íŠ¸

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ?˜ë£Œ ì§„ë‹¨ ?Œë«???œë²„ ì¤‘ì?" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# PM2 ?•ì¸
$pm2Installed = $null -ne (Get-Command pm2 -ErrorAction SilentlyContinue)

if ($pm2Installed) {
    Write-Host "1. PM2 ?„ë¡œ?¸ìŠ¤ ?•ì¸ ì¤?.." -ForegroundColor Yellow
    
    $pm2List = pm2 jlist | ConvertFrom-Json
    $medicalProcesses = $pm2List | Where-Object { $_.name -like "medical-*" }
    
    if ($medicalProcesses.Count -gt 0) {
        Write-Host ""
        Write-Host "   ë°œê²¬??PM2 ?„ë¡œ?¸ìŠ¤:" -ForegroundColor Cyan
        foreach ($proc in $medicalProcesses) {
            Write-Host "   - $($proc.name) (PID: $($proc.pid))" -ForegroundColor Gray
        }
        Write-Host ""
        
        $stopPM2 = Read-Host "PM2 ?„ë¡œ?¸ìŠ¤ë¥?ì¤‘ì??˜ì‹œê² ìŠµ?ˆê¹Œ? (Y/n)"
        if ($stopPM2 -ne "n" -and $stopPM2 -ne "N") {
            pm2 stop medical-backend medical-patient-portal medical-admin-dashboard 2>$null
            pm2 delete medical-backend medical-patient-portal medical-admin-dashboard 2>$null
            Write-Host "   ??PM2 ?„ë¡œ?¸ìŠ¤ ì¤‘ì??? -ForegroundColor Green
        }
    } else {
        Write-Host "   ?¹ï¸  ?¤í–‰ ì¤‘ì¸ PM2 ?„ë¡œ?¸ìŠ¤ê°€ ?†ìŠµ?ˆë‹¤." -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "2. ?¬íŠ¸ ?¬ìš© ì¤‘ì¸ ?„ë¡œ?¸ìŠ¤ ?•ì¸ ì¤?.." -ForegroundColor Yellow

$ports = @(5000, 3000, 3001)
$processesToKill = @()

foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($connection) {
        $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   ?“ ?¬íŠ¸ $port : $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
            $processesToKill += @{Port=$port; Process=$process}
        }
    }
}

if ($processesToKill.Count -gt 0) {
    Write-Host ""
    $killProcesses = Read-Host "?„ì˜ ?„ë¡œ?¸ìŠ¤ë¥?ì¢…ë£Œ?˜ì‹œê² ìŠµ?ˆê¹Œ? (Y/n)"
    
    if ($killProcesses -ne "n" -and $killProcesses -ne "N") {
        foreach ($item in $processesToKill) {
            try {
                Stop-Process -Id $item.Process.Id -Force -ErrorAction Stop
                Write-Host "   ??$($item.Process.ProcessName) ì¢…ë£Œ??(?¬íŠ¸ $($item.Port))" -ForegroundColor Green
            } catch {
                Write-Host "   ??$($item.Process.ProcessName) ì¢…ë£Œ ?¤íŒ¨: $_" -ForegroundColor Red
            }
        }
    }
} else {
    Write-Host "   ?¹ï¸  ?¬íŠ¸ 5000, 3000, 3001???¬ìš© ì¤‘ì¸ ?„ë¡œ?¸ìŠ¤ê°€ ?†ìŠµ?ˆë‹¤." -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ?„ë£Œ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# MongoDB ì¤‘ì? ?¬ë? ?•ì¸
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService -and $mongoService.Status -eq "Running") {
    Write-Host "?’¡ MongoDB ?œë¹„?¤ê? ?¤í–‰ ì¤‘ì…?ˆë‹¤." -ForegroundColor Yellow
    $stopMongo = Read-Host "MongoDB??ì¤‘ì??˜ì‹œê² ìŠµ?ˆê¹Œ? (y/N)"
    
    if ($stopMongo -eq "y" -or $stopMongo -eq "Y") {
        try {
            Stop-Service MongoDB -ErrorAction Stop
            Write-Host "   ??MongoDB ?œë¹„??ì¤‘ì??? -ForegroundColor Green
        } catch {
            Write-Host "   ??MongoDB ?œë¹„??ì¤‘ì? ?¤íŒ¨ (ê´€ë¦¬ì ê¶Œí•œ ?„ìš”)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "???œë²„ ì¤‘ì? ?„ë£Œ" -ForegroundColor Green
Write-Host ""
pause
