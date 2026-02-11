# 🚀 Android APK 빌드 가이드 (WebView)

## 📱 Android WebView 앱 생성 완료!

`android-app` 폴더에 WebView 기반 Android 앱 프로젝트가 생성되었습니다.

---

## 🛠️ APK 빌드 방법

### 방법 1: Android Studio 사용 (추천)

1. **Android Studio 설치**
   - https://developer.android.com/studio 에서 다운로드
   - 설치 시 Android SDK 포함

2. **프로젝트 열기**
   ```
   File > Open > e:\소스\의학\android-app 선택
   ```

3. **APK 빌드**
   ```
   Build > Build Bundle(s) / APK(s) > Build APK(s)
   ```

4. **APK 위치**
   ```
   android-app\app\build\outputs\apk\debug\app-debug.apk
   ```

---

### 방법 2: 명령줄로 빌드

Android SDK가 설치되어 있다면:

```powershell
cd e:\소스\의학\android-app

# Windows
.\gradlew.bat assembleDebug

# APK 위치
# app\build\outputs\apk\debug\app-debug.apk
```

---

### 방법 3: 온라인 빌드 서비스 (Android Studio 없이)

#### AppGyver / BuildApp.io
1. https://www.buildapp.io/ 접속
2. 프로젝트 업로드
3. 온라인에서 APK 빌드

#### GitHub Actions (무료, 자동화)
`.github/workflows/build-android.yml` 파일 생성 후 GitHub에 푸시하면 자동 빌드

---

## 🔧 앱 설정 변경

### 웹사이트 URL 변경
`android-app/app/src/main/java/com/medical/patient/MainActivity.java`:

```java
private static final String APP_URL = "https://your-website-url.com";
```

### 앱 이름 변경  
`android-app/app/src/main/res/values/strings.xml`:

```xml
<string name="app_name">의료 진단</string>
```

### 앱 아이콘 변경
`android-app/app/src/main/res/mipmap-*/` 폴더에 아이콘 이미지 배치

---

## 📲 APK 설치

1. APK 파일을 스마트폰으로 전송
2. 파일 관리자에서 APK 클릭
3. "알 수 없는 출처" 앱 설치 허용
4. 설치 완료!

---

## ⚡ 빠른 빌드 스크립트

다음 스크립트를 실행하여 자동으로 APK를 빌드:

```powershell
.\build-android-apk.ps1
```

---

## 🚨 문제 해결

### Gradle 다운로드 실패
- 인터넷 연결 확인
- VPN 사용 시 비활성화

### SDK 라이선스 동의 필요
```powershell
# Android SDK 경로로 이동
cd %LOCALAPPDATA%\Android\Sdk\tools\bin
sdkmanager --licenses
```

### 빌드 오류
- Android Studio에서 프로젝트를 한 번 열어서 자동 설정
- `File > Invalidate Caches / Restart`

---

## 📦 릴리즈 APK 생성 (서명)

릴리즈 APK는 Google Play Store에 업로드할 때 필요합니다.

### 1. 키스토어 생성
```powershell
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

### 2. build.gradle 수정
```gradle
android {
    signingConfigs {
        release {
            storeFile file("my-release-key.jks")
            storePassword "password"
            keyAlias "my-key-alias"
            keyPassword "password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 3. 릴리즈 빌드
```powershell
.\gradlew.bat assembleRelease
```

APK 위치: `app\build\outputs\apk\release\app-release.apk`
