# ⚠️ Aiven 데이터베이스 연결 오류 해결 가이드

## 🔴 현재 오류
```
Error: getaddrinfo ENOTFOUND geonhee-1017-itweed-cf64.e.aivencloud.com
```

**의미**: DNS에서 Aiven 호스트명을 찾을 수 없음

---

## 📋 확인 사항

### 1. Aiven 대시보드 접속
https://console.aiven.io 로그인

### 2. MySQL 서비스 상태 확인

#### 확인 방법:
1. Aiven Console 접속
2. 왼쪽 메뉴에서 "Services" 클릭
3. MySQL 서비스 찾기

#### 상태별 조치:

**🟢 Running (실행 중)**
→ 호스트명 확인 필요

**🟡 Rebuilding (재구축 중)**
→ 완료될 때까지 대기 (5-10분)

**🔴 Powered off (중지됨)**
→ 서비스 재시작 필요

**❌ Deleted (삭제됨)**
→ 새 서비스 생성 필요

---

## 🔧 해결 방법

### Case 1: 서비스가 중지된 경우

1. Aiven Console에서 MySQL 서비스 클릭
2. "Power On" 또는 "Start" 버튼 클릭
3. 상태가 "Running"이 될 때까지 대기 (3-5분)
4. 아래 "연결 정보 확인" 단계로 진행

---

### Case 2: 호스트명 확인 필요

Aiven Console에서 서비스를 클릭하면 "Overview" 탭에 연결 정보가 표시됩니다:

**필요한 정보:**
- Host: `xxxxx.aivencloud.com`
- Port: `26163` (보통 고정)
- User: `avnadmin`
- Password: `AVNS_...`
- Database: `defaultdb`

**현재 설정값:**
```
Host: geonhee-1017-itweed-cf64.e.aivencloud.com
Port: 26163
User: avnadmin
Database: defaultdb
```

---

### Case 3: 서비스가 삭제된 경우

새로운 MySQL 서비스를 생성해야 합니다:

1. Aiven Console → "Create service"
2. **MySQL** 선택
3. **Free plan** 선택
4. **Region**: Singapore 또는 가까운 지역
5. **Service name**: 원하는 이름 (예: `medical-diagnosis-db`)
6. "Create service" 클릭
7. 생성 완료 대기 (5-10분)

---

## 🔍 연결 정보 확인 방법

### Aiven Console에서
1. 서비스 클릭
2. "Overview" 탭
3. "Connection information" 섹션 확인

다음 정보를 복사하세요:
```
Service URI: mysql://avnadmin:비밀번호@호스트명:26163/defaultdb?ssl-mode=REQUIRED
```

또는 개별 항목:
- **Host**: `xxxxx.aivencloud.com`
- **Port**: `26163`
- **User**: `avnadmin`
- **Password**: `AVNS_...`
- **Database**: `defaultdb`

---

## 📝 환경 변수 업데이트

### Render 환경 변수 수정

1. **Render Dashboard** 접속: https://dashboard.render.com
2. `medical-diagnosis-platform` 서비스 클릭
3. 왼쪽 메뉴 → "Environment" 클릭
4. 다음 변수 수정:

```
DB_HOST=새로운호스트명.aivencloud.com
DB_PORT=26163
DB_USER=avnadmin
DB_PASSWORD=새로운비밀번호
DB_NAME=defaultdb
DB_SSL=true
```

5. "Save Changes" 클릭
6. 자동으로 재배포됨

---

## ⚡ 빠른 테스트

### 로컬에서 연결 테스트
```powershell
cd E:\소스\의학\backend
```

.env 파일을 Aiven의 새 정보로 업데이트:
```env
DB_HOST=새로운호스트명.aivencloud.com
DB_PORT=26163
DB_USER=avnadmin
DB_PASSWORD=새로운비밀번호
DB_NAME=defaultdb
DB_SSL=true
```

테스트:
```powershell
node server.js
```

성공 메시지:
```
✅ MySQL 연결 성공!
```

---

## 🆘 여전히 안 되는 경우

### 1. DNS 캐시 문제
Windows DNS 캐시 초기화:
```powershell
ipconfig /flushdns
```

### 2. 방화벽 문제
Aiven Console → 서비스 → "Overview" → "Allowed IP addresses"
- `0.0.0.0/0` 추가 (모든 IP 허용, 테스트용)

### 3. SSL 설정 문제
database.js에서 SSL 설정 확인:
```javascript
if (process.env.DB_SSL === 'true') {
  poolConfig.ssl = {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  };
}
```

---

## ✅ 해결 후 체크리스트

- [ ] Aiven 서비스 상태: **Running**
- [ ] 호스트명 확인 완료
- [ ] 로컬에서 연결 테스트 성공
- [ ] Render 환경 변수 업데이트 완료
- [ ] Render 재배포 완료
- [ ] `/api/debug/db` 접속 시 연결 성공

---

## 📞 다음 단계

**Aiven 대시보드를 확인하고 다음 정보를 알려주세요:**

1. **서비스 상태**: Running / Powered off / Rebuilding / Deleted
2. **호스트명**: `xxxxx.aivencloud.com`
3. **포트**: 보통 `26163`

정보를 알려주시면 정확한 해결 방법을 안내하겠습니다!

---

**작성일**: 2026-02-12  
**오류**: ENOTFOUND - Aiven 호스트 찾을 수 없음
