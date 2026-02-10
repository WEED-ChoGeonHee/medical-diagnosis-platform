# 배포 가이드

## GitHub 저장소

저장소 URL: https://github.com/WEED-ChoGeonHee/medical-diagnosis-platform

## Render 배포 방법

### 1. Render 계정 생성
1. [Render](https://render.com)에 접속
2. GitHub 계정으로 로그인

### 2. Blueprint로 배포 (권장)

#### 방법 1: 대시보드에서 직접 배포
1. Render 대시보드에서 "New" → "Blueprint" 클릭
2. GitHub 저장소 연결: `WEED-ChoGeonHee/medical-diagnosis-platform`
3. `render.yaml` 파일이 자동으로 감지됨
4. "Apply" 클릭

#### 방법 2: 아래 버튼으로 배포
아래 링크를 클릭하여 원클릭 배포:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/WEED-ChoGeonHee/medical-diagnosis-platform)

### 3. 환경 변수 설정

배포 과정에서 다음 환경 변수를 설정해야 합니다:

#### Backend 서비스
- **MONGODB_URI**: MongoDB 연결 문자열
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에서 무료 클러스터 생성
  - 예: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/medical-diagnosis?retryWrites=true&w=majority`
  
- **OPENAI_API_KEY**: OpenAI API 키
  - [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급
  - 예: `sk-...`

- **JWT_SECRET**: 자동 생성됨
- **PORT**: 5000 (자동 설정)

#### Frontend 서비스 (Patient Portal, Admin Dashboard)
- **REACT_APP_API_URL**: 백엔드 서비스 URL
  - 백엔드 배포 완료 후 자동으로 설정됨
  - 예: `https://medical-diagnosis-backend.onrender.com`

### 4. 개별 서비스 배포 (대안)

render.yaml을 사용하지 않고 개별 배포하는 방법:

#### Backend 배포
1. Render 대시보드에서 "New" → "Web Service" 클릭
2. GitHub 저장소 연결
3. 설정:
   - **Name**: medical-diagnosis-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. 환경 변수 추가 (위 참조)
5. "Create Web Service" 클릭

#### Patient Portal 배포
1. Render 대시보드에서 "New" → "Static Site" 클릭
2. GitHub 저장소 연결
3. 설정:
   - **Name**: medical-diagnosis-patient-portal
   - **Root Directory**: patient-portal
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: build
4. 환경 변수 추가:
   - `REACT_APP_API_URL`: 백엔드 URL
5. "Create Static Site" 클릭

#### Admin Dashboard 배포
Patient Portal과 동일한 방식으로 배포:
- **Name**: medical-diagnosis-admin-dashboard
- **Root Directory**: admin-dashboard

### 5. MongoDB Atlas 설정

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 가입
2. 무료 클러스터 생성 (M0 Sandbox)
3. Database User 생성
4. Network Access에서 IP 화이트리스트 설정
   - 모든 IP 허용: `0.0.0.0/0` (개발용)
5. 연결 문자열 복사하여 Render의 `MONGODB_URI`에 설정

### 6. 배포 확인

배포 완료 후 각 서비스의 URL:
- Backend: `https://medical-diagnosis-backend.onrender.com`
- Patient Portal: `https://medical-diagnosis-patient-portal.onrender.com`
- Admin Dashboard: `https://medical-diagnosis-admin-dashboard.onrender.com`

### 7. 초기 의사 계정 생성

백엔드가 배포된 후, SSH 또는 Render Shell에서 의사 계정 생성:

```bash
cd backend
node create-doctor.js
```

또는 API를 통해 직접 생성 가능.

## 주의사항

### 무료 플랜 제한
- Render 무료 플랜은 비활성 시 자동으로 중지됨
- 첫 요청 시 약 30초 소요 (콜드 스타트)
- 월 750시간 무료 사용 가능

### CORS 설정
백엔드의 CORS 설정이 프론트엔드 URL을 허용하도록 확인:
- Patient Portal URL
- Admin Dashboard URL

### 파일 업로드
- Render의 파일 시스템은 임시적임
- 파일 업로드 기능 사용 시 AWS S3, Cloudinary 등 외부 스토리지 권장

## 문제 해결

### 빌드 실패
- Render 로그 확인
- package.json의 dependencies 확인
- Node 버전 확인 (package.json에 engines 필드 추가 권장)

### 연결 오류
- 환경 변수가 올바르게 설정되었는지 확인
- MongoDB Atlas IP 화이트리스트 확인
- CORS 설정 확인

### 성능 최적화
- 이미지 최적화
- CDN 사용 고려
- 데이터베이스 인덱스 설정

## 업데이트 배포

코드 변경 후:
```bash
git add .
git commit -m "업데이트 내용"
git push origin master
```

Render가 자동으로 새 버전 배포.

## 추가 리소스

- [Render 문서](https://render.com/docs)
- [MongoDB Atlas 문서](https://docs.atlas.mongodb.com/)
- [OpenAI API 문서](https://platform.openai.com/docs)
