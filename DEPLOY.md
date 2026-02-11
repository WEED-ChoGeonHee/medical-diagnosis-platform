# ?? ?˜ë£Œ ì§„ë‹¨ ?Œë«??ë°°í¬ ê°€?´ë“œ

## ?“‹ ë°°í¬ êµ¬ì„±
- **?°ì´?°ë² ?´ìŠ¤**: Aiven MySQL (ë¬´ë£Œ ?°ì–´)
- **ë°±ì—”??*: Render.com Web Service (ë¬´ë£Œ ?°ì–´)
- **?„ë¡ ?¸ì—”??*: APK ?Œì¼ë¡?ë°°í¬ ?„ë£Œ

---

## 1ï¸âƒ£ Aiven MySQL ë¬´ë£Œ ?°ì´?°ë² ?´ìŠ¤ ?ì„±

### 1-1. Aiven ê³„ì • ?ì„±
1. https://console.aiven.io/signup ?‘ì†
2. ?´ë©”?¼ë¡œ ?Œì›ê°€??(? ìš©ì¹´ë“œ ë¶ˆí•„??)
3. ?´ë©”???¸ì¦

### 1-2. MySQL ?°ì´?°ë² ?´ìŠ¤ ?ì„±
1. Aiven ì½˜ì†”?ì„œ **Create service** ?´ë¦­
2. ?œë¹„??? íƒ: **MySQL**
3. ?´ë¼?°ë“œ ?œê³µ?? **Google Cloud** (ë¬´ë£Œ)
4. ë¦¬ì „: **Seoul** (asia-northeast3) - ê°€??ê°€ê¹Œìš´ ì§€??
5. ?Œëœ: **Hobbyist - Free** ? íƒ
6. ?œë¹„???´ë¦„: `medical-diagnosis-db` (?í•˜???´ë¦„)
7. **Create service** ?´ë¦­

### 1-3. ?°ì´?°ë² ?´ìŠ¤ ?°ê²° ?•ë³´ ?•ì¸
?œë¹„?¤ê? ?œì‘?˜ë©´ (2-3ë¶??Œìš”):
1. **Overview** ??—???°ê²° ?•ë³´ ?•ì¸
2. ?¤ìŒ ?•ë³´ë¥?ë©”ëª¨?¥ì— ë³µì‚¬:
   - **Host** (?? medical-diagnosis-db-xxx.aivencloud.com)
   - **Port** (ê¸°ë³¸ê°? 25060)
   - **User** (ê¸°ë³¸ê°? avnadmin)
   - **Password** (?ë™ ?ì„±??ë¹„ë?ë²ˆí˜¸)
   - **Database** (ê¸°ë³¸ê°? defaultdb)

### 1-4. ?°ì´?°ë² ?´ìŠ¤ ?´ë¦„ ë³€ê²?(? íƒ?¬í•­)
1. **Databases** ??œ¼ë¡??´ë™
2. **Create database** ?´ë¦­
3. ?°ì´?°ë² ?´ìŠ¤ ?´ë¦„: `medical_diagnosis` ?…ë ¥
4. **Add database** ?´ë¦­

---

## 2ï¸âƒ£ GitHub ?€?¥ì†Œ ?ì„± ë°?ì½”ë“œ ?…ë¡œ??

### 2-1. GitHub ?€?¥ì†Œ ?ì„±
1. https://github.com/new ?‘ì†
2. Repository name: `medical-diagnosis`
3. **Public** ? íƒ (ë¬´ë£Œ ë°°í¬ ?„ìˆ˜)
4. **Create repository** ?´ë¦­

### 2-2. ì½”ë“œ ?¸ì‹œ
PowerShell?ì„œ ?¤í–‰:

```powershell
cd e:\?ŒìŠ¤\?˜í•™

# Git ?¤ì • (ì²˜ìŒ ??ë²ˆë§Œ)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# GitHub ?€?¥ì†Œ ?°ê²°
git remote add origin https://github.com/YOUR_USERNAME/medical-diagnosis.git

# ë¸Œëœì¹??´ë¦„ ë³€ê²?(main?¼ë¡œ)
git branch -M main

# ?¸ì‹œ
git push -u origin main
```

**ì£¼ì˜**: `YOUR_USERNAME`???¤ì œ GitHub ?¬ìš©?ëª…?¼ë¡œ ë³€ê²?

---

## 3ï¸âƒ£ Render.com ë°°í¬

### 3-1. Render ê³„ì • ?ì„±
1. https://render.com ?‘ì†
2. **Get Started** ?´ë¦­
3. **GitHub**ë¡?ë¡œê·¸??

### 3-2. Blueprintë¡?ë°°í¬
1. Dashboard?ì„œ **New +** ?´ë¦­
2. **Blueprint** ? íƒ
3. GitHub ?€?¥ì†Œ ?°ê²°:
   - **Connect GitHub** ?´ë¦­
   - `medical-diagnosis` ?€?¥ì†Œ ? íƒ
4. `render.yaml` ?ë™ ê°ì???
5. **Blueprint Name**: `medical-diagnosis` ?…ë ¥

### 3-3. ?˜ê²½ ë³€???¤ì •
Aiven?ì„œ ë³µì‚¬???•ë³´ë¥??…ë ¥:

| ?˜ê²½ ë³€??| ê°?|
|---------|-----|
| `DB_HOST` | Aiven Host (?? medical-diagnosis-db-xxx.aivencloud.com) |
| `DB_PORT` | 25060 |
| `DB_USER` | avnadmin |
| `DB_PASSWORD` | Aiven?ì„œ ë³µì‚¬??ë¹„ë?ë²ˆí˜¸ |
| `DB_NAME` | medical_diagnosis (?ëŠ” defaultdb) |
| `GEMINI_API_KEY` | YOUR_GEMINI_API_KEY |

### 3-4. ë°°í¬ ?œì‘
1. **Apply** ?´ë¦­
2. ë°°í¬ ì§„í–‰ (5-10ë¶??Œìš”)
3. ?„ë£Œ?˜ë©´ URL ?•ì¸: `https://medical-diagnosis-platform.onrender.com`

---

## 4ï¸âƒ£ ë°°í¬ ?•ì¸

### 4-1. ë°±ì—”??API ?ŒìŠ¤??
ë¸Œë¼?°ì??ì„œ ?‘ì†:
```
https://medical-diagnosis-platform.onrender.com/api/auth/health
```

?•ìƒ ?‘ë‹µ:
```json
{"status": "ok", "database": "connected"}
```

### 4-2. ?°ì´?°ë² ?´ìŠ¤ ?°ê²° ?•ì¸
Aiven ì½˜ì†”:
1. **Current Queries** ??—???œì„± ?°ê²° ?•ì¸
2. **Metrics** ??—??CPU/ë©”ëª¨ë¦??¬ìš©???•ì¸

---

## 5ï¸âƒ£ APK ?…ë°?´íŠ¸ (? íƒ?¬í•­)

### ?„ì¬ APK???«ìŠ¤??IPë¡??¤ì •??
ë°°í¬??ë°±ì—”?œë? ?¬ìš©?˜ë ¤ë©?

1. `E:\medical\webview-apps\patient-webview\app\src\main\java\com\medicalapp\patient\MainActivity.java` ?˜ì •:
```java
private static final String APP_URL = "https://medical-diagnosis-platform.onrender.com/patient";
```

2. APK ?¬ë¹Œ??
```powershell
cd E:\medical\webview-apps
.\build-all.ps1
```

---

## ?¯ ?”ì•½

??**?„ë£Œ???‘ì—…**:
- Aiven MySQL ë¬´ë£Œ ?°ì´?°ë² ?´ìŠ¤ ?¤ì •
- GitHub ?€?¥ì†Œ ?ì„± ë°?ì½”ë“œ ?…ë¡œ??
- Render.com ë¬´ë£Œ ???œë¹„??ë°°í¬
- ?˜ê²½ ë³€???¤ì •

?Œ **ë°°í¬ URL**:
- ë°±ì—”??API: `https://medical-diagnosis-platform.onrender.com`
- ?„ë¡ ?¸ì—”?? APK ?Œì¼ (ë¡œì»¬ ?ëŠ” ?…ë°?´íŠ¸ ?„ìš”)

?’° **ë¹„ìš©**: ?„ì „ ë¬´ë£Œ!
- Aiven MySQL: ë¬´ë£Œ ?°ì–´ (5GB ?¤í† ë¦¬ì?)
- Render.com: ë¬´ë£Œ ?°ì–´ (750?œê°„/??

---

## ? ï¸ ì£¼ì˜?¬í•­

### Render ë¬´ë£Œ ?°ì–´ ?œí•œ
- **?ë™ ?¬ë¦½**: 15ë¶?ë¹„í™œ?????œë²„ ?•ì?
- **ì²˜ìŒ ?”ì²­ ???¬ì‹œ??*: 30ì´?1ë¶??Œìš”
- **??750?œê°„ ?œí•œ**: ??31??(ì¶©ë¶„??

### Aiven ë¬´ë£Œ ?°ì–´ ?œí•œ
- **?¤í† ë¦¬ì?**: ìµœë? 5GB
- **ë°±ì—…**: ?ë™ ë°±ì—… 2??ë³´ê?
- **?°ê²° ??*: ìµœë? 25ê°??™ì‹œ ?°ê²°

### ?´ê²° ë°©ë²•
- ?œë²„ê°€ ?ì£¼ ?¬ë¦½?˜ë©´ UptimeRobot (https://uptimerobot.com) ?¼ë¡œ 5ë¶„ë§ˆ????
- APK?ì„œ ë¡œë”© ?¸ë””ì¼€?´í„° ì¶”ê??˜ì—¬ ?¬ìš©??ê²½í—˜ ê°œì„ 

---

## ?†˜ ë¬¸ì œ ?´ê²°

### 1. ?°ì´?°ë² ?´ìŠ¤ ?°ê²° ?¤íŒ¨
- Aiven ì½˜ì†”?ì„œ ?œë¹„???íƒœ ?•ì¸
- Render ?˜ê²½ ë³€???¤ì‹œ ?•ì¸
- Aiven IP ?”ì´?¸ë¦¬?¤íŠ¸ ?•ì¸ (**ë¶ˆí•„??* - Render???ë™ ?ˆìš©??

### 2. Render ë°°í¬ ?¤íŒ¨
- GitHub ?€?¥ì†Œê°€ Public?¸ì? ?•ì¸
- `render.yaml` ?Œì¼??ë£¨íŠ¸ ?”ë ‰? ë¦¬???ˆëŠ”ì§€ ?•ì¸
- Render ë¡œê·¸?ì„œ ?ëŸ¬ ë©”ì‹œì§€ ?•ì¸

### 3. API ?”ì²­ ?¤íŒ¨
- ë°±ì—”??URL???•í™•?œì? ?•ì¸
- HTTPS ?¬ìš© ?•ì¸ (HTTP ??
- ë¸Œë¼?°ì? ì½˜ì†”?ì„œ CORS ?ëŸ¬ ?•ì¸

---

## ?“ ì§€??

ë¬¸ì œê°€ ?ˆë‹¤ë©?
1. Render Dashboard ??Logs ?•ì¸
2. Aiven Console ??Logs ?•ì¸
3. GitHub Issues??ë¬¸ì˜
