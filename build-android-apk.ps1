# Android WebView APK 빌드 자동화 스크립트
# 사용법: .\build-android-apk.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Android WebView APK 빌드 자동화" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot

# 환자용 앱 빌드
Write-Host "`n[1/2] 환자용 앱 빌드..." -ForegroundColor Yellow
$patientApp = "$rootDir\android-app"
if (Test-Path $patientApp) {
    Set-Location $patientApp
    if (Test-Path "gradlew.bat") {
        .\gradlew.bat assembleDebug
        if ($LASTEXITCODE -eq 0) {
            $apk = Get-ChildItem "$patientApp\app\build\outputs\apk\debug\*.apk" -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($apk) {
                Copy-Item $apk.FullName "$rootDir\환자용_의료진단.apk" -Force
                Write-Host "  환자용 APK 빌드 완료!" -ForegroundColor Green
            }
        } else {
            Write-Host "  환자용 APK 빌드 실패" -ForegroundColor Red
        }
    } else {
        Write-Host "  gradlew.bat 없음 - Android Studio에서 먼저 빌드하세요" -ForegroundColor Red
    }
}

# 의사용 앱 빌드
Write-Host "`n[2/2] 의사용 앱 빌드..." -ForegroundColor Yellow
$adminApp = "$rootDir\android-app-admin"
if (Test-Path $adminApp) {
    Set-Location $adminApp
    if (Test-Path "gradlew.bat") {
        .\gradlew.bat assembleDebug
        if ($LASTEXITCODE -eq 0) {
            $apk = Get-ChildItem "$adminApp\app\build\outputs\apk\debug\*.apk" -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($apk) {
                Copy-Item $apk.FullName "$rootDir\의사용_의료진단.apk" -Force
                Write-Host "  의사용 APK 빌드 완료!" -ForegroundColor Green
            }
        } else {
            Write-Host "  의사용 APK 빌드 실패" -ForegroundColor Red
        }
    } else {
        Write-Host "  gradlew.bat 없음 - Android Studio에서 먼저 빌드하세요" -ForegroundColor Red
    }
} else {
    Write-Host "  android-app-admin 폴더 없음 - 건너뜁니다" -ForegroundColor Yellow
}

Write-Host "`n====================================" -ForegroundColor Cyan
Write-Host "  빌드 완료!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan

Set-Location $rootDir
