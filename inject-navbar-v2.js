/**
 * inject-navbar-v2.js
 * Transforms single-row navbar → multi-row GIVA-inspired layout
 * across all HTML files in public/.
 *
 * Run: node inject-navbar-v2.js
 */
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

function getActivePage(fn) {
  const map = {
    'index.html':'','shop.html':'shop','product.html':'shop',
    'flash-sale.html':'sale','about.html':'about',
    'custom-design.html':'custom','contact.html':'contact',
  };
  return map[fn] || '';
}

/* ─── CSS Override (appended before </style>) ─── */
const navCSSOverride = `
/* ====== NAV V2 — Multi-Row Premium ====== */
nav{position:fixed;top:26px;width:100%;z-index:1000;background:var(--nav-bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border);display:flex;flex-direction:column;height:auto;padding:0;gap:0;align-items:stretch;transition:all .4s cubic-bezier(.4,0,.2,1);}
nav.scrolled{height:auto;box-shadow:0 4px 30px var(--shadow);}
nav.nav-hidden{transform:translateY(-100%);}

/* — Main Row — */
.nav-main-row{display:flex;align-items:center;justify-content:space-between;padding:0 5%;height:56px;gap:1rem;}
.logo{font-family:'Playfair Display',serif;font-size:1.55rem;font-weight:400;color:var(--text);text-decoration:none;letter-spacing:.05em;flex-shrink:0;transition:all .3s;}
.logo:hover{opacity:.8;}
.logo span{color:var(--silver);font-style:italic;}

/* — Search — */
.nav-search{flex:1;max-width:480px;position:relative;margin:0 auto;}
.nav-search-input{width:100%;background:var(--bg2);border:1px solid var(--border);padding:9px 40px 9px 16px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.85rem;outline:none;transition:all .3s;border-radius:4px;}
.nav-search-input:focus{border-color:var(--gold-accent);box-shadow:0 0 0 3px rgba(201,168,76,0.1);}
.nav-search-input::placeholder{color:var(--text2);}
.nav-search-btn{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text2);cursor:pointer;font-size:1rem;padding:4px;transition:color .3s;}
.nav-search-btn:hover{color:var(--text);}

/* — Icon Buttons — */
.nav-right{display:flex;align-items:center;gap:.15rem;flex-shrink:0;}
.nav-icon-btn{display:flex;flex-direction:column;align-items:center;gap:1px;background:none;border:none;cursor:pointer;color:var(--text2);text-decoration:none;padding:4px 10px;transition:all .3s;position:relative;font-family:'DM Sans',sans-serif;}
.nav-icon-btn:hover{color:var(--text);}
.nav-icon-symbol{font-size:1.15rem;line-height:1;}
.nav-icon-label{font-size:.52rem;letter-spacing:.06em;text-transform:uppercase;line-height:1.2;}
.nav-icon-btn .cart-badge{position:absolute;top:-2px;right:2px;background:var(--gold-accent);color:#fff;border-radius:50%;width:16px;height:16px;font-size:.55rem;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;font-weight:600;}

/* — Theme / Hamburger — */
.theme-toggle{background:none;border:1px solid var(--border);width:34px;height:34px;cursor:pointer;font-size:.9rem;display:flex;align-items:center;justify-content:center;color:var(--text2);transition:all .3s;border-radius:50%;padding:0;flex-shrink:0;}
.theme-toggle:hover{border-color:var(--gold-accent);color:var(--text);transform:rotate(20deg);}
.hamburger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;cursor:pointer;background:none;border:1px solid var(--border);border-radius:50%;width:34px;height:34px;padding:0;transition:all .3s;flex-shrink:0;}
.hamburger:hover{border-color:var(--gold-accent);}
.hamburger span{display:block;width:16px;height:1.5px;background:var(--text);transition:all .35s cubic-bezier(.4,0,.2,1);transform-origin:center;}
.hamburger.active span:nth-child(1){transform:rotate(45deg) translate(4.5px,4.5px);}
.hamburger.active span:nth-child(2){opacity:0;transform:scaleX(0);}
.hamburger.active span:nth-child(3){transform:rotate(-45deg) translate(4.5px,-4.5px);}

/* — Secondary Nav Row — */
.nav-secondary-row{border-top:1px solid var(--border);padding:0 5%;display:flex;align-items:center;justify-content:center;height:36px;}
.nav-links{display:flex;gap:0;list-style:none;flex:initial;justify-content:center;align-items:center;}
.nav-links li{position:relative;}
.nav-links a{text-decoration:none;color:var(--text2);font-size:.73rem;letter-spacing:.1em;text-transform:uppercase;padding:.35rem .85rem;display:block;transition:color .3s;white-space:nowrap;position:relative;}
.nav-links > li > a::after{content:'';position:absolute;bottom:0;left:50%;width:0;height:1.5px;background:var(--gold-accent);transition:all .35s cubic-bezier(.4,0,.2,1);transform:translateX(-50%);}
.nav-links > li > a:hover::after,.nav-links > li > a.active::after{width:60%;}
.nav-links a:hover,.nav-links a.active{color:var(--text);}

/* — Dropdown — */
.dropdown{position:relative;}
.dropdown-menu{position:absolute;top:100%;left:-10px;background:var(--card);border:1px solid var(--border);min-width:200px;opacity:0;pointer-events:none;transform:translateY(-10px);transition:all .3s cubic-bezier(.4,0,.2,1);z-index:100;box-shadow:0 12px 40px var(--shadow);border-radius:4px;overflow:hidden;}
.dropdown:hover .dropdown-menu{opacity:1;pointer-events:all;transform:translateY(0);}
.dropdown-menu a{display:block;padding:.75rem 1.25rem;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text2);text-decoration:none;border-bottom:1px solid var(--border);transition:all .25s;}
.dropdown-menu a:last-child{border-bottom:none;}
.dropdown-menu a:hover{color:var(--text);background:var(--bg2);padding-left:1.6rem;}
.coming-soon-tag{font-size:.55rem;background:var(--border);color:var(--text2);padding:2px 5px;border-radius:2px;margin-left:5px;vertical-align:middle;}

/* — Category Pill Tabs — */
.nav-category-tabs{border-top:1px solid var(--border);padding:0 5%;display:flex;align-items:center;justify-content:center;height:40px;gap:.5rem;}
.cat-tab{text-decoration:none;font-family:'DM Sans',sans-serif;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;padding:5px 24px;border-radius:20px;border:1px solid var(--border);color:var(--text2);transition:all .3s;white-space:nowrap;}
.cat-tab:hover{border-color:var(--gold-accent);color:var(--text);}
.cat-tab.active{background:var(--text);border-color:var(--text);color:var(--bg);font-weight:500;}
.cat-tab.disabled{opacity:.45;pointer-events:none;}

/* — Content padding for taller nav — */
.hero{padding-top:180px;}
.page-header{padding-top:180px;}

/* — Mobile — */
@media(max-width:768px){
nav{padding:0;gap:0;justify-content:flex-start;flex-direction:column;align-items:stretch;height:auto;}
.nav-main-row{padding:0 4%;gap:.5rem;height:52px;}
.nav-main-row .nav-search{display:none;}
.nav-secondary-row{display:none;}
.nav-category-tabs{display:none;}
.nav-icon-btn .nav-icon-label{display:none;}
.nav-icon-btn{padding:4px 6px;}
.nav-icon-symbol{font-size:1.05rem;}
.logo{font-size:1.3rem;}
.hamburger{display:flex;}
.nav-right{gap:.1rem;}
.theme-toggle,.hamburger{width:32px;height:32px;}
.dropdown-menu{display:none;}
.hero{padding-top:80px;}
.page-header{padding-top:80px;}
}
`;

/* ─── Nav HTML generator ─── */
function getNavHTML(activePage) {
  const cl = p => activePage === p ? ' class="active"' : '';
  return `<!-- NAV V2 -->
<nav id="mainNav">
  <div class="nav-main-row">
    <a href="/" class="logo">Silviyara <span>Jewels</span></a>
    <div class="nav-search">
      <input type="text" class="nav-search-input" placeholder='Search "Pendants"' id="navSearchInput" autocomplete="off" onkeydown="if(event.key==='Enter'){event.preventDefault();var q=this.value.trim();if(q)window.location.href='/shop?search='+encodeURIComponent(q);}" />
      <button class="nav-search-btn" onclick="var q=document.getElementById('navSearchInput').value.trim();if(q)window.location.href='/shop?search='+encodeURIComponent(q);">🔍</button>
    </div>
    <div class="nav-right">
      <a href="/track" class="nav-icon-btn" title="Track Order"><span class="nav-icon-symbol">📍</span><span class="nav-icon-label">Track</span></a>
      <a href="#" class="nav-icon-btn" id="accountBtn" title="My Account" style="text-decoration:none;"><span class="nav-icon-symbol">👤</span><span class="nav-icon-label">Account</span></a>
      <a href="/shop" class="nav-icon-btn" title="Wishlist" style="text-decoration:none;"><span class="nav-icon-symbol">♡</span><span class="nav-icon-label">Wishlist</span></a>
      <button class="nav-icon-btn" onclick="openCart()" title="Cart"><span class="nav-icon-symbol">🛒</span><span class="nav-icon-label">Cart</span><span class="cart-badge" id="cartCount">0</span></button>
      <button class="theme-toggle" onclick="toggleTheme()" id="themeBtn">🌙</button>
      <button class="hamburger" id="hamburgerBtn" onclick="toggleMobileDrawer()"><span></span><span></span><span></span></button>
    </div>
  </div>
  <div class="nav-secondary-row">
    <ul class="nav-links">
      <li class="dropdown"><a href="#">Shop by Category ▾</a>
        <div class="dropdown-menu">
          <a href="/shop?cat=pendant">Pendant</a>
          <a href="/shop?cat=ear-jewellery">Ear Jewellery</a>
          <a href="/shop?cat=rings">Rings</a>
          <a href="/shop?cat=anklets">Anklets</a>
          <a href="/shop?cat=bracelets">Bracelets</a>
          <a href="/shop?cat=necklaces">Necklaces</a>
          <a href="/shop?cat=hair-accessories">Hair Accessories</a>
        </div>
      </li>
      <li><a href="/shop"${cl('shop')}>Shop All</a></li>
      <li><a href="/flash-sale"${cl('sale')}>Flash Sale ⚡</a></li>
      <li><a href="/custom-design"${cl('custom')}>Custom Design</a></li>
      <li><a href="/about"${cl('about')}>About</a></li>
      <li><a href="#" onclick="openContactModal();return false;"${cl('contact')}>Contact</a></li>
    </ul>
  </div>
  <div class="nav-category-tabs">
    <a href="/shop?cat=silver" class="cat-tab active">Silver Jewellery</a>
    <a href="#" class="cat-tab disabled">Gold Jewellery <span class="coming-soon-tag">Soon</span></a>
    <a href="/shop" class="cat-tab">All Collections</a>
  </div>
</nav>`;
}

/* ─── Mobile Drawer HTML ─── */
const mobileDrawerHTML = `<!-- Mobile Drawer -->
<div class="mobile-drawer-overlay" id="mobileOverlay" onclick="closeMobileDrawer()"></div>
<div class="mobile-drawer" id="mobileDrawer">
  <div class="mobile-drawer-head">
    <h3>Menu</h3>
    <button class="mobile-drawer-close" onclick="closeMobileDrawer()">✕</button>
  </div>
  <div class="mobile-drawer-body">
    <div style="padding:.75rem 1.5rem 1rem;">
      <div class="nav-search" style="max-width:100%;display:block;">
        <input type="text" class="nav-search-input" placeholder="Search jewellery..." style="width:100%;" onkeydown="if(event.key==='Enter'){event.preventDefault();var q=this.value.trim();if(q)window.location.href='/shop?search='+encodeURIComponent(q);}" />
        <button class="nav-search-btn" onclick="var q=this.previousElementSibling.value.trim();if(q)window.location.href='/shop?search='+encodeURIComponent(q);">🔍</button>
      </div>
    </div>
    <a href="/" class="mobile-nav-item" style="color:var(--text);font-weight:500;">🏠 Home</a>
    <a href="/shop" class="mobile-nav-item">Shop All</a>
    <div class="mobile-nav-divider">Collections</div>
    <a href="/shop?cat=pendant" class="mobile-nav-item">Pendant</a>
    <a href="/shop?cat=ear-jewellery" class="mobile-nav-item">Ear Jewellery</a>
    <a href="/shop?cat=rings" class="mobile-nav-item">Rings</a>
    <a href="/shop?cat=anklets" class="mobile-nav-item">Anklets</a>
    <a href="/shop?cat=bracelets" class="mobile-nav-item">Bracelets</a>
    <a href="/shop?cat=necklaces" class="mobile-nav-item">Necklaces</a>
    <a href="/shop?cat=hair-accessories" class="mobile-nav-item">Hair Accessories</a>
    <div class="mobile-nav-divider">More</div>
    <a href="/flash-sale" class="mobile-nav-item">Flash Sale ⚡</a>
    <a href="/custom-design" class="mobile-nav-item">Custom Design 🎨</a>
    <a href="/about" class="mobile-nav-item">About</a>
    <a href="#" onclick="openContactModal();closeMobileDrawer();return false;" class="mobile-nav-item">Contact</a>
    <a href="/track" class="mobile-nav-item">Track Order 📍</a>
    <div class="mobile-nav-divider">Category</div>
    <a href="/shop?cat=silver" class="mobile-nav-item" style="color:var(--gold-accent);">✦ Silver Jewellery</a>
    <a href="#" class="mobile-nav-item" style="opacity:.45;">Gold Jewellery (Coming Soon)</a>
  </div>
  <div class="mobile-drawer-foot">
    <button class="theme-toggle" onclick="toggleTheme()" id="themeBtn2">🌙</button>
  </div>
</div>`;


/* ══════════════════════════════════════════
   MAIN  –  Process every HTML file
   ══════════════════════════════════════════ */
let updated = 0, skipped = 0;

htmlFiles.forEach(filename => {
  const filePath = path.join(publicDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('id="mainNav"')) {
    console.log(`  ⏭  ${filename} (no nav)`);
    skipped++;
    return;
  }

  const activePage = getActivePage(filename);

  // 1 ── Normalize gold variable (add --gold-accent where only --gold exists)
  if (!content.includes('--gold-accent')) {
    content = content.replace(/--gold:(#[a-fA-F0-9]+);/g, '--gold:$1;--gold-accent:$1;');
  }

  // 2 ── Inject CSS override before first </style>
  if (content.includes('/* ====== NAV V2 — Multi-Row Premium ====== */')) {
    content = content.replace(/\/\* ====== NAV V2 — Multi-Row Premium ====== \*\/[\s\S]*?(?=<\/style>)/, navCSSOverride + '\n');
  } else {
    content = content.replace('</style>', navCSSOverride + '\n</style>');
  }

  // 3 ── Replace <nav> block
  content = content.replace(
    /(?:<!--\s*NAV(?:\s*V2)?\s*-->\s*)?<nav id="mainNav">[\s\S]*?<\/nav>/,
    getNavHTML(activePage)
  );

  // 4 ── Replace mobile drawer (overlay + drawer)
  content = content.replace(
    /(?:<!--\s*Mobile Drawer\s*-->\s*)?<div class="mobile-drawer-overlay" id="mobileOverlay"[\s\S]*?class="mobile-drawer-foot"[\s\S]*?<\/div>\s*<\/div>/,
    mobileDrawerHTML
  );

  fs.writeFileSync(filePath, content);
  console.log(`  ✅  ${filename}`);
  updated++;
});

console.log(`\n🎉  Nav V2 done — ${updated} updated, ${skipped} skipped`);
