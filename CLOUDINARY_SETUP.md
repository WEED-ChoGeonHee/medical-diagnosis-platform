# 🖼️ Cloudinary 이미지 스토리지 설정 가이드

## 문제: Render.com 파일 저장 불가

Render 무료 웹 서비스는 **Ephemeral Filesystem**을 사용하여:
- ❌ 서버 재시작 시 업로드된 파일 모두 삭제
- ❌ `uploads/` 폴더의 모든 이미지 손실
- ❌ 영구 파일 저장 불가능

---

## 해결책: Cloudinary (무료 클라우드 스토리지)

### ✅ Cloudinary 장점
- 💰 **완전 무료**: 25GB 스토리지, 25GB 월간 대역폭
- 🚀 **CDN 제공**: 전 세계 빠른 이미지 로딩
- 🎨 **자동 최적화**: 이미지 크기, 포맷 자동 변환
- 🔒 **안전**: 클라우드 백업
- 💳 **신용카드 불필요**

---

## 1️⃣ Cloudinary 계정 생성 (1분)

1. https://cloudinary.com/users/register/free 접속
2. 이메일로 가입 (Google 계정 가능)
3. 이메일 인증

---

## 2️⃣ API 정보 복사

가입 후 Dashboard에서:

```
Cloud Name: your_cloud_name
API Key: 123456789012345
API Secret: abc123def456ghi789jkl012mno
```

**이 정보를 복사해 주세요!**

---

## 3️⃣ 설정 자동화

API 정보를 알려주시면:
1. npm 패키지 설치 (`cloudinary`, `multer-storage-cloudinary`)
2. 업로드 설정 자동 변경
3. .env 파일 업데이트
4. Render.com 환경 변수 안내

---

## 📋 필요한 정보

Cloudinary Dashboard에서 복사:
- `Cloud Name`: ?
- `API Key`: ?
- `API Secret`: ?

---

## 🔄 기존 이미지 마이그레이션

로컬 `uploads/` 폴더의 이미지를 Cloudinary로 자동 업로드도 가능!

---

## 💡 참고

- 무료 티어 제한: 25GB/월 (개인 프로젝트 충분)
- 이미지 URL 예시: `https://res.cloudinary.com/your_cloud/image/upload/v123/sample.jpg`
- Render.com 재시작 시에도 이미지 유지됨!
