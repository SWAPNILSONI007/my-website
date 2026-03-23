const fs = require('fs');
const path = require('path');

const cssToAdd = `
/* CART OVERLAY AND SIDEBAR */
.cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2000;opacity:0;pointer-events:none;transition:opacity .35s;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}
.cart-overlay.open{opacity:1;pointer-events:all;}
.cart-sidebar{position:fixed;top:0;right:-400px;width:380px;max-width:90vw;height:100vh;background:var(--card);z-index:2001;transition:right .4s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;border-left:1px solid var(--border);box-shadow:-8px 0 30px rgba(0,0,0,.15);}
.cart-sidebar.open{right:0;}
.cart-head{display:flex;justify-content:space-between;align-items:center;padding:1.5rem;border-bottom:1px solid var(--border);}
.cart-head h3{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:400;}
.cart-close{background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text);width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .2s;}
.cart-close:hover{background:var(--bg2);}
.cart-body{flex:1;overflow-y:auto;padding:1.5rem;}
.cart-empty{text-align:center;padding:3rem 0;color:var(--text2);font-size:.9rem;letter-spacing:.05em;}
.cart-item{display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;padding-bottom:1.25rem;border-bottom:1px solid var(--border);}
.cart-item-emoji{font-size:2rem;width:60px;height:60px;background:var(--bg2);display:flex;align-items:center;justify-content:center;border-radius:8px;}
.cart-item-info{flex:1;}
.cart-item-name{font-family:'Playfair Display',serif;font-size:1rem;margin-bottom:.25rem;}
.cart-item-price{font-size:.85rem;text-transform:uppercase;letter-spacing:.1em;}
.cart-item-remove{background:none;border:none;font-size:1rem;cursor:pointer;color:var(--silver);transition:color .2s;padding:5px;}
.cart-item-remove:hover{color:red;}
.cart-foot{padding:1.5rem;border-top:1px solid var(--border);background:var(--bg2);}
.cart-total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;font-size:.9rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text2);}
.cart-total-row strong{font-size:1.4rem;color:var(--text);font-family:'DM Sans',sans-serif;font-weight:500;}
.btn-checkout{width:100%;background:#25d366;color:#fff;border:none;padding:16px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;transition:all .3s;}
.btn-checkout:hover{background:#128c7e;}
`;

const pages = ['public/index.html', 'public/shop.html', 'public/flash-sale.html', 'public/product.html', 'public/about.html', 'public/contact.html'];

pages.forEach(p => {
  const fp = path.join(__dirname, p);
  let content = fs.readFileSync(fp, 'utf8');

  // Push .nav-right EXTREMELY left by adding margin. 
  content = content.replace(
    /\.nav-right\{display:flex;align-items:center;gap:\.6rem;flex-shrink:0;([^}]*)\}/, 
    '.nav-right{display:flex;align-items:center;gap:.6rem;flex-shrink:0;margin-right:7%;}'
  );

  // If CSS not updated yet (some files might have old one without group 1)
  content = content.replace(
    /\.nav-right\{display:flex;align-items:center;gap:\.6rem;flex-shrink:0;\}/, 
    '.nav-right{display:flex;align-items:center;gap:.6rem;flex-shrink:0;margin-right:7%;}'
  );

  // Add Cart CSS if missing
  if (!content.includes('.cart-sidebar{position:fixed;')) {
    content = content.replace(/<\/style>/, cssToAdd + '\n</style>');
  }

  fs.writeFileSync(fp, content);
  console.log('Fixed CSS on ' + p);
});
