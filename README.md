# 🔬 SkinIQ - AI 피부 진단 플랫폼

환자가 피부 사진을 업로드하면 **AI(Google Gemini)**가 자동 분석하고, 의사가 최종 진단을 내리는 플랫폼입니다.

> 💡 **신입 개발자분들께**: 이 문서를 처음부터 끝까지 읽으면 프로젝트 전체 구조를 파악할 수 있습니다!

---

## 📌 목차

1. [프로젝트 개요](#-프로젝트-개요)
2. [기술 스택](#-기술-스택)
3. [폴더 구조](#-폴더-구조)
4. [로컬 개발 환경 설정](#-로컬-개발-환경-설정)
5. [API 명세](#-api-명세)
6. [배포 방법](#-배포-방법)
7. [문서 가이드](#-문서-가이드)

---

## 🎯 프로젝트 개요

### 서비스 URL (프로덕션)

| 서비스 | URL | 설명 |
|--------|-----|------|
| SkinIQ (환자용) | https://medical-diagnosis-platform.onrender.com/patient | 환자가 피부 사진을 올리고 진단 결과를 확인 |
| SkinIQ Doctor (의사용) | https://medical-diagnosis-platform.onrender.com/admin | 의사가 AI 진단을 검토하고 최종 소견 작성 |

### 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 의사 | `doctor@hospital.com` | `doctor123` |
| 환자 | 직접 회원가입 | - |

### 주요 기능

```
환자 앱 (SkinIQ)
├── 회원가입 / 로그인
├── 피부 사진 업로드 → AI 자동 진단
├── 진단 결과 확인 (AI 분석 + 의사 소견)
└── 과거 진단 기록 조회

의사 앱 (SkinIQ Doctor)
├── 의사 전용 로그인
├── 대시보드 (통계: 총 진단수, 대기중, 완료 등)
├── 진단 목록 관리 (필터, 검색)
├── 상세 진단 검토 + 최종 소견 작성
└── 환자 목록 관리
```

---

## 🛠 기술 스택

### 백엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| Node.js | 18+ | 런타임 환경 |
| Express.js | 4.x | REST API 프레임워크 |
| MySQL | 8.x | 데이터베이스 (Aiven 클라우드) |
| JWT | - | 사용자 인증 토큰 |
| bcrypt | - | 비밀번호 암호화 |
| Multer | - | 파일 업로드 처리 |

### 프론트엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18.x | UI 라이브러리 |
| React Router | 6.x | 페이지 라우팅 |
| Axios | - | HTTP 클라이언트 |

### 외부 서비스
| 서비스 | 용도 |
|--------|------|
| Google Gemini API | AI 피부 질환 분석 |
| Cloudinary | 이미지 업로드 및 CDN |
| Aiven | MySQL 클라우드 호스팅 |
| Render.com | 웹 서비스 배포 |

### 모바일
| 기술 | 용도 |
|------|------|
| Android (WebView) | 환자용/의사용 네이티브 앱 |

---

## 📁 폴더 구조

```
SkinIQ/
│
├── 📂 backend/                  # ⭐ Express API 서버 (가장 중요!)
│   ├── server.js                #    서버 시작점 - Express 앱 설정
│   ├── config/
│   │   └── database.js          #    MySQL 연결 설정
│   ├── middleware/
│   │   └── auth.js              #    JWT 인증 미들웨어
│   ├── models/                  #    데이터베이스 쿼리 함수
│   │   ├── User.js              #    - 사용자 관련 (회원가입, 로그인)
│   │   └── Diagnosis.js         #    - 진단 관련 (생성, 조회, 수정)
│   ├── routes/                  #    API 엔드포인트 정의
│   │   ├── auth.js              #    - /api/auth/* (인증)
│   │   ├── diagnoses.js         #    - /api/diagnoses/* (환자용)
│   │   ├── admin.js             #    - /api/admin/* (의사용)
│   │   └── patients.js          #    - /api/patients/* (환자 정보)
│   └── uploads/                 #    로컬 테스트용 이미지 저장소
│
├── 📂 patient-portal/           # 환자용 React 웹앱
│   ├── public/                  #    정적 파일 (index.html)
│   └── src/
│       ├── App.js               #    라우팅 설정
│       ├── api.js               #    API 호출 함수
│       └── components/          #    React 컴포넌트
│           ├── Login.js         #    로그인 페이지
│           ├── Register.js      #    회원가입 페이지
│           ├── Dashboard.js     #    내 진단 목록
│           ├── NewDiagnosis.js  #    📸 새 진단 요청 (사진 업로드)
│           └── DiagnosisDetail.js  # 진단 상세 보기
│
├── 📂 admin-dashboard/          # 의사용 React 웹앱
│   └── src/
│       └── components/
│           ├── Login.js         #    의사 로그인
│           ├── Dashboard.js     #    📊 통계 대시보드
│           ├── DiagnosisList.js #    진단 목록 (필터, 페이지)
│           ├── DiagnosisDetail.js  # ✍️ 의사 소견 작성
│           └── PatientList.js   #    환자 목록
│
├── 📂 android-app/              # 환자용 Android 앱
│   └── app/src/main/
│       ├── java/com/skiniq/patient/  # MainActivity.java
│       └── res/                 #    아이콘, 레이아웃, 스타일
│
├── 📂 android-app-admin/        # 의사용 Android 앱
│   └── app/src/main/
│       ├── java/com/skiniq/doctor/   # MainActivity.java
│       └── res/                 #    아이콘, 레이아웃, 스타일
│
├── 📂 scripts/                  # 유틸리티 스크립트
│   ├── quick-start.ps1          #    한번에 전체 실행 (백엔드+프론트)
│   ├── start-server.ps1         #    백엔드만 실행
│   ├── stop-server.ps1          #    서버 종료
│   ├── build-android-apk.ps1    #    APK 빌드
│   └── backend-utils/           #    DB 관련 스크립트
│       ├── create-doctor.js     #    의사 계정 생성
│       ├── reset-db.js          #    DB 초기화 (⚠️ 주의)
│       └── seed-dermatology-data.js  # 샘플 데이터 삽입
│
├── 📂 docs/                     # 📚 상세 문서 (아래 참고)
│
├── 📂 apk-builds/               # 빌드된 APK 파일
│   ├── SkinIQ-Patient.apk       #    환자용 앱
│   └── SkinIQ-Doctor.apk        #    의사용 앱
│
├── 📄 .env.example              # 환경변수 템플릿 (복사해서 사용)
├── 📄 render.yaml               # Render.com 배포 설정
├── 📄 docker-compose.yml        # 로컬 Docker 환경 (선택)
└── 📄 deploy.ps1                # 빠른 배포 스크립트
```

---

## 🚀 로컬 개발 환경 설정

### 사전 준비물

| 필수 | 설치 방법 |
|------|-----------|
| Node.js 18+ | https://nodejs.org |
| Git | https://git-scm.com |
| MySQL | https://www.mysql.com 또는 Aiven 클라우드 |
| VS Code | https://code.visualstudio.com |

### 외부 서비스 계정 (무료)

1. **Aiven MySQL**: https://aiven.io (무료 티어)
2. **Cloudinary**: https://cloudinary.com (무료 25GB)
3. **Google AI Studio**: https://aistudio.google.com (Gemini API 키)

---

### Step 1: 저장소 클론

```bash
git clone https://github.com/WEED-ChoGeonHee/medical-diagnosis-platform.git
cd medical-diagnosis-platform
```

### Step 2: 환경변수 설정

```bash
# 템플릿 복사
cp backend/.env.example backend/.env

# backend/.env 파일을 열어서 실제 값 입력
```

**필수 환경변수:**
```env
# 서버
PORT=5000
NODE_ENV=development

# 데이터베이스 (Aiven에서 복사)
DB_HOST=mysql-xxxxx.aiven.io
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=your_password
DB_NAME=defaultdb
DB_SSL=true

# 인증
JWT_SECRET=your_secret_key_here

# AI (Google AI Studio에서 발급)
GEMINI_API_KEY=AIza...

# 이미지 (Cloudinary 대시보드에서 복사)
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123
```

### Step 3: 의존성 설치 및 실행

**방법 A: 한번에 실행 (추천)**
```powershell
.\scripts\quick-start.ps1
```

**방법 B: 개별 실행**
```bash
# 터미널 1 - 백엔드 (http://localhost:5000)
cd backend
npm install
node server.js

# 터미널 2 - 환자 포털 (http://localhost:3000)
cd patient-portal
npm install
npm start

# 터미널 3 - 관리자 대시보드 (http://localhost:3001)
cd admin-dashboard
npm install
set PORT=3001 && npm start   # Windows
# PORT=3001 npm start        # Mac/Linux
```

### Step 4: 의사 계정 생성 (최초 1회)

```bash
cd backend
node ../scripts/backend-utils/create-doctor.js
```

---

## 📡 API 명세

### 🔓 인증 API (Public)

| Method | Endpoint | 설명 | Body |
|--------|----------|------|------|
| POST | `/api/auth/register` | 환자 회원가입 | `{name, email, password}` |
| POST | `/api/auth/login` | 로그인 | `{email, password}` → JWT 반환 |

### 🔐 환자 API (JWT 필요)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/diagnoses` | 진단 요청 (이미지 업로드 + AI 분석) |
| GET | `/api/diagnoses/my` | 내 진단 목록 |
| GET | `/api/diagnoses/:id` | 진단 상세 |
| GET | `/api/patients/profile` | 내 프로필 |

### 🩺 의사 API (JWT + role:doctor)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/stats` | 대시보드 통계 |
| GET | `/api/admin/diagnoses` | 전체 진단 목록 |
| GET | `/api/admin/diagnoses/:id` | 진단 상세 |
| PUT | `/api/admin/diagnoses/:id` | 의사 소견 저장 |
| GET | `/api/admin/patients` | 환자 목록 |

---

## 🚢 배포 방법

### 자동 배포 (GitHub → Render)

`master` 브랜치에 push하면 Render가 자동으로 빌드 및 배포합니다.

```bash
git add .
git commit -m "feat: 새 기능 추가"
git push origin master

# → Render에서 자동 배포 시작 (3-5분 소요)
```

### 빠른 배포 스크립트

```powershell
.\deploy.ps1
# 프론트엔드 빌드 → Git 커밋 → Push 자동화
```

### APK 빌드

```powershell
.\scripts\build-android-apk.ps1
# → apk-builds/ 폴더에 APK 파일 생성
```

---

## 📚 문서 가이드

| 문서 | 내용 | 우선 읽기 |
|------|------|----------|
| [docs/QUICK-START.md](docs/QUICK-START.md) | 서비스 사용 흐름 (환자/의사) | ⭐ 필수 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 시스템 구조, DB 스키마 | ⭐ 필수 |
| [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md) | 환경변수 상세 설명 | 설정 시 |
| [docs/DEPLOY_GUIDE.md](docs/DEPLOY_GUIDE.md) | Render.com 배포 | 배포 시 |
| [docs/AIVEN_MYSQL.md](docs/AIVEN_MYSQL.md) | Aiven DB 설정 | DB 설정 시 |
| [docs/CLOUDINARY_SETUP.md](docs/CLOUDINARY_SETUP.md) | Cloudinary 설정 | 이미지 설정 시 |
| [docs/APK_BUILD.md](docs/APK_BUILD.md) | Android APK 빌드 | 앱 빌드 시 |

---

## 🤝 개발 시 주의사항

### 코드 컨벤션
- 사용자에게 보이는 텍스트는 **한글**로 작성
- API 응답은 `{ success: true/false, data/error }` 형식
- 에러 핸들링 필수 (`try-catch`)

### Git 브랜치 전략
- `master`: 프로덕션 (자동 배포)
- `feature/*`: 새 기능 개발
- `fix/*`: 버그 수정

### 커밋 메시지 규칙
```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
```

---

## 📄 라이선스

MIT License

---

## 👥 문의

문제가 있으면 이슈를 등록하거나 담당자에게 연락하세요.
