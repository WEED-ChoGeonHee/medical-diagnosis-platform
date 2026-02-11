# ⚠️ MySQL 생성 가이드 (빠른 참조)

## 1️⃣ Kafka 서비스 삭제 (비용 방지)

1. Aiven 콘솔: https://console.aiven.io
2. **kafka-4aafc99** 서비스 클릭
3. **Settings** → **Danger Zone** → **Delete service**
4. 확인 후 삭제

---

## 2️⃣ MySQL 서비스 생성 (무료)

### 단계별 가이드:

1. **Create service** 클릭

2. **서비스 선택**
   ```
   ✅ MySQL (데이터베이스)
   ❌ Kafka (메시지 큐 - 우리 프로젝트에 불필요)
   ```

3. **클라우드 제공자**
   - Google Cloud 선택

4. **리전**
   - Seoul (asia-northeast3) 또는
   - Tokyo (asia-northeast1)

5. **플랜** ⭐ 중요!
   ```
   ✅ Hobbyist - Free (무료)
      - 5GB 스토리지
      - 신용카드 불필요
      - 영구 무료
   
   ❌ Startup, Business, Premium (유료)
   ```

6. **서비스 이름**
   ```
   medical-diagnosis-db (또는 원하는 이름)
   ```

7. **Create service** 클릭

---

## 3️⃣ 연결 정보 확인 (2-3분 후)

서비스 시작되면 **Overview** 탭에서:

```
Host: medical-diagnosis-db-xxx.aivencloud.com
Port: 25060
User: avnadmin
Password: [자동 생성된 비밀번호]
Database: defaultdb
```

### 이 정보를 복사해서 저장! 📋

---

## 4️⃣ 데이터베이스 이름 변경 (선택사항)

1. **Databases** 탭
2. **Create database** 클릭
3. 이름: `medical_diagnosis`
4. **Add database** 클릭

---

## ✅ 확인사항

- [ ] 서비스 타입: **MySQL** (Kafka ❌)
- [ ] 플랜: **Hobbyist - Free** (무료)
- [ ] 리전: Seoul 또는 Tokyo (가까운 곳)
- [ ] 상태: Running (초록색)

---

## 💰 요금 확인

**Hobbyist 플랜은 영구 무료입니다!**
- 월 $0
- 신용카드 등록 불필요
- 5GB 무료 스토리지

---

## 🆘 문제 발생 시

1. Kafka 서비스가 요금 발생하면: **즉시 삭제!**
2. MySQL Hobbyist 플랜 선택 확인
3. "Free" 또는 "$0/month" 표시 확인

---

## 다음 단계

MySQL 생성 후:
```powershell
code DEPLOY.md
```

3단계부터 진행! (GitHub 푸시 → Render 배포)
