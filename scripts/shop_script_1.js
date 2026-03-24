
const EMOJI={pendant:'🔮','ear-jewellery':'✨',rings:'💍',anklets:'🌿',bracelets:'🪬',necklaces:'📿','hair-accessories':'🌸'};
let allProducts=[];
let filtered=[];
let currentCat='all';
let minP=0,maxP=10000;
let cart=[];

// Read URL param
const urlCat=new URLSearchParams(location.search).get('cat');
if(urlCat)currentCat=urlCat;

async function loadProducts(){
  try{
    const res=await fetch('/api/products');
    if(!res.ok) throw new Error('API error');
    const data=await res.json();
    allProducts=Array.isArray(data)?data:[];
    if(!allProducts.length) throw new Error('Empty');
  }catch(e){
    allProducts=[
      {_id:'1',name:'Moon Pendant',category:'pendant',price:1299,originalPrice:1800,inStock:true,badge:'New'},
      {_id:'2',name:'Jhumka Earrings Set',category:'ear-jewellery',price:899,inStock:true,badge:'Bestseller'},
      {_id:'3',name:'Twisted Band Ring',category:'rings',price:699,originalPrice:999,inStock:true,badge:'Sale'},
      {_id:'4',name:'Layered Anklet',category:'anklets',price:599,inStock:true},
      {_id:'5',name:'Charm Bracelet',category:'bracelets',price:1099,inStock:true,badge:'New'},
      {_id:'6',name:'Choker Set',category:'necklaces',price:1499,originalPrice:1999,inStock:true,badge:'Sale'},
    ];
  }
  // Set active sidebar button from URL param
  if(currentCat!=='all'){
    document.querySelectorAll('.cat-filter-btn').forEach(b=>{
      b.classList.remove('active');
      if(b.textContent.toLowerCase().replace(' ','-')===currentCat||b.onclick?.toString().includes(`'${currentCat}'`))b.classList.add('active');
    });
  }
  applyFilters();
}

function applyFilters(){
  filtered=allProducts.filter(p=>{
    const catOk=currentCat==='all'||p.category===currentCat;
    const priceOk=p.price>=minP&&p.price<=maxP;
    return catOk&&priceOk;
  });
  sortProducts(false);
  renderProducts();
}

function sortProducts(render=true){
  const sort=document.getElementById('sortSelect').value;
  if(sort==='price-low')filtered.sort((a,b)=>a.price-b.price);
  else if(sort==='price-high')filtered.sort((a,b)=>b.price-a.price);
  else filtered.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
  if(render)renderProducts();
}

function renderProducts(){
  const grid=document.getElementById('productsGrid');
  document.getElementById('resultsCount').textContent=`${filtered.length} product${filtered.length!==1?'s':''}`;
  if(!filtered.length){
    grid.innerHTML='<div class="no-products"><p>No products found</p><p style="font-size:.85rem;margin-top:.5rem;font-family:\'DM Sans\'">Try a different category or price range</p></div>';
    return;
  }
  grid.innerHTML=filtered.map(p=>{
    const emoji=p.emoji||EMOJI[p.category]||'💎';
    return`<div class="product-card" onclick="openProductModal(allProducts.find(x=>x._id==='${p._id}'))">
      <div class="product-img">
        ${p.badge?`<span class="badge ${p.badge==='Sale'?'badge-sale':'badge-new'}">${p.badge}</span>`:''}
        ${p.image ? `<img src="${p.image}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextSibling.style.display='block'"/><span class="img-inner" style="display:none">${emoji}</span>` : `<span class="img-inner">${emoji}</span>`}
      </div>
      <div class="product-body">
        <p class="product-cat">${(p.category||'').replace('-',' ')}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-price">
          ${p.originalPrice?`<span class="price-old">₹${p.originalPrice.toLocaleString()}</span>`:''}
          <span class="price-new">₹${p.price.toLocaleString()}</span>
        </div>
        <div class="product-actions" onclick="event.stopPropagation()">
          <button class="btn-cart" onclick="addToCart('${p.name}',${p.price},'${emoji}','${p._id}')">Add to Cart</button>
          <a href="https://wa.me/918004703038?text=Hi! I want to order ${encodeURIComponent(p.name)} for ₹${p.price}" target="_blank" class="btn-wa">💬</a>
        </div>
      </div>
    </div>`;
  }).join('');
}

function setCategory(cat,btn){
  currentCat=cat;
  document.querySelectorAll('.cat-filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  applyFilters();
}

function applyPriceFilter(){
  minP=parseInt(document.getElementById('minPrice').value)||0;
  maxP=parseInt(document.getElementById('maxPrice').value)||999999;
  applyFilters();
}

function setView(view,btn){
  const grid=document.getElementById('productsGrid');
  grid.classList.toggle('list-view',view==='list');
  document.querySelectorAll('.view-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

// Cart
function addToCart(name,price,emoji,id){
  cart.push({name,price,emoji,id});
  updateCart();openCart();
}
function updateCart(){
  document.getElementById('cartCount').textContent=cart.length;
  const body=document.getElementById('cartBody');
  const foot=document.getElementById('cartFoot');
  if(!cart.length){body.innerHTML='<div class="cart-empty"><p>Your cart is empty</p></div>';foot.style.display='none';return;}
  body.innerHTML=cart.map((i,idx)=>`<div class="cart-item"><span class="cart-item-emoji">${i.emoji}</span><div class="cart-item-info"><p class="cart-item-name">${i.name}</p><p class="cart-item-price">₹${i.price.toLocaleString()}</p></div><button class="cart-item-remove" onclick="removeFromCart(${idx})">✕</button></div>`).join('');
  document.getElementById('cartTotal').textContent='₹'+cart.reduce((s,i)=>s+i.price,0).toLocaleString();
  foot.style.display='block';
}
function removeFromCart(i){cart.splice(i,1);updateCart();}
function openCart(){document.getElementById('cartOverlay').classList.add('open');document.getElementById('cartSidebar').classList.add('open');}
function closeCart(){document.getElementById('cartOverlay').classList.remove('open');document.getElementById('cartSidebar').classList.remove('open');}
function checkoutWA(){
  const items=cart.map(i=>`• ${i.name} — ₹${i.price.toLocaleString()}`).join('\n');
  const total=cart.reduce((s,i)=>s+i.price,0);
  window.open(`https://wa.me/918004703038?text=${encodeURIComponent(`Hi Navyra Jewellers!\n\nOrder:\n${items}\n\nTotal: ₹${total.toLocaleString()}`)}`, '_blank');
}

function toggleTheme(){
  const h=document.documentElement;
  const newTheme = h.dataset.theme === 'light' ? 'dark' : 'light';
  h.dataset.theme = newTheme;
  localStorage.setItem('theme', newTheme);
  const icon = newTheme === 'dark' ? '☀️' : '🌙';
  document.querySelectorAll('.theme-toggle').forEach(b=>b.textContent=icon);
}
function toggleMobileDrawer(){
  const d=document.getElementById('mobileDrawer'),o=document.getElementById('mobileOverlay'),h=document.getElementById('hamburgerBtn');
  if(d.classList.contains('open')){closeMobileDrawer();}else{d.classList.add('open');o.classList.add('open');h.classList.add('active');document.body.style.overflow='hidden';}
}
function closeMobileDrawer(){
  document.getElementById('mobileDrawer').classList.remove('open');document.getElementById('mobileOverlay').classList.remove('open');document.getElementById('hamburgerBtn').classList.remove('active');document.body.style.overflow='';
}
// Scroll effects
let lastScroll=0;
window.addEventListener('scroll',()=>{const nav=document.getElementById('mainNav');const st=window.scrollY;if(st>60)nav.classList.add('scrolled');else nav.classList.remove('scrolled');if(st>400&&st>lastScroll)nav.classList.add('nav-hidden');else nav.classList.remove('nav-hidden');lastScroll=st;});
// Product Modal
function openProductModal(p){
  if(!p)return;
  const overlay=document.getElementById('productModalOverlay'),imgEl=document.getElementById('pmImg'),infoEl=document.getElementById('pmInfo');
  const emoji=p.emoji||EMOJI[p.category]||'💎';
  imgEl.innerHTML=p.image?`<img src="${p.image}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><span style="display:none;font-size:8rem;width:100%;height:100%;align-items:center;justify-content:center">${emoji}</span>`:emoji;
  const disc=p.originalPrice?Math.round((1-p.price/p.originalPrice)*100):0;
  infoEl.innerHTML=`<p class="pm-cat">${(p.category||'').replace(/-/g,' ')}</p><h2 class="pm-name">${p.name}</h2><div class="pm-price-row"><span class="pm-price">₹${p.price.toLocaleString()}</span>${p.originalPrice?`<span class="pm-original">₹${p.originalPrice.toLocaleString()}</span><span class="pm-disc">${disc}% OFF</span>`:''}</div><p class="pm-desc">${p.description||'A beautiful handcrafted piece from our sterling silver collection. Each item is carefully selected for quality and design.'}</p><div class="pm-features"><div class="pm-feature"><span class="pm-feature-icon">🪙</span><span>925 Sterling Silver — Hallmarked</span></div><div class="pm-feature"><span class="pm-feature-icon">📦</span><span>Free delivery above ₹999</span></div><div class="pm-feature"><span class="pm-feature-icon">↩️</span><span>7-day easy returns</span></div><div class="pm-feature"><span class="pm-feature-icon">💬</span><span>WhatsApp support</span></div></div><div class="pm-actions"><button class="pm-btn-cart" onclick="addToCart('${p.name.replace(/'/g,"\\\'")}',${p.price},'${emoji}','${p._id}');closeProductModal()">Add to Cart</button><a href="https://wa.me/918004703038?text=Hi! I want to order ${encodeURIComponent(p.name)} for ₹${p.price}" target="_blank" class="pm-btn-wa">💬 Order on WhatsApp</a></div>`;
  overlay.classList.add('open');document.body.style.overflow='hidden';
}
function closeProductModal(){document.getElementById('productModalOverlay').classList.remove('open');document.body.style.overflow='';}

loadProducts();
