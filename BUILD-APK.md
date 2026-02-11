# 📱 Android APK 생성 가이드

## 방법 1: Capacitor 사용 (추천)

### 1단계: Capacitor 설치
```powershell
cd e:\소스\의학\patient-portal

# Capacitor 설치
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Capacitor 초기화
npx cap init medicalApp com.medical.patient
```

### 2단계: 프로덕션 빌드
```powershell
# React 앱 빌드
npm run build

# Android 플랫폼 추가
npx cap add android
```

### 3단계: API URL 설정
`src/api.js` 파일 수정:
```javascript
const API_URL = 'https://medical-diagnosis-backend.onrender.com/api';
```

그리고 다시 빌드:
```powershell
npm run build
npx cap sync
```

### 4단계: APK 생성

#### 옵션 A: Android Studio 사용
```powershell
npx cap open android
```
Android Studio에서:
1. **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. 빌드 완료 후 APK 위치 확인

#### 옵션 B: 명령줄로 빌드 (Android Studio 없이)
```powershell
cd android
.\gradlew assembleDebug
```
생성된 APK 위치: `android\app\build\outputs\apk\debug\app-debug.apk`

---

## 방법 2: 간단한 WebView APK 프로젝트

Android Studio 없이 간단한 WebView 앱을 만들 수 있습니다.
이 방법은 별도 가이드 파일을 참조하세요.

---

## 🎯 빠른 APK 생성 스크립트

아래 스크립트를 실행하여 자동으로 APK를 생성합니다:

```powershell
.\build-apk.ps1
```

스크립트 내용은 다음 단계에서 생성됩니다.
