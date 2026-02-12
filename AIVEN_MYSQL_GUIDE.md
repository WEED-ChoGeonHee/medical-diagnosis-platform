# ⚡ Aiven MySQL 설정 가이드 (빠른 참조)

## 1. Aiven 계정 생성
1. https://console.aiven.io/signup 접속
2. 이메일로 회원가입 (신용카드 불필요)

## 2. MySQL 서비스 생성
1. **Create service** → **MySQL** 선택
2. Cloud: **Google Cloud**
3. Region: **asia-northeast3** (서울)
4. Plan: **Free** 선택
5. 서비스 이름 입력 → 생성

## 3. 접속 정보 확인
서비스 대시보드 → **Overview** → **Connection information**:
- **Host**: `xxx.aivencloud.com`
- **Port**: `26163` (예시)
- **User**: `avnadmin`
- **Password**: (표시된 비밀번호 복사)
- **Database**: `defaultdb`

## 4. 환경 변수에 입력
```env
DB_HOST=xxx.aivencloud.com
DB_PORT=26163
DB_USER=avnadmin
DB_PASSWORD=your_password
DB_NAME=defaultdb
DB_SSL=true
```

> ⚠️ `DB_SSL=true` 필수 — Aiven은 SSL 연결만 허용합니다.
