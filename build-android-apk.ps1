# Android WebView 앱 빌드 자동화
# 사용법: .\build-android-apk.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Android APK 빌드 스크립트" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$appDir = "e:\소스\의학\android-app"

# Android Studio 또는 Android SDK 확인
$androidHome = $env:ANDROID_HOME
$androidSdk = $env:ANDROID_SDK_ROOT

if (-not $androidHome -and -not $androidSdk) {
    Write-Host "⚠️  Android SDK를 찾을 수 없습니다!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "다음 중 하나를 선택하세요:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Android Studio 설치 (추천)" -ForegroundColor White
    Write-Host "   https://developer.android.com/studio" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Android Studio에서 프로젝트 열기" -ForegroundColor White
    Write-Host "   File > Open > $appDir" -ForegroundColor Gray
    Write-Host "   Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. 온라인 빌드 서비스 사용" -ForegroundColor White
    Write-Host "   https://www.buildapp.io/" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Android Studio를 여시겠습니까? (Y/N)"
    if ($choice -eq 'Y' -or $choice -eq 'y') {
        # Android Studio 경로 찾기
        $studioPath = "C:\Program Files\Android\Android Studio\bin\studio64.exe"
        if (Test-Path $studioPath) {
            Write-Host "Android Studio 실행 중..." -ForegroundColor Green
            Start-Process $studioPath -ArgumentList $appDir
        } else {
            Write-Host "Android Studio를 찾을 수 없습니다. 수동으로 설치하세요." -ForegroundColor Red
            Start-Process "https://developer.android.com/studio"
        }
    }
    exit
}

# Gradle Wrapper 확인
cd $appDir

if (-not (Test-Path "gradlew.bat")) {
    Write-Host "Gradle Wrapper 생성 중..." -ForegroundColor Yellow
    gradle wrapper
}

Write-Host "[1/3] 프로젝트 정리 중..." -ForegroundColor Yellow
.\gradlew.bat clean

Write-Host "[2/3] APK 빌드 중..." -ForegroundColor Yellow
.\gradlew.bat assembleDebug

if ($?) {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "   ✅ APK 빌드 완료!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
    
    if (Test-Path $apkPath) {
        $fullPath = (Resolve-Path $apkPath).Path
        $fileSize = (Get-Item $apkPath).Length / 1MB
        
        Write-Host "📱 APK 파일 정보:" -ForegroundColor Cyan
        Write-Host "   위치: $fullPath" -ForegroundColor White
        Write-Host "   크기: $([math]::Round($fileSize, 2)) MB" -ForegroundColor White
        Write-Host ""
        
        # APK를 루트로 복사
        $destPath = "..\medical-diagnosis.apk"
        Copy-Item $apkPath $destPath -Force
        
        Write-Host "[3/3] APK 복사 완료:" -ForegroundColor Green
        Write-Host "   e:\소스\의학\medical-diagnosis.apk" -ForegroundColor White
        Write-Host ""
        
        # 설치 안내
        Write-Host "📲 설치 방법:" -ForegroundColor Cyan
        Write-Host "   1. APK 파일을 스마트폰으로 전송" -ForegroundColor White
        Write-Host "   2. 파일 관리자에서 APK 클릭" -ForegroundColor White
        Write-Host "   3. '알 수 없는 출처' 앱 설치 허용" -ForegroundColor White
        Write-Host "   4. 설치 완료!" -ForegroundColor White
        Write-Host ""
        
        # 파일 탐색기로 열기
        $openChoice = Read-Host "파일 탐색기로 APK 위치를 여시겠습니까? (Y/N)"
        if ($openChoice -eq 'Y' -or $openChoice -eq 'y') {
            explorer.exe /select,$fullPath
        }
    } else {
        Write-Host "APK 파일을 찾을 수 없습니다: $apkPath" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Red
    Write-Host "   ❌ APK 빌드 실패" -ForegroundColor Red
    Write-Host "====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "문제 해결:" -ForegroundColor Yellow
    Write-Host "   1. Android Studio에서 프로젝트를 열어보세요" -ForegroundColor White
    Write-Host "   2. Sync Project with Gradle Files 실행" -ForegroundColor White
    Write-Host "   3. 빌드 로그에서 에러 확인" -ForegroundColor White
}

Write-Host ""
