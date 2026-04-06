/**
 * inject-auth-modal.js
 * Run with: node scripts/inject-auth-modal.js
 * Injects a fully themed Login/Register modal into all public pages.
 */
const fs = require('fs');
const path = require('path');

const files = ['index.html', 'shop.html', 'product.html', 'about.html', 'contact.html', 'flash-sale.html'];
const publicDir = path.join(__dirname, '..', 'public');

// ─── The new premium auth modal ──────────────────────────────────────────────
const AUTH_MODAL = `
<!-- ═══ Auth Modal (Login / Register) ═══ -->
<style>
/* Auth Modal */
.auth-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:5000;opacity:0;pointer-events:none;transition:opacity .35s cubic-bezier(.4,0,.2,1);display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}
.auth-modal-overlay.open{opacity:1;pointer-events:all;}
.auth-modal{background:var(--card);border:1px solid var(--border);width:100%;max-width:440px;border-radius:8px;overflow:hidden;transform:translateY(28px) scale(.97);opacity:0;transition:all .38s cubic-bezier(.4,0,.2,1);box-shadow:0 40px 100px rgba(0,0,0,0.35),0 0 0 1px rgba(201,168,76,0.12);position:relative;}
.auth-modal-overlay.open .auth-modal{transform:translateY(0) scale(1);opacity:1;}
/* Header stripe */
.auth-modal-stripe{background:linear-gradient(135deg,#0e0d0c 0%,#1c1814 100%);padding:2.2rem 2rem 1.6rem;position:relative;overflow:hidden;}
.auth-modal-stripe::before{content:'✦';position:absolute;bottom:-1.5rem;right:-1.5rem;font-size:8rem;color:rgba(201,168,76,0.07);line-height:1;pointer-events:none;}
.auth-modal-eyebrow{font-size:.6rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:.6rem;}
.auth-modal-title{font-family:'Playfair Display',serif;font-size:1.55rem;font-weight:400;color:#f0ebe3;line-height:1.2;}
.auth-modal-title em{font-style:italic;color:var(--gold);}
/* Close */
.auth-modal-close{position:absolute;top:1rem;right:1rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:.9rem;display:flex;align-items:center;justify-content:center;color:#f0ebe3;z-index:2;transition:all .25s;}
.auth-modal-close:hover{background:rgba(201,168,76,0.25);border-color:var(--gold);transform:rotate(90deg);}
/* Tabs */
.auth-tabs{display:flex;border-bottom:1px solid var(--border);background:var(--bg2);}
.auth-tab{flex:1;text-align:center;padding:1rem;cursor:pointer;color:var(--text2);font-size:.72rem;font-weight:500;text-transform:uppercase;letter-spacing:.15em;transition:all .3s;border-bottom:2px solid transparent;position:relative;}
.auth-tab.active{color:var(--gold);border-bottom-color:var(--gold);background:var(--card);}
.auth-tab:hover:not(.active){color:var(--text);}
/* Form body */
.auth-form-body{padding:1.75rem 2rem 2rem;}
.auth-form{display:none;}
.auth-form.active{display:block;}
.auth-form-group{margin-bottom:1rem;}
.auth-form-group label{display:block;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--silver);margin-bottom:.4rem;}
.auth-input{width:100%;padding:11px 14px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-family:'DM Sans',sans-serif;font-size:.9rem;outline:none;border-radius:4px;transition:all .3s;}
.auth-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,0.1);}
.auth-input::placeholder{color:var(--text2);opacity:.5;}
.auth-form-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;}
.btn-auth{width:100%;padding:14px;background:linear-gradient(135deg,#c9a84c,#e6c56a);border:none;color:#111;font-family:'DM Sans',sans-serif;font-weight:600;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;border-radius:4px;cursor:pointer;margin-top:.75rem;transition:all .35s;position:relative;overflow:hidden;}
.btn-auth::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .3s;}
.btn-auth:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,168,76,0.35);}
.btn-auth:disabled{opacity:.65;cursor:wait;transform:none;}
.auth-err{color:#e74c3c;font-size:.78rem;margin-top:.6rem;display:none;text-align:center;padding:.5rem;background:rgba(231,76,60,0.08);border-radius:4px;}
.auth-ok{color:#27ae60;font-size:.78rem;margin-top:.6rem;display:none;text-align:center;padding:.5rem;background:rgba(39,174,96,0.1);border-radius:4px;}
.auth-footer{text-align:center;padding:.75rem 2rem 1.5rem;font-size:.75rem;color:var(--text2);}
.auth-footer a{color:var(--gold);text-decoration:none;cursor:pointer;}
</style>

<div class="auth-modal-overlay" id="authModalOverlay" onclick="if(event.target===this)closeAuthModal()">
  <div class="auth-modal" id="authModal">
    <!-- Stripe header -->
    <div class="auth-modal-stripe">
      <button class="auth-modal-close" onclick="closeAuthModal()">✕</button>
      <p class="auth-modal-eyebrow">✦ Navyra Jewellers</p>
      <h2 class="auth-modal-title" id="authModalHeading">Welcome <em>back.</em></h2>
    </div>
    <!-- Tabs -->
    <div class="auth-tabs">
      <div class="auth-tab active" id="modal-tab-login" onclick="switchAuthTab('login')">Sign In</div>
      <div class="auth-tab" id="modal-tab-register" onclick="switchAuthTab('register')">Create Account</div>
    </div>
    <!-- Forms -->
    <div class="auth-form-body">
      <!-- LOGIN -->
      <form id="modal-form-login" class="auth-form active" onsubmit="handleModalLogin(event)">
        <div class="auth-form-group">
          <label>Email Address</label>
          <input type="email" id="modalLoginEmail" class="auth-input" placeholder="you@example.com" required>
        </div>
        <div class="auth-form-group">
          <label>Password</label>
          <input type="password" id="modalLoginPassword" class="auth-input" placeholder="••••••••" required>
        </div>
        <button type="submit" class="btn-auth" id="btnLogin">Sign In →</button>
        <p class="auth-err" id="modalLoginError"></p>
      </form>
      <!-- REGISTER -->
      <form id="modal-form-register" class="auth-form" onsubmit="handleModalRegister(event)">
        <div class="auth-form-group">
          <label>Full Name</label>
          <input type="text" id="modalRegName" class="auth-input" placeholder="Aditi Sharma" required>
        </div>
        <div class="auth-form-row">
          <div class="auth-form-group">
            <label>Mobile Number</label>
            <input type="tel" id="modalRegPhone" class="auth-input" placeholder="9876543210" required>
          </div>
          <div class="auth-form-group">
            <label>Email Address</label>
            <input type="email" id="modalRegEmail" class="auth-input" placeholder="you@email.com" required>
          </div>
        </div>
        <div class="auth-form-group">
          <label>Password (min 6 chars)</label>
          <input type="password" id="modalRegPassword" class="auth-input" placeholder="••••••••" required minlength="6">
        </div>
        <button type="submit" class="btn-auth" id="btnRegister">Create Account →</button>
        <p class="auth-err" id="modalRegError"></p>
        <p class="auth-ok" id="modalRegOk">✓ Account created! Signing you in...</p>
      </form>
    </div>
    <div class="auth-footer">
      By continuing you agree to our <a href="#">Privacy Policy</a>
    </div>
  </div>
</div>

<script>
function openAuthModal(tab) {
  if(localStorage.getItem('navToken')) { window.location.href='/account.html'; return; }
  if(tab) switchAuthTab(tab);
  document.getElementById('authModalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeAuthModal() {
  document.getElementById('authModalOverlay').classList.remove('open');
  document.body.style.overflow='';
}
function switchAuthTab(tab) {
  const isLogin = tab==='login';
  document.getElementById('modal-tab-login').classList.toggle('active',isLogin);
  document.getElementById('modal-tab-register').classList.toggle('active',!isLogin);
  document.getElementById('modal-form-login').classList.toggle('active',isLogin);
  document.getElementById('modal-form-register').classList.toggle('active',!isLogin);
  document.getElementById('authModalHeading').innerHTML = isLogin ? 'Welcome <em>back.</em>' : 'Join <em>Navyra.</em>';
}
async function handleModalLogin(e) {
  e.preventDefault();
  const btn=document.getElementById('btnLogin');
  const err=document.getElementById('modalLoginError');
  err.style.display='none'; btn.disabled=true; btn.textContent='Signing in...';
  try{
    const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:document.getElementById('modalLoginEmail').value,password:document.getElementById('modalLoginPassword').value})});
    const data=await res.json();
    if(data.success){
      localStorage.setItem('navToken',data.token);
      localStorage.setItem('navUser',JSON.stringify(data.customer));
      window.location.href='/account.html';
    } else { err.textContent=data.msg||'Incorrect email or password'; err.style.display='block'; }
  }catch(ex){ err.textContent='Connection error. Try again.'; err.style.display='block'; }
  btn.disabled=false; btn.textContent='Sign In →';
}
async function handleModalRegister(e) {
  e.preventDefault();
  const btn=document.getElementById('btnRegister');
  const err=document.getElementById('modalRegError');
  const ok=document.getElementById('modalRegOk');
  err.style.display='none'; ok.style.display='none'; btn.disabled=true; btn.textContent='Creating account...';
  try{
    const res=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:document.getElementById('modalRegName').value,email:document.getElementById('modalRegEmail').value,phone:document.getElementById('modalRegPhone').value,password:document.getElementById('modalRegPassword').value})});
    const data=await res.json();
    if(data.success){
      localStorage.setItem('navToken',data.token);
      localStorage.setItem('navUser',JSON.stringify(data.customer));
      ok.style.display='block';
      setTimeout(()=>window.location.href='/account.html',1200);
    } else { err.textContent=data.msg||'Could not create account'; err.style.display='block'; }
  }catch(ex){ err.textContent='Connection error. Try again.'; err.style.display='block'; }
  btn.disabled=false; btn.textContent='Create Account →';
}
// Wire up the account button dynamically
document.addEventListener('DOMContentLoaded', () => {
  const accBtn = document.getElementById('accountBtn');
  if(accBtn) {
    if(localStorage.getItem('navToken')) {
      accBtn.href='/account.html'; accBtn.title='My Account'; accBtn.onclick=null;
    } else {
      accBtn.href='#';
      accBtn.onclick=(e)=>{ e.preventDefault(); openAuthModal('login'); };
    }
  }
  // Keyboard close
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeAuthModal(); });
});
</script>
`;
// ─────────────────────────────────────────────────────────────────────────────

// Regex to strip any previously injected auth modal block
const OLD_MODAL_REGEX = /\n?<!-- (?:Auth Modal|═══ Auth Modal)[^>]*-->\s*<style>[\s\S]*?<\/style>\s*<div class="auth-modal-overlay"[\s\S]*?<\/div>\s*<script>[\s\S]*?<\/script>\s*\n?/g;

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) { console.log(`SKIP (not found): ${file}`); return; }

  let content = fs.readFileSync(filePath, 'utf8');

  // Strip old version
  content = content.replace(OLD_MODAL_REGEX, '');

  // Also strip old inline script redirect that was appended separately
  content = content.replace(
    /<script>\s*if\(localStorage\.getItem\('navToken'\)[^<]*<\/script>/g,
    ''
  );

  // Inject before </body>
  if (!content.includes('id="authModalOverlay"')) {
    content = content.replace('</body>', `${AUTH_MODAL}\n</body>`);
  } else {
    console.log(`ALREADY HAS MODAL — replacing in: ${file}`);
    content = content.replace(OLD_MODAL_REGEX, '');
    content = content.replace('</body>', `${AUTH_MODAL}\n</body>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Injected into: ${file}`);
});

console.log('\n✅ Done! Auth modal updated in all pages.');
