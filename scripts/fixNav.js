const fs = require('fs');
const path = require('path');

const cssToReplace = `/* NAV — Premium */
nav{position:fixed;top:0;width:100%;z-index:1000;background:var(--nav-bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border);height:72px;display:flex;align-items:center;padding:0 8% 0 5%;gap:2rem;transition:all .4s cubic-bezier(.4,0,.2,1);}
nav.scrolled{height:60px;box-shadow:0 4px 30px var(--shadow);}
nav.nav-hidden{transform:translateY(-100%);}
.logo{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:400;color:var(--text);text-decoration:none;letter-spacing:.05em;flex-shrink:0;transition:all .3s;}
.logo:hover{opacity:.8;}
.logo span{color:var(--silver);font-style:italic;}
.nav-links{display:flex;gap:.15rem;list-style:none;flex:1;justify-content:center;align-items:center;}
.nav-links a{text-decoration:none;color:var(--text2);font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;padding:.5rem 1rem;display:block;transition:color .3s;white-space:nowrap;position:relative;}
.nav-links > li > a::after{content:'';position:absolute;bottom:2px;left:50%;width:0;height:1.5px;background:var(--gold);transition:all .35s cubic-bezier(.4,0,.2,1);transform:translateX(-50%);}
.nav-links > li > a:hover::after,.nav-links > li > a.active::after{width:60%;}
.nav-links a:hover,.nav-links a.active{color:var(--text);}
.dropdown{position:relative;}
.dropdown-menu{position:absolute;top:100%;left:-10px;background:var(--card);border:1px solid var(--border);min-width:200px;opacity:0;pointer-events:none;transform:translateY(-10px);transition:all .3s cubic-bezier(.4,0,.2,1);z-index:100;box-shadow:0 12px 40px var(--shadow);border-radius:4px;overflow:hidden;}
.dropdown:hover .dropdown-menu{opacity:1;pointer-events:all;transform:translateY(0);}
.dropdown-menu a{display:block;padding:.75rem 1.25rem;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text2);text-decoration:none;border-bottom:1px solid var(--border);transition:all .25s;}
.dropdown-menu a:last-child{border-bottom:none;}
.dropdown-menu a:hover{color:var(--text);background:var(--bg2);padding-left:1.6rem;}
.coming-soon-tag{font-size:.55rem;background:var(--border);color:var(--text2);padding:2px 5px;border-radius:2px;margin-left:5px;}
.nav-right{display:flex;align-items:center;gap:.6rem;flex-shrink:0;}
.theme-toggle{background:none;border:1px solid var(--border);width:38px;height:38px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;color:var(--text2);transition:all .3s;border-radius:50%;}
.theme-toggle:hover{border-color:var(--gold);color:var(--text);transform:rotate(20deg);}
.cart-btn{position:relative;background:none;border:1px solid var(--border);cursor:pointer;color:var(--text);font-size:1rem;padding:7px 10px;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;transition:all .3s;}
.cart-btn:hover{border-color:var(--gold);}
.cart-badge{position:absolute;top:-4px;right:-4px;background:var(--gold);color:#fff;border-radius:50%;width:18px;height:18px;font-size:.6rem;display:flex;align-items:center;justify-content:center;font-weight:500;}
.hamburger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;cursor:pointer;background:none;border:1px solid var(--border);border-radius:50%;width:38px;height:38px;padding:0;transition:all .3s;}
.hamburger:hover{border-color:var(--gold);}
.hamburger span{display:block;width:18px;height:1.5px;background:var(--text);transition:all .35s cubic-bezier(.4,0,.2,1);transform-origin:center;}
.hamburger.active span:nth-child(1){transform:rotate(45deg) translate(4.5px,4.5px);}
.hamburger.active span:nth-child(2){opacity:0;transform:scaleX(0);}
.hamburger.active span:nth-child(3){transform:rotate(-45deg) translate(4.5px,-4.5px);}

/* MOBILE DRAWER */
.mobile-drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1500;opacity:0;pointer-events:none;transition:opacity .35s;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}
.mobile-drawer-overlay.open{opacity:1;pointer-events:all;}
.mobile-drawer{position:fixed;top:0;right:-320px;width:300px;max-width:85vw;height:100vh;background:var(--card);z-index:1501;transition:right .4s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;border-left:1px solid var(--border);box-shadow:-8px 0 30px rgba(0,0,0,.1);}
.mobile-drawer.open{right:0;}
.mobile-drawer-head{display:flex;justify-content:space-between;align-items:center;padding:1.5rem;border-bottom:1px solid var(--border);}
.mobile-drawer-head h3{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:400;}
.mobile-drawer-close{background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text);width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .2s;}
.mobile-drawer-close:hover{background:var(--bg2);}
.mobile-drawer-body{flex:1;overflow-y:auto;padding:1rem 0;}
.mobile-nav-item{display:block;text-decoration:none;color:var(--text2);font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;padding:.9rem 1.5rem;border-bottom:1px solid var(--border);transition:all .2s;}
.mobile-nav-item:hover,.mobile-nav-item.active{color:var(--text);background:var(--bg2);padding-left:2rem;}
.mobile-nav-divider{padding:.75rem 1.5rem .5rem;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--silver);}
.mobile-drawer-foot{padding:1.25rem 1.5rem;border-top:1px solid var(--border);display:flex;gap:.75rem;}
.mobile-drawer-foot .theme-toggle{width:42px;height:42px;font-size:1.1rem;}
`;

const getHtmlToReplace = (activePage) => `
<nav id="mainNav">
  <a href="/" class="logo">Navyra <span>Jewellers</span></a>
  <ul class="nav-links">
    <li class="dropdown"><a href="#">Collections ▾</a>
      <div class="dropdown-menu">
        <a href="/shop?cat=pendant">Pendant</a>
        <a href="/shop?cat=ear-jewellery">Ear Jewellery</a>
        <a href="/shop?cat=rings">Rings</a>
        <a href="/shop?cat=anklets">Anklets</a>
        <a href="/shop?cat=bracelets">Bracelets</a>
        <a href="/shop?cat=necklaces">Necklaces</a>
        <a href="/shop?cat=hair-accessories">Hair Accessories</a>
        <a href="#">Gold <span class="coming-soon-tag">Soon</span></a>
      </div>
    </li>
    <li><a href="/shop" class="${activePage==='Shop'?'active':''}">Shop</a></li>
    <li><a href="/flash-sale" class="${activePage==='Sale ⚡'?'active':''}">Sale ⚡</a></li>
    <li><a href="/about" class="${activePage==='About'?'active':''}">About</a></li>
    <li><a href="/contact" class="${activePage==='Contact'?'active':''}">Contact</a></li>
  </ul>
  <div class="nav-right">
    <button class="theme-toggle" onclick="toggleTheme()" id="themeBtn">🌙</button>
    <button class="cart-btn" onclick="openCart()">🛒 <span class="cart-badge" id="cartCount">0</span></button>
    <button class="hamburger" id="hamburgerBtn" onclick="toggleMobileDrawer()"><span></span><span></span><span></span></button>
  </div>
</nav>

<div class="mobile-drawer-overlay" id="mobileOverlay" onclick="closeMobileDrawer()"></div>
<div class="mobile-drawer" id="mobileDrawer">
  <div class="mobile-drawer-head"><h3>Menu</h3><button class="mobile-drawer-close" onclick="closeMobileDrawer()">✕</button></div>
  <div class="mobile-drawer-body">
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
    <a href="/flash-sale" class="mobile-nav-item ${activePage==='Sale ⚡'?'active':''}">Flash Sale ⚡</a>
    <a href="/about" class="mobile-nav-item ${activePage==='About'?'active':''}">About</a>
    <a href="/contact" class="mobile-nav-item ${activePage==='Contact'?'active':''}">Contact</a>
  </div>
  <div class="mobile-drawer-foot"><button class="theme-toggle" onclick="toggleTheme()" id="themeBtn2">🌙</button></div>
</div>
`;

const jsToReplace = `function toggleTheme(){
  const h=document.documentElement;
  const newTheme = h.dataset.theme === 'light' ? 'dark' : 'light';
  h.dataset.theme = newTheme;
  localStorage.setItem('theme', newTheme);
  const icon = newTheme === 'dark' ? '☀️' : '🌙';
  document.querySelectorAll('.theme-toggle').forEach(b=>b.textContent=icon);
}
function toggleMobileDrawer(){
  const d=document.getElementById('mobileDrawer'),o=document.getElementById('mobileOverlay'),h=document.getElementById('hamburgerBtn');
  if(d.classList.contains('open')){closeMobileDrawer();}else{d.classList.add('open');o.classList.add('open');h.classList.add('active');document.body.style.overflow='hidden';}
}
function closeMobileDrawer(){
  const d=document.getElementById('mobileDrawer'),o=document.getElementById('mobileOverlay'),h=document.getElementById('hamburgerBtn');
  if(d) d.classList.remove('open');
  if(o) o.classList.remove('open');
  if(h) h.classList.remove('active');
  document.body.style.overflow='';
}
let lastScroll=0;
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('mainNav');
  if(!nav) return;
  const st=window.scrollY;
  if(st>60)nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
  if(st>400&&st>lastScroll)nav.classList.add('nav-hidden');
  else nav.classList.remove('nav-hidden');
  lastScroll=st;
});`;

const localStorageScript = `<body>
<script>
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;
  document.addEventListener('DOMContentLoaded', () => {
    const icon = savedTheme === 'dark' ? '☀️' : '🌙';
    document.querySelectorAll('.theme-toggle').forEach(b => b.textContent = icon);
  });
</script>`;

const pages = [
  { file: 'public/product.html', activePage: '' },
  { file: 'public/about.html', activePage: 'About' },
  { file: 'public/contact.html', activePage: 'Contact' }
];

pages.forEach(p => {
  const fp = path.join(__dirname, p.file);
  let content = fs.readFileSync(fp, 'utf8');

  // Replace CSS
  content = content.replace(/nav\{position:fixed;top:0;width:100%[\s\S]*?\.hamburger span[^}]+}/, cssToReplace);

  // Replace HTML
  content = content.replace(/<nav>[\s\S]*?<\/nav>/, getHtmlToReplace(p.activePage));
  content = content.replace(/<div class="mobile-menu"[\s\S]*?<\/div>\s*<\/div>|<div class="mobile-menu"[\s\S]*?<\/div>\s*</, '');

  if (!content.includes("localStorage.getItem('theme')")) {
    content = content.replace(/<body>/, localStorageScript);
  }

  if (content.includes('function toggleTheme()')) {
    content = content.replace(/function toggleTheme\(\)\{[\s\S]*?(?=(function |<\/script>))/, jsToReplace + '\n');
  } else {
    content = content.replace(/<\/body>/, '<script>\n' + jsToReplace + '\n</script>\n</body>');
  }

  fs.writeFileSync(fp, content);
  console.log('Updated ' + p.file);
});
