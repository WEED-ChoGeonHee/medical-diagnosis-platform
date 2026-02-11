# ?˜ìž ?¬í„¸ APK ë¹Œë“œ ?ë™???¤í¬ë¦½íŠ¸
# ?¬ìš©ë²? .\build-apk.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   ?˜ë£Œ ì§„ë‹¨ ?Œëž«??APK ë¹Œë“œ" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Capacitorê°€ ?¤ì¹˜?˜ì–´ ?ˆëŠ”ì§€ ?•ì¸
$patientPortalDir = "e:\?ŒìŠ¤\?˜í•™\patient-portal"
cd $patientPortalDir

Write-Host "[1/6] Capacitor ?•ì¸ ì¤?.." -ForegroundColor Yellow

# package.json?ì„œ capacitor ?•ì¸
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
if (-not $packageJson.dependencies."@capacitor/core") {
    Write-Host "Capacitor ?¤ì¹˜ ì¤?.." -ForegroundColor Green
    npm install --save @capacitor/core @capacitor/cli @capacitor/android
    
    Write-Host "Capacitor ì´ˆê¸°??ì¤?.." -ForegroundColor Green
    npx cap init medicalApp com.medical.patient --web-dir=build
}

Write-Host "[2/6] React ??ë¹Œë“œ ì¤?.." -ForegroundColor Yellow

# API URL??ë°°í¬ ?œë²„ë¡?ë³€ê²?
$apiFile = "src\api.js"
if (Test-Path $apiFile) {
    $apiContent = Get-Content $apiFile -Raw
    if ($apiContent -match "localhost") {
        Write-Host "   ? ï¸  API URL??ë°°í¬ ?œë²„ë¡?ë³€ê²½í•´???©ë‹ˆ??" -ForegroundColor Red
        Write-Host "   src/api.js ?Œì¼?ì„œ API_URL???•ì¸?˜ì„¸??" -ForegroundColor Red
        Write-Host ""
        Read-Host "ê³„ì†?˜ë ¤ë©?Enterë¥??„ë¥´?¸ìš”"
    }
}

# ?„ë¡œ?•ì…˜ ë¹Œë“œ
npm run build

if (-not $?) {
    Write-Host "ë¹Œë“œ ?¤íŒ¨!" -ForegroundColor Red
    exit 1
}

Write-Host "[3/6] Android ?Œëž«???•ì¸ ì¤?.." -ForegroundColor Yellow

# Android ?Œëž«??ì¶”ê? (?´ë? ?ˆìœ¼ë©??¤í‚µ)
if (-not (Test-Path "android")) {
    npx cap add android
}

Write-Host "[4/6] Capacitor ?™ê¸°??ì¤?.." -ForegroundColor Yellow
npx cap sync android

Write-Host "[5/6] APK ë¹Œë“œ ì¤?.." -ForegroundColor Yellow

# Gradle???¤ì¹˜?˜ì–´ ?ˆëŠ”ì§€ ?•ì¸
if (Test-Path "android\gradlew.bat") {
    cd android
    .\gradlew.bat assembleDebug
    
    if ($?) {
        Write-Host ""
        Write-Host "====================================" -ForegroundColor Green
        Write-Host "   APK ë¹Œë“œ ?„ë£Œ!" -ForegroundColor Green
        Write-Host "====================================" -ForegroundColor Green
        Write-Host ""
        
        $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
        if (Test-Path $apkPath) {
            $fullPath = (Resolve-Path $apkPath).Path
            Write-Host "?“± APK ?Œì¼ ?„ì¹˜:" -ForegroundColor Cyan
            Write-Host "   $fullPath" -ForegroundColor White
            Write-Host ""
            
            # ?Œì¼ ?¬ê¸° ?œì‹œ
            $fileSize = (Get-Item $apkPath).Length / 1MB
            Write-Host "?“¦ ?Œì¼ ?¬ê¸°: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
            Write-Host ""
            
            # APKë¥?ë£¨íŠ¸ ?”ë ‰? ë¦¬ë¡?ë³µì‚¬
            $destPath = "..\..\patient-portal.apk"
            Copy-Item $apkPath $destPath -Force
            Write-Host "??APK ?Œì¼??ë³µì‚¬?˜ì—ˆ?µë‹ˆ??" -ForegroundColor Green
            Write-Host "   $patientPortalDir\patient-portal.apk" -ForegroundColor White
        }
    } else {
        Write-Host "APK ë¹Œë“œ ?¤íŒ¨!" -ForegroundColor Red
        Write-Host "Android Studioë¥??¤ì¹˜?˜ê³  ?¤ì‹œ ?œë„?˜ì„¸??" -ForegroundColor Yellow
    }
    
    cd ..
} else {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Yellow
    Write-Host "   Android Studio ?„ìš”" -ForegroundColor Yellow
    Write-Host "====================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "APKë¥?ë¹Œë“œ?˜ë ¤ë©?Android Studioê°€ ?„ìš”?©ë‹ˆ??" -ForegroundColor White
    Write-Host ""
    Write-Host "?¤ìŒ ëª…ë ¹?´ë¡œ Android Studioë¥??´ê³  ?˜ë™?¼ë¡œ ë¹Œë“œ?˜ì„¸??" -ForegroundColor Cyan
    Write-Host "   npx cap open android" -ForegroundColor White
    Write-Host ""
    Write-Host "Android Studio?ì„œ:" -ForegroundColor Cyan
    Write-Host "   Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor White
}

Write-Host ""
Write-Host "[6/6] ?„ë£Œ!" -ForegroundColor Green
Write-Host ""
