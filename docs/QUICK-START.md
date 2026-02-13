# 🚀 의료 진단 플랫폼 - 사용 가이드

## 빠른 시작

### 환자 포털
1. 브라우저에서 접속: https://medical-diagnosis-platform.onrender.com/patient
2. 회원가입 후 로그인
3. "새 진단 요청" 클릭
4. 증상 정보 입력:
   - 증상 종류 선택 (여드름, 아토피, 건선 등)
   - 피부 타입 선택 (지성, 건성, 복합성 등)
   - 증상 상세 설명
5. 피부 사진 업로드 (최대 5장)
6. 제출 → AI 진단 결과 확인

### 관리자 대시보드 (의사용)
1. 브라우저에서 접속: https://medical-diagnosis-platform.onrender.com/admin
2. 의사 계정으로 로그인
   - 이메일: `doctor@hospital.com`
   - 비밀번호: `doctor123`
3. 대시보드에서 진단 현황 확인
4. 진단 목록에서 환자 진단 상세 조회
5. 의사 소견 작성 및 상태 업데이트

### Android 앱 (환자용)
1. APK 파일 다운로드
2. Android 기기에 설치
3. 앱 실행 → 환자 포털 접속

---

## 로컬 개발 환경

### 백엔드
```bash
cd backend && npm install && node server.js
```

### 환자 포털
```bash
cd patient-portal && npm install && npm start
```

### 관리자 대시보드
```bash
cd admin-dashboard && npm install && PORT=3001 npm start
```
