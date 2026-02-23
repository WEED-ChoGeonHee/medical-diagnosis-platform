# 🏥 피부과 AI 의료 진단 플랫폼

환자가 피부 사진을 올리면 **AI(Google Gemini)**가 자동 진단하고, 의사가 최종 소견을 작성하는 플랫폼입니다.

---

## 🌐 프로덕션 URL

| 서비스 | URL |
|--------|-----|
| 환자 포털 | https://medical-diagnosis-platform.onrender.com/patient |
| 관리자 대시보드 | https://medical-diagnosis-platform.onrender.com/admin |

> **의사 테스트 계정**: `doctor@hospital.com` / `doctor123`  
> **환자 계정**: 회원가입 후 사용

---

## 🛠 기술 스택

| 구분 | 기술 | 역할 |
|------|------|------|
| 백엔드 | Node.js + Express | REST API 서버 |
| DB | MySQL (Aiven Cloud) | 사용자/진단 데이터 저장 |
| 프론트엔드 | React.js x 2 | 환자 포털 + 관리자 대시보드 |
| AI | Google Gemini API | 피부 질환 자동 진단 |
| 이미지 | Cloudinary | 환자 사진 업로드/CDN |
| 인증 | JWT + bcrypt | 로그인, 역할 기반 접근 제어 |
| 배포 | Render.com | 자동 배포 (master push 시) |
| 모바일 | Android WebView | 환자용/의사용 앱 |

---

## 📁 프로젝트 구조

```
├── backend/                     # ⭐ Express API 서버
│   ├── server.js                #    서버 진입점 (Express 앱 설정)
│   ├── config/database.js       #    MySQL 연결 + 테이블 자동 생성
│   ├── middleware/auth.js       #    JWT 인증 + 역할 확인
│   ├── models/                  #    DB 쿼리 함수
│   │   ├── User.js              #    - 회원가입, 로그인
│   │   └── Diagnosis.js         #    - 진단 CRUD
│   └── routes/                  #    API 엔드포인트
│       ├── auth.js              #    - POST /api/auth/register, login
│       ├── diagnoses.js         #    - POST/GET /api/diagnoses
│       ├── admin.js             #    - GET/PUT /api/admin/*
│       └── patients.js          #    - GET /api/patients/profile
│
├── patient-portal/              # 환자용 React 앱 (/patient)
│   └── src/components/
│       ├── NewDiagnosis.js      #    진단 요청 (사진 업로드 + AI 진단)
│       ├── Dashboard.js         #    내 진단 목록
│       ├── DiagnosisDetail.js   #    진단 상세 보기
│       ├── Login.js / Register.js
│       └── Header.js
│
├── admin-dashboard/             # 의사용 React 앱 (/admin)
│   └── src/components/
│       ├── Dashboard.js         #    KPI 통계 대시보드
│       ├── DiagnosisList.js     #    진단 목록 (필터, 페이지네이션)
│       ├── DiagnosisDetail.js   #    진단 상세 + 의사 소견 작성
│       ├── PatientList.js       #    환자 목록
│       ├── Login.js
│       └── Header.js
│
├── android-app/                 # 환자용 Android 앱 (WebView)
├── android-app-admin/           # 의사용 Android 앱 (WebView)
│
├── scripts/
│   ├── quick-start.ps1          #    한번에 전체 실행
│   ├── build-android-apk.ps1   #    APK 빌드
│   ├── start-server.ps1        #    백엔드만 실행
│   ├── stop-server.ps1         #    Node 프로세스 종료
│   └── backend-utils/
│       ├── create-doctor.js     #    의사 계정 생성 (DB 직접 insert)
│       ├── reset-db.js          #    DB 초기화 (주의!)
│       └── seed-dermatology-data.js  # 피부과 코드/데이터 시딩
│
├── docs/                        # 상세 문서 (아래 참고)
├── deploy.ps1                   # 빌드 + 커밋 + 배포 스크립트
├── docker-compose.yml           # 로컬 Docker 개발환경
├── render.yaml                  # Render.com 배포 설정
└── .env.example                 # 환경 변수 템플릿
```

---

## 🚀 로컬 개발 시작하기

### 사전 준비
- **Node.js 18+**
- **MySQL** (로컬 또는 [Aiven](https://aiven.io) 무료 계정)
- **Cloudinary** 계정 ([가입](https://cloudinary.com))
- **Google AI Studio** API 키 ([발급](https://aistudio.google.com))

### 1단계: 환경 변수 설정
```bash
cp backend/.env.example backend/.env
```
`backend/.env` 파일을 열어서 실제 값을 입력하세요.  
각 변수의 의미는 [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md) 참고.

### 2단계: 한번에 실행 (PowerShell)
```powershell
.\scripts\quick-start.ps1
```

### 또는 개별 실행
```bash
# 터미널 1 — 백엔드 (http://localhost:5000)
cd backend && npm install && node server.js

# 터미널 2 — 환자 포털 (http://localhost:3000)
cd patient-portal && npm install && npm start

# 터미널 3 — 관리자 대시보드 (http://localhost:3001)
cd admin-dashboard && npm install && PORT=3001 npm start
```

### 3단계: 의사 계정 생성 (최초 1회)
```bash
cd backend && node ../scripts/backend-utils/create-doctor.js
```

---

## 📊 API 구조

### 인증 (누구나)
```
POST /api/auth/register    환자 회원가입
POST /api/auth/login       로그인 → JWT 토큰 반환
```

### 진단 (환자 — JWT 필요)
```
POST /api/diagnoses        진단 요청 (이미지 + 증상 → AI 진단)
GET  /api/diagnoses/my     내 진단 목록
GET  /api/diagnoses/:id    진단 상세
```

### 관리자 (의사 — JWT + role:doctor 필요)
```
GET  /api/admin/stats            통계 (총 진단수, 상태별 등)
GET  /api/admin/diagnoses        전체 진단 목록
GET  /api/admin/diagnoses/:id    진단 상세
PUT  /api/admin/diagnoses/:id    의사 소견 저장 + 상태 변경
GET  /api/admin/patients         환자 목록
POST /api/admin/ai-suggest-symptoms  AI 증상 추천 (상위 3개)
```

---

## 🔄 배포 방법

### 자동 배포 (GitHub → Render)
```bash
git add .
git commit -m "feat: 변경 내용"
git push origin master
# → Render가 자동으로 빌드 + 배포 (약 3-5분)
```

### 스크립트로 배포
```powershell
.\deploy.ps1
# → 프론트 빌드 → 커밋 → 푸시 한번에
```

---

## 📚 상세 문서

| 문서 | 설명 |
|------|------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 시스템 구조, DB 스키마, 데이터 흐름 |
| [docs/QUICK-START.md](docs/QUICK-START.md) | 서비스 사용 방법 (환자/의사 흐름) |
| [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md) | 환경 변수 하나하나 설명 |
| [docs/DEPLOY_GUIDE.md](docs/DEPLOY_GUIDE.md) | Render.com 배포 상세 |
| [docs/AIVEN_MYSQL.md](docs/AIVEN_MYSQL.md) | Aiven MySQL 설정 |
| [docs/CLOUDINARY_SETUP.md](docs/CLOUDINARY_SETUP.md) | Cloudinary 설정 |
| [docs/APK_BUILD.md](docs/APK_BUILD.md) | Android APK 빌드 |
| [docs/RENDER_TROUBLESHOOTING.md](docs/RENDER_TROUBLESHOOTING.md) | 배포 오류 해결 |

---

## 📄 라이선스

MIT License
