# 🚨 Render 환경변수 설정 가이드

## 문제 상황
JWT_SECRET이 자동 생성되지 않아 회원가입/로그인이 실패합니다.

## ✅ 해결 방법: Render에서 JWT_SECRET 환경변수 설정

### 1단계: Render Dashboard 접속
```
https://dashboard.render.com/
```

### 2단계: 서비스 선택
- **medical-diagnosis-platform** 클릭

### 3단계: Environment 설정
- 왼쪽 메뉴에서 **Environment** 클릭
- **Add Environment Variable** 버튼 클릭

### 4단계: JWT_SECRET 추가

**Key:**
```
JWT_SECRET
```

**Value:** (아래 값 중 하나 복사해서 사용)
```
mySecretJwtKey2026ForMedicalDiagnosisPlatformProduction
```

또는 더 안전한 랜덤 값:
```
7a9f8e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f
```

### 5단계: 저장 및 재배포
- **Save Changes** 클릭
- 자동으로 재배포 시작 (5-7분 소요)

### 6단계: 배포 완료 확인
```
https://medical-diagnosis-platform.onrender.com/api/debug/db
```
위 주소에서 `"JWT_SECRET": "✅ set"` 확인

---

## 🧪 배포 완료 후 테스트

### 1. 웹 브라우저 테스트
```
URL: https://medical-diagnosis-platform.onrender.com/patient
```
1. 회원가입
2. 로그인
3. 진단 생성 (이미지 업로드)
4. 진단 상세에서 이미지 확인

### 2. APK 테스트
1. `환자용_의료진단.apk` 설치
2. 앱 실행 → 회원가입/로그인
3. 진단 생성 → **카메라 촬영** 또는 **갤러리 선택**
4. 이미지 업로드 확인
5. 진단 목록에서 이미지 썸네일 확인
6. 진단 상세에서 이미지 풀사이즈 확인

---

## ✅ 테스트 체크리스트

- [ ] Render에 JWT_SECRET 환경변수 설정
- [ ] 재배포 완료 (5-7분 대기)
- [ ] /api/debug/db에서 JWT_SECRET ✅ 확인
- [ ] 웹에서 회원가입 성공
- [ ] 웹에서 로그인 성공
- [ ] 웹에서 이미지 업로드
- [ ] 웹에서 이미지 표시 확인
- [ ] APK 설치
- [ ] APK에서 카메라 촬영 테스트
- [ ] APK에서 갤러리 선택 테스트
- [ ] APK에서 이미지 표시 확인

---

## 🎯 모든 기능 완성!

환경변수 설정 후:
- ✅ 회원가입/로그인
- ✅ 카메라 촬영
- ✅ 갤러리 선택  
- ✅ 이미지 업로드 (Cloudinary)
- ✅ 이미지 표시
- ✅ AI 진단
- ✅ 의사 검토

**모든 준비 완료!** 🎉
