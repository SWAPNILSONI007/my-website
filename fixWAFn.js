const fs = require('fs');
const path = require('path');

const pages = ['public/index.html', 'public/shop.html', 'public/flash-sale.html', 'public/product.html', 'public/about.html', 'public/contact.html'];

pages.forEach(p => {
  const fp = path.join(__dirname, p);
  let content = fs.readFileSync(fp, 'utf8');

  // Replace nested template literals and escaped newlines with simple string concatenation to avoid browser HTML parser issues
  const badWA = 'window.open(`https://wa.me/918004703038?text=${encodeURIComponent(`Hi Navyra! Order:\\n${items}\\nTotal: ₹${total.toLocaleString()}`)}`, \\'_blank\\');';
  
  // Actually, I'll just replace the entire checkoutWA function safely:
  content = content.replace(/function checkoutWA\(\)\{[\s\S]*?\}/g, 
    "function checkoutWA() { const items=cart.map(i=>'• '+i.name+' — ₹'+i.price.toLocaleString()).join('%0A'); const total=cart.reduce((s,i)=>s+i.price,0); window.open('https://wa.me/918004703038?text=Hi%20Navyra!%20Order:%0A' + items + '%0ATotal:%20%E2%82%B9' + total.toLocaleString(), '_blank'); }"
  );

  fs.writeFileSync(fp, content);
  console.log('Fixed checkoutWA on ' + p);
});
