# 🌐 웹사이트 접속 가이드

## 배포 서버 접속

### 환자 포털
```
https://medical-diagnosis-platform.onrender.com/patient
```

### 관리자 대시보드
```
https://medical-diagnosis-platform.onrender.com/admin
```

---

## 로컬 개발 서버 접속

### 백엔드 API 서버
```bash
cd backend && node server.js
# http://localhost:5000
```

### 환자 포털 (개발 모드)
```bash
cd patient-portal && npm start
# http://localhost:3000
```

### 관리자 대시보드 (개발 모드)
```bash
cd admin-dashboard && PORT=3001 npm start
# http://localhost:3001/login
```

---

## 계정 정보

### 의사 계정
- **이메일**: `doctor@hospital.com`
- **비밀번호**: `doctor123`

### 환자 계정
- 회원가입 후 사용

---

## 참고
> 무료 Render 플랜은 15분 비활성 시 슬립 모드에 진입합니다.
> 첫 접속 시 30초~1분 정도 로딩이 걸릴 수 있습니다.
