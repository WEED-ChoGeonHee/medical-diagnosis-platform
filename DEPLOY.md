# 🚀 의료 진단 플랫폼 배포 가이드

## 📌 배포 구성
- **데이터베이스**: Aiven MySQL (무료 티어, 5GB)
- **백엔드**: Render.com Web Service (무료 티어, 750시간/월)
- **프론트엔드**: 백엔드에서 정적 파일로 서빙
- **모바일**: Android APK (환자용, 의사용)

---

## 1️⃣ Aiven MySQL 데이터베이스 설정

### 1-1. Aiven 계정 생성
1. https://console.aiven.io/signup 접속
2. 이메일로 회원가입 (신용카드 불필요)
3. 이메일 인증

### 1-2. MySQL 데이터베이스 생성
1. Aiven 콘솔에서 **Create service** 클릭
2. 서비스 선택: **MySQL**
3. 클라우드 공급자: **Google Cloud** (무료)
4. 리전: **asia-northeast3** (서울)
5. 플랜: **Free** 선택
6. 서비스 이름 설정 후 생성

### 1-3. 접속 정보 확인
서비스 대시보드 → **Connection information**에서:
- Host, Port, User, Password, Database Name 복사

---

## 2️⃣ Render.com 배포

### 2-1. Render 계정 생성
1. https://render.com 접속
2. GitHub 계정으로 로그인

### 2-2. Web Service 생성
1. **New** → **Web Service** 클릭
2. GitHub 저장소 연결: `medical-diagnosis-platform`
3. 설정:
   - **Name**: medical-diagnosis-platform
   - **Region**: Singapore
   - **Build Command**: `render.yaml` 참조
   - **Start Command**: `npm --prefix backend start`
   - **Plan**: Free

### 2-3. 환경 변수 설정
Render Dashboard → Environment 에서 다음 변수 추가:

| 변수명 | 값 |
|--------|-----|
| `DB_HOST` | Aiven MySQL 호스트 |
| `DB_PORT` | Aiven MySQL 포트 |
| `DB_USER` | Aiven MySQL 사용자 |
| `DB_PASSWORD` | Aiven MySQL 비밀번호 |
| `DB_NAME` | Aiven MySQL 데이터베이스명 |
| `DB_SSL` | `true` |
| `JWT_SECRET` | 자동 생성 (또는 직접 입력) |
| `GEMINI_API_KEY` | Google AI Studio API 키 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary 클라우드명 |
| `CLOUDINARY_API_KEY` | Cloudinary API 키 |
| `CLOUDINARY_API_SECRET` | Cloudinary API 시크릿 |

---

## 3️⃣ 배포 확인

배포 완료 후 접속:
- **환자 포털**: `https://[서비스명].onrender.com/patient`
- **관리자 대시보드**: `https://[서비스명].onrender.com/admin`

> ⚠️ 무료 플랜은 15분 비활성 시 서버가 슬립 모드에 진입합니다.
> 첫 접속 시 30초~1분 정도 로딩이 걸릴 수 있습니다.
