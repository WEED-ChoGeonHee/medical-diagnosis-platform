# 📱 Android App Admin - SkinIQ Doctor 의사용 앱

SkinIQ Doctor 대시보드를 Android 앱으로 패키징한 WebView 앱입니다.

---

## 기술 스택

- **언어**: Java
- **최소 SDK**: Android 7.0 (API 24)
- **타겟 SDK**: Android 14 (API 34)
- **빌드**: Gradle

---

## 앱 정보

| 항목 | 값 |
|------|-----|
| 앱 이름 | SkinIQ Doctor |
| 패키지명 | `com.skiniq.doctor` |
| 버전 | 1.0 |

---

## 폴더 구조

```
android-app-admin/
├── app/
│   ├── build.gradle         # 앱 빌드 설정
│   └── src/main/
│       ├── AndroidManifest.xml  # 앱 권한 및 설정
│       ├── java/com/skiniq/doctor/
│       │   └── MainActivity.java  # WebView Activity
│       └── res/
│           ├── layout/activity_main.xml  # 레이아웃
│           ├── values/
│           │   ├── strings.xml    # 앱 이름
│           │   ├── colors.xml     # 색상
│           │   └── styles.xml     # 테마
│           ├── drawable/          # 아이콘, 스플래시
│           └── mipmap-anydpi-v26/ # Adaptive Icon
│
├── build.gradle             # 프로젝트 빌드 설정
├── settings.gradle          # 프로젝트 설정
├── gradlew                  # Gradle Wrapper (Linux/Mac)
└── gradlew.bat              # Gradle Wrapper (Windows)
```

---

## 주요 기능

### 1. WebView
- SkinIQ Doctor 웹사이트(`/admin`)를 앱 내에서 표시
- JavaScript 활성화

### 2. 카메라/갤러리 연동 (선택적)
- 환자 사진 추가 촬영 시 사용

### 3. 권한
- `CAMERA`: 사진 촬영
- `READ_MEDIA_IMAGES`: 갤러리 접근 (Android 13+)
- `READ/WRITE_EXTERNAL_STORAGE`: 갤러리 접근 (Android 12 이하)

---

## 환자 앱과의 차이점

| 항목 | 환자 앱 | 의사 앱 |
|------|---------|---------|
| 패키지명 | `com.skiniq.patient` | `com.skiniq.doctor` |
| 접속 URL | `/patient` | `/admin` |
| 아이콘 색상 | 블루 (#4f8cff) | 퍼플 (#a855f7) |
| 아이콘 심볼 | 피부 패턴 | 의료 십자 + AI |

---

## 빌드 방법

### 방법 1: 스크립트 사용 (추천)

```powershell
# 프로젝트 루트에서
.\scripts\build-android-apk.ps1
```

### 방법 2: Gradle 직접 실행

```bash
cd android-app-admin
.\gradlew.bat assembleDebug
```

### 빌드 결과

- Debug APK: `app/build/outputs/apk/debug/app-debug.apk`
- 복사 위치: `apk-builds/SkinIQ-Doctor.apk`

---

## 앱 아이콘

아이콘 디자인 컨셉:
- 🔬 의료 십자 + AI 네트워크 (의사 전용 구분)
- 배경색: `#0a0e27` (앱 테마)
- 메인 컬러: `#a855f7` (퍼플), `#00d4ff` (시안)

---

## 개발 환경

### 요구사항
- Android Studio (권장)
- JDK 8+
- Android SDK 34

### VS Code에서 빌드
```bash
.\gradlew.bat assembleDebug
```

---

## 배포

의사 전용 앱으로, 병원 내부 배포 또는 MDM을 통해 배포합니다.
