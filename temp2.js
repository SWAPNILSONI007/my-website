
async function submitForm(e){
  e.preventDefault();
  const data={name:document.getElementById('fname').value,phone:document.getElementById('fphone').value,email:document.getElementById('femail').value,subject:document.getElementById('fsubject').value,message:document.getElementById('fmessage').value};
  try{
    await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  }catch(err){}
  document.getElementById('successMsg').style.display='block';
  e.target.reset();
  setTimeout(()=>document.getElementById('successMsg').style.display='none',5000);
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
  const d=document.getElementById('mobileDrawer'),o=document.getElementById('mobileOverlay'),h=document.getElementById('hamburgerBtn');
  if(d) d.classList.remove('open');
  if(o) o.classList.remove('open');
  if(h) h.classList.remove('active');
  document.body.style.overflow='';
}
let lastScroll=0;
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('mainNav');
  if(!nav) return;
  const st=window.scrollY;
  if(st>60)nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
  if(st>400&&st>lastScroll)nav.classList.add('nav-hidden');
  else nav.classList.remove('nav-hidden');
  lastScroll=st;
});
function toggleMobile(){document.getElementById('mobileMenu').classList.toggle('open');}


let cart=[];
function updateCart(){
  const countEl=document.getElementById('cartCount');
  if(countEl)countEl.textContent=cart.length;
  const body=document.getElementById('cartBody'),foot=document.getElementById('cartFoot'),tot=document.getElementById('cartTotal');
  if(!body)return;
  if(!cart.length){body.innerHTML='<div class="cart-empty"><p>Your cart is empty</p></div>';if(foot)foot.style.display='none';return;}
  body.innerHTML=cart.map((i,idx)=>`<div class="cart-item"><span class="cart-item-emoji">${i.emoji||'✨'}</span><div class="cart-item-info"><p class="cart-item-name">${i.name}</p><p class="cart-item-price">₹${i.price.toLocaleString()}</p></div><button class="cart-item-remove" onclick="removeFromCart(${idx})">✕</button></div>`).join('');
  if(tot)tot.textContent='₹'+cart.reduce((s,i)=>s+i.price,0).toLocaleString();
  if(foot)foot.style.display='block';
}
function removeFromCart(i){cart.splice(i,1);updateCart();}
function openCart(){const o=document.getElementById('cartOverlay'),s=document.getElementById('cartSidebar');if(o)o.classList.add('open');if(s)s.classList.add('open');}
function closeCart(){const o=document.getElementById('cartOverlay'),s=document.getElementById('cartSidebar');if(o)o.classList.remove('open');if(s)s.classList.remove('open');}
function checkoutWA(){
  const items=cart.map(i=>`• ${i.name} — ₹${i.price.toLocaleString()}`).join('\n');
  const total=cart.reduce((s,i)=>s+i.price,0);
  window.open(`https://wa.me/918004703038?text=${encodeURIComponent(`Hi Navyra! Order:\n${items}\nTotal: ₹${total.toLocaleString()}`)}`, '_blank');
}

