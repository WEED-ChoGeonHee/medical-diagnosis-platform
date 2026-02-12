# 🚀 Render 배포 최종 가이드

## ✅ 수정 완료 사항

### 1. 빌드 설정 수정
`render.yaml` 파일이 이제 **프론트엔드 빌드를 포함**합니다:
- ✅ Patient Portal 빌드 추가
- ✅ Admin Dashboard 빌드 추가
- ✅ 모든 의존성 설치 명령 포함

### 2. API 설정 확인
프론트엔드가 프로덕션 환경에서 올바르게 작동합니다:
- ✅ `patient-portal/src/api.js`: 프로덕션에서 `/api` 사용
- ✅ `admin-dashboard/src/api.js`: 프로덕션에서 `/api` 사용
- ✅ `homepage` 설정: `/patient`, `/admin`

### 3. 서버 라우팅 확인
백엔드가 정적 파일을 올바르게 서빙합니다:
- ✅ `/patient` → 환자 포털
- ✅ `/admin` → 관리자 대시보드
- ✅ `/api` → API 엔드포인트
- ✅ `/` → `/patient`로 리다이렉트

---

## 📋 Render 배포 단계

### 1단계: GitHub에 코드 푸시
```powershell
git add .
git commit -m "fix: Render 빌드 설정 수정 - 프론트엔드 빌드 추가"
git push origin main
```

### 2단계: Render 대시보드 접속
1. https://dashboard.render.com 로그인
2. 기존 서비스 찾기 (`medical-diagnosis-platform`)

### 3단계: 환경 변수 확인
**필수 환경 변수**가 모두 설정되어 있는지 확인:

#### 데이터베이스 (Aiven MySQL)
- `DB_HOST` - Aiven 호스트명
- `DB_PORT` - Aiven 포트 (기본: 26163)
- `DB_USER` - Aiven 사용자명
- `DB_PASSWORD` - Aiven 비밀번호
- `DB_NAME` - 데이터베이스 이름
- `DB_SSL` - `enabled`

#### Cloudinary (이미지 업로드)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

#### AI (Gemini API)
- `GEMINI_API_KEY`

#### 기타
- `NODE_ENV` - `production`
- `PORT` - `10000`
- `JWT_SECRET` - 자동 생성됨

### 4단계: 수동 배포 트리거
1. Render 대시보드에서 서비스 선택
2. "Manual Deploy" → "Deploy latest commit" 클릭
3. 빌드 로그 모니터링

### 5단계: 빌드 로그 확인
빌드가 다음 단계를 모두 완료하는지 확인:
```
=== Installing Backend Dependencies ===
=== Installing Patient Portal Dependencies ===
=== Installing Admin Dashboard Dependencies ===
=== Building Patient Portal ===
The project was built assuming it is hosted at /patient/.
=== Building Admin Dashboard ===
The project was built assuming it is hosted at /admin/.
=== Build Complete ===
```

### 6단계: 배포 확인
배포가 완료되면 다음 URL에 접속하여 테스트:

1. **루트 경로** (환자 포털로 리다이렉트)
   ```
   https://your-app.onrender.com
   ```

2. **환자 포털**
   ```
   https://your-app.onrender.com/patient
   ```

3. **관리자 대시보드**
   ```
   https://your-app.onrender.com/admin
   ```

4. **API 테스트**
   ```
   https://your-app.onrender.com/api/debug/db
   ```

---

## 🔍 문제 해결

### 빌드 실패 시
1. **빌드 로그 확인**: Render 대시보드의 "Logs" 탭
2. **의존성 오류**: `package.json` 확인
3. **메모리 부족**: Free 플랜의 제한 확인

### 404 오류 시
1. **빌드 폴더 확인**: 빌드 로그에서 `build` 폴더 생성 확인
2. **경로 확인**: 
   - `/patient` 접속 시도
   - `/admin` 접속 시도
3. **서버 로그 확인**: 정적 파일 서빙 메시지 확인

### API 연결 오류 시
1. **환경 변수 확인**: 모든 DB 설정이 올바른지 확인
2. **CORS 확인**: 백엔드가 모든 origin 허용하는지 확인
3. **API URL 확인**: 브라우저 개발자 도구 → Network 탭

### 데이터베이스 연결 오류 시
1. **Aiven 상태 확인**: Aiven 대시보드에서 서비스 상태 확인
2. **인증 확인**: 사용자명/비밀번호 정확한지 확인
3. **SSL 설정 확인**: `DB_SSL=enabled` 설정되어 있는지 확인

---

## 🎯 배포 후 테스트 체크리스트

### 환자 포털
- [ ] 로그인/회원가입 작동
- [ ] 대시보드 로딩
- [ ] 진단 목록 조회
- [ ] 새 진단 생성 (이미지 업로드 포함)
- [ ] 진단 상세 조회

### 관리자 대시보드
- [ ] 의사 로그인
- [ ] 환자 목록 조회
- [ ] 진단 목록 조회
- [ ] 진단 상세 조회 및 답변 작성
- [ ] 진단 상태 변경

### API
- [ ] `/api/debug/db` - 환경 변수 및 DB 연결 상태
- [ ] `/api/auth/register` - 회원가입
- [ ] `/api/auth/login` - 로그인
- [ ] `/api/diagnoses` - 진단 CRUD

---

## 📌 중요 사항

### 프로덕션 환경 변수
- 모든 민감한 정보는 Render 환경 변수에만 저장
- `.env` 파일은 절대 Git에 커밋하지 않음
- `JWT_SECRET`은 Render가 자동 생성

### 빌드 시간
- Free 플랜: 빌드에 5-10분 소요 가능
- 프론트엔드 2개 + 백엔드 = 약 3-5분

### 재배포
코드 변경 후 재배포 방법:
1. 코드 수정
2. Git push
3. Render가 자동 배포 (또는 수동 트리거)

---

## 🔗 유용한 링크

- **Render 대시보드**: https://dashboard.render.com
- **Render 문서**: https://render.com/docs
- **Aiven 대시보드**: https://console.aiven.io
- **Cloudinary 대시보드**: https://cloudinary.com/console

---

## ✨ 다음 단계

배포 완료 후:
1. ✅ 모든 기능 테스트
2. ✅ 실제 이미지 업로드 테스트
3. ✅ AI 진단 기능 테스트
4. ✅ 의사 계정으로 답변 테스트
5. ✅ 성능 모니터링

---

**마지막 업데이트**: 2026-02-12
**작성자**: GitHub Copilot
