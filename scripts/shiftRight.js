const fs = require('fs');
const path = require('path');

const pages = ['public/index.html', 'public/shop.html', 'public/flash-sale.html', 'public/product.html', 'public/about.html', 'public/contact.html'];

pages.forEach(p => {
  const fp = path.join(__dirname, p);
  let content = fs.readFileSync(fp, 'utf8');

  // Move nav right items back towards the right by removing the 7% margin
  content = content.replace(
    /\.nav-right\{display:flex;align-items:center;gap:\.6rem;flex-shrink:0;margin-right:7%;\}/g,
    '.nav-right{display:flex;align-items:center;gap:.6rem;flex-shrink:0;margin-right:2%;}'
  );
  
  // Just in case it has old padding, let's normalize nav padding to something elegant.
  // 14% was considered ok but maybe a bit too far left, let's use 10%
  content = content.replace(/padding:0 14% 0 5%;/g, 'padding:0 10% 0 5%;');

  fs.writeFileSync(fp, content);
  console.log('Moved right on ' + p);
});
