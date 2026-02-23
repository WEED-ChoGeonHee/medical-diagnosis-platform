# 🏥 피부과 AI 의료 진단 플랫폼

환자가 피부 증상을 입력하고 이미지를 업로드하면, AI(Google Gemini)가 자동으로 진단하고 관련 의학 정보를 제공하는 통합 의료 플랫폼입니다.

---

## 🌐 접속 정보

### 웹사이트
- **환자 포털**: https://medical-diagnosis-platform.onrender.com/patient
- **관리자 대시보드**: https://medical-diagnosis-platform.onrender.com/admin

### 테스트 계정
- **의사 계정**: `doctor@hospital.com` / `doctor123`
- **환자 계정**: 회원가입 후 사용

---

## 📋 주요 기능

### 환자 포털
- 🤖 AI 기반 피부과 진단 (Google Gemini)
- 📸 증상 이미지 업로드 (최대 5장)
- 📝 진단 기록 조회 및 히스토리

### 관리자 대시보드
- 👨‍⚕️ 의사 전용 진단 관리
- 📊 KPI 통계 대시보드
- 🔍 환자 목록 및 진단 필터링
- 💬 의사 소견 작성

### Android 앱
- 📱 환자용 모바일 앱
- 📱 의사용 관리자 앱

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| **백엔드** | Node.js + Express.js |
| **데이터베이스** | MySQL (Aiven Cloud) |
| **프론트엔드** | React.js |
| **AI 진단** | Google Gemini API |
| **이미지 저장** | Cloudinary |
| **배포** | Render.com |
| **모바일** | Android (WebView) |
| **인증** | JWT + bcrypt |

---

## 🚀 빠른 시작

### 로컬 개발 환경

1. **저장소 클론**
   ```bash
   git clone https://github.com/WEED-ChoGeonHee/medical-diagnosis-platform.git
   cd medical-diagnosis-platform
   ```

2. **환경 변수 설정**
   ```bash
   cp backend/.env.example backend/.env
   # .env 파일에 필요한 값 입력 (DB, API 키 등)
   ```

3. **빠른 실행 (PowerShell)**
   ```powershell
   .\scripts\quick-start.ps1
   ```

4. **개별 실행**
   ```bash
   # 백엔드
   cd backend
   npm install
   node server.js

   # 환자 포털
   cd patient-portal
   npm install
   npm start

   # 관리자 대시보드
   cd admin-dashboard
   npm install
   PORT=3001 npm start
   ```

---

## 📚 상세 문서

- 📖 [프로젝트 전체 문서](docs/README.md)
- 🏗️ [시스템 아키텍처](docs/ARCHITECTURE.md)
- 🚢 [배포 가이드](docs/DEPLOY_GUIDE.md)
- 🔑 [환경 변수 설정](docs/ENVIRONMENT_VARIABLES.md)
- 📱 [Android APK 빌드](docs/APK_BUILD.md)
- 🔧 [문제 해결](docs/RENDER_TROUBLESHOOTING.md)

---

## 📁 프로젝트 구조

```
medical-diagnosis-platform/
├── backend/                    # Express API 서버
│   ├── config/                # DB, JWT 설정
│   ├── models/                # MySQL 모델
│   ├── routes/                # API 라우트
│   ├── middleware/            # 인증 미들웨어
│   └── server.js              # 메인 서버
│
├── patient-portal/            # 환자 포털 (React)
│   ├── src/components/        # React 컴포넌트
│   └── build/                 # 프로덕션 빌드
│
├── admin-dashboard/           # 관리자 대시보드 (React)
│   ├── src/components/        # React 컴포넌트
│   └── build/                 # 프로덕션 빌드
│
├── android-app/               # 환자용 Android 앱
├── android-app-admin/         # 의사용 Android 앱
│
├── scripts/                   # 유틸리티 스크립트
│   ├── backend-utils/         # DB 마이그레이션 등
│   └── *.ps1                  # PowerShell 스크립트
│
├── docs/                      # 상세 문서
└── render.yaml               # Render 배포 설정
```

---

## 🔄 개발 워크플로우

### 코드 변경 및 배포
```bash
# 1. 변경사항 커밋
git add .
git commit -m "설명"

# 2. GitHub에 푸시
git push origin master

# 3. Render 자동 배포 (master 브랜치)
# https://medical-diagnosis-platform.onrender.com
```

### 프로덕션 빌드
```bash
# 환자 포털 빌드
cd patient-portal
npm run build

# 관리자 대시보드 빌드
cd admin-dashboard
npm run build
```

---

## 📊 API 엔드포인트

### 인증
- `POST /api/auth/register` - 환자 회원가입
- `POST /api/auth/login` - 로그인

### 진단 (환자용)
- `POST /api/diagnoses` - 새 진단 요청
- `GET /api/diagnoses/my` - 내 진단 목록
- `GET /api/diagnoses/:id` - 진단 상세

### 관리자 (의사용)
- `GET /api/admin/stats` - 통계 정보
- `GET /api/admin/diagnoses` - 전체 진단 목록
- `PUT /api/admin/diagnoses/:id` - 의사 소견 저장
- `GET /api/admin/patients` - 환자 목록

---

## 📞 지원

문제가 발생하거나 질문이 있으신 경우:
- [문제 해결 가이드](docs/RENDER_TROUBLESHOOTING.md)
- [전체 문서](docs/README.md)

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
