# 🚀 자동 빌드 및 배포 스크립트
# 사용법: .\deploy.ps1

Write-Host "`n🔨 빌드 시작...`n" -ForegroundColor Cyan

# 환자 포털 빌드
Write-Host "[1/2] 환자 포털 빌드 중..." -ForegroundColor Yellow
Set-Location patient-portal
$env:CI = 'false'
npm run build 2>&1 | Out-Null

if (Test-Path build\index.html) {
    Write-Host "✅ 환자 포털 빌드 완료" -ForegroundColor Green
} else {
    Write-Host "❌ 환자 포털 빌드 실패" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# 관리자 대시보드 빌드
Write-Host "[2/2] 관리자 대시보드 빌드 중..." -ForegroundColor Yellow
Set-Location ..\admin-dashboard
$env:CI = 'false'
npm run build 2>&1 | Out-Null

if (Test-Path build\index.html) {
    Write-Host "✅ 관리자 대시보드 빌드 완료`n" -ForegroundColor Green
} else {
    Write-Host "❌ 관리자 대시보드 빌드 실패" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Git 작업
Set-Location ..
Write-Host "📦 Git 커밋 및 배포 준비...`n" -ForegroundColor Cyan

# 변경사항 확인
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "⚠️  변경사항이 없습니다." -ForegroundColor Yellow
    exit 0
}

Write-Host "변경된 파일:" -ForegroundColor Cyan
git status --short

$commitMsg = Read-Host "`n커밋 메시지를 입력하세요"

if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    Write-Host "❌ 커밋 메시지가 필요합니다." -ForegroundColor Red
    exit 1
}

git add .
git commit -m "$commitMsg"

Write-Host "`n🚀 Render에 배포 중..." -ForegroundColor Cyan
git push origin master

Write-Host "`n배포 완료!`n" -ForegroundColor Green
Write-Host "배포 상태 확인: https://dashboard.render.com" -ForegroundColor Yellow
Write-Host "환자 포털: https://medical-diagnosis-platform.onrender.com/patient" -ForegroundColor Cyan
Write-Host "관리자 대시보드: https://medical-diagnosis-platform.onrender.com/admin" -ForegroundColor Cyan
Write-Host "`n배포 완료까지 약 2-3분 소요됩니다.`n" -ForegroundColor Gray
