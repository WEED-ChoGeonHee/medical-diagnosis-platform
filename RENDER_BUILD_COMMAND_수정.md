# ?š¨ Render Build Command ?˜ì • ê°€?´ë“œ (?„ìˆ˜!)

## ??ë¬¸ì œ ?í™©

?¬ì „??ê°™ì? ?¤ë¥˜ê°€ ë°œìƒ:
```
npm error path /opt/render/project/src/package.json
npm error ENOENT: no such file or directory
```

**?ì¸**: Render Dashboard??Settings???¤ì •??Build Commandê°€ render.yaml????–´?°ê³  ?ˆìŠµ?ˆë‹¤!

---

## ???´ê²° ë°©ë²• (2ê°€ì§€ ì¤?? íƒ)

### ?ŒŸ ë°©ë²• 1: Build Command ?„ì „??ë¹„ìš°ê¸?(ê°€???¬ì?!)

#### ?¨ê³„ë³?ì§„í–‰:

1. **Render Dashboard ?‘ì†**
   - https://dashboard.render.com

2. **medical-diagnosis-backend ?œë¹„???´ë¦­**

3. **Settings ??* ?´ë¦­ (ì¢Œì¸¡ ë©”ë‰´)

4. **Build & Deploy** ?¹ì…˜?¼ë¡œ ?¤í¬ë¡?

5. **Build Command** ?„ë“œ ?•ì¸:
   
   **?„ì¬ (?˜ëª»??:**
   ```
   npm install && npm --prefix patient-portal install && ...
   ```
   
   **?˜ì •:**
   ```
   [?„ì „???? œ - ë¹ˆì¹¸?¼ë¡œ ë§Œë“¤ê¸?
   ```
   
   - ?„ë“œ ?ˆì˜ ëª¨ë“  ?ìŠ¤??? íƒ (Ctrl+A)
   - Delete ?¤ë¡œ ?? œ
   - ?„ì „??ë¹„ì›Œ?ê¸°

6. **Start Command** ?„ë“œ??ê°™ì? ë°©ë²•?¼ë¡œ:
   ```
   [?„ì „???? œ - ë¹ˆì¹¸?¼ë¡œ ë§Œë“¤ê¸?
   ```

7. **Save Changes** ë²„íŠ¼ ?´ë¦­ (?˜ì´ì§€ ?˜ë‹¨)

8. **Manual Deploy** ??œ¼ë¡??´ë™
   - **Clear build cache & deploy** ? íƒ
   - **Deploy** ë²„íŠ¼ ?´ë¦­

#### ?’¡ ?´ë ‡ê²??˜ë©´:
- Renderê°€ render.yaml ?Œì¼???¤ì •???¬ìš©?©ë‹ˆ??
- render.yaml?ëŠ” ?´ë? ?¬ë°”ë¥?ëª…ë ¹?´ê? ?¤ì–´?ˆìŠµ?ˆë‹¤:
  ```yaml
  buildCommand: |
    npm --prefix patient-portal install
    npm --prefix patient-portal run build
    npm --prefix admin-dashboard install
    npm --prefix admin-dashboard run build
    npm --prefix backend install
  ```

---

### ?”§ ë°©ë²• 2: Dashboard??ì§ì ‘ ?¬ë°”ë¥?ëª…ë ¹???…ë ¥

#### ë§Œì•½ ë°©ë²• 1???‘ë™?˜ì? ?Šìœ¼ë©?

1. **Render Dashboard ??medical-diagnosis-backend ??Settings**

2. **Build Command** ?„ë“œ???¤ìŒ??ë³µì‚¬ ë¶™ì—¬?£ê¸°:

   ```bash
   npm --prefix patient-portal install && npm --prefix patient-portal run build && npm --prefix admin-dashboard install && npm --prefix admin-dashboard run build && npm --prefix backend install
   ```

3. **Start Command** ?„ë“œ??

   ```bash
   npm --prefix backend start
   ```

4. **Save Changes** ?´ë¦­

5. **Manual Deploy ??Clear build cache & deploy**

---

## ? ï¸ ?ˆë? ?˜ì? ë§ì•„????ê²?

### ???˜ëª»??Build Command:
```bash
npm install && npm --prefix patient-portal install && ...
^^^^^^^^^^^
???´ê²ƒ ?Œë¬¸???¤ë¥˜ ë°œìƒ!
```

**?´ìœ **: ?„ë¡œ?íŠ¸ ë£¨íŠ¸(/)?ëŠ” package.json???†ìŠµ?ˆë‹¤!
- `/package.json` ???†ìŒ
- `/patient-portal/package.json` ???ˆìŒ
- `/admin-dashboard/package.json` ???ˆìŒ
- `/backend/package.json` ???ˆìŒ

### ???¬ë°”ë¥?Build Command:
```bash
npm --prefix patient-portal install && ...
???œë¸Œ ?”ë ‰? ë¦¬ë¶€???œì‘!
```

---

## ?“‹ ?¤ì • ì²´í¬ë¦¬ìŠ¤??

### Settings ??—???•ì¸:

#### Build & Deploy ?¹ì…˜:
- [ ] **Environment**: `Node` (Docker ??
- [ ] **Build Command**: ë¹„ì›Œ?ê¸° ?ëŠ” `npm --prefix`ë¡??œì‘
- [ ] **Start Command**: ë¹„ì›Œ?ê¸° ?ëŠ” `npm --prefix backend start`
- [ ] **Auto-Deploy**: `Yes`

#### ? ï¸ Build Command ì²??¨ì–´ ?•ì¸:
```
???•ìƒ: npm --prefix patient-portal install
???•ìƒ: [ë¹„ì–´?ˆìŒ]
???¤ë¥˜: npm install && ...
???¤ë¥˜: yarn install
```

---

## ?¯ ?¬ë°”ë¥?ë°°í¬ ë¡œê·¸ ?ˆì‹œ

?¤ì •???œë?ë¡??˜ë©´ ?¤ìŒê³?ê°™ì´ ?œì‹œ?˜ì–´???©ë‹ˆ??

```bash
==> Building...
==> Running build command from render.yaml...

# ?ëŠ” (Dashboard??ì§ì ‘ ?…ë ¥??ê²½ìš°)
==> Running build command 'npm --prefix patient-portal install && ...'

==> npm --prefix patient-portal install
added 1500 packages

==> npm --prefix patient-portal run build
Creating an optimized production build...
Compiled successfully!  ??????ë©”ì‹œì§€ ?„ìˆ˜!

==> npm --prefix admin-dashboard install
added 1500 packages

==> npm --prefix admin-dashboard run build
Creating an optimized production build...
Compiled successfully!  ??????ë©”ì‹œì§€ ?„ìˆ˜!

==> npm --prefix backend install
added 100 packages

==> Build succeeded ?‰

==> Deploying...
==> Running 'npm --prefix backend start'

?œë²„ ?œì‘?? http://localhost:10000
?˜ì ?¬í„¸ ë¹Œë“œ ì¡´ì¬ ?¬ë?: true
ê´€ë¦¬ì ?€?œë³´??ë¹Œë“œ ì¡´ì¬ ?¬ë?: true
MySQL ?°ê²° ?±ê³µ

==> Your service is live ?‰
```

---

## ?” ë¬¸ì œ ì§„ë‹¨

### ë§Œì•½ ?¬ì „??"ENOENT package.json" ?¤ë¥˜ê°€ ?˜ë©´:

#### ?•ì¸ 1: Build Command ë§????•ì¸
```
Settings ??Build & Deploy ??Build Command ë§??ì´:

??npm install  ???´ëŸ¬ë©?????
??npm --prefix ???´ë˜????
??[ë¹„ì–´?ˆìŒ]    ???´ê²ƒ??OK!
```

#### ?•ì¸ 2: Root Directory ?¤ì •
```
Settings ??Build & Deploy ??Root Directory:

??[ë¹„ì–´?ˆìŒ]  ??ë£¨íŠ¸ ?”ë ‰? ë¦¬ ?¬ìš©
??src         ???´ë ‡ê²??˜ì–´ ?ˆìœ¼ë©??? œ!
??backend     ???´ê²ƒ???? œ!
```

#### ?•ì¸ 3: Environment ?•ì¸
```
Settings ??Environment:

??Node
??Docker
```

---

## ?’¡ ?˜ê²½ ë³€?˜ë„ ê¼??…ë ¥!

Buildê°€ ?±ê³µ?´ë„ ?˜ê²½ ë³€?˜ê? ?†ìœ¼ë©??œë²„ê°€ ?œì‘?˜ì? ?ŠìŠµ?ˆë‹¤!

### Environment ??—???…ë ¥:

```
GEMINI_API_KEY = YOUR_GEMINI_API_KEY
DB_HOST = (Aiven MySQL ?¸ìŠ¤??
DB_USER = avnadmin
DB_PASSWORD = (Aiven MySQL ë¹„ë?ë²ˆí˜¸)
```

**Save Changes** ?´ë¦­!

---

## ?¬ ?„ì²´ ì§„í–‰ ?œì„œ (ì²˜ìŒë¶€??

1. ??Settings ??Build & Deploy ??Build Command **ë¹„ìš°ê¸?*
2. ??Settings ??Build & Deploy ??Start Command **ë¹„ìš°ê¸?*
3. ??Settings ??Build & Deploy ??**Save Changes**
4. ??Environment ???˜ê²½ ë³€??4ê°??…ë ¥ ??**Save Changes**
5. ??Manual Deploy ??**Clear build cache & deploy**
6. ?±ï¸ 5-7ë¶??€ê¸?
7. ??Logs ?•ì¸: "Compiled successfully!" Ã— 2
8. ???¹ì‚¬?´íŠ¸ ?‘ì†: https://medical-diagnosis-platform.onrender.com/patient

---

## ?“ ì¶”ê? ?„ì?ë§?

### Aiven MySQL ?•ë³´ ?•ì¸:
1. https://console.aiven.io
2. MySQL ?œë¹„???´ë¦­
3. Overview ??Connection information
4. Host, Password ë³µì‚¬

### Render ?„ì „ ?¬ì„¤??
ë§Œì•½ ??ë°©ë²•?¼ë¡œ?????˜ë©´:
1. Settings ??Delete Web Service
2. ?œë¹„???¬ìƒ??(RENDER_?¬ìƒ??ê°€?´ë“œ.md ì°¸ê³ )
3. ì²˜ìŒë¶€???¬ë°”ë¥´ê²Œ ?¤ì •

---

**?±ï¸ ?ˆìƒ ?Œìš” ?œê°„**: 
- Settings ?˜ì •: 2ë¶?
- ?˜ê²½ ë³€???…ë ¥: 3ë¶?
- ë°°í¬ ?€ê¸? 5-7ë¶?
- **ì´?10-12ë¶?*

**???´ë²ˆ??ë°˜ë“œ???±ê³µ?©ë‹ˆ??**
