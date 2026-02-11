# 🔧 Render 환경 변수 확인하기

## 📌 DB 연결 문제 해결

### 문제 상황
- 페이지는 나오지만 회원가입이 안 되는 경우
- "서버 오류" 메시지만 나오는 경우

### 해결 방법

---

## 1️⃣ Render Dashboard 접속

1. https://dashboard.render.com/ 접속
2. **medical-diagnosis-platform** 서비스 클릭
3. 왼쪽 메뉴에서 **Environment** 클릭

---

## 2️⃣ 환경 변수 확인 (총 12개 필요)

### ✅ 자동 설정 (3개)
- `NODE_ENV` = production
- `PORT` = 10000  
- `JWT_SECRET` = (자동 생성됨)

### ⚠️ 수동 입력 필요 (9개)

#### Database (6개) - **가장 중요!**
```
DB_HOST = geonhee-1017-itweed-cf64.e.aivencloud.com
DB_PORT = 26163
DB_USER = avnadmin
DB_PASSWORD = (Aiven 비밀번호)
DB_NAME = defaultdb
DB_SSL = true
```

#### API (1개)
```
GEMINI_API_KEY = (Gemini API 키)
```

#### Cloudinary (3개)
```
CLOUDINARY_CLOUD_NAME = (Cloudinary 이름)
CLOUDINARY_API_KEY = (Cloudinary API 키)
CLOUDINARY_API_SECRET = (Cloudinary Secret)
```

---

## 3️⃣ 환경 변수 입력 방법

1. **Environment** 페이지에서 **Add Environment Variable** 클릭
2. Key와 Value 입력
   - Key: `DB_HOST`
   - Value: `geonhee-1017-itweed-cf64.e.aivencloud.com`
3. **Add** 버튼 클릭
4. 위 과정을 9번 반복 (나머지 변수들도 입력)
5. 모두 입력 후 **Save Changes** 클릭

---

## 4️⃣ 자동 재배포 확인

저장하면 자동으로 재배포 시작:
1. **Events** 탭에서 "Deploy started" 확인
2. **Logs** 탭에서 배포 진행 상황 확인
3. "✅ MySQL 연결 성공!" 메시지 확인 (중요!)
4. "Deploy live" 메시지 확인

배포 완료까지 약 5-7분 소요

---

## 5️⃣ 배포 완료 확인

### 방법 1: 웹사이트 테스트
https://medical-diagnosis-platform.onrender.com/patient/register
→ 회원가입 시도해보기

### 방법 2: DB 디버그 확인
https://medical-diagnosis-platform.onrender.com/api/debug/db
→ `"connection": "✅ connected"` 확인

---

## ⚠️ 주의사항

### DB_PORT 확인!
- ❌ **25060** (일반 MySQL 기본 포트 - 틀림!)
- ✅ **26163** (Aiven MySQL 실제 포트 - 맞음!)

### DB_NAME 확인!
- ❌ **medical_diagnosis** (로컬 DB 이름 - 틀림!)
- ✅ **defaultdb** (Aiven 기본 DB 이름 - 맞음!)

### DB_SSL 필수!
- ✅ **true** (Aiven은 SSL 필수)

---

## 🎯 완료 후 다음 단계

1. ✅ 환경 변수 12개 모두 입력
2. ✅ Render 재배포 완료
3. ✅ 웹사이트 정상 작동 확인
4. ▶️ APK 파일 재빌드

---

**⏱️ 예상 소요 시간:**
- 환경 변수 입력: 5분
- Render 재배포: 5-7분
- **총 10-15분**
