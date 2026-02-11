# 환자 포털 APK 빌드 자동화 스크립트
# 사용법: .\build-apk.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   의료 진단 플랫폼 APK 빌드" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Capacitor가 설치되어 있는지 확인
$patientPortalDir = "e:\소스\의학\patient-portal"
cd $patientPortalDir

Write-Host "[1/6] Capacitor 확인 중..." -ForegroundColor Yellow

# package.json에서 capacitor 확인
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
if (-not $packageJson.dependencies."@capacitor/core") {
    Write-Host "Capacitor 설치 중..." -ForegroundColor Green
    npm install --save @capacitor/core @capacitor/cli @capacitor/android
    
    Write-Host "Capacitor 초기화 중..." -ForegroundColor Green
    npx cap init medicalApp com.medical.patient --web-dir=build
}

Write-Host "[2/6] React 앱 빌드 중..." -ForegroundColor Yellow

# API URL을 배포 서버로 변경
$apiFile = "src\api.js"
if (Test-Path $apiFile) {
    $apiContent = Get-Content $apiFile -Raw
    if ($apiContent -match "localhost") {
        Write-Host "   ⚠️  API URL을 배포 서버로 변경해야 합니다!" -ForegroundColor Red
        Write-Host "   src/api.js 파일에서 API_URL을 확인하세요." -ForegroundColor Red
        Write-Host ""
        Read-Host "계속하려면 Enter를 누르세요"
    }
}

# 프로덕션 빌드
npm run build

if (-not $?) {
    Write-Host "빌드 실패!" -ForegroundColor Red
    exit 1
}

Write-Host "[3/6] Android 플랫폼 확인 중..." -ForegroundColor Yellow

# Android 플랫폼 추가 (이미 있으면 스킵)
if (-not (Test-Path "android")) {
    npx cap add android
}

Write-Host "[4/6] Capacitor 동기화 중..." -ForegroundColor Yellow
npx cap sync android

Write-Host "[5/6] APK 빌드 중..." -ForegroundColor Yellow

# Gradle이 설치되어 있는지 확인
if (Test-Path "android\gradlew.bat") {
    cd android
    .\gradlew.bat assembleDebug
    
    if ($?) {
        Write-Host ""
        Write-Host "====================================" -ForegroundColor Green
        Write-Host "   APK 빌드 완료!" -ForegroundColor Green
        Write-Host "====================================" -ForegroundColor Green
        Write-Host ""
        
        $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
        if (Test-Path $apkPath) {
            $fullPath = (Resolve-Path $apkPath).Path
            Write-Host "📱 APK 파일 위치:" -ForegroundColor Cyan
            Write-Host "   $fullPath" -ForegroundColor White
            Write-Host ""
            
            # 파일 크기 표시
            $fileSize = (Get-Item $apkPath).Length / 1MB
            Write-Host "📦 파일 크기: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
            Write-Host ""
            
            # APK를 루트 디렉토리로 복사
            $destPath = "..\..\patient-portal.apk"
            Copy-Item $apkPath $destPath -Force
            Write-Host "✅ APK 파일이 복사되었습니다:" -ForegroundColor Green
            Write-Host "   $patientPortalDir\patient-portal.apk" -ForegroundColor White
        }
    } else {
        Write-Host "APK 빌드 실패!" -ForegroundColor Red
        Write-Host "Android Studio를 설치하고 다시 시도하세요." -ForegroundColor Yellow
    }
    
    cd ..
} else {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Yellow
    Write-Host "   Android Studio 필요" -ForegroundColor Yellow
    Write-Host "====================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "APK를 빌드하려면 Android Studio가 필요합니다." -ForegroundColor White
    Write-Host ""
    Write-Host "다음 명령어로 Android Studio를 열고 수동으로 빌드하세요:" -ForegroundColor Cyan
    Write-Host "   npx cap open android" -ForegroundColor White
    Write-Host ""
    Write-Host "Android Studio에서:" -ForegroundColor Cyan
    Write-Host "   Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor White
}

Write-Host ""
Write-Host "[6/6] 완료!" -ForegroundColor Green
Write-Host ""
