# 📱 Android APK 생성 가이드

## 사전 준비
- Android Studio 설치
- Java JDK 17+

## 빌드 순서

### 1. 프로젝트 열기
```
Android Studio → Open → android-app/ 폴더 선택
```

### 2. Gradle Sync
Android Studio가 자동으로 Gradle 동기화 실행

### 3. 서버 URL 설정
`app/src/main/java/.../MainActivity.java`에서:
```java
webView.loadUrl("https://medical-diagnosis-platform.onrender.com/patient");
```

### 4. 디버그 APK 빌드
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```
생성 경로: `app/build/outputs/apk/debug/app-debug.apk`

### 5. 릴리즈 APK 빌드
```
Build → Generate Signed Bundle / APK → APK
→ 키스토어 생성 또는 선택 → Release 빌드
```

## 주요 설정 파일
- `app/build.gradle` — 앱 버전, SDK 설정
- `AndroidManifest.xml` — 권한 (인터넷, 카메라, 갤러리)
- `MainActivity.java` — WebView 설정, 파일 업로드 처리
