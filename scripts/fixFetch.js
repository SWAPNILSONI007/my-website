const fs = require('fs');
const path = require('path');

const pages = ['public/index.html', 'public/shop.html', 'public/flash-sale.html'];

pages.forEach(p => {
  const fp = path.join(__dirname, p);
  let content = fs.readFileSync(fp, 'utf8');

  // Replace fetch with AbortController wrapper
  content = content.replace(
    /const res=await fetch\('\/api\/products'\);/g,
    `const controller = new AbortController(); setTimeout(() => controller.abort(), 2000); const res = await fetch('/api/products', { signal: controller.signal });`
  );

  fs.writeFileSync(fp, content);
  console.log('Fixed fetch timeout on ' + p);
});

// Now fix product.html
const pFp = path.join(__dirname, 'public/product.html');
let pContent = fs.readFileSync(pFp, 'utf8');
pContent = pContent.replace(
  /const r=await fetch\(\`\/api\/products\/\$\{id\}\`\);/g,
  `const controller = new AbortController(); setTimeout(() => controller.abort(), 2000); const r = await fetch(\`/api/products/\${id}\`, { signal: controller.signal });`
);
fs.writeFileSync(pFp, pContent);
console.log('Fixed fetch timeout on public/product.html');
