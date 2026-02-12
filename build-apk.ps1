# Android APK 빌드 스크립트
# 사용법: .\build-apk.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Android APK 빌드" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot

# android-app 폴더 확인
$appDir = "$rootDir\android-app"
if (-not (Test-Path $appDir)) {
    Write-Host "android-app 폴더가 없습니다." -ForegroundColor Red
    exit 1
}

Set-Location $appDir

# Gradle Wrapper 확인
if (-not (Test-Path "gradlew.bat")) {
    Write-Host "gradlew.bat가 없습니다. Android Studio에서 프로젝트를 먼저 열어주세요." -ForegroundColor Red
    exit 1
}

# 디버그 APK 빌드
Write-Host "`nAPK 빌드 중..." -ForegroundColor Yellow
.\gradlew.bat assembleDebug

if ($LASTEXITCODE -eq 0) {
    $apkPath = "$appDir\app\build\outputs\apk\debug\app-debug.apk"
    if (Test-Path $apkPath) {
        Write-Host "`n빌드 성공!" -ForegroundColor Green
        Write-Host "APK 경로: $apkPath" -ForegroundColor White
        
        # APK를 루트 폴더로 복사
        Copy-Item $apkPath "$rootDir\환자용_의료진단.apk" -Force
        Write-Host "복사 완료: $rootDir\환자용_의료진단.apk" -ForegroundColor Green
    }
} else {
    Write-Host "`n빌드 실패! Android Studio를 확인하세요." -ForegroundColor Red
}

Set-Location $rootDir
