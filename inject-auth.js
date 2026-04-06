const fs = require('fs');
const path = require('path');

const files = ['index.html', 'shop.html', 'product.html', 'about.html', 'contact.html', 'flash-sale.html'];
const publicDir = path.join(__dirname, 'public');

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add Auth Button to Nav Right
  if (!content.includes('id="accountBtn"')) {
    content = content.replace(
      /<button class="theme-toggle".*?>.*?<\/button>/,
      match => `${match}\n    <a href="/login.html" class="cart-btn" style="text-decoration:none;" id="accountBtn" title="My Account">👤</a>`
    );
  }

  // 2. Add Prefill Logic to openCheckoutModal (if it exists)
  if (content.includes('function openCheckoutModal()') && !content.includes('const navUser = JSON.parse')) {
    content = content.replace(
      /function openCheckoutModal\(\)\s*\{/,
      `function openCheckoutModal() {\n  const navUser = JSON.parse(localStorage.getItem('navUser') || 'null');\n  if(navUser) {\n    if(document.getElementById('co-name')) document.getElementById('co-name').value = navUser.name || '';\n    if(document.getElementById('co-email')) document.getElementById('co-email').value = navUser.email || '';\n    if(document.getElementById('co-mobile')) document.getElementById('co-mobile').value = navUser.phone || '';\n  }`
    );
  }

  // 3. Add customerId to order payload
  if (content.includes('async function saveOrderToServer') && !content.includes('navUser ? navUser.id : null')) {
    content = content.replace(
      /body:JSON\.stringify\(\{(customerName:name,.*?)}\)/,
      `body:JSON.stringify({customerId: (JSON.parse(localStorage.getItem('navUser') || 'null') || {}).id || null, $1})`
    );
  }

  // 4. Add auth state JS to bottom
  if (!content.includes('document.getElementById(\'accountBtn\').href = \'/account.html\'')) {
    content = content.replace(
      /<\/body>/,
      `<script>
  if(localStorage.getItem('navToken') && document.getElementById('accountBtn')) {
    document.getElementById('accountBtn').href = '/account.html';
  }
</script>\n</body>`
    );
  }

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
