# 🚀 APK 빌드 및 배포 완료!

## 📱 웹사이트 주소

배포된 사이트 주소:

### **환자 포털 (모바일용)**
```
https://medical-diagnosis-backend.onrender.com/patient
```

### **관리자 대시보드 (의사용)**  
```
https://medical-diagnosis-backend.onrender.com/admin
```

### **API 서버**
```
https://medical-diagnosis-backend.onrender.com/api
```

---

## 📲 APK 빌드 방법

### 방법 1: 자동 빌드 스크립트 (가장 간단)

```powershell
cd e:\소스\의학
.\build-android-apk.ps1
```

이 스크립트가 자동으로:
1. Gradle로 APK 빌드
2. APK를 `medical-diagnosis.apk`로 복사
3. 설치 방법 안내

---

### 방법 2: Android Studio 사용

1. **Android Studio 다운로드**
   - https://developer.android.com/studio

2. **프로젝트 열기**
   - `File > Open > e:\소스\의학\android-app`

3. **Gradle 동기화 대기**
   - 자동으로 의존성 다운로드

4. **APK 빌드**
   - `Build > Build Bundle(s) / APK(s) > Build APK(s)`

5. **APK 파일 위치**
   ```
   android-app\app\build\outputs\apk\debug\app-debug.apk
   ```

---

### 방법 3: 명령줄로 직접 빌드

Android SDK가 이미 설치되어 있다면:

```powershell
cd e:\소스\의학\android-app

# Windows
.\gradlew.bat assembleDebug

# 성공하면 APK 생성됨
# 위치: app\build\outputs\apk\debug\app-debug.apk
```

---

## 🌐 배포 업데이트 (Render.com)

코드를 GitHub에 푸시하면 자동으로 배포됩니다:

```powershell
cd e:\소스\의학

git add .
git commit -m "프론트엔드 정적 파일 서빙 추가"
git push origin main
```

Render.com에서 자동으로:
1. 환자 포털 빌드
2. 관리자 대시보드 빌드  
3. 백엔드 서버에서 모두 서빙

배포 완료되면 (5-10분 소요):
- https://medical-diagnosis-backend.onrender.com/patient
- https://medical-diagnosis-backend.onrender.com/admin

---

## 📱 APK 설치 방법

1. **APK 파일을 스마트폰으로 전송**
   - USB 케이블
   - Google Drive
   - 카카오톡 파일 전송
   - 이메일

2. **스마트폰에서 설치**
   - 파일 관리자 앱에서 APK 클릭
   - "알 수 없는 출처" 앱 설치 허용
   - 설치 완료!

---

## ✅ APK 설정 확인

APK는 다음 URL로 접속하도록 설정되어 있습니다:

**MainActivity.java**:
```java
private static final String APP_URL = "https://medical-diagnosis-backend.onrender.com/patient";
```

---

## 🎯 최종 확인 체크리스트

### 로컬 테스트 (개발용)
- [ ] 백엔드 서버 실행: `cd backend && npm start`
- [ ] 환자 포털 실행: `cd patient-portal && npm start`
- [ ] http://localhost:3000 접속 확인

### 배포 (프로덕션)
- [ ] GitHub에 코드 푸시
- [ ] Render.com 배포 완료 대기
- [ ] https://medical-diagnosis-backend.onrender.com/patient 접속 확인
- [ ] APK 빌드 및 테스트

---

## 🚨 주의사항

### 첫 접속 시 느림
- 무료 서버는 15분 비활성 후 슬립 모드
- 첫 접속 시 30초~1분 대기 (자동 재시작)
- 이후 정상 속도로 동작

### APK URL 변경이 필요한 경우
1. `android-app\app\src\main\java\com\medical\patient\MainActivity.java` 수정
2. `APP_URL` 변경
3. APK 다시 빌드

---

## 📞 도움말

더 자세한 내용은:
- [QUICK-START.md](QUICK-START.md) - 전체 가이드
- [android-app/README.md](android-app/README.md) - Android 앱 상세 가이드
- [DEPLOY.md](DEPLOY.md) - 배포 가이드
