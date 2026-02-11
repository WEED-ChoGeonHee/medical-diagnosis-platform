# Android WebView ??ë¹Œë“œ ?ë™??
# ?¬ìš©ë²? .\build-android-apk.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Android APK ë¹Œë“œ ?¤í¬ë¦½íŠ¸" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$appDir = "e:\?ŒìŠ¤\?˜í•™\android-app"

# Android Studio ?ëŠ” Android SDK ?•ì¸
$androidHome = $env:ANDROID_HOME
$androidSdk = $env:ANDROID_SDK_ROOT

if (-not $androidHome -and -not $androidSdk) {
    Write-Host "? ï¸  Android SDKë¥?ì°¾ì„ ???†ìŠµ?ˆë‹¤!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "?¤ìŒ ì¤??˜ë‚˜ë¥?? íƒ?˜ì„¸??" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Android Studio ?¤ì¹˜ (ì¶”ì²œ)" -ForegroundColor White
    Write-Host "   https://developer.android.com/studio" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Android Studio?ì„œ ?„ë¡œ?íŠ¸ ?´ê¸°" -ForegroundColor White
    Write-Host "   File > Open > $appDir" -ForegroundColor Gray
    Write-Host "   Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. ?¨ë¼??ë¹Œë“œ ?œë¹„???¬ìš©" -ForegroundColor White
    Write-Host "   https://www.buildapp.io/" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Android Studioë¥??¬ì‹œê² ìŠµ?ˆê¹Œ? (Y/N)"
    if ($choice -eq 'Y' -or $choice -eq 'y') {
        # Android Studio ê²½ë¡œ ì°¾ê¸°
        $studioPath = "C:\Program Files\Android\Android Studio\bin\studio64.exe"
        if (Test-Path $studioPath) {
            Write-Host "Android Studio ?¤í–‰ ì¤?.." -ForegroundColor Green
            Start-Process $studioPath -ArgumentList $appDir
        } else {
            Write-Host "Android Studioë¥?ì°¾ì„ ???†ìŠµ?ˆë‹¤. ?˜ë™?¼ë¡œ ?¤ì¹˜?˜ì„¸??" -ForegroundColor Red
            Start-Process "https://developer.android.com/studio"
        }
    }
    exit
}

# Gradle Wrapper ?•ì¸
cd $appDir

if (-not (Test-Path "gradlew.bat")) {
    Write-Host "Gradle Wrapper ?ì„± ì¤?.." -ForegroundColor Yellow
    gradle wrapper
}

Write-Host "[1/3] ?„ë¡œ?íŠ¸ ?•ë¦¬ ì¤?.." -ForegroundColor Yellow
.\gradlew.bat clean

Write-Host "[2/3] APK ë¹Œë“œ ì¤?.." -ForegroundColor Yellow
.\gradlew.bat assembleDebug

if ($?) {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "   ??APK ë¹Œë“œ ?„ë£Œ!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
    
    if (Test-Path $apkPath) {
        $fullPath = (Resolve-Path $apkPath).Path
        $fileSize = (Get-Item $apkPath).Length / 1MB
        
        Write-Host "?“± APK ?Œì¼ ?•ë³´:" -ForegroundColor Cyan
        Write-Host "   ?„ì¹˜: $fullPath" -ForegroundColor White
        Write-Host "   ?¬ê¸°: $([math]::Round($fileSize, 2)) MB" -ForegroundColor White
        Write-Host ""
        
        # APKë¥?ë£¨íŠ¸ë¡?ë³µì‚¬
        $destPath = "..\medical-diagnosis.apk"
        Copy-Item $apkPath $destPath -Force
        
        Write-Host "[3/3] APK ë³µì‚¬ ?„ë£Œ:" -ForegroundColor Green
        Write-Host "   e:\?ŒìŠ¤\?˜í•™\medical-diagnosis.apk" -ForegroundColor White
        Write-Host ""
        
        # ?¤ì¹˜ ?ˆë‚´
        Write-Host "?“² ?¤ì¹˜ ë°©ë²•:" -ForegroundColor Cyan
        Write-Host "   1. APK ?Œì¼???¤ë§ˆ?¸í°?¼ë¡œ ?„ì†¡" -ForegroundColor White
        Write-Host "   2. ?Œì¼ ê´€ë¦¬ì?ì„œ APK ?´ë¦­" -ForegroundColor White
        Write-Host "   3. '?????†ëŠ” ì¶œì²˜' ???¤ì¹˜ ?ˆìš©" -ForegroundColor White
        Write-Host "   4. ?¤ì¹˜ ?„ë£Œ!" -ForegroundColor White
        Write-Host ""
        
        # ?Œì¼ ?ìƒ‰ê¸°ë¡œ ?´ê¸°
        $openChoice = Read-Host "?Œì¼ ?ìƒ‰ê¸°ë¡œ APK ?„ì¹˜ë¥??¬ì‹œê² ìŠµ?ˆê¹Œ? (Y/N)"
        if ($openChoice -eq 'Y' -or $openChoice -eq 'y') {
            explorer.exe /select,$fullPath
        }
    } else {
        Write-Host "APK ?Œì¼??ì°¾ì„ ???†ìŠµ?ˆë‹¤: $apkPath" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Red
    Write-Host "   ??APK ë¹Œë“œ ?¤íŒ¨" -ForegroundColor Red
    Write-Host "====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "ë¬¸ì œ ?´ê²°:" -ForegroundColor Yellow
    Write-Host "   1. Android Studio?ì„œ ?„ë¡œ?íŠ¸ë¥??´ì–´ë³´ì„¸?? -ForegroundColor White
    Write-Host "   2. Sync Project with Gradle Files ?¤í–‰" -ForegroundColor White
    Write-Host "   3. ë¹Œë“œ ë¡œê·¸?ì„œ ?ëŸ¬ ?•ì¸" -ForegroundColor White
}

Write-Host ""
