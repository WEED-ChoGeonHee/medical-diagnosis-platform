# 📱 의료 진단 플랫폼 - 사용 가이드

## 🌐 웹사이트 접속 방법

### ✅ 가장 간단한 방법: 웹 브라우저로 접속

#### 로컬 서버 실행 후 접속:

1. **백엔드 서버 시작** (새 PowerShell 터미널):
```powershell
cd e:\소스\의학\backend
npm install
npm start
```

2. **환자 포털 시작** (새 PowerShell 터미널):
```powershell
cd e:\소스\의학\patient-portal
npm install
npm start
```

3. **브라우저에서 접속**:
   - 환자 포털: http://localhost:3000
   - 관리자 대시보드: http://localhost:3001 (추가 터미널에서 admin-dashboard 실행)

#### 모바일에서 접속 (같은 Wi-Fi):
1. PC의 IP 주소 확인:
```powershell
ipconfig
# IPv4 주소 확인 (예: 192.168.0.10)
```

2. 모바일 브라우저에서:
   - http://192.168.0.10:3000

---

### ☁️ 배포된 서버 접속 (어디서나)

배포가 완료되었다면:
- **환자 포털**: https://medical-diagnosis-backend.onrender.com/patient
- **관리자 대시보드**: https://medical-diagnosis-backend.onrender.com/admin

⚠️ **참고**: 무료 서버는 처음 접속 시 30초~1분 정도 대기 시간이 있습니다 (슬립 모드 해제).

---

## 📲 Android APK 생성 방법

### 방법 1: 빠른 빌드 (자동화 스크립트)

```powershell
cd e:\소스\의학
.\build-android-apk.ps1
```

이 스크립트가 자동으로:
1. Android SDK 확인
2. Gradle로 APK 빌드
3. APK 파일을 `medical-diagnosis.apk`로 복사

**필요사항**: Android Studio 또는 Android SDK 설치 필요

---

### 방법 2: Android Studio 사용 (추천)

1. **Android Studio 다운로드 및 설치**:
   - https://developer.android.com/studio

2. **프로젝트 열기**:
   ```
   File > Open > e:\소스\의학\android-app
   ```

3. **APK 빌드**:
   ```
   Build > Build Bundle(s) / APK(s) > Build APK(s)
   ```

4. **APK 파일 위치**:
   ```
   android-app\app\build\outputs\apk\debug\app-debug.apk
   ```

---

### 방법 3: 온라인 빌드 서비스 (Android Studio 없이)

Android Studio 설치 없이 APK를 생성할 수 있습니다:

#### AppGyver BuildApp.io
1. https://www.buildapp.io/ 접속
2. `android-app` 폴더를 ZIP으로 압축
3. 업로드하고 빌드

#### GitHub Actions (자동화)
- GitHub에 코드를 푸시하면 자동으로 APK 생성
- 설정 방법은 `android-app/README.md` 참조

---

### 방법 4: Capacitor 사용 (React 앱 -> 네이티브)

```powershell
cd e:\소스\의학\patient-portal

# Capacitor 설치
npm install @capacitor/core @capacitor/cli @capacitor/android

# 초기화
npx cap init medicalApp com.medical.patient --web-dir=build

# 빌드 및 Android 추가
npm run build
npx cap add android
npx cap sync

# Android Studio 열기
npx cap open android
```

Android Studio에서 Build > Build APK(s)

---

## 📱 APK 설치 방법

1. **APK 파일 전송**:
   - USB 케이블로 연결
   - 또는 Google Drive, 카카오톡 등으로 전송

2. **스마트폰에서 APK 파일 열기**:
   - 파일 관리자 앱에서 APK 파일 클릭

3. **설치 허용**:
   - "알 수 없는 출처" 앱 설치 허용
   - (설정 > 보안 > 알 수 없는 출처)

4. **설치 완료!** 🎉

---

## ⚙️ 앱 설정 변경

### 웹사이트 URL 변경
APK가 접속할 웹사이트 주소를 변경하려면:

**파일**: `android-app\app\src\main\java\com\medical\patient\MainActivity.java`

```java
private static final String APP_URL = "https://your-website-url.com";
```

배포된 서버 주소로 변경:
```java
private static final String APP_URL = "https://medical-diagnosis-backend.onrender.com/patient";
```

변경 후 다시 APK 빌드!

### 앱 이름 변경
**파일**: `android-app\app\src\main\res\values\strings.xml`

```xml
<string name="app_name">의료 진단</string>
```

---

## 🚨 문제 해결

### 1. "MongoDB service not found"
- 프로젝트가 MySQL로 변경되었습니다
- `backend\.env` 파일에 MySQL 설정 필요:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medical_diagnosis
```

### 2. 백엔드 연결 실패
- 백엔드 서버가 실행 중인지 확인
- 환경 변수 (.env) 설정 확인
- 방화벽 설정 확인

### 3. APK 빌드 실패
- Android Studio 설치 확인
- Gradle 동기화: `File > Sync Project with Gradle Files`
- SDK 라이선스 동의: `sdkmanager --licenses`

### 4. APK 설치 실패
- "알 수 없는 출처" 앱 설치 허용
- 저장 공간 확인
- 이전 버전 앱 삭제 후 재설치

---

## 📞 추가 도움말

- **웹사이트 접속**: [START-WEB.md](START-WEB.md)
- **APK 빌드**: [BUILD-APK.md](BUILD-APK.md)
- **Android 앱**: [android-app/README.md](android-app/README.md)
- **배포 가이드**: [DEPLOY.md](DEPLOY.md)

---

## 🎯 빠른 시작 체크리스트

### 웹사이트만 사용하기:
- [ ] 백엔드 서버 시작
- [ ] 환자 포털 시작
- [ ] 브라우저에서 http://localhost:3000 접속

### APK 사용하기:
- [ ] Android Studio 설치
- [ ] `build-android-apk.ps1` 실행
- [ ] APK 파일을 스마트폰으로 전송
- [ ] APK 설치

### 배포하기:
- [ ] [DEPLOY.md](DEPLOY.md) 참조
- [ ] Aiven MySQL 설정
- [ ] Render.com 배포
- [ ] APK URL 업데이트

---

## ✨ 기능 요약

### 환자 포털
- ✅ 회원가입 및 로그인
- ✅ 피부 증상 입력 및 이미지 업로드
- ✅ AI 진단 결과 확인
- ✅ 의사 소견 확인

### 관리자 대시보드
- ✅ 모든 진단 내역 조회
- ✅ 환자 정보 관리
- ✅ 의사 소견 작성
- ✅ 통계 대시보드

**기술 스택**: React + Node.js + MySQL + Gemini AI
