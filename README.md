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

## 🔄 개발 워크플로우 (수정 후 자동 테스트 및 배포)

### 변경사항 테스트 및 배포 자동화

코드 수정 후 다음 명령으로 자동 테스트 + 배포:

```powershell
# 1단계: 프론트엔드 빌드 (테스트)
cd patient-portal
npm run build

# 빌드 확인
if (Test-Path build\index.html) { Write-Host "✅ 환자 포털 빌드 성공" } else { Write-Host "❌ 빌드 실패"; exit 1 }

# 2단계: 관리자 대시보드 빌드
cd ..\admin-dashboard
npm run build

# 빌드 확인
if (Test-Path build\index.html) { Write-Host "✅ 관리자 대시보드 빌드 성공" } else { Write-Host "❌ 빌드 실패"; exit 1 }

# 3단계: Git 커밋 및 푸시 (자동 배포 트리거)
cd ..
git add .
git commit -m "feat: your changes description"
git push origin master

# ✨ Render가 자동으로 배포 시작!
```

### 간편 스크립트 (PowerShell)

워크스페이스 루트에 `deploy.ps1` 생성:

```powershell
# deploy.ps1
Write-Host "🔨 빌드 시작..." -ForegroundColor Cyan

# 환자 포털 빌드
Set-Location patient-portal
npm run build 2>&1 | Out-Null
if (Test-Path build\index.html) {
    Write-Host "✅ 환자 포털 빌드 완료" -ForegroundColor Green
} else {
    Write-Host "❌ 환자 포털 빌드 실패" -ForegroundColor Red
    exit 1
}

# 관리자 대시보드 빌드
Set-Location ..\admin-dashboard
npm run build 2>&1 | Out-Null
if (Test-Path build\index.html) {
    Write-Host "✅ 관리자 대시보드 빌드 완료" -ForegroundColor Green
} else {
    Write-Host "❌ 관리자 대시보드 빌드 실패" -ForegroundColor Red
    exit 1
}

# Git 푸시
Set-Location ..
Write-Host "📦 변경사항 커밋 및 배포..." -ForegroundColor Cyan

$commitMsg = Read-Host "커밋 메시지를 입력하세요"
git add .
git commit -m "$commitMsg"
git push origin master

Write-Host "🚀 배포 완료! Render에서 자동 배포가 시작됩니다." -ForegroundColor Green
Write-Host "배포 상태 확인: https://dashboard.render.com" -ForegroundColor Yellow
```

**사용법**:
```powershell
.\deploy.ps1
```

### Render 자동 배포 설정 (이미 완료됨)

`render.yaml` 파일에 정의된 대로:
- ✅ `master` 브랜치에 푸시하면 **자동 배포**
- ✅ 빌드 명령: `npm install --prefix backend && npm install --prefix patient-portal && npm run build --prefix patient-portal && npm install --prefix admin-dashboard && npm run build --prefix admin-dashboard`
- ✅ 시작 명령: `node backend/server.js`

**배포 확인**:
1. https://dashboard.render.com 접속
2. "medical-diagnosis-platform" 서비스 클릭
3. "Logs" 탭에서 배포 진행 상황 확인
4. 2-3분 후 프로덕션 URL에서 변경사항 확인

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

## � 문서

상세한 문서는 [docs](docs/) 폴더를 참조하세요:

### 🏗️ 시스템 이해하기
- 📖 [메인 가이드](docs/README.md) - 프로젝트 전체 개요
- 🏗️ **[시스템 아키텍처](docs/ARCHITECTURE.md)** ⭐ - **전체 시스템 흐름 및 데이터 플로우**
- 🚀 [빠른 시작](docs/QUICK-START.md) - 로컬 개발 환경 설정
- 🌐 [웹사이트 접속](docs/START-WEB.md) - 접속 URL 및 계정 정보

### 배포 및 설정
- 🚢 [배포 가이드](docs/DEPLOY_GUIDE.md) - Render.com 배포 방법
- 🔑 [환경 변수 설정](docs/ENVIRONMENT_VARIABLES.md) - 필수 환경 변수
- 🗄️ [Aiven MySQL 설정](docs/AIVEN_MYSQL.md) - 데이터베이스 설정
- ☁️ [Cloudinary 설정](docs/CLOUDINARY_SETUP.md) - 이미지 스토리지 설정

### 모바일 앱
- 📱 [APK 빌드 가이드](docs/APK_BUILD.md) - Android 앱 빌드 방법

### 테스트 및 문제 해결
- 🧪 [이미지 업로드 테스트](docs/이미지_업로드_테스트_가이드.md)
- 🔧 [Render 문제 해결](docs/RENDER_TROUBLESHOOTING.md) - 배포 오류 해결

---

## 📄 라이선스

이 프로젝트는 교육 및 개인 프로젝트 용도입니다.
