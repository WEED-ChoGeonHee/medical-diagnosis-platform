# 🔧 Render 문제 해결 가이드

## 목차
1. [빌드 오류](#빌드-오류)
2. [연결 문제](#연결-문제)
3. [환경 변수 문제](#환경-변수-문제)
4. [서비스 재생성](#서비스-재생성)

---

## 빌드 오류

### 문제 1: "Application exited early" 또는 "No open ports detected"

**원인**: Build Command 설정 충돌

**해결 방법**:
1. Render Dashboard → **Settings** → **Build & Deploy**
2. **Build Command** 필드를 **비우기** (render.yaml 사용)
3. **Start Command**: `npm --prefix backend start`
4. **Save Changes** 클릭

또는 Build Command에 직접 입력:
```bash
cd patient-portal && PUBLIC_URL=/patient npm install && PUBLIC_URL=/patient npm run build && cd .. && cd admin-dashboard && PUBLIC_URL=/admin npm install && PUBLIC_URL=/admin npm run build && cd .. && cd backend && npm install && cd ..
```

---

### 문제 2: "npm error ENOENT package.json"

**원인**: npm이 잘못된 디렉토리에서 실행됨

**해결 방법**:
- Build Command에 `cd backend &&` 접두사 확인
- 또는 Build Command를 비우고 render.yaml 사용

---

### 문제 3: Yarn 실행 오류

**원인**: Render가 자동으로 yarn 감지

**해결 방법**:
1. Settings → Build & Deploy
2. Build Command를 명시적으로 설정
3. yarn.lock 파일이 있다면 삭제 (npm만 사용)

---

### 문제 4: 빌드 타임아웃

**원인**: 무료 플랜 빌드 시간 제한 (15분)

**해결 방법**:
- render.yaml의 빌드 명령 최적화
- node_modules 캐싱 활용
- 불필요한 의존성 제거

---

## 연결 문제

### 문제 1: "자바스크립트를 활성화하세요" 오류

**원인**: 프론트엔드 빌드가 제대로 안 됨

**확인 사항**:
1. Logs → Build logs에서 컴파일 성공 확인:
   ```
   ✓ Compiled successfully
   ```
2. 빌드 파일 생성 확인:
   ```
   patient-portal/build/index.html
   admin-dashboard/build/index.html
   ```

**해결 방법**:
- render.yaml에 빌드 명령 확인
- 수동 재배포: **Manual Deploy** → **Deploy latest commit**

---

### 문제 2: 404 Not Found

**원인**: 라우팅 설정 문제

**확인 사항**:
- `backend/server.js`에 정적 파일 서빙 설정 확인:
  ```javascript
  app.use('/patient', express.static(path.join(__dirname, '../patient-portal/build')));
  app.use('/admin', express.static(path.join(__dirname, '../admin-dashboard/build')));
  ```

---

### 문제 3: 무료 플랜 슬립 모드 (첫 접속 시 30초~1분 대기)

**원인**: 15분 비활성 시 서버 자동 슬립

**해결 방법**:
- 정상 동작입니다
- 첫 접속 시 웨이크업 대기
- 또는 유료 플랜으로 업그레이드

---

## 환경 변수 문제

### 문제 1: DB 연결 실패

**증상**: "getaddrinfo ENOTFOUND" 또는 "Access denied"

**확인 사항**:
1. Environment 탭에서 DB 환경 변수 확인:
   - `DB_HOST` - 정확한 Aiven 호스트명
   - `DB_PORT` - 26163 (기본값)
   - `DB_USER` - avnadmin
   - `DB_PASSWORD` - 정확한 비밀번호
   - `DB_NAME` - defaultdb
   - `DB_SSL` - **true** (필수!)

2. Aiven 서비스 상태 확인:
   - https://console.aiven.io
   - 서비스가 **Running** 상태인지 확인

**해결 방법**:
- 환경변수 값 재확인 및 수정
- Save Changes 후 재배포 대기

---

### 문제 2: JWT 오류

**증상**: 회원가입/로그인 실패

**확인 사항**:
- `JWT_SECRET` 환경변수 설정 확인

**해결 방법**:
```
JWT_SECRET = mySecretJwtKey2026ForMedicalDiagnosisPlatformProduction
```
또는 랜덤 문자열 생성:
```
JWT_SECRET = 7a9f8e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f
```

---

### 문제 3: Cloudinary 이미지 업로드 실패

**확인 사항**:
```
CLOUDINARY_CLOUD_NAME = [정확한 클라우드명]
CLOUDINARY_API_KEY = [정확한 API 키]
CLOUDINARY_API_SECRET = [정확한 시크릿]
```

**디버깅**:
- `/api/debug/db` 접속하여 Cloudinary 설정 확인
- Cloudinary Dashboard에서 API 키 재확인

---

## 서비스 재생성

### 언제 필요한가?
- 빌드 실패가 계속 반복될 때
- 환경 변수를 처음부터 다시 설정하고 싶을 때
- 리전 변경이 필요할 때

### 재생성 순서

#### 1단계: 기존 서비스 삭제
1. Render Dashboard 접속
2. 기존 서비스 클릭
3. **Settings** → 맨 아래 **Delete Service**
4. 서비스 이름 입력 후 확인

#### 2단계: 새 서비스 생성
1. **New** → **Web Service**
2. GitHub 저장소 연결
3. 위의 "Render 배포" 가이드 따라 설정

#### 3단계: 환경 변수 다시 설정
- [환경변수 가이드](ENVIRONMENT_VARIABLES.md) 참조
- 모든 환경 변수 다시 입력

#### 4단계: 배포 확인
- 빌드 로그 확인
- 서비스 접속 테스트

### ⚠️ 주의사항
- 서비스 삭제 시 빌드 캐시도 삭제됨
- 환경 변수 백업 필요
- 무료 플랜은 계정당 Web Service 1개만 가능

---

## 일반적인 디버깅 방법

### 1. Logs 확인
- **Build logs**: 빌드 과정 확인
- **Deploy logs**: 서버 시작 및 에러 확인

### 2. 환경 변수 디버깅
접속: `https://[서비스명].onrender.com/api/debug/db`

확인 항목:
```json
{
  "dbConfig": {
    "DB_HOST": "✅ set",
    "DB_PORT": "✅ set",
    "DB_SSL": "✅ enabled"
  },
  "cloudinary": {
    "CLOUDINARY_CLOUD_NAME": "✅ set"
  }
}
```

### 3. 브라우저 개발자 도구
- F12 → Console 탭에서 에러 확인
- Network 탭에서 API 요청 확인

---

## 추가 도움말

### Render 문서
- https://render.com/docs

### 커뮤니티 지원
- Render Community: https://community.render.com/

### 이슈 제보
- GitHub Issues에 로그 첨부하여 제보
