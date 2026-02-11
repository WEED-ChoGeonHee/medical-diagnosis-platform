# ?? ê°„ë‹¨??APK ë¹Œë“œ ê°€?´ë“œ

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   ?˜ë£Œ ì§„ë‹¨ APK ë¹Œë“œ" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$androidDir = "e:\?ŒìŠ¤\?˜í•™\android-app"

# Android Studio ?•ì¸
$studioPath = "C:\Program Files\Android\Android Studio\bin\studio64.exe"
$hasAndroidStudio = Test-Path $studioPath

Write-Host "?“± APK ?¤ì • ?•ë³´:" -ForegroundColor Green
Write-Host "   ?¹ì‚¬?´íŠ¸ URL: https://medical-diagnosis-platform.onrender.com/patient" -ForegroundColor White
Write-Host "   ???´ë¦„: ?˜ë£Œ ì§„ë‹¨" -ForegroundColor White
Write-Host "   ?¨í‚¤ì§€: com.medical.patient" -ForegroundColor White
Write-Host ""

if ($hasAndroidStudio) {
    Write-Host "??Android Studioê°€ ?¤ì¹˜?˜ì–´ ?ˆìŠµ?ˆë‹¤!" -ForegroundColor Green
    Write-Host ""
    Write-Host "APKë¥?ë¹Œë“œ?˜ë ¤ë©?" -ForegroundColor Cyan
    Write-Host "   1. Android Studio ?´ê¸°" -ForegroundColor White
    Write-Host "   2. File > Open > $androidDir" -ForegroundColor White
    Write-Host "   3. Gradle ?™ê¸°???€ê¸? -ForegroundColor White
    Write-Host "   4. Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor White
    Write-Host ""
    
    $openStudio = Read-Host "ì§€ê¸?Android Studioë¥??¬ì‹œê² ìŠµ?ˆê¹Œ? (Y/N)"
    if ($openStudio -eq 'Y' -or $openStudio -eq 'y') {
        Write-Host "Android Studio ?¤í–‰ ì¤?.." -ForegroundColor Green
        Start-Process $studioPath -ArgumentList $androidDir
        Write-Host ""
        Write-Host "Android Studio?ì„œ ?„ë¡œ?íŠ¸ê°€ ?´ë¦¬ë©?" -ForegroundColor Yellow
        Write-Host "   Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor White
        Write-Host ""
        Write-Host "ë¹Œë“œ??APK ?„ì¹˜:" -ForegroundColor Cyan
        Write-Host "   $androidDir\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Gray
    }
} else {
    Write-Host "??Android Studioê°€ ?¤ì¹˜?˜ì–´ ?ˆì? ?ŠìŠµ?ˆë‹¤." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "APK ë¹Œë“œ ë°©ë²•:" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "ë°©ë²• 1: Android Studio ?¤ì¹˜ (ì¶”ì²œ)" -ForegroundColor White
    Write-Host "   1. https://developer.android.com/studio ?‘ì†" -ForegroundColor Gray
    Write-Host "   2. Android Studio ?¤ìš´ë¡œë“œ ë°??¤ì¹˜" -ForegroundColor Gray
    Write-Host "   3. ???¤í¬ë¦½íŠ¸ ?¤ì‹œ ?¤í–‰" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "ë°©ë²• 2: ?¨ë¼??ë¹Œë“œ ?œë¹„??(Android Studio ?†ì´)" -ForegroundColor White
    Write-Host "   1. android-app ?´ë”ë¥?ZIP?¼ë¡œ ?•ì¶•" -ForegroundColor Gray
    Write-Host "   2. https://www.appetize.io/ ?ëŠ” ?¨ë¼??ë¹Œë“œ ?œë¹„???¬ìš©" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "ë°©ë²• 3: GitHub Actions (?ë™??" -ForegroundColor White
    Write-Host "   1. GitHub??ì½”ë“œ ?¸ì‹œ" -ForegroundColor Gray
    Write-Host "   2. GitHub Actionsë¡??ë™ APK ë¹Œë“œ" -ForegroundColor Gray
    Write-Host ""
    
    $download = Read-Host "Android Studio ?¤ìš´ë¡œë“œ ?˜ì´ì§€ë¥??¬ì‹œê² ìŠµ?ˆê¹Œ? (Y/N)"
    if ($download -eq 'Y' -or $download -eq 'y') {
        Start-Process "https://developer.android.com/studio"
    }
}

Write-Host ""
Write-Host "?“– ?ì„¸??ê°€?´ë“œ:" -ForegroundColor Cyan
Write-Host "   - APK-BUILD-GUIDE.md" -ForegroundColor White
Write-Host "   - android-app/README.md" -ForegroundColor White
Write-Host ""
