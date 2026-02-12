# 🏥 피부과 AI 의료 진단 플랫폼

환자가 피부 증상을 입력하고 이미지를 업로드하면, AI(Gemini)가 자동으로 진단하고 관련 의학 정보를 제공하는 통합 의료 플랫폼입니다.

## 📋 주요 기능

### 환자 포털 (Patient Portal)
- 피부 증상 입력 및 이미지 업로드 (최대 5장)
- AI(Gemini) 기반 자동 피부과 진단
- 관련 의학 논문 정보 제공
- 진단 기록 조회

### 관리자 대시보드 (Admin Dashboard)
- 의사 전용 로그인 (역할 기반 접근 제어)
- 환자 진단 목록 관리 (필터링, 페이지네이션)
- 의사 소견 작성 및 진단 상태 관리
- KPI 통계 대시보드 (진단 현황, 증상/피부타입 차트)
- 환자 목록 조회

### Android 앱
- 환자 포털 WebView 앱
- 카메라 촬영 및 갤러리 이미지 선택
- Android 13+ 권한 정책 대응

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| **백엔드** | Node.js, Express.js |
| **데이터베이스** | MySQL (Aiven Cloud) |
| **프론트엔드** | React.js |
| **AI 진단** | Google Gemini API |
| **이미지 저장** | Cloudinary |
| **배포** | Render.com |
| **모바일** | Android (Java, WebView) |
| **인증** | JWT + bcrypt |

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 18+
- npm

### 1. 저장소 클론
```bash
git clone https://github.com/WEED-ChoGeonHee/medical-diagnosis-platform.git
cd medical-diagnosis-platform
```

### 2. 백엔드 설정
```bash
cd backend
npm install
```

`.env` 파일 생성:
```env
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_SSL=true
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
# 의사 계정 생성
node create-doctor.js

# 서버 실행
node server.js
```

### 3. 환자 포털 실행 (개발 모드)
```bash
cd patient-portal
npm install
npm start
```
브라우저에서 http://localhost:3000 접속

### 4. 관리자 대시보드 실행 (개발 모드)
```bash
cd admin-dashboard
npm install
PORT=3001 npm start
```
브라우저에서 http://localhost:3001/login 접속

---

## 🌐 배포 URL (프로덕션)

| 서비스 | URL |
|--------|-----|
| **환자 포털** | https://medical-diagnosis-platform.onrender.com/patient |
| **관리자 대시보드** | https://medical-diagnosis-platform.onrender.com/admin |

### 의사 계정
- **이메일**: `doctor@hospital.com`
- **비밀번호**: `doctor123`

---

## 📁 프로젝트 구조

```
medical-diagnosis-platform/
├── backend/                  # Express.js API 서버
│   ├── config/
│   │   └── database.js       # MySQL 연결 + 마이그레이션
│   ├── middleware/
│   │   └── auth.js           # JWT 인증/인가
│   ├── models/
│   │   ├── User.js           # 사용자 모델
│   │   └── Diagnosis.js      # 진단 모델
│   ├── routes/
│   │   ├── auth.js           # 인증 API
│   │   ├── admin.js          # 관리자 API
│   │   ├── diagnoses.js      # 진단 API
│   │   └── patients.js       # 환자 API
│   ├── create-doctor.js      # 의사 계정 시딩
│   └── server.js             # 서버 엔트리포인트
├── patient-portal/           # 환자용 React 앱
├── admin-dashboard/          # 관리자용 React 앱
├── android-app/              # Android WebView 앱
└── render.yaml               # Render 배포 설정
```

---

## 📊 API 엔드포인트

### 인증
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/register` | 환자 회원가입 |
| POST | `/api/auth/login` | 로그인 |

### 진단 (환자용)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/diagnoses` | 새 진단 요청 (이미지 포함) |
| GET | `/api/diagnoses/my` | 내 진단 목록 |
| GET | `/api/diagnoses/:id` | 진단 상세 |

### 관리자 (의사용)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/stats` | 통계 정보 |
| GET | `/api/admin/diagnoses` | 전체 진단 목록 |
| PUT | `/api/admin/diagnoses/:id` | 의사 소견 저장 |
| GET | `/api/admin/patients` | 환자 목록 |

---

## 📱 Android APK 빌드

자세한 내용은 [APK-BUILD-GUIDE.md](APK-BUILD-GUIDE.md) 참조

---

## 📄 라이선스

MIT License
