# ☁️ Cloudinary 이미지 스토리지 설정 가이드

## 1. Cloudinary 계정 생성
1. https://cloudinary.com/users/register/free 접속
2. 무료 계정 생성
3. 이메일 인증

## 2. API 키 확인
Dashboard → Settings → API Keys:
- **Cloud Name**: 대시보드 상단에 표시
- **API Key**: Settings에서 확인
- **API Secret**: Settings에서 확인

## 3. 환경 변수 설정
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 4. 용도
- 환자가 업로드한 피부 이미지 저장
- 이미지 자동 리사이징 (최대 1200x1200)
- CDN을 통한 빠른 이미지 로딩

## 5. 무료 플랜 제한
- 25GB 저장 공간
- 25GB 대역폭/월
- 25,000 변환/월
