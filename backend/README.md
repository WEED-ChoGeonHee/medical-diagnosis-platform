# 📦 Backend - SkinIQ API Server

SkinIQ 플랫폼의 백엔드 REST API 서버입니다.

## 기술 스택

- **런타임**: Node.js 18+
- **프레임워크**: Express.js
- **데이터베이스**: MySQL (Aiven Cloud)
- **인증**: JWT + bcrypt
- **파일 업로드**: Multer + Cloudinary
- **AI**: Google Gemini API

---

## 폴더 구조

```
backend/
├── server.js              # 🚀 서버 진입점 (Express 앱 설정)
├── package.json           # 의존성 목록
│
├── config/
│   └── database.js        # MySQL 연결 + 테이블 자동 생성
│
├── middleware/
│   └── auth.js            # JWT 인증 + 역할 확인 (patient/doctor)
│
├── models/                # 데이터베이스 쿼리 로직
│   ├── User.js            # 회원가입, 로그인, 사용자 조회
│   └── Diagnosis.js       # 진단 CRUD (생성, 조회, 수정)
│
├── routes/                # API 라우터 (엔드포인트 정의)
│   ├── auth.js            # /api/auth/* (회원가입, 로그인)
│   ├── diagnoses.js       # /api/diagnoses/* (환자용)
│   ├── admin.js           # /api/admin/* (의사용)
│   └── patients.js        # /api/patients/* (환자 정보)
│
└── uploads/               # 로컬 테스트용 이미지 저장 (프로덕션은 Cloudinary 사용)
    └── .gitkeep
```

---

## 로컬 실행

### 1. 환경변수 설정

```bash
cp .env.example .env
# .env 파일을 열어서 실제 값 입력
```

### 2. 의존성 설치 및 실행

```bash
npm install
node server.js
```

서버가 `http://localhost:5000`에서 실행됩니다.

---

## 주요 API 엔드포인트

### 인증 (Public)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/register` | 환자 회원가입 |
| POST | `/api/auth/login` | 로그인 (JWT 반환) |

### 환자용 (JWT 필요)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/diagnoses` | 진단 요청 (이미지 + AI 분석) |
| GET | `/api/diagnoses/my` | 내 진단 목록 |
| GET | `/api/diagnoses/:id` | 진단 상세 |

### 의사용 (JWT + role:doctor)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/stats` | 대시보드 통계 |
| GET | `/api/admin/diagnoses` | 전체 진단 목록 |
| PUT | `/api/admin/diagnoses/:id` | 의사 소견 저장 |

---

## 데이터베이스 스키마

### users 테이블
```sql
- id (INT, PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- role ('patient' | 'doctor')
- created_at (DATETIME)
```

### diagnoses 테이블
```sql
- id (INT, PK)
- patient_id (INT, FK → users)
- symptoms (TEXT)
- ai_diagnosis (TEXT)
- doctor_notes (TEXT)
- status ('pending' | 'in_review' | 'completed')
- created_at (DATETIME)
- updated_at (DATETIME)
```

### diagnosis_images 테이블
```sql
- id (INT, PK)
- diagnosis_id (INT, FK → diagnoses)
- image_url (VARCHAR)
```

---

## 의사 계정 생성

```bash
node ../scripts/backend-utils/create-doctor.js
```

기본 계정: `doctor@hospital.com` / `doctor123`

---

## 환경변수

상세 설명은 [docs/ENVIRONMENT_VARIABLES.md](../docs/ENVIRONMENT_VARIABLES.md) 참고

| 변수 | 필수 | 설명 |
|------|------|------|
| `PORT` | O | 서버 포트 (기본: 5000) |
| `DB_HOST` | O | MySQL 호스트 |
| `DB_USER` | O | MySQL 사용자 |
| `DB_PASSWORD` | O | MySQL 비밀번호 |
| `DB_NAME` | O | 데이터베이스 이름 |
| `JWT_SECRET` | O | JWT 서명 키 |
| `GEMINI_API_KEY` | O | Google Gemini API 키 |
| `CLOUDINARY_*` | O | Cloudinary 설정 (3개) |
