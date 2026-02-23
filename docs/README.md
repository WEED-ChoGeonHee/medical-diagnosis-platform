# 🏥 의료 진단 플랫폼

AI 기반 피부 질환 진단 서비스

---

## 📌 프로젝트 개요

환자가 피부 이미지를 업로드하면 AI가 피부 질환을 분석하고, 의사가 최종 진단 소견을 작성하는 의료 진단 플랫폼입니다.

### 주요 기능
- 🤖 **AI 진단**: Google Gemini API를 활용한 피부 질환 분석
- 📸 **이미지 업로드**: 최대 5장의 피부 사진 업로드
- 👨‍⚕️ **의사 검토**: 전문의의 최종 진단 소견
- 📱 **Android 앱**: 환자용 및 의사용 모바일 앱
- 📊 **대시보드**: 진단 통계 및 환자 관리

---

## 🛠️ 기술 스택

### 백엔드
- **Node.js** + Express
- **MySQL** (Aiven)
- **JWT** 인증
- **Cloudinary** (이미지 스토리지)
- **Google Gemini API** (AI 진단)

### 프론트엔드
- **React** (환자 포털)
- **React** (관리자 대시보드)
- **Axios** (API 통신)

### 모바일
- **Android WebView** (Capacitor 기반)
- 환자용 앱
- 의사용 앱

### 배포
- **Render.com** (백엔드 + 프론트엔드)
- **Aiven** (MySQL 데이터베이스)
- **Cloudinary** (이미지 CDN)

---

## 🚀 빠른 시작

### 웹사이트 접속

| 서비스 | URL |
|--------|-----|
| 환자 포털 | https://medical-diagnosis-platform.onrender.com/patient |
| 관리자 대시보드 | https://medical-diagnosis-platform.onrender.com/admin |

### 테스트 계정

**의사 계정**:
- 이메일: `doctor@hospital.com`
- 비밀번호: `doctor123`

**환자 계정**: 회원가입 후 사용

## 📚 문서

### 시작하기
- 🏗️ [시스템 아키텍처](ARCHITECTURE.md) - **전체 시스템 흐름 및 구조**
- 🚀 [빠른 시작](QUICK-START.md) - 로컬 개발 환경 설정
- 🌐 [웹사이트 접속](START-WEB.md) - 접속 URL 및 계정 정보

### 배포 및 설정
- 🚢 [배포 가이드](DEPLOY_GUIDE.md) - Render.com 배포 방법
- 🔑 [환경 변수 설정](ENVIRONMENT_VARIABLES.md) - 필수 환경 변수
- 🗄️ [Aiven MySQL 설정](AIVEN_MYSQL.md) - 데이터베이스 설정
- ☁️ [Cloudinary 설정](CLOUDINARY_SETUP.md) - 이미지 스토리지 설정

### 모바일 앱
- 📱 [APK 빌드 가이드](APK_BUILD.md) - Android 앱 빌드 방법

### 테스트 및 문제 해결
- 🧪 [이미지 업로드 테스트](이미지_업로드_테스트_가이드.md)
- 🔧 [Render 문제 해결](RENDER_TROUBLESHOOTING.md) - 배포 오류 해결

---

## 🏗️ 프로젝트 구조

```
의학/
├── backend/                 # Express API 서버
│   ├── server.js           # 메인 서버 파일
│   ├── config/             # 설정 (DB, JWT 등)
│   ├── models/             # MySQL 모델
│   ├── routes/             # API 라우트
│   └── middleware/         # 인증 미들웨어
│
├── patient-portal/         # 환자 포털 (React)
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js          # API 클라이언트
│   │   └── components/     # React 컴포넌트
│   └── build/              # 빌드 결과
│
├── admin-dashboard/        # 관리자 대시보드 (React)
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js
│   │   └── components/
│   └── build/
│
├── android-app/            # 환자용 Android 앱
│   └── app/
│       └── src/main/java/
│
├── android-app-admin/      # 의사용 Android 앱
│   └── app/
│       └── src/main/java/
│
├── docs/                   # 문서
│   ├── DEPLOY_GUIDE.md
│   ├── ENVIRONMENT_VARIABLES.md
│   └── ...
│
├── render.yaml             # Render 배포 설정
├── docker-compose.yml      # Docker Compose
└── README.md               # 이 파일
```

---

## 💻 로컬 개발

### 사전 준비
- Node.js 16+
- MySQL (또는 Aiven 계정)
- Cloudinary 계정
- Google AI Studio API 키

### 1. 저장소 클론
```bash
git clone <repository-url>
cd 의학
```

### 2. 환경 변수 설정
`backend/.env` 파일 생성:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medical_diagnosis
DB_SSL=false

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=your_jwt_secret

NODE_ENV=development
PORT=5000
```

### 3. 백엔드 실행
```bash
cd backend
npm install
node server.js
```
→ http://localhost:5000

### 4. 환자 포털 실행
```bash
cd patient-portal
npm install
npm start
```
→ http://localhost:3000

### 5. 관리자 대시보드 실행
```bash
cd admin-dashboard
npm install
PORT=3001 npm start
```
→ http://localhost:3001

---

## 📦 배포

### Render.com 배포
1. [배포 가이드](DEPLOY_GUIDE.md) 참조
2. GitHub에 코드 푸시
3. Render에서 자동 빌드 및 배포
4. 환경 변수 설정

### Docker Compose (선택사항)
```bash
docker-compose up -d
```

---

## 🧪 테스트

### API 테스트
```bash
# 서버 상태 확인
curl http://localhost:5000/api/debug/db

# 로그인 테스트
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@hospital.com","password":"doctor123"}'
```

### 기능 테스트
1. [이미지 업로드 테스트 가이드](이미지_업로드_테스트_가이드.md) 참조
2. 환자 계정으로 진단 요청
3. 의사 계정으로 소견 작성

---

## 🔐 보안

### 환경 변수 관리
- `.env` 파일을 Git에 포함하지 마세요
- `.gitignore`에 `.env` 추가됨
- Render에서만 프로덕션 환경 변수 설정

### API 인증
- JWT 토큰 기반 인증
- 의사 계정은 별도 역할(role) 관리

### 데이터베이스
- Aiven MySQL SSL 연결 필수
- 환자 개인정보 보호

---

## 📱 모바일 앱

### Android APK 다운로드
- 환자용: `환자용_의료진단.apk`
- 의사용: `의사용_의료진단.apk`

### 빌드 방법
[APK 빌드 가이드](APK_BUILD.md) 참조

### 시스템 요구사항
- Android 7.0 (API 24) 이상
- 인터넷 연결 필요
- 카메라 및 저장소 권한 필요

---

## 🤝 기여

### 버그 리포트
GitHub Issues에 다음 정보 포함:
- 발생한 오류 메시지
- 재현 단계
- 환경 (브라우저, OS 등)

### 기능 제안
GitHub Issues에 "Feature Request" 라벨로 작성

---

## 📄 라이선스

이 프로젝트는 교육 및 개인 프로젝트 용도입니다.

---

## 🆘 지원

### 문서
- 모든 문서는 `docs/` 폴더에 있습니다
- [문제 해결 가이드](RENDER_TROUBLESHOOTING.md) 먼저 확인

### 주요 링크
- Render 대시보드: https://dashboard.render.com
- Aiven Console: https://console.aiven.io
- Cloudinary Dashboard: https://console.cloudinary.com
- Google AI Studio: https://aistudio.google.com

---

## 📊 시스템 상태

### 프로덕션 URL
- 백엔드 API: https://medical-diagnosis-platform.onrender.com/api
- 환자 포털: https://medical-diagnosis-platform.onrender.com/patient
- 관리자 대시보드: https://medical-diagnosis-platform.onrender.com/admin

### 데이터베이스
- Aiven MySQL (무료 티어)
- 저장 공간: 5 GB
- 리전: 서울 (asia-northeast3)

### 이미지 스토리지
- Cloudinary CDN
- 무료 티어: 25 GB 저장/월

---

## ✅ 완료된 작업

- ✅ 백엔드 API 구현
- ✅ 환자 포털 구현
- ✅ 관리자 대시보드 구현
- ✅ AI 진단 기능 (Google Gemini)
- ✅ 이미지 업로드 (Cloudinary)
- ✅ JWT 인증
- ✅ Android 앱 (환자용, 의사용)
- ✅ Render 배포
- ✅ Aiven MySQL 연동
- ✅ 문서 정리

---

**마지막 업데이트**: 2026년 2월 13일
