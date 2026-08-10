/**
 * fix-scroll.js
 * Fixes the nav scroll-hide behavior across all HTML files.
 * Old: hides nav after 400px scroll down, shows on any non-down scroll (buggy)
 * New: hides nav after 150px scroll down, shows ONLY on scroll-up
 */
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

let fixed = 0;

htmlFiles.forEach(filename => {
  const filePath = path.join(publicDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Pattern A: multi-line format (most pages)
  // if(st>400&&st>lastScroll)nav.classList.add('nav-hidden');
  //   else nav.classList.remove('nav-hidden');
  //   lastScroll=st;
  content = content.replace(
    /if\(st>400&&st>lastScroll\)nav\.classList\.add\('nav-hidden'\);\s*else nav\.classList\.remove\('nav-hidden'\);\s*lastScroll=st;/g,
    "if(st>150&&st>lastScroll){nav.classList.add('nav-hidden');}else if(st<lastScroll){nav.classList.remove('nav-hidden');}\n  lastScroll=st<=0?0:st;"
  );

  // Pattern B: single-line format with spaces (index.html style)
  // if(st>400 && st>lastScroll) nav.classList.add('nav-hidden'); else nav.classList.remove('nav-hidden');
  content = content.replace(
    /if\(st>400 && st>lastScroll\) nav\.classList\.add\('nav-hidden'\); else nav\.classList\.remove\('nav-hidden'\);/g,
    "if(st>150&&st>lastScroll){nav.classList.add('nav-hidden');}else if(st<lastScroll){nav.classList.remove('nav-hidden');}"
  );

  // Pattern C: flash-sale inline (no space around &&)
  // if(st>400&&st>lastScroll)nav.classList.add('nav-hidden');else nav.classList.remove('nav-hidden');lastScroll=st;
  content = content.replace(
    /if\(st>400&&st>lastScroll\)nav\.classList\.add\('nav-hidden'\);else nav\.classList\.remove\('nav-hidden'\);lastScroll=st;/g,
    "if(st>150&&st>lastScroll){nav.classList.add('nav-hidden');}else if(st<lastScroll){nav.classList.remove('nav-hidden');}lastScroll=st<=0?0:st;"
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    fixed++;
    console.log(`  ✅  ${filename}`);
  } else {
    console.log(`  ⏭  ${filename} (no match)`);
  }
});

console.log(`\n🎉  Scroll fix done — ${fixed} files updated`);
