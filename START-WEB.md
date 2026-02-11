# 🌐 웹사이트 접속 가이드

## 💻 로컬 서버 실행 (개발용)

### 1단계: MySQL 서버 시작
PowerShell에서 실행:
```powershell
# MySQL 서비스 시작 (Windows)
Start-Service MySQL80  # MySQL 8.0 기준

# 또는 XAMPP 사용 시
# XAMPP Control Panel에서 MySQL 시작
```

### 2단계: 백엔드 .env 파일 설정
`backend\.env` 파일 생성 (없으면):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medical_diagnosis
GEMINI_API_KEY=AIzaSyC5YvYM0s72gEABsISDMrt-didXfZxksvg
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 3단계: 백엔드 서버 시작
```powershell
cd e:\소스\의학\backend
npm install
npm start
```

백엔드가 http://localhost:5000 에서 실행됩니다.

### 4단계: 환자 포털 시작 (새 터미널)
```powershell
cd e:\소스\의학\patient-portal
npm install
npm start
```

자동으로 브라우저가 열리며 http://localhost:3000 에서 접속됩니다.

### 5단계: 관리자 대시보드 시작 (필요시, 새 터미널)
```powershell
cd e:\소스\의학\admin-dashboard
npm install
npm start
```

http://localhost:3001 에서 접속됩니다.

---

## ☁️ 배포된 서버 접속 (추천)

배포가 완료되었다면:
- **환자 포털**: https://medical-diagnosis-backend.onrender.com/patient
- **관리자 대시보드**: https://medical-diagnosis-backend.onrender.com/admin

⚠️ 첫 접속 시 30초~1분 대기 (무료 서버 재시작)

---

## 📱 모바일에서 접속

### Wi-Fi로 접속 (같은 네트워크)
1. PC와 모바일이 같은 Wi-Fi에 연결
2. PC의 IP 주소 확인:
   ```powershell
   ipconfig
   # IPv4 주소 확인 (예: 192.168.0.10)
   ```
3. 모바일 브라우저에서 접속:
   - 환자 포털: `http://192.168.0.10:3000`
   - 관리자: `http://192.168.0.10:3001`

### 배포 서버 접속 (어디서나)
- 모바일 브라우저에서 배포 URL 접속
- 홈 화면에 추가하여 앱처럼 사용 가능
