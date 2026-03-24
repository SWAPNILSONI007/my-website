const fs = require('fs');
const path = require('path');

const pages = ['public/index.html', 'public/shop.html', 'public/flash-sale.html', 'public/product.html', 'public/about.html', 'public/contact.html'];

pages.forEach(p => {
  const fp = path.join(__dirname, p);
  let content = fs.readFileSync(fp, 'utf8');

  // Replace literal '\n' with actual newline
  content = content.replace(/\\nfunction toggleMobile/g, '\nfunction toggleMobile');
  content = content.replace(/\\n<\/script>/g, '\n</script>');

  fs.writeFileSync(fp, content);
  console.log('Fixed illegal tokens on ' + p);
});
