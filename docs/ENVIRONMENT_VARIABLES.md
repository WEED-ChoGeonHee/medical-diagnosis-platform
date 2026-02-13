# 🔑 환경 변수 설정 가이드

## 목차
1. [필요한 환경 변수](#필요한-환경-변수)
2. [Render 설정 방법](#render-설정-방법)
3. [로컬 개발 설정](#로컬-개발-설정)
4. [환경 변수 확인](#환경-변수-확인)

---

## 필요한 환경 변수

총 **12개**의 환경 변수가 필요합니다.

### 1️⃣ 데이터베이스 (Aiven MySQL) - 6개

| 변수명 | 설명 | 예시 값 |
|--------|------|---------|
| `DB_HOST` | Aiven 호스트명 | `xxx.aivencloud.com` |
| `DB_PORT` | 포트 | `26163` |
| `DB_USER` | 사용자명 | `avnadmin` |
| `DB_PASSWORD` | 비밀번호 | `[Aiven 비밀번호]` |
| `DB_NAME` | 데이터베이스명 | `defaultdb` |
| `DB_SSL` | SSL 연결 활성화 | `true` ⚠️ 필수! |

**값 확인 위치**: 
- Aiven Console → 서비스 → **Overview** → **Connection information**

---

### 2️⃣ AI (Google Gemini) - 1개

| 변수명 | 설명 | 발급 위치 |
|--------|------|-----------|
| `GEMINI_API_KEY` | Gemini API 키 | https://aistudio.google.com/app/apikey |

**발급 방법**:
1. Google AI Studio 접속
2. **Get API key** 클릭
3. **Create API key** 선택
4. 생성된 키 복사

---

### 3️⃣ 이미지 스토리지 (Cloudinary) - 3개

| 변수명 | 설명 | 값 확인 위치 |
|--------|------|--------------|
| `CLOUDINARY_CLOUD_NAME` | 클라우드명 | Dashboard 상단 |
| `CLOUDINARY_API_KEY` | API 키 | Dashboard → Settings → API Keys |
| `CLOUDINARY_API_SECRET` | API 시크릿 | Dashboard → Settings → API Keys |

**값 확인 위치**:
- Cloudinary Dashboard: https://console.cloudinary.com/

---

### 4️⃣ 인증 (JWT) - 1개

| 변수명 | 설명 | 예시 값 |
|--------|------|---------|
| `JWT_SECRET` | JWT 서명 키 | `mySecretJwtKey2026...` |

**권장 값** (아래 중 하나 사용):
```
mySecretJwtKey2026ForMedicalDiagnosisPlatformProduction
```

또는 더 안전한 랜덤 값:
```
7a9f8e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f
```

**생성 방법** (Node.js):
```javascript
require('crypto').randomBytes(32).toString('hex')
```

---

### 5️⃣ 시스템 (자동 설정) - 2개

| 변수명 | 설명 | 값 |
|--------|------|-----|
| `NODE_ENV` | 실행 환경 | `production` |
| `PORT` | 서버 포트 | `10000` |

⚠️ **Render에서 자동으로 설정되므로 수동 입력 불필요**

---

## Render 설정 방법

### 1단계: Render Dashboard 접속
```
https://dashboard.render.com
```

### 2단계: 서비스 선택
- **medical-diagnosis-platform** 클릭

### 3단계: Environment 탭
- 왼쪽 메뉴에서 **Environment** 클릭

### 4단계: 환경 변수 추가

각 변수마다:
1. **Add Environment Variable** 클릭
2. **Key**: 변수명 입력
3. **Value**: 값 입력
4. **Add** 클릭

### 5단계: 저장 및 재배포
- **Save Changes** 클릭
- 자동으로 재배포 시작 (5-7분 소요)

---

## 로컬 개발 설정

### 1. `.env` 파일 생성

`backend/.env` 파일 생성:

```env
# 데이터베이스
DB_HOST=xxx.aivencloud.com
DB_PORT=26163
DB_USER=avnadmin
DB_PASSWORD=[Aiven 비밀번호]
DB_NAME=defaultdb
DB_SSL=true

# AI
GEMINI_API_KEY=[Google AI Studio API 키]

# 이미지
CLOUDINARY_CLOUD_NAME=[Cloudinary 클라우드명]
CLOUDINARY_API_KEY=[Cloudinary API 키]
CLOUDINARY_API_SECRET=[Cloudinary API 시크릿]

# JWT
JWT_SECRET=mySecretJwtKey2026ForLocalDevelopment

# 시스템
NODE_ENV=development
PORT=5000
```

### 2. `.gitignore` 확인

`.env` 파일이 Git에 포함되지 않도록:

```
backend/.env
.env
```

### 3. 로컬 서버 실행

```bash
cd backend
npm install
node server.js
```

---

## 환경 변수 확인

### Render 배포 후 확인

접속: `https://[서비스명].onrender.com/api/debug/db`

**정상 출력**:
```json
{
  "status": "ok",
  "dbConfig": {
    "DB_HOST": "✅ set",
    "DB_PORT": "✅ set",
    "DB_USER": "✅ set",
    "DB_PASSWORD": "✅ set",
    "DB_NAME": "✅ set",
    "DB_SSL": "✅ enabled"
  },
  "cloudinary": {
    "CLOUDINARY_CLOUD_NAME": "✅ set",
    "CLOUDINARY_API_KEY": "✅ set",
    "CLOUDINARY_API_SECRET": "✅ set"
  },
  "gemini": {
    "GEMINI_API_KEY": "✅ set"
  },
  "jwt": {
    "JWT_SECRET": "✅ set"
  }
}
```

**문제 발생 시**:
```json
{
  "DB_HOST": "❌ not set"
}
```
→ 해당 환경 변수를 Render에서 추가

---

## 체크리스트

배포 전 확인:

### Aiven MySQL
- [ ] Aiven 서비스가 **Running** 상태
- [ ] `DB_HOST` 정확한 호스트명
- [ ] `DB_PORT` 정확한 포트
- [ ] `DB_USER` avnadmin
- [ ] `DB_PASSWORD` 정확한 비밀번호
- [ ] `DB_NAME` defaultdb
- [ ] `DB_SSL` **true** (필수!)

### Google Gemini
- [ ] API 키 발급 완료
- [ ] `GEMINI_API_KEY` 정확한 키 값

### Cloudinary
- [ ] 계정 생성 완료
- [ ] `CLOUDINARY_CLOUD_NAME` 정확한 클라우드명
- [ ] `CLOUDINARY_API_KEY` 정확한 API 키
- [ ] `CLOUDINARY_API_SECRET` 정확한 시크릿

### JWT
- [ ] `JWT_SECRET` 랜덤 문자열 설정

### Render
- [ ] 모든 환경 변수 입력 완료
- [ ] Save Changes 클릭
- [ ] 재배포 완료 대기

---

## 문제 해결

### JWT 오류
**증상**: 회원가입/로그인 실패

**해결**: 
- `JWT_SECRET` 환경변수 추가
- 값: `mySecretJwtKey2026ForMedicalDiagnosisPlatformProduction`

### DB 연결 실패
**증상**: "getaddrinfo ENOTFOUND" 또는 "Access denied"

**해결**: 
1. Aiven 서비스 상태 확인 (Running인지)
2. `DB_HOST`, `DB_PASSWORD` 재확인
3. `DB_SSL=true` 확인 (필수!)

### Cloudinary 업로드 실패
**증상**: 이미지 업로드 시 서버 오류

**해결**:
1. Cloudinary 환경 변수 3개 모두 확인
2. `/api/debug/db`에서 설정 확인
3. Cloudinary Dashboard에서 API 키 재확인

---

## 보안 주의사항

⚠️ **절대 Git에 포함하지 마세요**:
- `.env` 파일
- API 키, 비밀번호
- 환경 변수 값

✅ **안전한 방법**:
- Render Dashboard에서만 설정
- 로컬에서는 `.env` 파일 사용
- `.gitignore`에 `.env` 추가
