# 🚀 SkinIQ - 서비스 사용 가이드

SkinIQ 플랫폼의 사용 방법을 안내합니다.

---

## 📱 환자용 - SkinIQ

### 접속 방법

**웹 브라우저:**
```
https://medical-diagnosis-platform.onrender.com/patient
```

**Android 앱:**
- `apk-builds/SkinIQ-Patient.apk` 설치

---

### 사용 흐름

#### 1. 회원가입
1. "회원가입" 클릭
2. 이름, 이메일, 비밀번호 입력
3. 가입 완료 → 자동 로그인

#### 2. 새 진단 요청
1. "새 진단" 버튼 클릭
2. **증상 선택** (복수 선택 가능)
   - 여드름
   - 아토피
   - 건선
   - 습진
   - 두드러기
   - 기타
3. **피부 타입 선택**
   - 지성, 건성, 복합성, 민감성
4. **증상 상세 설명** 작성
5. **피부 사진 업로드** (최대 5장)
   - 카메라 촬영 또는 갤러리 선택
6. "진단 요청" 클릭

#### 3. AI 진단 결과 확인
제출 즉시 Google Gemini AI가 분석:
- 예상 질환명
- 원인 분석
- 관리 방법 제안
- 주의사항

#### 4. 의사 소견 확인
의사가 검토 완료 시:
- 상태가 "완료"로 변경
- 전문 의료 소견 확인 가능

---

## 🩺 의사용 - SkinIQ Doctor

### 접속 방법

**웹 브라우저:**
```
https://medical-diagnosis-platform.onrender.com/admin
```

**Android 앱:**
- `apk-builds/SkinIQ-Doctor.apk` 설치

---

### 테스트 계정

| 이메일 | 비밀번호 |
|--------|----------|
| `doctor@hospital.com` | `doctor123` |

---

### 사용 흐름

#### 1. 로그인
- 의사 계정으로 로그인
- 일반 환자 계정은 접근 불가

#### 2. 대시보드 확인
로그인 후 통계 확인:
- 총 진단 수
- 대기중 (pending)
- 검토중 (in_review)
- 완료 (completed)

#### 3. 진단 목록 조회
- 전체 환자 진단 목록
- 상태별 필터링
- 날짜/환자 검색

#### 4. 진단 상세 및 소견 작성
1. 진단 항목 클릭
2. **환자 정보** 확인
   - 이름, 증상, 제출일
3. **피부 사진** 확인
   - 확대 보기 가능
4. **AI 진단** 검토
   - AI가 분석한 결과
5. **의사 소견 작성**
   ```
   - 진단명
   - 치료 방법
   - 약 처방 (선택)
   - 주의사항
   ```
6. **상태 변경**
   - 대기중 → 검토중 → 완료
7. "저장" 클릭

#### 5. 환자 목록
- 등록된 환자 목록 조회
- 환자별 진단 이력 확인

---

## 🔧 로컬 개발 환경

### 한번에 실행

```powershell
.\scripts\quick-start.ps1
```

### 개별 실행

```bash
# 백엔드 (http://localhost:5000)
cd backend && npm install && node server.js

# 환자 포털 (http://localhost:3000)
cd patient-portal && npm install && npm start

# 관리자 대시보드 (http://localhost:3001)
cd admin-dashboard && npm install && set PORT=3001 && npm start
```

---

## 📊 진단 상태 흐름

```
pending (대기중)
    │
    ↓ (의사가 검토 시작)
    │
in_review (검토중)
    │
    ↓ (의사 소견 작성 완료)
    │
completed (완료)
```

---

## ❓ FAQ

### Q: 환자가 진단 결과를 확인하려면?
A: "내 진단" 메뉴에서 진단 목록 확인 → 상세 보기

### Q: 의사 계정은 어떻게 만드나요?
A: 관리자가 `scripts/backend-utils/create-doctor.js` 실행

### Q: AI 진단은 얼마나 정확한가요?
A: AI 진단은 참고용이며, 최종 진단은 의사가 내립니다.

### Q: 사진은 어디에 저장되나요?
A: Cloudinary CDN에 안전하게 저장됩니다.
