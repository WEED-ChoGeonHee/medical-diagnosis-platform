# 🔧 Render Build Command 수정 가이드

## 📌 문제 상황

다음과 같은 오류가 발생할 때:
```
npm error path /opt/render/project/src/package.json
npm error ENOENT: no such file or directory
```

**원인**: Render Dashboard의 Settings에 설정된 Build Command가 `render.yaml`과 충돌

---

## ✅ 해결 방법

### 방법 1: Build Command 비우기 (가장 간단!)

1. **Render Dashboard 접속**
   - https://dashboard.render.com

2. **서비스 클릭** → **Settings** 탭

3. **Build & Deploy** 섹션으로 스크롤

4. **Build Command** 필드를 **완전히 비우기** (빈칸)

5. **Save Changes** 클릭

> `render.yaml`에 이미 Build Command가 정의되어 있으므로, Dashboard에서는 비워두면 자동으로 yaml 설정을 사용합니다.

---

### 방법 2: Build Command 직접 입력

Dashboard의 Build Command에 다음을 입력:

```bash
cd patient-portal && PUBLIC_URL=/patient npm install && PUBLIC_URL=/patient npm run build && cd .. && cd admin-dashboard && PUBLIC_URL=/admin npm install && PUBLIC_URL=/admin npm run build && cd .. && cd backend && npm install && cd ..
```

Start Command:
```bash
npm --prefix backend start
```

---

## 📋 확인 사항

- [ ] Build Command 설정 확인
- [ ] Start Command: `npm --prefix backend start`
- [ ] 환경 변수 모두 입력
- [ ] 변경 후 **Manual Deploy** → **Deploy latest commit** 클릭
