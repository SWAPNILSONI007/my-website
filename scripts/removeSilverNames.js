const fs = require('fs');
const path = require('path');

const pages = ['public/index.html', 'public/shop.html', 'public/flash-sale.html', 'public/product.html'];

pages.forEach(p => {
  const fp = path.join(__dirname, p);
  let content = fs.readFileSync(fp, 'utf8');

  // Replace "Silver " from demo product names
  content = content.replace(/'Silver Moon Pendant'/g, "'Moon Pendant'");
  content = content.replace(/'Classic Silver Hoops'/g, "'Classic Hoops'");
  content = content.replace(/'Oxidized Silver Jhumka'/g, "'Oxidized Jhumka'");
  content = content.replace(/'Minimalist Silver Band'/g, "'Minimalist Band'");
  content = content.replace(/'Vintage Silver Anklet'/g, "'Vintage Anklet'");
  content = content.replace(/'Silver Choker Set'/g, "'Choker Set'");

  fs.writeFileSync(fp, content);
  console.log('Removed Silver from names on ' + p);
});
