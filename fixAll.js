const fs = require('fs');
const path = require('path');

const pages = ['public/index.html', 'public/shop.html', 'public/flash-sale.html', 'public/product.html', 'public/about.html', 'public/contact.html'];

const cartHTML = `
<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
<div class="cart-sidebar" id="cartSidebar">
  <div class="cart-head"><h3>Your Cart</h3><button class="cart-close" onclick="closeCart()">✕</button></div>
  <div class="cart-body" id="cartBody"><div class="cart-empty"><p>Your cart is empty</p></div></div>
  <div class="cart-foot" id="cartFoot" style="display:none">
    <div class="cart-total-row"><span>Total</span><strong id="cartTotal">₹0</strong></div>
    <button class="btn-checkout" onclick="checkoutWA()">💬 Order via WhatsApp</button>
  </div>
</div>
`;

const cartJS = `
let cart=[];
function updateCart(){
  const countEl=document.getElementById('cartCount');
  if(countEl)countEl.textContent=cart.length;
  const body=document.getElementById('cartBody'),foot=document.getElementById('cartFoot'),tot=document.getElementById('cartTotal');
  if(!body)return;
  if(!cart.length){body.innerHTML='<div class="cart-empty"><p>Your cart is empty</p></div>';if(foot)foot.style.display='none';return;}
  body.innerHTML=cart.map((i,idx)=>\`<div class="cart-item"><span class="cart-item-emoji">\${i.emoji||'✨'}</span><div class="cart-item-info"><p class="cart-item-name">\${i.name}</p><p class="cart-item-price">₹\${i.price.toLocaleString()}</p></div><button class="cart-item-remove" onclick="removeFromCart(\${idx})">✕</button></div>\`).join('');
  if(tot)tot.textContent='₹'+cart.reduce((s,i)=>s+i.price,0).toLocaleString();
  if(foot)foot.style.display='block';
}
function removeFromCart(i){cart.splice(i,1);updateCart();}
function openCart(){const o=document.getElementById('cartOverlay'),s=document.getElementById('cartSidebar');if(o)o.classList.add('open');if(s)s.classList.add('open');}
function closeCart(){const o=document.getElementById('cartOverlay'),s=document.getElementById('cartSidebar');if(o)o.classList.remove('open');if(s)s.classList.remove('open');}
function checkoutWA(){
  const items=cart.map(i=>\`• \${i.name} — ₹\${i.price.toLocaleString()}\`).join('\\n');
  const total=cart.reduce((s,i)=>s+i.price,0);
  window.open(\`https://wa.me/918004703038?text=\${encodeURIComponent(\`Hi Navyra! Order:\\n\${items}\\nTotal: ₹\${total.toLocaleString()}\`)}\`, '_blank');
}
`;

pages.forEach(p => {
  const fp = path.join(__dirname, p);
  let content = fs.readFileSync(fp, 'utf8');

  // 1. Navbar padding leftward shift
  content = content.replace(/padding:0 8% 0 5%;/, 'padding:0 14% 0 5%;');

  // 2. Add Home button in navbar
  if (!content.includes('>Home</a>')) {
    const isHome = p === 'public/index.html' ? 'active' : '';
    content = content.replace(
      /<li class="dropdown"><a href="#">Collections ▾<\/a>/,
      `<li><a href="/" class="${isHome}">Home</a></li>\n    <li class="dropdown"><a href="#">Collections ▾</a>`
    );
  }

  // 3. Add Cart HTML if missing (about, contact, product might miss it if stripped)
  if (!content.includes('id="cartOverlay"')) {
    content = content.replace(/<nav id="mainNav">/, cartHTML + '\n<nav id="mainNav">');
  }

  // 4. Add Cart JS if missing (about, contact missing openCart)
  if (!content.includes('function openCart()')) {
    content = content.replace(/<\/script>\s*<\/body>/, '\n' + cartJS + '\n</script>\n</body>');
  }

  // 5. Contact page layout fix
  if (p === 'public/contact.html') {
    content = content.replace(/grid-template-columns:1fr 2fr;gap:4rem;max-width:1100px;/, 'grid-template-columns:1fr 1.3fr;gap:6rem;max-width:1050px;');
  }

  fs.writeFileSync(fp, content);
  console.log('Processed ' + p);
});
