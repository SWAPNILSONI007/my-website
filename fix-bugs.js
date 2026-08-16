const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const wishlistCss = `
<style>
/* Wishlist Restored */
.btn-wish { background:none; border:none; cursor:pointer; font-size:1.1rem; padding:6px 8px; transition:all .3s; color:var(--text2); border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; }
.btn-wish:hover { transform:scale(1.2); }
.btn-wish.wished { color:#e74c3c; animation:heartPop .3s cubic-bezier(.4,0,.2,1); }
@keyframes heartPop { 0%{transform:scale(1)} 50%{transform:scale(1.4)} 100%{transform:scale(1.1)} }
.wishlist-toast { position:fixed; bottom:80px; left:50%; transform:translateX(-50%) translateY(20px); background:var(--card); border:1px solid var(--border); padding:10px 20px; border-radius:30px; font-size:.82rem; color:var(--text); box-shadow:0 8px 30px rgba(0,0,0,.15); opacity:0; transition:all .35s; z-index:9999; white-space:nowrap; pointer-events:none; }
.wishlist-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
</style>
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix toggleTheme()
  const oldThemeCode = `  if(h.dataset.theme==='light'){h.dataset.theme='dark';}
  else{h.dataset.theme='light';}
  const icon=h.dataset.theme==='dark'?'☀️':'🌙';`;
  
  const newThemeCode = `  if(h.dataset.theme==='light'){h.dataset.theme='dark';}
  else{h.dataset.theme='light';}
  localStorage.setItem('theme', h.dataset.theme);
  const icon=h.dataset.theme==='dark'?'☀️':'🌙';`;
  
  if (content.includes(oldThemeCode) && !content.includes("localStorage.setItem('theme', h.dataset.theme);")) {
    content = content.replace(oldThemeCode, newThemeCode);
    changed = true;
  }

  // 2. Fix top nav Wishlist button
  const oldWishBtn = /<a href="\/shop" class="nav-icon-btn" title="Wishlist"(.*?)><span class="nav-icon-symbol">♡<\/span><span class="nav-icon-label">Wishlist<\/span><\/a>/g;
  if (oldWishBtn.test(content)) {
    content = content.replace(oldWishBtn, '<a href="#" class="nav-icon-btn" title="Wishlist"$1 onclick="openWishlistDrawer();return false;"><span class="nav-icon-symbol">♡</span><span class="nav-icon-label">Wishlist</span><span class="cart-badge wishlist-badge" id="wishlistCount" style="background:#e74c3c;display:none;">0</span></a>');
    changed = true;
  }

  // 3. Inject missing wishlist CSS
  if (!content.includes('.btn-wish {') && content.includes('</head>')) {
    content = content.replace('</head>', wishlistCss + '\n</head>');
    changed = true;
  }
  
  // 4. Ensure wishlist HTML drawer exists if not present
  // The drawer HTML was removed from some files maybe? Actually it's present in index and shop. Let's just make sure we save changes if any.
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

walkDir(publicDir);
