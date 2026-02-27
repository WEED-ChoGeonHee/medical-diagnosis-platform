# 🏠 Patient Portal - SkinIQ 환자용 웹앱

환자가 피부 사진을 업로드하고 AI 진단 결과를 확인하는 React 웹 애플리케이션입니다.

## 기술 스택

- **프레임워크**: React 18
- **라우팅**: React Router v6
- **HTTP**: Axios
- **스타일**: CSS (커스텀)

---

## 폴더 구조

```
patient-portal/
├── public/
│   └── index.html           # HTML 템플릿
│
├── src/
│   ├── index.js             # React 진입점
│   ├── App.js               # 라우팅 설정 + 인증 상태 관리
│   ├── api.js               # API 호출 함수 (axios)
│   ├── index.css            # 전역 스타일
│   │
│   └── components/
│       ├── Login.js         # 🔐 로그인 페이지
│       ├── Register.js      # 📝 회원가입 페이지
│       ├── Header.js        # 상단 네비게이션
│       ├── Dashboard.js     # 📋 내 진단 목록
│       ├── NewDiagnosis.js  # 📸 새 진단 요청 (핵심!)
│       ├── DiagnosisDetail.js # 🔍 진단 상세 보기
│       └── *.css            # 컴포넌트별 스타일
│
├── build/                   # 빌드 결과물 (배포용)
└── package.json
```

---

## 주요 기능

### 1. 회원가입/로그인
- 이메일 + 비밀번호 인증
- JWT 토큰을 localStorage에 저장

### 2. 새 진단 요청 (NewDiagnosis.js)
- 증상 선택 (체크박스)
- 피부 사진 업로드 (최대 5장)
- 업로드 시 AI가 자동 분석

### 3. 진단 목록 (Dashboard.js)
- 내 진단 기록 조회
- 상태별 필터 (대기중, 검토중, 완료)

### 4. 진단 상세 (DiagnosisDetail.js)
- AI 진단 결과 확인
- 의사 소견 확인 (완료 시)

---

## 로컬 실행

```bash
npm install
npm start
```

`http://localhost:3000`에서 실행됩니다.

> ⚠️ 백엔드 서버(`localhost:5000`)가 먼저 실행되어야 합니다.

---

## 환경 설정

### 개발 환경 (package.json)
```json
{
  "proxy": "http://localhost:5000"
}
```
개발 시 `/api/*` 요청이 백엔드로 프록시됩니다.

### 프로덕션 환경
빌드된 파일이 백엔드 서버의 `/patient` 경로에서 서빙됩니다.

---

## 빌드

```bash
npm run build
```

`build/` 폴더에 정적 파일이 생성됩니다.

---

## 컴포넌트 흐름

```
App.js (라우팅)
│
├── /login → Login.js
├── /register → Register.js
│
└── (인증 후)
    ├── /dashboard → Dashboard.js → 진단 목록
    ├── /new-diagnosis → NewDiagnosis.js → 진단 요청
    └── /diagnosis/:id → DiagnosisDetail.js → 상세 보기
```

---

## 스타일 가이드

- 배경색: `#0a0e27` (다크 테마)
- 메인 컬러: `#4f8cff` (블루), `#00d4ff` (시안)
- 폰트: Inter
