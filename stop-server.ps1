# 의료 진단 플랫폼 - 서버 중지 스크립트
# 사용법: .\stop-server.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  서버 중지 스크립트" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Node.js 프로세스 찾기
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "`n실행 중인 Node.js 프로세스:" -ForegroundColor Yellow
    $nodeProcesses | Format-Table Id, ProcessName, StartTime -AutoSize

    Write-Host "모든 Node.js 프로세스를 종료합니다..." -ForegroundColor Red
    $nodeProcesses | Stop-Process -Force
    Write-Host "서버가 종료되었습니다." -ForegroundColor Green
} else {
    Write-Host "`n실행 중인 Node.js 프로세스가 없습니다." -ForegroundColor Yellow
}
