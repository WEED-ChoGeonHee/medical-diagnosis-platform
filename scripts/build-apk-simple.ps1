# Android APK 간편 빌드 스크립트
# 사용법: .\build-apk-simple.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  APK 간편 빌드" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot
$appDir = "$rootDir\android-app"

if (-not (Test-Path $appDir)) {
    Write-Host "android-app 폴더를 찾을 수 없습니다." -ForegroundColor Red
    exit 1
}

Set-Location $appDir

# 빌드 실행
Write-Host "`n디버그 APK 빌드 중..." -ForegroundColor Yellow
.\gradlew.bat assembleDebug 2>&1 | Tee-Object -Variable buildOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n빌드 성공!" -ForegroundColor Green
    
    $apkPath = Get-ChildItem -Path "$appDir\app\build\outputs\apk" -Filter "*.apk" -Recurse | Select-Object -First 1
    if ($apkPath) {
        Write-Host "APK: $($apkPath.FullName)" -ForegroundColor White
        Write-Host "크기: $([math]::Round($apkPath.Length / 1MB, 2)) MB" -ForegroundColor White
    }
} else {
    Write-Host "`n빌드 실패" -ForegroundColor Red
}

Set-Location $rootDir
