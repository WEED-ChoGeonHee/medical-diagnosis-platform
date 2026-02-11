# 의료 진단 플랫폼

AI 기반 의료 진단 플랫폼으로, 환자가 증상과 이미지를 업로드하면 Gemini API가 진단 정보와 관련 의학 논문을 제공하고, 의사가 관리자 대시보드에서 환자 정보를 확인할 수 있습니다.

## 🌐 배포

### 클라우드 배포
- **데이터베이스**: Aiven MySQL (무료 티어, 5GB)
- **백엔드**: Render.com Web Service (무료 티어, 750시간/월)
- **프론트엔드**: Android APK (WebView)

📖 **배포 가이드**: [DEPLOY.md](DEPLOY.md) 참조

### 로컬 개발 서버 (Windows)

빠른 시작:
```powershell
.\quick-start.ps1
```

개별 실행:
```powershell
# 서버 시작
.\start-server.ps1

# 서버 중지
.\stop-server.ps1
```

## 📋 프로젝트 구조

```
의학/
├── backend/              # Node.js + Express 백엔드 서버
│   ├── models/          # MySQL 모델 (User, Diagnosis)
│   ├── routes/          # API 라우트
│   ├── middleware/      # 인증 미들웨어
│   └── server.js        # 서버 진입점
├── patient-portal/      # React 환자 포털
│   └── src/
│       ├── components/  # React 컴포넌트
│       └── api.js       # API 클라이언트
└── admin-dashboard/     # React 의사 관리자 대시보드
    └── src/
        ├── components/  # React 컴포넌트
        └── api.js       # API 클라이언트
```

## 🚀 기능

### 환자 포털
- ✅ 회원가입 및 로그인
- ✅ 증상 설명 및 이미지 업로드 (최대 5개)
- ✅ AI 진단 결과 및 관련 의학 논문 확인
- ✅ 진단 내역 조회
- ✅ 의사 소견 확인

### 의사 관리자 대시보드
- ✅ 통계 대시보드 (환자 수, 진단 수 등)
- ✅ 모든 진단 요청 목록 조회
- ✅ 진단 상세 정보 및 환자 정보 확인
- ✅ 의사 소견 작성 및 상태 업데이트
- ✅ 환자 목록 관리

## 🛠️ 기술 스택

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, React Router
- **Authentication**: JWT (JSON Web Tokens)
- **AI**: OpenAI GPT-4 API
- **File Upload**: Multer
- **Validation**: express-validator

## 📦 설치 방법

### 사전 요구사항
- Node.js (v16 이상)
- MongoDB (v5 이상)
- OpenAI API Key

### 1. 백엔드 설정

```powershell
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어서 다음 값들을 설정:
# - MONGODB_URI: MongoDB 연결 문자열
# - JWT_SECRET: JWT 시크릿 키
# - OPENAI_API_KEY: OpenAI API 키

# uploads 폴더 생성
mkdir uploads

# 서버 시작
npm start
# 또는 개발 모드로 시작
npm install -D nodemon
npm run dev
```

### 2. 환자 포털 설정

```powershell
# 환자 포털 디렉토리로 이동
cd patient-portal

# 의존성 설치
npm install

# 개발 서버 시작 (포트 3000)
npm start
```

### 3. 관리자 대시보드 설정

```powershell
# 관리자 대시보드 디렉토리로 이동
cd admin-dashboard

# 의존성 설치
npm install

# 개발 서버 시작 (포트 3001)
$env:PORT=3001; npm start
```

## 🔐 환경 변수 설정

### backend/.env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-diagnosis
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
OPENAI_API_KEY=sk-your-openai-api-key-here
```

## 🎯 사용 방법

### 환자 포털 (http://localhost:3000)

1. **회원가입**: 이름, 이메일, 비밀번호, 전화번호로 가입
2. **로그인**: 이메일과 비밀번호로 로그인
3. **새 진단 요청**: 
   - 증상을 상세히 작성
   - 관련 이미지 업로드 (선택사항)
   - AI가 진단 결과와 관련 의학 논문 제공
4. **진단 내역**: 과거 진단 요청 및 의사 소견 확인

### 관리자 대시보드 (http://localhost:3001)

1. **의사 계정으로 로그인**: role이 'doctor'인 계정 필요
2. **대시보드**: 전체 통계 확인
3. **진단 목록**: 모든 환자의 진단 요청 확인
4. **진단 상세**: 
   - 환자 정보 확인
   - AI 진단 결과 검토
   - 의사 소견 작성
   - 상태 업데이트 (검토 완료/완료)
5. **환자 목록**: 등록된 모든 환자 확인

## 📝 의사 계정 생성

의사 계정은 MongoDB에서 직접 생성하거나 환자 회원가입 API를 사용할 때 `role: "doctor"`를 추가하면 됩니다.

```javascript
// POST /api/auth/register
{
  "name": "홍길동",
  "email": "doctor@example.com",
  "password": "password123",
  "phone": "010-1234-5678",
  "role": "doctor"
}
```

## 🔌 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 진단 (환자)
- `POST /api/diagnoses` - 새 진단 요청 (이미지 업로드 포함)
- `GET /api/diagnoses/my` - 내 진단 목록
- `GET /api/diagnoses/:id` - 진단 상세 조회

### 관리자 (의사)
- `GET /api/admin/stats` - 통계 정보
- `GET /api/admin/diagnoses` - 모든 진단 목록
- `GET /api/admin/diagnoses/:id` - 진단 상세
- `PUT /api/admin/diagnoses/:id` - 의사 소견 추가
- `GET /api/admin/patients` - 환자 목록

## ⚠️ 주의사항

- 이 플랫폼은 **참고용**이며, 실제 의료 진단을 대체할 수 없습니다.
- OpenAI API 사용 시 비용이 발생할 수 있습니다.
- 프로덕션 환경에서는 반드시 HTTPS를 사용하세요.
- 환자 데이터는 민감 정보이므로 보안에 각별히 주의하세요.

## 📄 라이선스

MIT License

## 🤝 기여

이슈와 풀 리퀘스트는 언제나 환영합니다!
