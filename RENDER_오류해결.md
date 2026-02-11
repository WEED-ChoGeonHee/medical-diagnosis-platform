# ?š¨ Render ë°°í¬ ?¤ë¥˜ ?´ê²° (ê¸´ê¸‰)

## ???„ì¬ ë¬¸ì œ

ë¡œê·¸ ë¶„ì„:
```
==> Running 'yarn'  ??Renderê°€ yarn ?¤í–‰ (?˜ëª»??)
==> Application exited early  ???œë²„ ?œì‘ ?¤íŒ¨
==> No open ports detected  ???¬íŠ¸ ?´ë¦¬ì§€ ?ŠìŒ
```

**?ì¸**: 
1. Renderê°€ `render.yaml`??ë¬´ì‹œ?˜ê³  ê¸°ë³¸ ?¤ì • ?¬ìš©
2. Build Commandê°€ ë¹„ì–´?ˆì? ?Šê±°???˜ëª» ?¤ì •??
3. ?„ë¡ ?¸ì—”??ë¹Œë“œê°€ ?¤í–‰?˜ì? ?ŠìŒ
4. ?˜ê²½ ë³€??ë¯¸ì…??

---

## ???´ê²° ë°©ë²• (5ë¶?

### 1?¨ê³„: Settings ???•ì¸ ? ï¸

#### Render Dashboard ??medical-diagnosis-backend ??Settings

#### ?“ Build & Deploy ?¹ì…˜?ì„œ:

##### ??Build Command ?•ì¸:
**?„ì¬ ?íƒœ ?•ì¸**: ë¹„ì–´?ˆì? ?Šìœ¼ë©?ë¬¸ì œ!

**?¬ë°”ë¥??¤ì • 2ê°€ì§€ ë°©ë²•**:

**ë°©ë²• A: ë¹„ì›Œ?ê¸° (ì¶”ì²œ)** ??
```
Build Command: [ë¹„ì›Œ?ê¸° - render.yaml ?¬ìš©]
```

**ë°©ë²• B: ëª…ì‹œ???…ë ¥**
```
Build Command:
npm --prefix patient-portal install && npm --prefix patient-portal run build && npm --prefix admin-dashboard install && npm --prefix admin-dashboard run build && npm --prefix backend install
```

? ï¸ **ì£¼ì˜**: `npm install`??ë§??ì— ?£ìœ¼ë©????©ë‹ˆ?? (ë£¨íŠ¸??package.json???†ìŒ)

##### ??Start Command ?•ì¸:
**?„ì¬ ?íƒœ ?•ì¸**: `yarn start` ?ëŠ” ?¤ë¥¸ ê°’ì´ ?ˆìœ¼ë©?ë¬¸ì œ!

**?¬ë°”ë¥??¤ì •**:
```
Start Command: npm --prefix backend start
```
?ëŠ”
```
Start Command: [ë¹„ì›Œ?ê¸° - render.yaml ?¬ìš©]
```

##### ??Auto-Deploy:
```
??Yes (?œì„±??
```

---

### 2?¨ê³„: Environment ?•ì¸

#### Environment ?¹ì…˜?ì„œ:
```
Environment: Node  ??ë°˜ë“œ??"Node"?¬ì•¼ ??
```

**Dockerë¡??˜ì–´ ?ˆìœ¼ë©?*: 
1. Edit Configuration ?´ë¦­
2. Environmentë¥?`Node`ë¡?ë³€ê²?
3. Update Web Service ?´ë¦­

---

### 3?¨ê³„: ?˜ê²½ ë³€???…ë ¥ (Environment ??

#### medical-diagnosis-backend ??Environment ??

**?„ìˆ˜ 4ê°?ë³€??*:

```
GEMINI_API_KEY = YOUR_GEMINI_API_KEY
DB_HOST = (Aiven MySQL ?¸ìŠ¤??
DB_USER = avnadmin
DB_PASSWORD = (Aiven MySQL ë¹„ë?ë²ˆí˜¸)
```

#### ?…ë ¥ ë°©ë²•:
1. **Add Environment Variable** ë²„íŠ¼ ?´ë¦­
2. Key/Value ?…ë ¥
3. **Add** ?´ë¦­
4. 4ê°?ëª¨ë‘ ?…ë ¥ ??**Save Changes** ?´ë¦­

---

### 4?¨ê³„: Manual Deploy ??—???¬ë°°??

#### Settings ë³€ê²???

1. **Manual Deploy** ???´ë¦­
2. **Clear build cache & deploy** ? íƒ â­?
3. **Deploy** ë²„íŠ¼ ?´ë¦­

? ï¸ **ì¤‘ìš”**: Clear build cacheë¥?? íƒ?´ì•¼ ?´ì „ ?¤ì •???„ì „??ì´ˆê¸°?”ë¨!

---

## ?“‹ ?¬ë°”ë¥?ë°°í¬ ë¡œê·¸ ?ˆì‹œ

?¤ì •???œë?ë¡??˜ë©´ ?¤ìŒê³?ê°™ì´ ?˜í??˜ì•¼ ??

```bash
==> Building...
==> Running build command from render.yaml...

# npm install (ë£¨íŠ¸)
added 1 packages

# npm --prefix patient-portal install
added 1500 packages

# npm --prefix patient-portal run build
Creating an optimized production build...
Compiled successfully!  ????ë©”ì‹œì§€ ?„ìˆ˜!
Build folder ready.

# npm --prefix admin-dashboard install
added 1500 packages

# npm --prefix admin-dashboard run build
Creating an optimized production build...
Compiled successfully!  ????ë©”ì‹œì§€ ?„ìˆ˜!
Build folder ready.

# npm --prefix backend install
added 100 packages

==> Build succeeded!

==> Deploying...
==> Running 'npm --prefix backend start'

?œë²„ ?œì‘?? http://localhost:10000  ???œë²„ ?œì‘
?˜ì ?¬í„¸ ë¹Œë“œ ì¡´ì¬ ?¬ë?: true  ??ë¹Œë“œ ?•ì¸
ê´€ë¦¬ì ?€?œë³´??ë¹Œë“œ ì¡´ì¬ ?¬ë?: true  ??ë¹Œë“œ ?•ì¸
MySQL ?°ê²° ?±ê³µ  ??DB ?°ê²°

==> Your service is live ?‰
```

---

## ?” ?„ì¬ vs ?¬ë°”ë¥??¤ì • ë¹„êµ

### ???„ì¬ (?˜ëª»??ë¡œê·¸):
```
==> Running 'yarn'  ??yarn ?¤í–‰ (?˜ëª»??
==> Application exited early  ???œë²„ ?¤íŒ¨
```

### ???¬ë°”ë¥?ë¡œê·¸:
```
==> Running build command from render.yaml...
==> npm --prefix patient-portal run build
Compiled successfully!  ???„ë¡ ?¸ì—”??ë¹Œë“œ
==> npm --prefix admin-dashboard run build
Compiled successfully!  ???„ë¡ ?¸ì—”??ë¹Œë“œ
==> Running 'npm --prefix backend start'
?œë²„ ?œì‘?? http://localhost:10000  ???œë²„ ?œì‘
MySQL ?°ê²° ?±ê³µ  ??DB ?°ê²°
```

---

## ?¯ ì²´í¬ë¦¬ìŠ¤??

### Settings ??
- [ ] Environment: `Node` (Docker ??
- [ ] Build Command: ë¹„ì›Œ?ê¸° ?ëŠ” npm ëª…ë ¹??
- [ ] Start Command: `npm --prefix backend start` ?ëŠ” ë¹„ì›Œ?ê¸°
- [ ] Auto-Deploy: Yes

### Environment ??
- [ ] GEMINI_API_KEY ?…ë ¥
- [ ] DB_HOST ?…ë ¥
- [ ] DB_USER ?…ë ¥
- [ ] DB_PASSWORD ?…ë ¥
- [ ] Save Changes ?´ë¦­

### Manual Deploy:
- [ ] Clear build cache & deploy ? íƒ
- [ ] Deploy ë²„íŠ¼ ?´ë¦­

### ë°°í¬ ?±ê³µ ?•ì¸:
- [ ] Logs??"Compiled successfully!" 2ë²??œì‹œ
- [ ] Logs??"?œë²„ ?œì‘?? ?œì‹œ
- [ ] Logs??"MySQL ?°ê²° ?±ê³µ" ?œì‹œ
- [ ] Events ??— "Deploy live" (ì´ˆë¡??

---

## ?’¡ ë¬¸ì œ ?´ê²° ??

### ë¬¸ì œ: Settings?ì„œ Build Commandë¥?ë¹„ì› ?”ë°??yarn ?¤í–‰

**?´ê²°**:
1. Settings ??Build & Deploy
2. **Override build command** ì²´í¬ë°•ìŠ¤ ?•ì¸
3. ì²´í¬ ?´ì œ?˜ê±°?? ëª…ì‹œ?ìœ¼ë¡?npm ëª…ë ¹???…ë ¥

### ë¬¸ì œ: render.yaml???¸ì‹ ????

**?´ê²°**:
1. GitHub ?€?¥ì†Œ?ì„œ `render.yaml` ?Œì¼??ë£¨íŠ¸???ˆëŠ”ì§€ ?•ì¸
2. ?Œì¼ëª??€?Œë¬¸???•ì¸ (`render.yaml` ?? `Render.yaml` ??
3. Settings?ì„œ Branchê°€ `master`ë¡??˜ì–´ ?ˆëŠ”ì§€ ?•ì¸

### ë¬¸ì œ: ?˜ê²½ ë³€???…ë ¥?ˆëŠ”?°ë„ "Application exited early"

**?•ì¸**:
1. Environment ??—??4ê°?ë³€??ëª¨ë‘ ?…ë ¥?˜ì—ˆ?”ì?
2. DB_HOST???¬íŠ¸ ë²ˆí˜¸(`:25060`) ?¬í•¨ ???ˆëŠ”ì§€
3. Aiven MySQL ?œë¹„?¤ê? ?œì„±??Running) ?íƒœ?¸ì?
4. Logs?ì„œ ?•í™•???ëŸ¬ ë©”ì‹œì§€ ?•ì¸

---

## ?? ë¹ ë¥¸ ?¬ì„¤??(ê°€???•ì‹¤??ë°©ë²•)

ë§Œì•½ ??ë°©ë²•?¼ë¡œ?????˜ë©´:

### ?œë¹„???? œ ???¬ìƒ??

1. **Settings** ???˜ì´ì§€ ?˜ë‹¨ ??**Delete Web Service**
2. **New +** ??**Web Service**
3. ?€?¥ì†Œ ?°ê²°: `WEED-ChoGeonHee/medical-diagnosis-platform`
4. ?¤ì •:
   - Environment: `Node` ??
   - Build Command: **?„ì „??ë¹„ì›Œ?ê¸°**
   - Start Command: **?„ì „??ë¹„ì›Œ?ê¸°**
5. ?˜ê²½ ë³€??4ê°??…ë ¥
6. Create Web Service ?´ë¦­

---

**?±ï¸ ?ˆìƒ ?Œìš” ?œê°„**: 
- Settings ?˜ì •: 2ë¶?
- ?˜ê²½ ë³€???…ë ¥: 3ë¶?
- ?¬ë°°???€ê¸? 3-5ë¶?
- **ì´?10ë¶?*
