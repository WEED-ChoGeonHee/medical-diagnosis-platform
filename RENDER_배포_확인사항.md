# Render.com 배포 확인 사항

## ⚠️ "자바스크립트를 활성화하세요" 오류 해결

### 1단계: Render 대시보드 확인
🔗 https://dashboard.render.com/

1. **서비스 선택**: `medical-diagnosis-platform` (또는 `medical-diagnosis-backend`)
2. **현재 배포 상태** 확인:
   - ✅ "Deploy live" - 배포 완료
   - 🔄 "Building..." - 빌드 중 (5-10분 대기)
   - ❌ "Failed" - 빌드 실패 (로그 확인 필요)

### 2단계: 빌드 로그 확인
**Logs 탭 → Build logs 확인**

다음 메시지가 있어야 함:
```
✓ Compiled successfully
✓ Creating optimized production build
```

오류가 있다면:
```
Failed to compile
Module not found
```

### 3단계: 환경변수 확인 (12개 필수)
**Environment 탭**에서 다음 변수 확인:

#### Database (6개)
- [ ] `DB_HOST` = geonhee-1017-itweed-cf64.e.aivencloud.com
- [ ] `DB_PORT` = 26163
- [ ] `DB_USER` = avnadmin
- [ ] `DB_PASSWORD` = [실제 비밀번호]
- [ ] `DB_NAME` = defaultdb
- [ ] `DB_SSL` = true

#### AI (1개)
- [ ] `GEMINI_API_KEY` = [실제 API 키]

#### Cloudinary (3개)
- [ ] `CLOUDINARY_CLOUD_NAME` = [실제 Cloud Name]
- [ ] `CLOUDINARY_API_KEY` = [실제 API Key]
- [ ] `CLOUDINARY_API_SECRET` = [실제 API Secret]

#### 기타 (2개)
- [ ] `NODE_ENV` = production
- [ ] `PORT` = 10000

### 4단계: 수동 재배포
환경변수를 새로 추가했다면:

**Manual Deploy 버튼 클릭 → Deploy latest commit**

### 5단계: 배포 완료 후 테스트
배포가 완료되면 (5-10분 소요):

**환자 포털**: https://medical-diagnosis-platform.onrender.com/patient
**의사 대시보드**: https://medical-diagnosis-platform.onrender.com/admin

브라우저에서 F12 → Console 탭 확인:
- ✅ 오류 없음 → 정상
- ❌ `404 /patient/static/js/...` → 빌드 실패
- ❌ `Failed to load module` → 환경변수 문제

## 일반적인 문제

### 문제 1: 빌드는 성공했는데 흰 화면
**원인**: 정적 파일 경로 문제
**해결**: 
1. package.json에 `"homepage": "/patient"` 있는지 확인
2. Render에서 수동 재배포

### 문제 2: 빌드 실패 (Failed to compile)
**원인**: 소스 코드 오류
**해결**: 
1. 로컬에서 `npm run build` 실행
2. 오류 수정 후 다시 푸시

### 문제 3: 데이터베이스 연결 실패
**원인**: 환경변수 누락 또는 잘못됨
**해결**:
1. Environment 탭에서 DB_* 변수 12개 모두 확인
2. 특히 `DB_PORT=26163` (25060 아님!)
3. `DB_SSL=true` 확인

## 디버깅 팁

### 브라우저 개발자 도구 (F12)
**Console 탭**:
- JS 로드 오류 확인
- API 호출 오류 확인

**Network 탭**:
- Status 200: 정상
- Status 404: 파일 없음
- Status 500: 서버 오류

### Render 로그
**Logs 탭 → Runtime logs**:
```
✅ MySQL 연결 성공
✅ 환자 포털 정적 파일 서빙 설정 완료
✅ 관리자 대시보드 정적 파일 서빙 설정 완료
```

## 현재 설정 요약

### render.yaml
- 서비스 이름: `medical-diagnosis-platform` ✅
- Build: Frontend 2개 + Backend 빌드
- Start: backend 서버 실행

### package.json
- patient-portal: `homepage: "/patient"` ✅
- admin-dashboard: `homepage: "/admin"` ✅

### server.js
- `/patient` → patient-portal/build ✅
- `/admin` → admin-dashboard/build ✅
- API routes: `/api/*` ✅

## 다음 단계

1. ✅ render.yaml 수정 완료
2. ✅ GitHub 푸시 완료
3. ⏳ Render 자동 배포 대기 (5-10분)
4. ⏳ 배포 완료 후 웹사이트 테스트
5. ⏳ APK 설치 및 테스트
