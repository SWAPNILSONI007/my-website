const fs = require('fs');
const path = require('path');
const pages = ['public/index.html', 'public/shop.html', 'public/flash-sale.html', 'public/product.html', 'public/about.html', 'public/contact.html'];

pages.forEach(p => {
  const fp = path.join(__dirname, p);
  let content = fs.readFileSync(fp, 'utf8');

  // Push buttons completely to the right by using the default 5% padding and no margin-right.
  content = content.replace(/padding:0 10% 0 5%;/g, 'padding:0 5%;');
  content = content.replace(/\.nav-right\{display:flex;align-items:center;gap:\.6rem;flex-shrink:0;margin-right:2%;\}/g, '.nav-right{display:flex;align-items:center;gap:.6rem;flex-shrink:0;}');

  fs.writeFileSync(fp, content);
  console.log('Fixed nav right spacing on ' + p);
});
