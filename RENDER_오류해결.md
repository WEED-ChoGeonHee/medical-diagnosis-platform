# 🚨 Render 배포 오류 해결

## 📋 일반적인 문제와 해결 방법

### 문제 1: Application exited early / No open ports detected

**원인**: Render가 `render.yaml`을 무시하고 기본 설정 적용

**해결**:
1. Render Dashboard → Settings → Build & Deploy 확인
2. Build Command가 비어있으면 아래 입력:
```bash
cd patient-portal && PUBLIC_URL=/patient npm install && PUBLIC_URL=/patient npm run build && cd .. && cd admin-dashboard && PUBLIC_URL=/admin npm install && PUBLIC_URL=/admin npm run build && cd .. && cd backend && npm install && cd ..
```
3. Start Command: `npm --prefix backend start`

---

### 문제 2: npm error ENOENT package.json

**원인**: Build Command가 루트에서 npm 실행 시도

**해결**: Build Command에 `cd backend &&` 접두사 확인

---

### 문제 3: yarn 실행 오류

**원인**: Render가 자동으로 yarn 감지

**해결**: Settings → Build & Deploy에서 Build Command를 명시적으로 설정

---

### 문제 4: 환경 변수 미설정

**증상**: DB 연결 실패, JWT 오류 등

**해결**:
1. Dashboard → Environment 탭
2. 모든 환경 변수 입력 확인
3. [RENDER_환경변수_완전체크리스트.md](RENDER_환경변수_완전체크리스트.md) 참조

---

### 문제 5: 무료 플랜 슬립 모드

**증상**: 첫 접속 시 30초~1분 대기

**원인**: 무료 플랜은 15분 비활성 시 서버 슬립

**해결**: 정상 동작, 첫 요청 시 자동 웨이크업

---

## 🔍 디버그 방법

배포 후 환경 변수 상태 확인:
```
https://[서비스명].onrender.com/api/debug/db
```
