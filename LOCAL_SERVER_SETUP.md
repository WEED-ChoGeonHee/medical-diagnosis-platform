# PC를 서버로 사용하기 가이드

현재 PC를 외부에서 접근 가능한 서버로 설정하는 방법입니다.

## 📋 목차
1. [기본 요구사항](#기본-요구사항)
2. [MongoDB 설치 및 설정](#mongodb-설치-및-설정)
3. [환경 변수 설정](#환경-변수-설정)
4. [방화벽 설정](#방화벽-설정)
5. [포트 포워딩 설정](#포트-포워딩-설정)
6. [동적 DNS 설정](#동적-dns-설정)
7. [서버 실행](#서버-실행)
8. [외부 접근 테스트](#외부-접근-테스트)
9. [보안 강화](#보안-강화)
10. [자동 시작 설정](#자동-시작-설정)

---

## 기본 요구사항

### 필수 프로그램
- ✅ Node.js (이미 설치됨)
- ✅ Git (이미 설치됨)
- ⬜ MongoDB Community Server
- ⬜ ngrok (임시 테스트용, 선택사항)

### 네트워크 환경
- 공유기/라우터 관리자 권한
- 고정 IP 또는 동적 DNS 계정
- 방화벽 설정 권한

---

## MongoDB 설치 및 설정

### 1. MongoDB 설치

```powershell
# Chocolatey가 있는 경우
choco install mongodb

# 또는 수동 다운로드
# https://www.mongodb.com/try/download/community
```

### 2. MongoDB 서비스 시작

```powershell
# MongoDB 서비스 시작
net start MongoDB

# 또는 수동 실행
mongod --dbpath C:\data\db
```

### 3. MongoDB 연결 확인

```powershell
# MongoDB 셸에서 확인
mongosh
# 연결 성공 시 MongoDB 프롬프트 표시
```

---

## 환경 변수 설정

### Backend 환경 변수

`backend/.env` 파일 생성:

```env
# 서버 설정
NODE_ENV=production
PORT=5000

# MongoDB 설정 (로컬)
MONGODB_URI=mongodb://localhost:27017/medical-diagnosis

# JWT 시크릿 (랜덤 문자열 생성)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI API 키
OPENAI_API_KEY=sk-your-openai-api-key

# CORS 설정 (외부 IP로 변경 필요)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://YOUR_PUBLIC_IP:3000,http://YOUR_PUBLIC_IP:3001
```

### Frontend 환경 변수

`patient-portal/.env`:
```env
REACT_APP_API_URL=http://YOUR_PUBLIC_IP:5000
```

`admin-dashboard/.env`:
```env
REACT_APP_API_URL=http://YOUR_PUBLIC_IP:5000
```

---

## 방화벽 설정

### Windows 방화벽 인바운드 규칙 추가

```powershell
# 관리자 권한으로 PowerShell 실행 후

# Backend (포트 5000)
New-NetFirewallRule -DisplayName "Medical Diagnosis Backend" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow

# Patient Portal (포트 3000)
New-NetFirewallRule -DisplayName "Medical Diagnosis Patient Portal" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow

# Admin Dashboard (포트 3001)
New-NetFirewallRule -DisplayName "Medical Diagnosis Admin" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow

# MongoDB (포트 27017) - 외부 접근 필요 시만
New-NetFirewallRule -DisplayName "MongoDB" -Direction Inbound -Protocol TCP -LocalPort 27017 -Action Allow
```

또는 GUI로 설정:
1. `Windows 방화벽` → `고급 설정`
2. `인바운드 규칙` → `새 규칙`
3. `포트` 선택 → `TCP` → 특정 로컬 포트 `5000, 3000, 3001` 입력
4. `연결 허용` → 이름 지정 후 완료

---

## 포트 포워딩 설정

### 공유기 설정 방법 (일반적인 단계)

1. **공유기 관리 페이지 접속**
   - 브라우저에서 `192.168.0.1` 또는 `192.168.1.1` 접속
   - 관리자 계정으로 로그인

2. **현재 PC의 로컬 IP 확인**
   ```powershell
   ipconfig
   # IPv4 주소 확인 (예: 192.168.0.100)
   ```

3. **포트 포워딩 규칙 추가**
   - 메뉴: `고급 설정` → `NAT/라우터 설정` → `포트 포워딩`
   
   | 서비스 이름 | 외부 포트 | 내부 IP | 내부 포트 | 프로토콜 |
   |------------|----------|---------|----------|---------|
   | Backend | 5000 | 192.168.0.100 | 5000 | TCP |
   | Patient Portal | 3000 | 192.168.0.100 | 3000 | TCP |
   | Admin Dashboard | 3001 | 192.168.0.100 | 3001 | TCP |

4. **저장 및 재시작**

### 현재 공인 IP 확인

```powershell
# PowerShell에서
(Invoke-WebRequest -Uri "http://ifconfig.me/ip").Content

# 또는 브라우저에서
# https://www.whatismyip.com/
```

---

## 동적 DNS 설정

공인 IP가 자주 변경되는 경우 동적 DNS 사용 권장:

### 무료 DDNS 서비스
- **No-IP**: https://www.noip.com/
- **DuckDNS**: https://www.duckdns.org/
- **FreeDNS**: https://freedns.afraid.org/

### DuckDNS 설정 예시

1. DuckDNS 회웃 가입 및 도메인 생성
   - 예: `medical-diagnosis.duckdns.org`

2. Windows에서 자동 업데이트 스크립트 생성

`update-dns.ps1`:
```powershell
$domain = "medical-diagnosis"
$token = "your-duckdns-token"
Invoke-WebRequest "https://www.duckdns.org/update?domains=$domain&token=$token&ip="
```

3. 작업 스케줄러에 등록 (5분마다 실행)

---

## 서버 실행

### 1. 의존성 설치

```powershell
# Backend
cd backend
npm install

# Patient Portal
cd ..\patient-portal
npm install

# Admin Dashboard
cd ..\admin-dashboard
npm install
```

### 2. Production 빌드

```powershell
# Patient Portal
cd patient-portal
npm run build

# Admin Dashboard
cd ..\admin-dashboard
npm run build
```

### 3. 서버 실행 스크립트 사용

프로젝트 루트에서:
```powershell
.\start-server.ps1
```

또는 수동 실행:

**터미널 1 - Backend:**
```powershell
cd backend
node server.js
```

**터미널 2 - Patient Portal:**
```powershell
cd patient-portal
npx serve -s build -l 3000
```

**터미널 3 - Admin Dashboard:**
```powershell
cd admin-dashboard
npx serve -s build -l 3001
```

---

## 외부 접근 테스트

### 1. 로컬 테스트
```
http://localhost:5000          # Backend API
http://localhost:3000          # Patient Portal
http://localhost:3001          # Admin Dashboard
```

### 2. 같은 네트워크 내에서 테스트
```
http://192.168.0.100:5000      # Backend API
http://192.168.0.100:3000      # Patient Portal
http://192.168.0.100:3001      # Admin Dashboard
```

### 3. 외부에서 테스트 (모바일 데이터 사용)
```
http://YOUR_PUBLIC_IP:5000     # Backend API
http://YOUR_PUBLIC_IP:3000     # Patient Portal
http://YOUR_PUBLIC_IP:3001     # Admin Dashboard
```

또는 DDNS 사용 시:
```
http://medical-diagnosis.duckdns.org:5000
http://medical-diagnosis.duckdns.org:3000
http://medical-diagnosis.duckdns.org:3001
```

---

## 보안 강화

### 1. HTTPS 설정 (권장)

**Let's Encrypt + Nginx 사용:**

```powershell
# Nginx 설치
choco install nginx

# Certbot 설치
choco install certbot
```

Nginx 설정 파일 예시는 `nginx.conf.example` 참조

### 2. 환경 변수 보안
- `.env` 파일을 절대 공개하지 마세요
- 강력한 JWT_SECRET 사용
- 주기적으로 키 변경

### 3. MongoDB 보안
```javascript
// MongoDB 인증 활성화
mongod --auth --dbpath C:\data\db

// 관리자 계정 생성
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["userAdminAnyDatabase"]
})
```

### 4. Rate Limiting
Backend에 이미 구현된 rate limiting 확인:
```javascript
// server.js에서
app.use('/api/', rateLimiter);
```

### 5. 정기 업데이트
```powershell
# 의존성 업데이트
npm audit fix
npm update
```

---

## 자동 시작 설정

### PM2 사용 (권장)

```powershell
# PM2 전역 설치
npm install -g pm2

# Backend 시작
cd backend
pm2 start server.js --name medical-backend

# Frontend 서빙 (선택사항)
pm2 start "npx serve -s build -l 3000" --name patient-portal
pm2 start "npx serve -s build -l 3001" --name admin-dashboard

# PM2 목록 확인
pm2 list

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save

# 로그 확인
pm2 logs

# 재시작
pm2 restart all

# 중지
pm2 stop all
```

### Windows 서비스로 등록

**NSSM 사용:**
```powershell
# NSSM 설치
choco install nssm

# Backend 서비스 등록
nssm install MedicalBackend "C:\Program Files\nodejs\node.exe" "E:\소스\의학\backend\server.js"
nssm set MedicalBackend AppDirectory "E:\소스\의학\backend"
nssm start MedicalBackend

# 서비스 상태 확인
nssm status MedicalBackend
```

---

## 대안: ngrok 사용 (빠른 테스트용)

포트 포워딩 없이 즉시 외부 접근이 필요한 경우:

```powershell
# ngrok 설치
choco install ngrok

# Backend 노출
ngrok http 5000

# 제공된 URL 사용 (예: https://abc123.ngrok.io)
```

**장점:**
- 설정이 간단
- HTTPS 자동 제공
- 방화벽/포트 포워딩 불필요

**단점:**
- URL이 매번 변경됨 (무료 플랜)
- 성능 제한
- 장기 운영 부적합

---

## 모니터링 및 유지보수

### 1. 로그 모니터링
```powershell
# PM2 로그
pm2 logs --lines 100

# MongoDB 로그
Get-Content C:\data\db\mongod.log -Tail 50 -Wait
```

### 2. 시스템 리소스 확인
```powershell
# CPU, 메모리 사용량
pm2 monit
```

### 3. 백업 설정
```powershell
# MongoDB 백업 스크립트
mongodump --db medical-diagnosis --out C:\backups\mongodb\$(Get-Date -Format 'yyyy-MM-dd')
```

### 4. 디스크 공간 관리
```powershell
# 업로드 파일 정리 (30일 이상 된 파일)
Get-ChildItem "E:\소스\의학\backend\uploads" -Recurse | 
  Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} | 
  Remove-Item
```

---

## 문제 해결

### 포트가 이미 사용 중인 경우
```powershell
# 포트 사용 프로세스 확인
netstat -ano | findstr :5000

# 프로세스 종료
taskkill /PID <PID> /F
```

### MongoDB 연결 실패
```powershell
# MongoDB 서비스 상태 확인
Get-Service MongoDB

# 서비스 재시작
Restart-Service MongoDB
```

### 외부 접근 안 됨
1. 방화벽 규칙 확인
2. 포트 포워딩 설정 확인
3. 공인 IP 확인
4. ISP의 포트 차단 여부 확인 (일부 ISP는 특정 포트 차단)

---

## 체크리스트

설정 완료 후 확인사항:

- [ ] MongoDB 설치 및 실행
- [ ] Backend .env 파일 설정
- [ ] Frontend .env 파일 설정 (공인 IP/도메인)
- [ ] Windows 방화벽 규칙 추가
- [ ] 공유기 포트 포워딩 설정
- [ ] 공인 IP/DDNS 확인
- [ ] 로컬에서 접근 테스트
- [ ] 외부에서 접근 테스트
- [ ] HTTPS 설정 (선택사항)
- [ ] PM2/서비스 자동 시작 설정
- [ ] 의사 계정 생성
- [ ] 백업 설정
- [ ] 모니터링 설정

---

## 추가 참고사항

### 전력 관리
PC를 서버로 사용하는 경우:
- 절전 모드 비활성화
- 하드 디스크 대기 비활성화
- 자동 업데이트 시간 조정

```powershell
# 절전 모드 비활성화
powercfg -change -standby-timeout-ac 0
powercfg -change -disk-timeout-ac 0
```

### 성능 최적화
- SSD 사용 권장 (MongoDB)
- 충분한 RAM (최소 8GB)
- 안정적인 인터넷 연결 (업로드 속도 중요)

### 비용 고려사항
- 전기료 (24/7 운영 시)
- 고정 IP 비용 (ISP에 별도 신청 필요할 수 있음)
- 트래픽 제한 확인 (일부 ISP는 업로드 제한)

---

## 도움이 필요한 경우

- 프로젝트 이슈: [GitHub Issues](https://github.com/WEED-ChoGeonHee/medical-diagnosis-platform/issues)
- MongoDB 문서: https://docs.mongodb.com/
- Node.js 문서: https://nodejs.org/docs/
- PM2 문서: https://pm2.keymetrics.io/docs/
