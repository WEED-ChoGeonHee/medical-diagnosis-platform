# ?“± ?˜ë£Œ ì§„ë‹¨ ?Œë«??- ?¬ìš© ê°€?´ë“œ

## ?Œ ?¹ì‚¬?´íŠ¸ ?‘ì† ë°©ë²•

### ??ê°€??ê°„ë‹¨??ë°©ë²•: ??ë¸Œë¼?°ì?ë¡??‘ì†

#### ë¡œì»¬ ?œë²„ ?¤í–‰ ???‘ì†:

1. **ë°±ì—”???œë²„ ?œì‘** (??PowerShell ?°ë???:
```powershell
cd e:\?ŒìŠ¤\?˜í•™\backend
npm install
npm start
```

2. **?˜ì ?¬í„¸ ?œì‘** (??PowerShell ?°ë???:
```powershell
cd e:\?ŒìŠ¤\?˜í•™\patient-portal
npm install
npm start
```

3. **ë¸Œë¼?°ì??ì„œ ?‘ì†**:
   - ?˜ì ?¬í„¸: http://localhost:3000
   - ê´€ë¦¬ì ?€?œë³´?? http://localhost:3001 (ì¶”ê? ?°ë??ì—??admin-dashboard ?¤í–‰)

#### ëª¨ë°”?¼ì—???‘ì† (ê°™ì? Wi-Fi):
1. PC??IP ì£¼ì†Œ ?•ì¸:
```powershell
ipconfig
# IPv4 ì£¼ì†Œ ?•ì¸ (?? 192.168.0.10)
```

2. ëª¨ë°”??ë¸Œë¼?°ì??ì„œ:
   - http://192.168.0.10:3000

---

### ?ï¸ ë°°í¬???œë²„ ?‘ì† (?´ë””?œë‚˜)

ë°°í¬ê°€ ?„ë£Œ?˜ì—ˆ?¤ë©´:
- **?˜ì ?¬í„¸**: https://medical-diagnosis-platform.onrender.com/patient
- **ê´€ë¦¬ì ?€?œë³´??*: https://medical-diagnosis-platform.onrender.com/admin

? ï¸ **ì°¸ê³ **: ë¬´ë£Œ ?œë²„??ì²˜ìŒ ?‘ì† ??30ì´?1ë¶??•ë„ ?€ê¸??œê°„???ˆìŠµ?ˆë‹¤ (?¬ë¦½ ëª¨ë“œ ?´ì œ).

---

## ?“² Android APK ?ì„± ë°©ë²•

### ë°©ë²• 1: ë¹ ë¥¸ ë¹Œë“œ (?ë™???¤í¬ë¦½íŠ¸)

```powershell
cd e:\?ŒìŠ¤\?˜í•™
.\build-android-apk.ps1
```

???¤í¬ë¦½íŠ¸ê°€ ?ë™?¼ë¡œ:
1. Android SDK ?•ì¸
2. Gradleë¡?APK ë¹Œë“œ
3. APK ?Œì¼??`medical-diagnosis.apk`ë¡?ë³µì‚¬

**?„ìš”?¬í•­**: Android Studio ?ëŠ” Android SDK ?¤ì¹˜ ?„ìš”

---

### ë°©ë²• 2: Android Studio ?¬ìš© (ì¶”ì²œ)

1. **Android Studio ?¤ìš´ë¡œë“œ ë°??¤ì¹˜**:
   - https://developer.android.com/studio

2. **?„ë¡œ?íŠ¸ ?´ê¸°**:
   ```
   File > Open > e:\?ŒìŠ¤\?˜í•™\android-app
   ```

3. **APK ë¹Œë“œ**:
   ```
   Build > Build Bundle(s) / APK(s) > Build APK(s)
   ```

4. **APK ?Œì¼ ?„ì¹˜**:
   ```
   android-app\app\build\outputs\apk\debug\app-debug.apk
   ```

---

### ë°©ë²• 3: ?¨ë¼??ë¹Œë“œ ?œë¹„??(Android Studio ?†ì´)

Android Studio ?¤ì¹˜ ?†ì´ APKë¥??ì„±?????ˆìŠµ?ˆë‹¤:

#### AppGyver BuildApp.io
1. https://www.buildapp.io/ ?‘ì†
2. `android-app` ?´ë”ë¥?ZIP?¼ë¡œ ?•ì¶•
3. ?…ë¡œ?œí•˜ê³?ë¹Œë“œ

#### GitHub Actions (?ë™??
- GitHub??ì½”ë“œë¥??¸ì‹œ?˜ë©´ ?ë™?¼ë¡œ APK ?ì„±
- ?¤ì • ë°©ë²•?€ `android-app/README.md` ì°¸ì¡°

---

### ë°©ë²• 4: Capacitor ?¬ìš© (React ??-> ?¤ì´?°ë¸Œ)

```powershell
cd e:\?ŒìŠ¤\?˜í•™\patient-portal

# Capacitor ?¤ì¹˜
npm install @capacitor/core @capacitor/cli @capacitor/android

# ì´ˆê¸°??
npx cap init medicalApp com.medical.patient --web-dir=build

# ë¹Œë“œ ë°?Android ì¶”ê?
npm run build
npx cap add android
npx cap sync

# Android Studio ?´ê¸°
npx cap open android
```

Android Studio?ì„œ Build > Build APK(s)

---

## ?“± APK ?¤ì¹˜ ë°©ë²•

1. **APK ?Œì¼ ?„ì†¡**:
   - USB ì¼€?´ë¸”ë¡??°ê²°
   - ?ëŠ” Google Drive, ì¹´ì¹´?¤í†¡ ?±ìœ¼ë¡??„ì†¡

2. **?¤ë§ˆ?¸í°?ì„œ APK ?Œì¼ ?´ê¸°**:
   - ?Œì¼ ê´€ë¦¬ì ?±ì—??APK ?Œì¼ ?´ë¦­

3. **?¤ì¹˜ ?ˆìš©**:
   - "?????†ëŠ” ì¶œì²˜" ???¤ì¹˜ ?ˆìš©
   - (?¤ì • > ë³´ì•ˆ > ?????†ëŠ” ì¶œì²˜)

4. **?¤ì¹˜ ?„ë£Œ!** ?‰

---

## ?™ï¸ ???¤ì • ë³€ê²?

### ?¹ì‚¬?´íŠ¸ URL ë³€ê²?
APKê°€ ?‘ì†???¹ì‚¬?´íŠ¸ ì£¼ì†Œë¥?ë³€ê²½í•˜?¤ë©´:

**?Œì¼**: `android-app\app\src\main\java\com\medical\patient\MainActivity.java`

```java
private static final String APP_URL = "https://your-website-url.com";
```

ë°°í¬???œë²„ ì£¼ì†Œë¡?ë³€ê²?
```java
private static final String APP_URL = "https://medical-diagnosis-platform.onrender.com/patient";
```

ë³€ê²????¤ì‹œ APK ë¹Œë“œ!

### ???´ë¦„ ë³€ê²?
**?Œì¼**: `android-app\app\src\main\res\values\strings.xml`

```xml
<string name="app_name">?˜ë£Œ ì§„ë‹¨</string>
```

---

## ?š¨ ë¬¸ì œ ?´ê²°

### 1. "MongoDB service not found"
- ?„ë¡œ?íŠ¸ê°€ MySQLë¡?ë³€ê²½ë˜?ˆìŠµ?ˆë‹¤
- `backend\.env` ?Œì¼??MySQL ?¤ì • ?„ìš”:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medical_diagnosis
```

### 2. ë°±ì—”???°ê²° ?¤íŒ¨
- ë°±ì—”???œë²„ê°€ ?¤í–‰ ì¤‘ì¸ì§€ ?•ì¸
- ?˜ê²½ ë³€??(.env) ?¤ì • ?•ì¸
- ë°©í™”ë²??¤ì • ?•ì¸

### 3. APK ë¹Œë“œ ?¤íŒ¨
- Android Studio ?¤ì¹˜ ?•ì¸
- Gradle ?™ê¸°?? `File > Sync Project with Gradle Files`
- SDK ?¼ì´? ìŠ¤ ?™ì˜: `sdkmanager --licenses`

### 4. APK ?¤ì¹˜ ?¤íŒ¨
- "?????†ëŠ” ì¶œì²˜" ???¤ì¹˜ ?ˆìš©
- ?€??ê³µê°„ ?•ì¸
- ?´ì „ ë²„ì „ ???? œ ???¬ì„¤ì¹?

---

## ?“ ì¶”ê? ?„ì?ë§?

- **?¹ì‚¬?´íŠ¸ ?‘ì†**: [START-WEB.md](START-WEB.md)
- **APK ë¹Œë“œ**: [BUILD-APK.md](BUILD-APK.md)
- **Android ??*: [android-app/README.md](android-app/README.md)
- **ë°°í¬ ê°€?´ë“œ**: [DEPLOY.md](DEPLOY.md)

---

## ?¯ ë¹ ë¥¸ ?œì‘ ì²´í¬ë¦¬ìŠ¤??

### ?¹ì‚¬?´íŠ¸ë§??¬ìš©?˜ê¸°:
- [ ] ë°±ì—”???œë²„ ?œì‘
- [ ] ?˜ì ?¬í„¸ ?œì‘
- [ ] ë¸Œë¼?°ì??ì„œ http://localhost:3000 ?‘ì†

### APK ?¬ìš©?˜ê¸°:
- [ ] Android Studio ?¤ì¹˜
- [ ] `build-android-apk.ps1` ?¤í–‰
- [ ] APK ?Œì¼???¤ë§ˆ?¸í°?¼ë¡œ ?„ì†¡
- [ ] APK ?¤ì¹˜

### ë°°í¬?˜ê¸°:
- [ ] [DEPLOY.md](DEPLOY.md) ì°¸ì¡°
- [ ] Aiven MySQL ?¤ì •
- [ ] Render.com ë°°í¬
- [ ] APK URL ?…ë°?´íŠ¸

---

## ??ê¸°ëŠ¥ ?”ì•½

### ?˜ì ?¬í„¸
- ???Œì›ê°€??ë°?ë¡œê·¸??
- ???¼ë? ì¦ìƒ ?…ë ¥ ë°??´ë?ì§€ ?…ë¡œ??
- ??AI ì§„ë‹¨ ê²°ê³¼ ?•ì¸
- ???˜ì‚¬ ?Œê²¬ ?•ì¸

### ê´€ë¦¬ì ?€?œë³´??
- ??ëª¨ë“  ì§„ë‹¨ ?´ì—­ ì¡°íšŒ
- ???˜ì ?•ë³´ ê´€ë¦?
- ???˜ì‚¬ ?Œê²¬ ?‘ì„±
- ???µê³„ ?€?œë³´??

**ê¸°ìˆ  ?¤íƒ**: React + Node.js + MySQL + Gemini AI
