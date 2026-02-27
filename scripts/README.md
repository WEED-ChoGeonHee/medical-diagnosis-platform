# 🛠 Scripts - 유틸리티 스크립트

프로젝트 실행, 빌드, 데이터베이스 관리를 위한 PowerShell/Node.js 스크립트입니다.

---

## 스크립트 목록

### 서버 실행 스크립트

| 스크립트 | 설명 | 사용법 |
|---------|------|--------|
| `quick-start.ps1` | 백엔드 + 프론트엔드 한번에 실행 | `.\scripts\quick-start.ps1` |
| `start-server.ps1` | 백엔드 서버만 실행 | `.\scripts\start-server.ps1` |
| `stop-server.ps1` | 실행 중인 Node.js 프로세스 종료 | `.\scripts\stop-server.ps1` |

### 빌드 스크립트

| 스크립트 | 설명 | 사용법 |
|---------|------|--------|
| `build-android-apk.ps1` | Android APK 빌드 | `.\scripts\build-android-apk.ps1` |

---

## Backend Utils (Node.js)

데이터베이스 관련 유틸리티 스크립트입니다.

### 의사 계정 생성

```bash
cd backend
node ../scripts/backend-utils/create-doctor.js
```

- 기본 계정: `doctor@hospital.com` / `doctor123`
- 이미 존재하면 스킵

### 데이터베이스 초기화 ⚠️

```bash
cd backend
node ../scripts/backend-utils/reset-db.js
```

> ⚠️ **주의**: 모든 데이터가 삭제됩니다! 개발 환경에서만 사용하세요.

### 샘플 데이터 삽입

```bash
cd backend
node ../scripts/backend-utils/seed-dermatology-data.js
```

피부과 관련 샘플 진단 데이터를 삽입합니다.

---

## 사용 예시

### 개발 시작 (처음 1회)

```powershell
# 1. 의사 계정 생성
cd backend
node ../scripts/backend-utils/create-doctor.js

# 2. 전체 서버 실행
cd ..
.\scripts\quick-start.ps1
```

### 매일 개발 시작

```powershell
.\scripts\quick-start.ps1
```

### APK 빌드

```powershell
.\scripts\build-android-apk.ps1
# → apk-builds/ 폴더에 APK 생성
```

---

## 주의사항

- 모든 스크립트는 **프로젝트 루트 디렉토리**에서 실행
- PowerShell 스크립트는 Windows 환경용
- `reset-db.js`는 프로덕션에서 절대 실행 금지!
