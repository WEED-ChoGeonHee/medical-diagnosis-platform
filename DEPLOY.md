# 🚀 의료 진단 플랫폼 배포 가이드

## 📋 배포 구성
- **데이터베이스**: Aiven MySQL (무료 티어)
- **백엔드**: Render.com Web Service (무료 티어)
- **프론트엔드**: APK 파일로 배포 완료

---

## 1️⃣ Aiven MySQL 무료 데이터베이스 생성

### 1-1. Aiven 계정 생성
1. https://console.aiven.io/signup 접속
2. 이메일로 회원가입 (신용카드 불필요!)
3. 이메일 인증

### 1-2. MySQL 데이터베이스 생성
1. Aiven 콘솔에서 **Create service** 클릭
2. 서비스 선택: **MySQL**
3. 클라우드 제공자: **Google Cloud** (무료)
4. 리전: **Seoul** (asia-northeast3) - 가장 가까운 지역
5. 플랜: **Hobbyist - Free** 선택
6. 서비스 이름: `medical-diagnosis-db` (원하는 이름)
7. **Create service** 클릭

### 1-3. 데이터베이스 연결 정보 확인
서비스가 시작되면 (2-3분 소요):
1. **Overview** 탭에서 연결 정보 확인
2. 다음 정보를 메모장에 복사:
   - **Host** (예: medical-diagnosis-db-xxx.aivencloud.com)
   - **Port** (기본값: 25060)
   - **User** (기본값: avnadmin)
   - **Password** (자동 생성된 비밀번호)
   - **Database** (기본값: defaultdb)

### 1-4. 데이터베이스 이름 변경 (선택사항)
1. **Databases** 탭으로 이동
2. **Create database** 클릭
3. 데이터베이스 이름: `medical_diagnosis` 입력
4. **Add database** 클릭

---

## 2️⃣ GitHub 저장소 생성 및 코드 업로드

### 2-1. GitHub 저장소 생성
1. https://github.com/new 접속
2. Repository name: `medical-diagnosis`
3. **Public** 선택 (무료 배포 필수)
4. **Create repository** 클릭

### 2-2. 코드 푸시
PowerShell에서 실행:

```powershell
cd e:\소스\의학

# Git 설정 (처음 한 번만)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# GitHub 저장소 연결
git remote add origin https://github.com/YOUR_USERNAME/medical-diagnosis.git

# 브랜치 이름 변경 (main으로)
git branch -M main

# 푸시
git push -u origin main
```

**주의**: `YOUR_USERNAME`을 실제 GitHub 사용자명으로 변경!

---

## 3️⃣ Render.com 배포

### 3-1. Render 계정 생성
1. https://render.com 접속
2. **Get Started** 클릭
3. **GitHub**로 로그인

### 3-2. Blueprint로 배포
1. Dashboard에서 **New +** 클릭
2. **Blueprint** 선택
3. GitHub 저장소 연결:
   - **Connect GitHub** 클릭
   - `medical-diagnosis` 저장소 선택
4. `render.yaml` 자동 감지됨
5. **Blueprint Name**: `medical-diagnosis` 입력

### 3-3. 환경 변수 설정
Aiven에서 복사한 정보를 입력:

| 환경 변수 | 값 |
|---------|-----|
| `DB_HOST` | Aiven Host (예: medical-diagnosis-db-xxx.aivencloud.com) |
| `DB_PORT` | 25060 |
| `DB_USER` | avnadmin |
| `DB_PASSWORD` | Aiven에서 복사한 비밀번호 |
| `DB_NAME` | medical_diagnosis (또는 defaultdb) |
| `GEMINI_API_KEY` | AIzaSyC5YvYM0s72gEABsISDMrt-didXfZxksvg |

### 3-4. 배포 시작
1. **Apply** 클릭
2. 배포 진행 (5-10분 소요)
3. 완료되면 URL 확인: `https://medical-diagnosis-backend.onrender.com`

---

## 4️⃣ 배포 확인

### 4-1. 백엔드 API 테스트
브라우저에서 접속:
```
https://medical-diagnosis-backend.onrender.com/api/auth/health
```

정상 응답:
```json
{"status": "ok", "database": "connected"}
```

### 4-2. 데이터베이스 연결 확인
Aiven 콘솔:
1. **Current Queries** 탭에서 활성 연결 확인
2. **Metrics** 탭에서 CPU/메모리 사용량 확인

---

## 5️⃣ APK 업데이트 (선택사항)

### 현재 APK는 핫스팟 IP로 설정됨
배포된 백엔드를 사용하려면:

1. `E:\medical\webview-apps\patient-webview\app\src\main\java\com\medicalapp\patient\MainActivity.java` 수정:
```java
private static final String APP_URL = "https://medical-diagnosis-backend.onrender.com/patient";
```

2. APK 재빌드:
```powershell
cd E:\medical\webview-apps
.\build-all.ps1
```

---

## 🎯 요약

✅ **완료된 작업**:
- Aiven MySQL 무료 데이터베이스 설정
- GitHub 저장소 생성 및 코드 업로드
- Render.com 무료 웹 서비스 배포
- 환경 변수 설정

🌐 **배포 URL**:
- 백엔드 API: `https://medical-diagnosis-backend.onrender.com`
- 프론트엔드: APK 파일 (로컬 또는 업데이트 필요)

💰 **비용**: 완전 무료!
- Aiven MySQL: 무료 티어 (5GB 스토리지)
- Render.com: 무료 티어 (750시간/월)

---

## ⚠️ 주의사항

### Render 무료 티어 제한
- **자동 슬립**: 15분 비활성 시 서버 정지
- **처음 요청 시 재시작**: 30초~1분 소요
- **월 750시간 제한**: 약 31일 (충분함)

### Aiven 무료 티어 제한
- **스토리지**: 최대 5GB
- **백업**: 자동 백업 2일 보관
- **연결 수**: 최대 25개 동시 연결

### 해결 방법
- 서버가 자주 슬립되면 UptimeRobot (https://uptimerobot.com) 으로 5분마다 핑
- APK에서 로딩 인디케이터 추가하여 사용자 경험 개선

---

## 🆘 문제 해결

### 1. 데이터베이스 연결 실패
- Aiven 콘솔에서 서비스 상태 확인
- Render 환경 변수 다시 확인
- Aiven IP 화이트리스트 확인 (**불필요** - Render는 자동 허용됨)

### 2. Render 배포 실패
- GitHub 저장소가 Public인지 확인
- `render.yaml` 파일이 루트 디렉토리에 있는지 확인
- Render 로그에서 에러 메시지 확인

### 3. API 요청 실패
- 백엔드 URL이 정확한지 확인
- HTTPS 사용 확인 (HTTP ❌)
- 브라우저 콘솔에서 CORS 에러 확인

---

## 📞 지원

문제가 있다면:
1. Render Dashboard → Logs 확인
2. Aiven Console → Logs 확인
3. GitHub Issues에 문의
