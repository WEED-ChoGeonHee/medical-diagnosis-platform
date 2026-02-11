# ?“± Android APK ?ì„± ê°€?´ë“œ

## ë°©ë²• 1: Capacitor ?¬ìš© (ì¶”ì²œ)

### 1?¨ê³„: Capacitor ?¤ì¹˜
```powershell
cd e:\?ŒìŠ¤\?˜í•™\patient-portal

# Capacitor ?¤ì¹˜
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Capacitor ì´ˆê¸°??
npx cap init medicalApp com.medical.patient
```

### 2?¨ê³„: ?„ë¡œ?•ì…˜ ë¹Œë“œ
```powershell
# React ??ë¹Œë“œ
npm run build

# Android ?Œë«??ì¶”ê?
npx cap add android
```

### 3?¨ê³„: API URL ?¤ì •
`src/api.js` ?Œì¼ ?˜ì •:
```javascript
const API_URL = 'https://medical-diagnosis-platform.onrender.com/api';
```

ê·¸ë¦¬ê³??¤ì‹œ ë¹Œë“œ:
```powershell
npm run build
npx cap sync
```

### 4?¨ê³„: APK ?ì„±

#### ?µì…˜ A: Android Studio ?¬ìš©
```powershell
npx cap open android
```
Android Studio?ì„œ:
1. **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. ë¹Œë“œ ?„ë£Œ ??APK ?„ì¹˜ ?•ì¸

#### ?µì…˜ B: ëª…ë ¹ì¤„ë¡œ ë¹Œë“œ (Android Studio ?†ì´)
```powershell
cd android
.\gradlew assembleDebug
```
?ì„±??APK ?„ì¹˜: `android\app\build\outputs\apk\debug\app-debug.apk`

---

## ë°©ë²• 2: ê°„ë‹¨??WebView APK ?„ë¡œ?íŠ¸

Android Studio ?†ì´ ê°„ë‹¨??WebView ?±ì„ ë§Œë“¤ ???ˆìŠµ?ˆë‹¤.
??ë°©ë²•?€ ë³„ë„ ê°€?´ë“œ ?Œì¼??ì°¸ì¡°?˜ì„¸??

---

## ?¯ ë¹ ë¥¸ APK ?ì„± ?¤í¬ë¦½íŠ¸

?„ë˜ ?¤í¬ë¦½íŠ¸ë¥??¤í–‰?˜ì—¬ ?ë™?¼ë¡œ APKë¥??ì„±?©ë‹ˆ??

```powershell
.\build-apk.ps1
```

?¤í¬ë¦½íŠ¸ ?´ìš©?€ ?¤ìŒ ?¨ê³„?ì„œ ?ì„±?©ë‹ˆ??
