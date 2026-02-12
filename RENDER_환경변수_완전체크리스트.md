# ✅ Render 환경 변수 완전 체크리스트

## 총 12개 환경 변수 필요

### Render Dashboard → Environment 에서 확인

---

## 📋 환경 변수 목록 및 값

### 1️⃣ 자동 설정 (건드리지 않아도 됨)

```
✅ NODE_ENV = production (render.yaml에서 자동 설정)
✅ PORT = 10000 (render.yaml에서 자동 설정)
✅ JWT_SECRET = (자동 생성)
```

---

### 2️⃣ 데이터베이스 (Aiven MySQL)

```
DB_HOST = [Aiven 호스트 주소].aivencloud.com
DB_PORT = [포트 번호]
DB_USER = avnadmin
DB_PASSWORD = [Aiven 비밀번호]
DB_NAME = defaultdb
DB_SSL = true
```

> Aiven 콘솔 → Service → Connection information 에서 복사

---

### 3️⃣ AI 진단 (Google Gemini)

```
GEMINI_API_KEY = [Google AI Studio에서 발급한 키]
```

> https://aistudio.google.com/app/apikey 에서 발급

---

### 4️⃣ 이미지 업로드 (Cloudinary)

```
CLOUDINARY_CLOUD_NAME = [클라우드명]
CLOUDINARY_API_KEY = [API 키]
CLOUDINARY_API_SECRET = [API 시크릿]
```

> https://console.cloudinary.com/settings/api-keys 에서 확인

---

## 🔍 확인 방법

배포 후 다음 URL로 환경 변수 상태 확인:
```
https://[서비스명].onrender.com/api/debug/db
```

모든 항목이 `✅ set`으로 표시되어야 합니다.
