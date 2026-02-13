# 📱 Android APK 빌드 가이드

## 목차
1. [사전 준비](#사전-준비)
2. [환자용 앱 빌드](#환자용-앱-빌드)
3. [의사용 앱 빌드](#의사용-앱-빌드)
4. [설치 및 배포](#설치-및-배포)

---

## 사전 준비

### 필요한 도구
- **Android Studio** (최신 버전)
- **Java JDK 17+**

### 다운로드
- Android Studio: https://developer.android.com/studio
- OpenJDK: https://adoptium.net/

---

## 환자용 앱 빌드

### 1단계: 프로젝트 열기
1. Android Studio 실행
2. **Open** 클릭
3. `android-app/` 폴더 선택
4. Gradle 자동 동기화 대기

### 2단계: 서버 URL 설정
`app/src/main/java/com/medical/patient/MainActivity.java` 열기:

```java
webView.loadUrl("https://medical-diagnosis-platform.onrender.com/patient");
```

⚠️ **본인의 Render 서비스 URL로 변경**

### 3단계: APK 빌드

#### 디버그 APK (개발/테스트용)
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. 빌드 완료 대기 (1-2분)
3. 생성 위치: `app/build/outputs/apk/debug/app-debug.apk`

#### 릴리즈 APK (배포용)
1. **Build** → **Generate Signed Bundle / APK**
2. **APK** 선택 → **Next**
3. 키스토어 생성 또는 선택:
   - **Create new...** 클릭
   - Key store path: 저장 위치 선택
   - Password: 비밀번호 설정
   - Alias: `patient-app-key`
   - Validity: 25년
   - First and Last Name: 이름 입력
4. **Next** → **release** 선택 → **Finish**
5. 생성 위치: `app/build/outputs/apk/release/app-release.apk`

---

## 의사용 앱 빌드

### 1단계: 프로젝트 열기
1. Android Studio 실행
2. **Open** 클릭
3. `android-app-admin/` 폴더 선택
4. Gradle 자동 동기화 대기

### 2단계: 서버 URL 설정
`app/src/main/java/com/medical/doctor/MainActivity.java` 열기:

```java
webView.loadUrl("https://medical-diagnosis-platform.onrender.com/admin");
```

⚠️ **본인의 Render 서비스 URL로 변경**

### 3단계: APK 빌드
환자용 앱과 동일한 방법으로 빌드

---

## 설치 및 배포

### Android 기기에 직접 설치

#### 1. APK 파일 전송
- USB 케이블로 연결
- 또는 이메일/클라우드로 APK 전송

#### 2. 기기에서 설치
1. **파일 관리자**에서 APK 파일 찾기
2. APK 파일 탭
3. "알 수 없는 출처" 허용 (보안 설정)
4. **설치** 클릭
5. 설치 완료!

### Google Play 스토어 배포

#### 1. Google Play Console 가입
- https://play.google.com/console
- 개발자 등록 ($25 일회성)

#### 2. AAB 파일 생성
1. **Build** → **Generate Signed Bundle / APK**
2. **Android App Bundle** 선택
3. 서명 키 설정
4. 릴리즈 빌드

#### 3. Play Console 업로드
1. **Create app** 클릭
2. 앱 정보 입력
3. **Release** → **Production**
4. AAB 파일 업로드
5. 심사 제출

---

## 앱 기능

### 환자용 앱
- ✅ 카메라로 피부 사진 촬영
- ✅ 갤러리에서 사진 선택
- ✅ 여러 이미지 동시 업로드 (최대 5개)
- ✅ AI 진단 결과 확인
- ✅ 진단 이력 조회

### 의사용 앱
- ✅ 환자 목록 조회
- ✅ 진단 상세 확인
- ✅ 의사 소견 작성
- ✅ 진단 상태 업데이트
- ✅ 대시보드 통계

---

## 주요 설정 파일

### build.gradle (앱 수준)
```gradle
android {
    compileSdk 34
    
    defaultConfig {
        applicationId "com.medical.patient"  // 또는 "com.medical.doctor"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }
}
```

### AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### MainActivity.java
- WebView 설정
- 파일 업로드 처리
- 카메라/갤러리 권한

---

## 문제 해결

### Gradle Sync 실패
**해결**:
1. **File** → **Invalidate Caches** → **Invalidate and Restart**
2. 인터넷 연결 확인
3. Gradle 버전 확인

### 빌드 오류: "SDK not found"
**해결**:
1. **Tools** → **SDK Manager**
2. Android SDK 설치 확인
3. SDK 경로 설정 확인

### APK 설치 실패: "앱이 설치되지 않음"
**해결**:
1. 기존 앱 삭제 후 재설치
2. "알 수 없는 출처" 허용 확인
3. Android 버전 확인 (최소 7.0 필요)

### 카메라/갤러리 권한 거부
**해결**:
1. 앱 설정 → 권한
2. 카메라, 저장소 권한 허용
3. 앱 재시작

---

## 시스템 요구사항

### Android 버전
- **최소**: Android 7.0 (API 24)
- **권장**: Android 10.0 (API 29) 이상

### 권한
- 인터넷 (필수)
- 카메라 (이미지 촬영)
- 저장소 (이미지 선택)

### 용량
- APK 크기: 약 5 MB
- 설치 후: 약 15 MB

---

## 버전 관리

### 버전 코드 증가
`app/build.gradle`:
```gradle
versionCode 2  // 1씩 증가
versionName "1.1"  // 표시용 버전
```

### 변경 로그 작성
각 버전별 변경사항 기록:
```
v1.0 (2026-02-13)
- 초기 릴리즈
- 카메라/갤러리 이미지 업로드
- AI 진단 기능

v1.1 (예정)
- UI 개선
- 버그 수정
```

---

## 참고 자료
- Android Developers: https://developer.android.com/
- WebView 가이드: https://developer.android.com/guide/webapps/webview
- Play Console 도움말: https://support.google.com/googleplay/android-developer
