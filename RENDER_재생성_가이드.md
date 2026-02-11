# ?? Render ?œë¹„???¬ìƒ??ê°€?´ë“œ

## ?“‹ ?œì‘ ??ì¤€ë¹„ì‚¬??

??GitHub ?€?¥ì†Œ: https://github.com/WEED-ChoGeonHee/medical-diagnosis-platform  
??Aiven MySQL ?°ì´?°ë² ?´ìŠ¤ ?•ë³´ (AIVEN_MYSQL_GUIDE.md ì°¸ê³ )  
??Gemini API Key: `YOUR_GEMINI_API_KEY`

---

## 1ï¸âƒ£ Render ?€?œë³´???‘ì†

1. https://dashboard.render.com ?‘ì†
2. ë¡œê·¸??(GitHub ê³„ì •?¼ë¡œ)

---

## 2ï¸âƒ£ ??Web Service ?ì„±

1. **Dashboard** ?°ì¸¡ ?ë‹¨ **New +** ë²„íŠ¼ ?´ë¦­
2. **Web Service** ? íƒ

---

## 3ï¸âƒ£ GitHub ?€?¥ì†Œ ?°ê²°

1. **Connect a repository** ?¹ì…˜?ì„œ:
   - `WEED-ChoGeonHee/medical-diagnosis-platform` ì°¾ê¸°
   - **Connect** ë²„íŠ¼ ?´ë¦­

2. ?€?¥ì†Œê°€ ??ë³´ì´ë©?
   - **Configure account** ?´ë¦­
   - GitHub?ì„œ Render???€?¥ì†Œ ?‘ê·¼ ê¶Œí•œ ë¶€??

---

## 4ï¸âƒ£ ?œë¹„???¤ì • (ì¤‘ìš”!)

### ê¸°ë³¸ ?•ë³´:
- **Name**: `medical-diagnosis-backend`
- **Region**: `Singapore (Southeast Asia)` â­?
- **Branch**: `master`
- **Root Directory**: ë¹„ì›Œ?ê¸° (ë£¨íŠ¸)

### Runtime:
- **Environment**: `Node` ??(Docker ??

### Build & Deploy:
- **Build Command**: **ë¹„ì›Œ?ê¸°** (render.yaml ?¬ìš©)
- **Start Command**: **ë¹„ì›Œ?ê¸°** (render.yaml ?¬ìš©)

### Plan:
- **Free** ? íƒ ??

---

## 5ï¸âƒ£ ?˜ê²½ ë³€???¤ì • (Environment Variables)

**Add Environment Variable** ë²„íŠ¼???´ë¦­?˜ê³  ?„ë˜ ë³€?˜ë“¤???˜ë‚˜??ì¶”ê?:

### ?„ìˆ˜ ?˜ê²½ ë³€??

#### 1. Gemini API
```
Key: GEMINI_API_KEY
Value: YOUR_GEMINI_API_KEY
```

#### 2. Database - Host
```
Key: DB_HOST
Value: (Aiven MySQL ?°ê²° ?•ë³´?ì„œ ë³µì‚¬)
?ˆì‹œ: mysql-xxxxxxxx-your-project.aivencloud.com
```

#### 3. Database - User
```
Key: DB_USER
Value: avnadmin
```

#### 4. Database - Password
```
Key: DB_PASSWORD
Value: (Aiven MySQL ë¹„ë?ë²ˆí˜¸)
```

### ?ë™ ?¤ì • ë³€??(render.yaml?ì„œ ?ë™?¼ë¡œ ?¤ì •??:
- `NODE_ENV`: production
- `PORT`: 10000
- `DB_PORT`: 25060
- `DB_NAME`: medical_diagnosis
- `JWT_SECRET`: (?ë™ ?ì„±)

---

## 6ï¸âƒ£ ?œë¹„???ì„±

1. ëª¨ë“  ?¤ì • ?•ì¸
2. ?˜ì´ì§€ ?˜ë‹¨ **Create Web Service** ë²„íŠ¼ ?´ë¦­

---

## 7ï¸âƒ£ ë°°í¬ ì§„í–‰ ?•ì¸

### ë°°í¬ ë¡œê·¸ ëª¨ë‹ˆ?°ë§:

1. ?œë¹„???ì„± ???ë™?¼ë¡œ **Logs** ??œ¼ë¡??´ë™
2. ?¤ìŒ ë©”ì‹œì§€?¤ì´ ?œì„œ?€ë¡??˜í??˜ëŠ”ì§€ ?•ì¸:

```bash
??Cloning repository...
??npm install
??npm --prefix patient-portal install
??npm --prefix patient-portal run build
   ??"Compiled successfully!" ë©”ì‹œì§€ ?•ì¸
??npm --prefix admin-dashboard install
??npm --prefix admin-dashboard run build
   ??"Compiled successfully!" ë©”ì‹œì§€ ?•ì¸
??npm --prefix backend install
??Starting service...
???œë²„ ?œì‘?? http://localhost:10000
??MySQL ?°ê²° ?±ê³µ
```

### ë°°í¬ ?¤íŒ¨ ??
- **Events** ??—???ëŸ¬ ë©”ì‹œì§€ ?•ì¸
- **Logs** ??—???ì„¸ ë¡œê·¸ ?•ì¸
- ?˜ê²½ ë³€?˜ê? ?¬ë°”ë¥¸ì? ?¬í™•??

---

## 8ï¸âƒ£ ë°°í¬ ?„ë£Œ ?•ì¸

### ë°°í¬ ?±ê³µ ?œì‹œ:
- **Events** ?? `Deploy live for ...` (ì´ˆë¡??
- ?œë¹„??URL ?ë™ ?ì„±: `https://medical-diagnosis-platform.onrender.com`

### ?¹ì‚¬?´íŠ¸ ?ŒìŠ¤??

1. **?˜ì ?¬í„¸** ?‘ì†:
   ```
   https://medical-diagnosis-platform.onrender.com/patient
   ```
   - ë¡œê·¸???˜ì´ì§€ê°€ ë³´ì—¬??????

2. **?˜ì‚¬ ?€?œë³´??* ?‘ì†:
   ```
   https://medical-diagnosis-platform.onrender.com/admin
   ```
   - ë¡œê·¸???˜ì´ì§€ê°€ ë³´ì—¬??????

3. ??**?¤ë¥˜ ë°œìƒ ??*:
   ```json
   {"error":"Endpoint not found"}
   ```
   - Logs?ì„œ "?˜ì ?¬í„¸ ë¹Œë“œ ì¡´ì¬ ?¬ë?: true" ?•ì¸
   - Logs?ì„œ "ê´€ë¦¬ì ?€?œë³´??ë¹Œë“œ ì¡´ì¬ ?¬ë?: true" ?•ì¸
   - Environment ?¤ì •??"Node"?¸ì? ?¬í™•??

---

## 9ï¸âƒ£ APK ???ŒìŠ¤??

ë°°í¬ê°€ ?±ê³µ?˜ë©´:

1. **?˜ì??APK** ?¤ì¹˜:
   ```
   E:\?ŒìŠ¤\?˜í•™\?˜ì???˜ë£Œì§„ë‹¨.apk
   ```

2. **?˜ì‚¬??APK** ?¤ì¹˜:
   ```
   E:\?ŒìŠ¤\?˜í•™\?˜ì‚¬???˜ë£Œì§„ë‹¨.apk
   ```

3. ???¤í–‰ ??Render??ë°°í¬???¹ì‚¬?´íŠ¸ê°€ ë¡œë“œ??

---

## ?”§ ë¬¸ì œ ?´ê²°

### ë¬¸ì œ 1: ?€?¥ì†Œê°€ ëª©ë¡???†ìŒ
**?´ê²°**: GitHub Settings ??Applications ??Render ??Repository access ???€?¥ì†Œ ì¶”ê?

### ë¬¸ì œ 2: Build ?¤íŒ¨
**?•ì¸?¬í•­**:
- render.yaml ?Œì¼??master ë¸Œëœì¹˜ì— ?ˆëŠ”ì§€
- Environmentê°€ "Node"ë¡??¤ì •?˜ì—ˆ?”ì?
- Build Commandê°€ ë¹„ì–´?ˆëŠ”ì§€ (render.yaml ?¬ìš©)

### ë¬¸ì œ 3: ë°°í¬ ??404 ?¤ë¥˜
**?•ì¸?¬í•­**:
- Logs?ì„œ "Compiled successfully!" ??ë²??˜í??¬ëŠ”ì§€
- Environment Variables??ëª¨ë“  ?„ìˆ˜ ë³€?˜ê? ?¤ì •?˜ì—ˆ?”ì?
- Settings ??Environmentê°€ "Node"?¸ì? (Docker ?„ë‹˜)

### ë¬¸ì œ 4: Database ?°ê²° ?¤ë¥˜
**?•ì¸?¬í•­**:
- DB_HOST, DB_USER, DB_PASSWORD ?˜ê²½ ë³€??
- Aiven MySQL ?œë¹„?¤ê? ?œì„±?”ë˜???ˆëŠ”ì§€
- Aiven MySQL ë°©í™”ë²??¤ì • (Allow all ê¶Œì¥)

---

## ?“ Aiven MySQL ?•ë³´ ?•ì¸ ë°©ë²•

1. https://console.aiven.io ?‘ì†
2. MySQL ?œë¹„???´ë¦­
3. **Overview** ??
   - **Service URI** ë³µì‚¬
   - ?•ì‹: `mysql://avnadmin:PASSWORD@HOST:PORT/defaultdb`
   - HOST ë¶€ë¶? `DB_HOST` ê°?
   - PASSWORD ë¶€ë¶? `DB_PASSWORD` ê°?

---

## ???±ê³µ ì²´í¬ë¦¬ìŠ¤??

- [ ] Render ?œë¹„???ì„± ?„ë£Œ
- [ ] Environment: Nodeë¡??¤ì •
- [ ] ëª¨ë“  ?˜ê²½ ë³€???…ë ¥
- [ ] ë°°í¬ ?„ë£Œ (Events ??— "Deploy live" ?œì‹œ)
- [ ] /patient URL ?‘ì† ?±ê³µ
- [ ] /admin URL ?‘ì† ?±ê³µ
- [ ] ?˜ì??APK ???•ìƒ ?‘ë™
- [ ] ?˜ì‚¬??APK ???•ìƒ ?‘ë™

---

## ?¯ ìµœì¢… URL

ë°°í¬ ?±ê³µ ??
- **?˜ì ?¬í„¸**: https://medical-diagnosis-platform.onrender.com/patient
- **?˜ì‚¬ ?€?œë³´??*: https://medical-diagnosis-platform.onrender.com/admin
- **API ?”ë“œ?¬ì¸??*: https://medical-diagnosis-platform.onrender.com/api

---

**?’¡ ??*: Render ë¬´ë£Œ ?Œëœ?€ 15ë¶„ê°„ ?œë™???†ìœ¼ë©??¬ë¦½ ëª¨ë“œë¡??¤ì–´ê°‘ë‹ˆ?? ì²??‘ì† ??30ì´??•ë„ ê¸°ë‹¤ë¦¬ë©´ ?œë¹„?¤ê? ê¹¨ì–´?©ë‹ˆ??
