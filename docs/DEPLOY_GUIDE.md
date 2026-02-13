# 🚀 배포 가이드

## 목차
1. [사전 준비](#사전-준비)
2. [Render 배포](#render-배포)
3. [배포 확인](#배포-확인)

---

## 사전 준비

### 필요한 계정
- [Aiven](https://console.aiven.io) - MySQL 데이터베이스
- [Cloudinary](https://cloudinary.com) - 이미지 스토리지
- [Google AI Studio](https://aistudio.google.com) - Gemini API
- [Render](https://render.com) - 호스팅 플랫폼

### GitHub 저장소 확인
코드가 GitHub에 푸시되어 있어야 합니다:
```bash
git add .
git commit -m "준비 완료"
git push origin main
```

---

## Render 배포

### 1단계: Render 서비스 생성

1. https://dashboard.render.com 접속 후 로그인
2. **New** → **Web Service** 클릭
3. GitHub 저장소 연결
4. 설정:
   - **Name**: medical-diagnosis-platform
   - **Region**: Singapore (또는 가까운 리전)
   - **Branch**: main
   - **Root Directory**: (비워두기)
   - **Build Command**: (비워두기 - render.yaml 사용)
   - **Start Command**: `npm --prefix backend start`
   - **Plan**: Free

### 2단계: 환경 변수 설정

**Environment** 탭에서 다음 변수들을 추가하세요:

#### 데이터베이스 (Aiven MySQL)
```
DB_HOST = [Aiven 호스트명].aivencloud.com
DB_PORT = 26163
DB_USER = avnadmin
DB_PASSWORD = [Aiven 비밀번호]
DB_NAME = defaultdb
DB_SSL = true
```

#### AI (Google Gemini)
```
GEMINI_API_KEY = [Google AI Studio API 키]
```

#### 이미지 (Cloudinary)
```
CLOUDINARY_CLOUD_NAME = [Cloudinary 클라우드명]
CLOUDINARY_API_KEY = [Cloudinary API 키]
CLOUDINARY_API_SECRET = [Cloudinary API 시크릿]
```

#### JWT (자동 생성 또는 수동 설정)
```
JWT_SECRET = [랜덤 문자열 또는 자동 생성]
```

#### 시스템 (자동 설정됨)
```
NODE_ENV = production
PORT = 10000
```

### 3단계: 배포 시작

1. **Save Changes** 클릭
2. 자동으로 빌드 시작 (5-10분 소요)
3. **Logs** 탭에서 빌드 진행 상황 확인

---

## 배포 확인

### 빌드 성공 확인
Logs에서 다음 메시지 확인:
```
✓ Compiled successfully
✓ Creating optimized production build
==> Build successful 🎉
```

### 서비스 접속 테스트

| 서비스 | URL |
|--------|-----|
| 환자 포털 | `https://[서비스명].onrender.com/patient` |
| 관리자 대시보드 | `https://[서비스명].onrender.com/admin` |
| API 상태 | `https://[서비스명].onrender.com/api/debug/db` |

### 기능 테스트

#### 환자 포털
- [ ] 회원가입/로그인
- [ ] 진단 요청 생성
- [ ] 이미지 업로드 (최대 5장)
- [ ] AI 진단 결과 확인

#### 관리자 대시보드
- [ ] 의사 로그인 (`doctor@hospital.com` / `doctor123`)
- [ ] 대시보드 통계 확인
- [ ] 진단 목록 조회
- [ ] 환자 목록 조회
- [ ] 의사 소견 작성

---

## 재배포

### 코드 변경 시
```bash
git add .
git commit -m "수정 내용"
git push origin main
```
→ Render가 자동으로 재배포

### 수동 재배포
Render Dashboard → **Manual Deploy** → **Deploy latest commit**

---

## 참고 문서
- [환경변수 상세 가이드](ENVIRONMENT_VARIABLES.md)
- [Aiven MySQL 설정](AIVEN_MYSQL.md)
- [Cloudinary 설정](CLOUDINARY_SETUP.md)
- [문제 해결](RENDER_TROUBLESHOOTING.md)
