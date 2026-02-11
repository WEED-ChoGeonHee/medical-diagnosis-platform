# ?? APK ë¹Œë“œ ë°?ë°°í¬ ?„ë£Œ!

## ?“± ?¹ì‚¬?´íŠ¸ ì£¼ì†Œ

ë°°í¬???¬ì´??ì£¼ì†Œ:

### **?˜ì ?¬í„¸ (ëª¨ë°”?¼ìš©)**
```
https://medical-diagnosis-platform.onrender.com/patient
```

### **ê´€ë¦¬ì ?€?œë³´??(?˜ì‚¬??**  
```
https://medical-diagnosis-platform.onrender.com/admin
```

### **API ?œë²„**
```
https://medical-diagnosis-platform.onrender.com/api
```

---

## ?“² APK ë¹Œë“œ ë°©ë²•

### ë°©ë²• 1: ?ë™ ë¹Œë“œ ?¤í¬ë¦½íŠ¸ (ê°€??ê°„ë‹¨)

```powershell
cd e:\?ŒìŠ¤\?˜í•™
.\build-android-apk.ps1
```

???¤í¬ë¦½íŠ¸ê°€ ?ë™?¼ë¡œ:
1. Gradleë¡?APK ë¹Œë“œ
2. APKë¥?`medical-diagnosis.apk`ë¡?ë³µì‚¬
3. ?¤ì¹˜ ë°©ë²• ?ˆë‚´

---

### ë°©ë²• 2: Android Studio ?¬ìš©

1. **Android Studio ?¤ìš´ë¡œë“œ**
   - https://developer.android.com/studio

2. **?„ë¡œ?íŠ¸ ?´ê¸°**
   - `File > Open > e:\?ŒìŠ¤\?˜í•™\android-app`

3. **Gradle ?™ê¸°???€ê¸?*
   - ?ë™?¼ë¡œ ?˜ì¡´???¤ìš´ë¡œë“œ

4. **APK ë¹Œë“œ**
   - `Build > Build Bundle(s) / APK(s) > Build APK(s)`

5. **APK ?Œì¼ ?„ì¹˜**
   ```
   android-app\app\build\outputs\apk\debug\app-debug.apk
   ```

---

### ë°©ë²• 3: ëª…ë ¹ì¤„ë¡œ ì§ì ‘ ë¹Œë“œ

Android SDKê°€ ?´ë? ?¤ì¹˜?˜ì–´ ?ˆë‹¤ë©?

```powershell
cd e:\?ŒìŠ¤\?˜í•™\android-app

# Windows
.\gradlew.bat assembleDebug

# ?±ê³µ?˜ë©´ APK ?ì„±??
# ?„ì¹˜: app\build\outputs\apk\debug\app-debug.apk
```

---

## ?Œ ë°°í¬ ?…ë°?´íŠ¸ (Render.com)

ì½”ë“œë¥?GitHub???¸ì‹œ?˜ë©´ ?ë™?¼ë¡œ ë°°í¬?©ë‹ˆ??

```powershell
cd e:\?ŒìŠ¤\?˜í•™

git add .
git commit -m "?„ë¡ ?¸ì—”???•ì  ?Œì¼ ?œë¹™ ì¶”ê?"
git push origin main
```

Render.com?ì„œ ?ë™?¼ë¡œ:
1. ?˜ì ?¬í„¸ ë¹Œë“œ
2. ê´€ë¦¬ì ?€?œë³´??ë¹Œë“œ  
3. ë°±ì—”???œë²„?ì„œ ëª¨ë‘ ?œë¹™

ë°°í¬ ?„ë£Œ?˜ë©´ (5-10ë¶??Œìš”):
- https://medical-diagnosis-platform.onrender.com/patient
- https://medical-diagnosis-platform.onrender.com/admin

---

## ?“± APK ?¤ì¹˜ ë°©ë²•

1. **APK ?Œì¼???¤ë§ˆ?¸í°?¼ë¡œ ?„ì†¡**
   - USB ì¼€?´ë¸”
   - Google Drive
   - ì¹´ì¹´?¤í†¡ ?Œì¼ ?„ì†¡
   - ?´ë©”??

2. **?¤ë§ˆ?¸í°?ì„œ ?¤ì¹˜**
   - ?Œì¼ ê´€ë¦¬ì ?±ì—??APK ?´ë¦­
   - "?????†ëŠ” ì¶œì²˜" ???¤ì¹˜ ?ˆìš©
   - ?¤ì¹˜ ?„ë£Œ!

---

## ??APK ?¤ì • ?•ì¸

APK???¤ìŒ URLë¡??‘ì†?˜ë„ë¡??¤ì •?˜ì–´ ?ˆìŠµ?ˆë‹¤:

**MainActivity.java**:
```java
private static final String APP_URL = "https://medical-diagnosis-platform.onrender.com/patient";
```

---

## ?¯ ìµœì¢… ?•ì¸ ì²´í¬ë¦¬ìŠ¤??

### ë¡œì»¬ ?ŒìŠ¤??(ê°œë°œ??
- [ ] ë°±ì—”???œë²„ ?¤í–‰: `cd backend && npm start`
- [ ] ?˜ì ?¬í„¸ ?¤í–‰: `cd patient-portal && npm start`
- [ ] http://localhost:3000 ?‘ì† ?•ì¸

### ë°°í¬ (?„ë¡œ?•ì…˜)
- [ ] GitHub??ì½”ë“œ ?¸ì‹œ
- [ ] Render.com ë°°í¬ ?„ë£Œ ?€ê¸?
- [ ] https://medical-diagnosis-platform.onrender.com/patient ?‘ì† ?•ì¸
- [ ] APK ë¹Œë“œ ë°??ŒìŠ¤??

---

## ?š¨ ì£¼ì˜?¬í•­

### ì²??‘ì† ???ë¦¼
- ë¬´ë£Œ ?œë²„??15ë¶?ë¹„í™œ?????¬ë¦½ ëª¨ë“œ
- ì²??‘ì† ??30ì´?1ë¶??€ê¸?(?ë™ ?¬ì‹œ??
- ?´í›„ ?•ìƒ ?ë„ë¡??™ì‘

### APK URL ë³€ê²½ì´ ?„ìš”??ê²½ìš°
1. `android-app\app\src\main\java\com\medical\patient\MainActivity.java` ?˜ì •
2. `APP_URL` ë³€ê²?
3. APK ?¤ì‹œ ë¹Œë“œ

---

## ?“ ?„ì?ë§?

???ì„¸???´ìš©?€:
- [QUICK-START.md](QUICK-START.md) - ?„ì²´ ê°€?´ë“œ
- [android-app/README.md](android-app/README.md) - Android ???ì„¸ ê°€?´ë“œ
- [DEPLOY.md](DEPLOY.md) - ë°°í¬ ê°€?´ë“œ
