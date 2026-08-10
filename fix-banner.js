/**
 * fix-banner.js
 * Fixes the flash-banner across ALL HTML pages:
 * 1. Adds CSS transition to .flash-banner so it slides smoothly
 * 2. Updates scroll JS to hide/show banner together with nav
 */
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

// CSS: old vs new
const OLD_BANNER_CSS_A = '.flash-banner{position:fixed;top:0;left:0;width:100%;z-index:2000;background:var(--flash,#1a0a0a);color:#f0ebe3;padding:5px 0;text-align:center;font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;}';
const NEW_BANNER_CSS   = '.flash-banner{position:fixed;top:0;left:0;width:100%;z-index:2000;background:var(--flash,#1a0a0a);color:#f0ebe3;padding:5px 0;text-align:center;font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;transition:transform .4s cubic-bezier(.4,0,.2,1);}';

// Already fixed version (index.html)
const ALREADY_FIXED_BANNER = '.flash-banner{position:fixed;top:0;left:0;width:100%;z-index:2000;background:var(--flash,#1a0a0a);color:#f0ebe3;padding:5px 0;text-align:center;font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;transition:transform .4s cubic-bezier(.4,0,.2,1);}';

// Scroll JS patterns to find and replace (multiple formats)
const SCROLL_PATTERNS = [
  // Multi-line format
  {
    old: `if(st>150&&st>lastScroll){nav.classList.add('nav-hidden');}else if(st<lastScroll){nav.classList.remove('nav-hidden');}
  lastScroll=st<=0?0:st;`,
    new: `if(st>150&&st>lastScroll){
    nav.classList.add('nav-hidden');
    if(banner) banner.style.transform='translateY(-100%)';
  }else if(st<lastScroll){
    nav.classList.remove('nav-hidden');
    if(banner) banner.style.transform='';
  }
  lastScroll=st<=0?0:st;`
  },
  // Inline format (flash-sale, shop)
  {
    old: `if(st>150&&st>lastScroll){nav.classList.add('nav-hidden');}else if(st<lastScroll){nav.classList.remove('nav-hidden');}`,
    new: `if(st>150&&st>lastScroll){nav.classList.add('nav-hidden');if(banner)banner.style.transform='translateY(-100%)';}else if(st<lastScroll){nav.classList.remove('nav-hidden');if(banner)banner.style.transform='';}`
  }
];

// Banner variable injection (add const banner= after const nav=)
const NAV_CONST_PATTERN = /const nav=document\.getElementById\('mainNav'\);(?!\s*const banner)/g;
const NAV_CONST_WITH_BANNER = `const nav=document.getElementById('mainNav');
  const banner=document.querySelector('.flash-banner');`;

let fixed = 0;

htmlFiles.forEach(filename => {
  const filePath = path.join(publicDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 1. Fix CSS transition
  if (content.includes(OLD_BANNER_CSS_A)) {
    content = content.replace(OLD_BANNER_CSS_A, NEW_BANNER_CSS);
  }

  // 2. Add banner variable to scroll listener if not already there
  if (content.includes("getElementById('mainNav')") && !content.includes("querySelector('.flash-banner')")) {
    content = content.replace(NAV_CONST_PATTERN, NAV_CONST_WITH_BANNER);
  }

  // 3. Update scroll hide/show logic to include banner
  for (const pat of SCROLL_PATTERNS) {
    if (content.includes(pat.old)) {
      content = content.split(pat.old).join(pat.new);
      break;
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    fixed++;
    console.log(`  ✅  ${filename}`);
  } else {
    console.log(`  ⏭  ${filename} (no change)`);
  }
});

console.log(`\n🎉  Banner fix done — ${fixed} files updated`);
