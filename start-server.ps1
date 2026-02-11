# ?˜ë£Œ ì§„ë‹¨ ?Œë«??- ?œë²„ ?œì‘ ?¤í¬ë¦½íŠ¸

param(
    [switch]$Production,
    [switch]$Dev
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ?˜ë£Œ ì§„ë‹¨ ?Œë«???œë²„ ?œì‘" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ?„ë¡œ?íŠ¸ ë£¨íŠ¸ ?”ë ‰? ë¦¬
$rootDir = $PSScriptRoot

# ëª¨ë“œ ?•ì¸
$mode = if ($Production) { "production" } else { "development" }
Write-Host "?? ëª¨ë“œ: $mode" -ForegroundColor Cyan
Write-Host ""

# 1. MongoDB ?œë¹„???•ì¸
Write-Host "1. MongoDB ?œë¹„???•ì¸ ì¤?.." -ForegroundColor Yellow

$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService) {
    if ($mongoService.Status -eq "Running") {
        Write-Host "   ??MongoDB ?¤í–‰ ì¤? -ForegroundColor Green
    } else {
        Write-Host "   ? ï¸  MongoDB ?œì‘ ì¤?.." -ForegroundColor Yellow
        try {
            Start-Service MongoDB -ErrorAction Stop
            Start-Sleep -Seconds 2
            Write-Host "   ??MongoDB ?œì‘?? -ForegroundColor Green
        } catch {
            Write-Host "   ??MongoDB ?œì‘ ?¤íŒ¨. ?˜ë™ ?œì‘???„ìš”?????ˆìŠµ?ˆë‹¤." -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ? ï¸  MongoDB ?œë¹„?¤ë? ì°¾ì„ ???†ìŠµ?ˆë‹¤." -ForegroundColor Yellow
    Write-Host "   ?’¡ MongoDBê°€ ?¤ì¹˜?˜ì? ?Šì•˜?¤ë©´: https://www.mongodb.com/try/download/community" -ForegroundColor Gray
}

Write-Host ""

# 2. ?˜ê²½ ë³€???Œì¼ ?•ì¸
Write-Host "2. ?˜ê²½ ë³€???Œì¼ ?•ì¸ ì¤?.." -ForegroundColor Yellow

$envFiles = @(
    "$rootDir\backend\.env",
    "$rootDir\patient-portal\.env",
    "$rootDir\admin-dashboard\.env"
)

$allEnvExists = $true
foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Write-Host "   ??$(Split-Path (Split-Path $file -Parent) -Leaf)/.env ì¡´ì¬" -ForegroundColor Green
    } else {
        Write-Host "   ??$(Split-Path (Split-Path $file -Parent) -Leaf)/.env ?†ìŒ" -ForegroundColor Red
        $allEnvExists = $false
    }
}

if (-not $allEnvExists) {
    Write-Host ""
    Write-Host "? ï¸  ?¼ë? ?˜ê²½ ë³€???Œì¼???†ìŠµ?ˆë‹¤." -ForegroundColor Yellow
    Write-Host "   backend/.env.example??ì°¸ì¡°?˜ì—¬ .env ?Œì¼???ì„±?˜ì„¸??" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "ê³„ì† ì§„í–‰?˜ì‹œê² ìŠµ?ˆê¹Œ? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "ì¢…ë£Œ?©ë‹ˆ??" -ForegroundColor Yellow
        exit
    }
}

Write-Host ""

# 3. ?˜ì¡´???•ì¸ ë°??¤ì¹˜
Write-Host "3. ?˜ì¡´???•ì¸ ì¤?.." -ForegroundColor Yellow

$modules = @(
    @{Path="$rootDir\backend"; Name="Backend"},
    @{Path="$rootDir\patient-portal"; Name="Patient Portal"},
    @{Path="$rootDir\admin-dashboard"; Name="Admin Dashboard"}
)

foreach ($module in $modules) {
    if (Test-Path "$($module.Path)\node_modules") {
        Write-Host "   ??$($module.Name) ?˜ì¡´??ì¡´ì¬" -ForegroundColor Green
    } else {
        Write-Host "   ?“¦ $($module.Name) ?˜ì¡´???¤ì¹˜ ì¤?.." -ForegroundColor Yellow
        Push-Location $module.Path
        npm install --silent
        Pop-Location
        Write-Host "   ??$($module.Name) ?˜ì¡´???¤ì¹˜ ?„ë£Œ" -ForegroundColor Green
    }
}

Write-Host ""

# 4. Production ë¹Œë“œ (Production ëª¨ë“œ??ê²½ìš°)
if ($Production) {
    Write-Host "4. Production ë¹Œë“œ ì¤?.." -ForegroundColor Yellow
    
    # Patient Portal ë¹Œë“œ
    if (-not (Test-Path "$rootDir\patient-portal\build")) {
        Write-Host "   ?”¨ Patient Portal ë¹Œë“œ ì¤?.." -ForegroundColor Yellow
        Push-Location "$rootDir\patient-portal"
        npm run build --silent
        Pop-Location
        Write-Host "   ??Patient Portal ë¹Œë“œ ?„ë£Œ" -ForegroundColor Green
    } else {
        Write-Host "   ??¸  Patient Portal ë¹Œë“œ ?´ë” ì¡´ì¬ (?¬ë¹Œ?œí•˜?¤ë©´ build ?´ë” ?? œ)" -ForegroundColor Gray
    }
    
    # Admin Dashboard ë¹Œë“œ
    if (-not (Test-Path "$rootDir\admin-dashboard\build")) {
        Write-Host "   ?”¨ Admin Dashboard ë¹Œë“œ ì¤?.." -ForegroundColor Yellow
        Push-Location "$rootDir\admin-dashboard"
        npm run build --silent
        Pop-Location
        Write-Host "   ??Admin Dashboard ë¹Œë“œ ?„ë£Œ" -ForegroundColor Green
    } else {
        Write-Host "   ??¸  Admin Dashboard ë¹Œë“œ ?´ë” ì¡´ì¬ (?¬ë¹Œ?œí•˜?¤ë©´ build ?´ë” ?? œ)" -ForegroundColor Gray
    }
    
    Write-Host ""
}

# 5. PM2 ?•ì¸
Write-Host "5. PM2 ?•ì¸ ì¤?.." -ForegroundColor Yellow

$pm2Installed = $null -ne (Get-Command pm2 -ErrorAction SilentlyContinue)

if ($pm2Installed) {
    Write-Host "   ??PM2 ?¤ì¹˜?? -ForegroundColor Green
    $usePM2 = $true
} else {
    Write-Host "   ? ï¸  PM2ê°€ ?¤ì¹˜?˜ì? ?Šì•˜?µë‹ˆ??" -ForegroundColor Yellow
    Write-Host "   ?’¡ PM2 ?¤ì¹˜: npm install -g pm2" -ForegroundColor Gray
    $usePM2 = $false
}

Write-Host ""

# 6. ?œë²„ ?œì‘
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ?œë²„ ?œì‘ ì¤?.." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($usePM2 -and $Production) {
    # PM2ë¡??œì‘ (Production)
    Write-Host "PM2ë¥??¬ìš©?˜ì—¬ ?œë¹„???œì‘ ì¤?.." -ForegroundColor Cyan
    Write-Host ""
    
    # Backend ?œì‘
    Push-Location "$rootDir\backend"
    pm2 delete medical-backend -s 2>$null
    pm2 start server.js --name medical-backend --log-date-format="YYYY-MM-DD HH:mm:ss"
    Pop-Location
    Write-Host "   ??Backend ?œì‘??(PM2)" -ForegroundColor Green
    
    # Patient Portal ?œì‘ (?•ì  ?Œì¼ ?œë¹™)
    Push-Location "$rootDir\patient-portal"
    pm2 delete medical-patient-portal -s 2>$null
    pm2 start "npx serve -s build -l 3000" --name medical-patient-portal
    Pop-Location
    Write-Host "   ??Patient Portal ?œì‘??(PM2)" -ForegroundColor Green
    
    # Admin Dashboard ?œì‘ (?•ì  ?Œì¼ ?œë¹™)
    Push-Location "$rootDir\admin-dashboard"
    pm2 delete medical-admin-dashboard -s 2>$null
    pm2 start "npx serve -s build -l 3001" --name medical-admin-dashboard
    Pop-Location
    Write-Host "   ??Admin Dashboard ?œì‘??(PM2)" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "PM2 ?„ë¡œ?¸ìŠ¤ ëª©ë¡:" -ForegroundColor Cyan
    pm2 list
    
    Write-Host ""
    Write-Host "?“‹ PM2 ëª…ë ¹??" -ForegroundColor Yellow
    Write-Host "   - ë¡œê·¸ ë³´ê¸°:    pm2 logs" -ForegroundColor Gray
    Write-Host "   - ?íƒœ ?•ì¸:    pm2 list" -ForegroundColor Gray
    Write-Host "   - ?¬ì‹œ??       pm2 restart all" -ForegroundColor Gray
    Write-Host "   - ì¤‘ì?:         pm2 stop all" -ForegroundColor Gray
    Write-Host "   - ëª¨ë‹ˆ?°ë§:     pm2 monit" -ForegroundColor Gray
    
} else {
    # ?¼ë°˜ ëª¨ë“œë¡??œì‘ (ë³„ë„ ?°ë???
    Write-Host "???°ë???ì°½ì—???œë¹„?¤ë? ?œì‘?©ë‹ˆ??.." -ForegroundColor Cyan
    Write-Host ""
    
    # Backend ?œì‘
    Write-Host "   ?? Backend ?œì‘ ì¤?(?¬íŠ¸ 5000)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; Write-Host '=== Backend Server ===' -ForegroundColor Cyan; node server.js"
    Start-Sleep -Seconds 2
    
    if ($Production) {
        # Production ëª¨ë“œ: ë¹Œë“œ???Œì¼ ?œë¹™
        Write-Host "   ?? Patient Portal ?œì‘ ì¤?(?¬íŠ¸ 3000)..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\patient-portal'; Write-Host '=== Patient Portal (Production) ===' -ForegroundColor Cyan; npx serve -s build -l 3000"
        Start-Sleep -Seconds 2
        
        Write-Host "   ?? Admin Dashboard ?œì‘ ì¤?(?¬íŠ¸ 3001)..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\admin-dashboard'; Write-Host '=== Admin Dashboard (Production) ===' -ForegroundColor Cyan; npx serve -s build -l 3001"
    } else {
        # Development ëª¨ë“œ: React ê°œë°œ ?œë²„
        Write-Host "   ?? Patient Portal ?œì‘ ì¤?(?¬íŠ¸ 3000)..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\patient-portal'; `$env:PORT=3000; Write-Host '=== Patient Portal (Development) ===' -ForegroundColor Cyan; npm start"
        Start-Sleep -Seconds 2
        
        Write-Host "   ?? Admin Dashboard ?œì‘ ì¤?(?¬íŠ¸ 3001)..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\admin-dashboard'; `$env:PORT=3001; Write-Host '=== Admin Dashboard (Development) ===' -ForegroundColor Cyan; npm start"
    }
    
    Write-Host ""
    Write-Host "   ??ëª¨ë“  ?œë¹„?¤ê? ë³„ë„ ?°ë??ì—???œì‘?˜ì—ˆ?µë‹ˆ??" -ForegroundColor Green
    Write-Host "   ?’¡ ê°??°ë??ì„ ?«ìœ¼ë©??´ë‹¹ ?œë¹„?¤ê? ì¤‘ì??©ë‹ˆ??" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ?œë²„ ?¤í–‰ ?„ë£Œ!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ?‘ì† ?•ë³´ ?œì‹œ
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress

Write-Host "?Œ ?‘ì† ì£¼ì†Œ:" -ForegroundColor White
Write-Host ""
Write-Host "   ë¡œì»¬ (??PC):" -ForegroundColor Cyan
Write-Host "   - Backend API:     http://localhost:5000" -ForegroundColor Gray
Write-Host "   - Patient Portal:  http://localhost:3000" -ForegroundColor Gray
Write-Host "   - Admin Dashboard: http://localhost:3001" -ForegroundColor Gray
Write-Host ""

if ($localIP) {
    Write-Host "   ê°™ì? ?¤íŠ¸?Œí¬ (ê³µìœ ê¸??´ë?):" -ForegroundColor Cyan
    Write-Host "   - Backend API:     http://${localIP}:5000" -ForegroundColor Gray
    Write-Host "   - Patient Portal:  http://${localIP}:3000" -ForegroundColor Gray
    Write-Host "   - Admin Dashboard: http://${localIP}:3001" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "? ï¸  ?¸ë? ?‘ì†???„í•´?œëŠ”:" -ForegroundColor Yellow
Write-Host "   1. ê³µìœ ê¸??¬íŠ¸ ?¬ì›Œ???¤ì • ?„ìš” (5000, 3000, 3001 ?¬íŠ¸)" -ForegroundColor Gray
Write-Host "   2. ?˜ê²½ ë³€?˜ì— ê³µì¸ IP ?ëŠ” ?„ë©”???¤ì • ?„ìš”" -ForegroundColor Gray
Write-Host "   3. LOCAL_SERVER_SETUP.md ?Œì¼ ì°¸ì¡°" -ForegroundColor Gray
Write-Host ""

Write-Host "?“š ì¶”ê? ?•ë³´:" -ForegroundColor Yellow
Write-Host "   - ì´ˆê¸° ?˜ì‚¬ ê³„ì • ?ì„±: cd backend && node create-doctor.js" -ForegroundColor Gray
Write-Host "   - ?°ì´?°ë² ?´ìŠ¤ ë¦¬ì…‹:   cd backend && node reset-db.js" -ForegroundColor Gray
Write-Host ""

# ??ë¸Œë¼?°ì? ?ë™ ?´ê¸°
$openBrowser = Read-Host "??ë¸Œë¼?°ì?ë¥??¬ì‹œê² ìŠµ?ˆê¹Œ? (Y/n)"
if ($openBrowser -ne "n" -and $openBrowser -ne "N") {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:3000"
    Start-Process "http://localhost:3001"
}

Write-Host ""
Write-Host "???œë²„ê°€ ?¤í–‰ ì¤‘ì…?ˆë‹¤!" -ForegroundColor Green
Write-Host ""
