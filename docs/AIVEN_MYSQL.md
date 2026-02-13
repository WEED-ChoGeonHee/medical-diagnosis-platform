# 🗄️ Aiven MySQL 데이터베이스 가이드

## 목차
1. [계정 생성 및 설정](#계정-생성-및-설정)
2. [접속 정보](#접속-정보)
3. [문제 해결](#문제-해결)

---

## 계정 생성 및 설정

### 1단계: Aiven 계정 생성
1. https://console.aiven.io/signup 접속
2. 이메일로 회원가입 (신용카드 불필요)
3. 이메일 인증 완료

### 2단계: MySQL 서비스 생성
1. Aiven Console → **Create service** 클릭
2. 서비스 선택: **MySQL**
3. 클라우드 공급자: **Google Cloud** (무료)
4. 리전: **asia-northeast3** (서울)
5. 플랜: **Free** 선택 (무료 티어)
6. 서비스 이름 입력 (예: `medical-db`)
7. **Create service** 클릭
8. 서비스 시작 대기 (3-5분)

### 3단계: 서비스 상태 확인
상태가 **Running** (초록색)이 되면 사용 가능

---

## 접속 정보

### 연결 정보 확인
Aiven Console → 서비스 선택 → **Overview** → **Connection information**

| 항목 | 설명 | 예시 |
|------|------|------|
| **Host** | 서버 주소 | `xxx.aivencloud.com` |
| **Port** | 포트 번호 | `26163` |
| **User** | 사용자명 | `avnadmin` |
| **Password** | 비밀번호 | 자동 생성됨 (복사) |
| **Database** | DB 이름 | `defaultdb` |

### 환경 변수 설정
위 정보를 Render 환경 변수에 입력:

```env
DB_HOST=xxx.aivencloud.com
DB_PORT=26163
DB_USER=avnadmin
DB_PASSWORD=[복사한 비밀번호]
DB_NAME=defaultdb
DB_SSL=true
```

⚠️ **`DB_SSL=true` 필수** — Aiven은 SSL 연결만 허용합니다!

---

## 무료 플랜 제한

| 항목 | 제한 |
|------|------|
| 저장 공간 | 5 GB |
| RAM | 1 GB |
| 동시 연결 | 25개 |
| 백업 | 2일 보관 |
| HA (고가용성) | 없음 |

---

## 데이터베이스 관리

### 1. MySQL Workbench로 접속

#### 연결 설정
1. MySQL Workbench 실행
2. **+** 클릭 (새 연결)
3. 연결 정보 입력:
   - **Connection Name**: Aiven Medical DB
   - **Hostname**: [Aiven Host]
   - **Port**: 26163
   - **Username**: avnadmin
   - **Password**: [Store in Keychain...]
4. **SSL** 탭:
   - **Use SSL**: Require
5. **Test Connection** → 성공 확인

#### CA 인증서 (선택사항)
Aiven Console → **Overview** → **CA Certificate** 다운로드

### 2. Aiven Console에서 직접 관리

#### Query Editor 사용
1. Aiven Console → 서비스 선택
2. **Query Editor** 탭
3. SQL 쿼리 실행

#### 데이터베이스 생성
```sql
CREATE DATABASE medical_prod;
USE medical_prod;
```

#### 테이블 확인
```sql
SHOW TABLES;
DESCRIBE users;
DESCRIBE diagnoses;
```

---

## 문제 해결

### 문제 1: "getaddrinfo ENOTFOUND"

**원인**: DNS에서 호스트를 찾을 수 없음

**확인 사항**:
1. Aiven Console에서 서비스 상태 확인
   - 🟢 **Running**: 정상
   - 🟡 **Rebuilding**: 대기 (5-10분)
   - 🔴 **Powered off**: 시작 필요
   - ❌ **Deleted**: 새로 생성 필요

2. 호스트명이 정확한지 확인
   - `DB_HOST` 환경 변수 재확인
   - Aiven Console에서 호스트명 복사

**해결 방법**:

#### Case 1: 서비스가 중지됨
1. Aiven Console → 서비스 클릭
2. **Power On** 또는 **Start** 클릭
3. Running 상태까지 대기 (3-5분)
4. 환경 변수 재확인

#### Case 2: 호스트명 변경됨
1. Aiven Console → **Overview** → **Connection information**
2. 현재 호스트명 복사
3. Render 환경 변수 `DB_HOST` 업데이트
4. Save Changes → 재배포 대기

#### Case 3: 서비스가 삭제됨
1. 새 MySQL 서비스 생성 (위의 "서비스 생성" 참조)
2. 새 접속 정보로 환경 변수 업데이트

---

### 문제 2: "Access denied for user"

**원인**: 비밀번호 불일치 또는 사용자 권한 문제

**해결 방법**:
1. Aiven Console → **Overview** → **Connection information**
2. 비밀번호 복사 (눈 아이콘 클릭)
3. Render 환경 변수 `DB_PASSWORD` 업데이트
4. Save Changes

---

### 문제 3: "SSL connection required"

**원인**: SSL 없이 연결 시도

**해결 방법**:
1. Render 환경 변수 확인: `DB_SSL=true`
2. 백엔드 코드 확인 (`backend/config/database.js`):
   ```javascript
   ssl: process.env.DB_SSL === 'true' ? {
     rejectUnauthorized: true
   } : false
   ```

---

### 문제 4: "Too many connections"

**원인**: 동시 연결 수 초과 (무료 플랜: 25개)

**해결 방법**:
1. 연결 풀 크기 조정 (`backend/config/database.js`):
   ```javascript
   connectionLimit: 10  // 기본값 줄이기
   ```
2. 사용하지 않는 연결 종료
3. Aiven Console → **Metrics**에서 연결 수 모니터링

---

### 문제 5: 서비스가 자동으로 중지됨

**원인**: 무료 플랜 - 장기간 미사용 시 자동 중지

**해결 방법**:
1. Aiven Console → **Power On**
2. 또는 유료 플랜 업그레이드

---

## 모니터링

### Metrics 확인
Aiven Console → **Metrics**

확인 항목:
- **CPU Usage**: CPU 사용률
- **Memory Usage**: 메모리 사용률
- **Disk Usage**: 디스크 사용량
- **Connections**: 연결 수
- **Queries**: 초당 쿼리 수

### Logs 확인
Aiven Console → **Logs**

확인 항목:
- 연결 오류
- 쿼리 에러
- 성능 문제

---

## 백업 및 복구

### 자동 백업
- 무료 플랜: 2일 보관
- 매일 자동 백업

### 수동 백업
Aiven Console → **Backups** → **Create backup**

### 복구
1. **Backups** 탭
2. 백업 선택
3. **Restore** 클릭
4. 복구 완료 대기

---

## 마이그레이션

### 다른 DB에서 Aiven으로

#### 1. 기존 DB 덤프
```bash
mysqldump -h old-host -u user -p database > backup.sql
```

#### 2. Aiven에 임포트
```bash
mysql -h xxx.aivencloud.com -P 26163 -u avnadmin -p --ssl-mode=REQUIRED defaultdb < backup.sql
```

---

## 업그레이드

### 유료 플랜으로 전환
1. Aiven Console → **Service settings**
2. **Change plan** 클릭
3. 플랜 선택
4. 결제 정보 입력

### 유료 플랜 혜택
- 더 많은 저장 공간
- 더 많은 RAM/CPU
- 고가용성 (HA)
- 더 긴 백업 보관
- 더 많은 동시 연결

---

## 보안

### IP 화이트리스트 (유료 플랜)
특정 IP만 접속 허용

### VPC Peering (유료 플랜)
프라이빗 네트워크 연결

### SSL/TLS 인증서
- 기본 제공
- 자동 갱신

### 사용자 관리
```sql
CREATE USER 'newuser'@'%' IDENTIFIED BY 'password';
GRANT SELECT ON defaultdb.* TO 'newuser'@'%';
FLUSH PRIVILEGES;
```

---

## 참고 자료
- Aiven 공식 문서: https://docs.aiven.io/
- MySQL 문서: https://dev.mysql.com/doc/
- Aiven 지원: https://help.aiven.io/
