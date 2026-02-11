# 🚀 간단한 APK 빌드 가이드

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   의료 진단 APK 빌드" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$androidDir = "e:\소스\의학\android-app"

# Android Studio 확인
$studioPath = "C:\Program Files\Android\Android Studio\bin\studio64.exe"
$hasAndroidStudio = Test-Path $studioPath

Write-Host "📱 APK 설정 정보:" -ForegroundColor Green
Write-Host "   웹사이트 URL: https://medical-diagnosis-backend.onrender.com/patient" -ForegroundColor White
Write-Host "   앱 이름: 의료 진단" -ForegroundColor White
Write-Host "   패키지: com.medical.patient" -ForegroundColor White
Write-Host ""

if ($hasAndroidStudio) {
    Write-Host "✅ Android Studio가 설치되어 있습니다!" -ForegroundColor Green
    Write-Host ""
    Write-Host "APK를 빌드하려면:" -ForegroundColor Cyan
    Write-Host "   1. Android Studio 열기" -ForegroundColor White
    Write-Host "   2. File > Open > $androidDir" -ForegroundColor White
    Write-Host "   3. Gradle 동기화 대기" -ForegroundColor White
    Write-Host "   4. Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor White
    Write-Host ""
    
    $openStudio = Read-Host "지금 Android Studio를 여시겠습니까? (Y/N)"
    if ($openStudio -eq 'Y' -or $openStudio -eq 'y') {
        Write-Host "Android Studio 실행 중..." -ForegroundColor Green
        Start-Process $studioPath -ArgumentList $androidDir
        Write-Host ""
        Write-Host "Android Studio에서 프로젝트가 열리면:" -ForegroundColor Yellow
        Write-Host "   Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor White
        Write-Host ""
        Write-Host "빌드된 APK 위치:" -ForegroundColor Cyan
        Write-Host "   $androidDir\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Android Studio가 설치되어 있지 않습니다." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "APK 빌드 방법:" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "방법 1: Android Studio 설치 (추천)" -ForegroundColor White
    Write-Host "   1. https://developer.android.com/studio 접속" -ForegroundColor Gray
    Write-Host "   2. Android Studio 다운로드 및 설치" -ForegroundColor Gray
    Write-Host "   3. 이 스크립트 다시 실행" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "방법 2: 온라인 빌드 서비스 (Android Studio 없이)" -ForegroundColor White
    Write-Host "   1. android-app 폴더를 ZIP으로 압축" -ForegroundColor Gray
    Write-Host "   2. https://www.appetize.io/ 또는 온라인 빌드 서비스 사용" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "방법 3: GitHub Actions (자동화)" -ForegroundColor White
    Write-Host "   1. GitHub에 코드 푸시" -ForegroundColor Gray
    Write-Host "   2. GitHub Actions로 자동 APK 빌드" -ForegroundColor Gray
    Write-Host ""
    
    $download = Read-Host "Android Studio 다운로드 페이지를 여시겠습니까? (Y/N)"
    if ($download -eq 'Y' -or $download -eq 'y') {
        Start-Process "https://developer.android.com/studio"
    }
}

Write-Host ""
Write-Host "📖 자세한 가이드:" -ForegroundColor Cyan
Write-Host "   - APK-BUILD-GUIDE.md" -ForegroundColor White
Write-Host "   - android-app/README.md" -ForegroundColor White
Write-Host ""
