# 🔄 Render 서비스 재생성 가이드

## 언제 재생성이 필요한가?
- 기존 서비스가 빌드 실패로 복구 불가할 때
- 환경 변수를 처음부터 다시 설정하고 싶을 때
- 다른 리전으로 변경하고 싶을 때

---

## 📋 재생성 순서

### 1단계: 기존 서비스 삭제
1. Render Dashboard 접속
2. 기존 서비스 선택
3. Settings → **Delete Service** 클릭
4. 서비스 이름 입력 후 확인

### 2단계: 새 서비스 생성
1. **New** → **Web Service** 클릭
2. GitHub 저장소 연결
3. 설정:
   - **Name**: medical-diagnosis-platform
   - **Region**: Singapore
   - **Build Command**: (render.yaml에서 자동)
   - **Start Command**: `npm --prefix backend start`
   - **Plan**: Free

### 3단계: 환경 변수 설정
[RENDER_환경변수_완전체크리스트.md](RENDER_환경변수_완전체크리스트.md) 참조

### 4단계: 배포 확인
- 빌드 로그에서 오류 없는지 확인
- 환자 포털, 관리자 대시보드 접속 테스트

---

## ⚠️ 주의사항
- 서비스 삭제 시 기존 빌드 캐시도 삭제됨
- 환경 변수는 수동으로 다시 입력 필요
- 무료 플랜은 계정당 1개 Web Service만 가능
