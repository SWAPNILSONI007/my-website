const fs = require('fs');
const path = require('path');

const files = ['index.html', 'shop.html', 'product.html', 'about.html', 'contact.html', 'flash-sale.html'];
const publicDir = path.join(__dirname, 'public');

const modalHTML = `
<!-- Auth Modal -->
<style>
.auth-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:4000;opacity:0;pointer-events:none;transition:opacity .3s;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);}
.auth-modal-overlay.open{opacity:1;pointer-events:all;}
.auth-modal{background:var(--card);border:1px solid var(--border);width:100%;max-width:400px;border-radius:6px;overflow:hidden;transform:translateY(20px);opacity:0;transition:all .3s;box-shadow:0 20px 60px rgba(0,0,0,0.2);position:relative;}
.auth-modal-overlay.open .auth-modal{transform:translateY(0);opacity:1;}
.auth-modal-close{position:absolute;top:15px;right:15px;background:var(--bg2);border:1px solid var(--border);width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;color:var(--text);z-index:2;transition:all .2s;}
.auth-modal-close:hover{background:var(--text);color:var(--bg);}
.auth-tabs{display:flex;border-bottom:1px solid var(--border);background:var(--bg2);}
.auth-tab{flex:1;text-align:center;padding:15px 10px;cursor:pointer;color:var(--text2);font-weight:600;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;transition:all .3s;}
.auth-tab.active{color:var(--gold-accent);background:var(--card);border-bottom:2px solid var(--gold-accent);}
.auth-form-wrap{padding:2rem;}
.auth-form{display:none;}
.auth-form.active{display:block;}
.auth-form-group{margin-bottom:1.2rem;}
.auth-form-group label{display:block;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--silver);margin-bottom:0.4rem;}
.auth-input{width:100%;padding:12px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-family:inherit;font-size:0.9rem;outline:none;border-radius:4px;transition:all .3s;}
.auth-input:focus{border-color:var(--gold-accent);}
.btn-auth{width:100%;padding:14px;background:linear-gradient(135deg, #c9a84c, #e6c56a);border:none;color:#111;font-weight:600;font-size:0.85rem;border-radius:4px;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;margin-top:0.5rem;transition:all .3s;}
.btn-auth:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(201,168,76,0.3);}
</style>
<div class="auth-modal-overlay" id="authModalOverlay" onclick="if(event.target===this)closeAuthModal()">
  <div class="auth-modal" id="authModal">
    <div class="auth-modal-close" onclick="closeAuthModal()">✕</div>
    <div class="auth-tabs">
      <div class="auth-tab active" id="modal-tab-login" onclick="switchAuthTab('login')">Login</div>
      <div class="auth-tab" id="modal-tab-register" onclick="switchAuthTab('register')">Register</div>
    </div>
    <div class="auth-form-wrap">
      <!-- Login -->
      <form id="modal-form-login" class="auth-form active" onsubmit="handleModalLogin(event)">
        <div class="auth-form-group"><label>Email Address</label><input type="email" id="modalLoginEmail" class="auth-input" required></div>
        <div class="auth-form-group"><label>Password</label><input type="password" id="modalLoginPassword" class="auth-input" required></div>
        <button type="submit" class="btn-auth">Sign In</button>
        <p id="modalLoginError" style="color:#e74c3c;font-size:0.8rem;margin-top:10px;display:none;"></p>
      </form>
      <!-- Register -->
      <form id="modal-form-register" class="auth-form" onsubmit="handleModalRegister(event)">
        <div class="auth-form-group"><label>Full Name</label><input type="text" id="modalRegName" class="auth-input" required></div>
        <div class="auth-form-group"><label>Email Address</label><input type="email" id="modalRegEmail" class="auth-input" required></div>
        <div class="auth-form-group"><label>Mobile Number</label><input type="tel" id="modalRegPhone" class="auth-input" required></div>
        <div class="auth-form-group"><label>Password</label><input type="password" id="modalRegPassword" class="auth-input" required minlength="6"></div>
        <button type="submit" class="btn-auth">Create Account</button>
        <p id="modalRegError" style="color:#e74c3c;font-size:0.8rem;margin-top:10px;display:none;"></p>
      </form>
    </div>
  </div>
</div>
<script>
  function openAuthModal() {
    if(localStorage.getItem('navToken')) { window.location.href='/account.html'; return; }
    document.getElementById('authModalOverlay').classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeAuthModal() {
    document.getElementById('authModalOverlay').classList.remove('open');
    document.body.style.overflow='';
  }
  function switchAuthTab(tab) {
    if(tab==='login'){
      document.getElementById('modal-tab-login').classList.add('active');
      document.getElementById('modal-tab-register').classList.remove('active');
      document.getElementById('modal-form-login').classList.add('active');
      document.getElementById('modal-form-register').classList.remove('active');
    } else {
      document.getElementById('modal-tab-register').classList.add('active');
      document.getElementById('modal-tab-login').classList.remove('active');
      document.getElementById('modal-form-register').classList.add('active');
      document.getElementById('modal-form-login').classList.remove('active');
    }
  }
  async function handleModalLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const err = document.getElementById('modalLoginError');
    btn.disabled=true; btn.textContent='Wait...'; err.style.display='none';
    try{
      const res = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('modalLoginEmail').value,password:document.getElementById('modalLoginPassword').value})});
      const data = await res.json();
      if(data.success){ localStorage.setItem('navToken',data.token); localStorage.setItem('navUser',JSON.stringify(data.customer)); window.location.href='/account.html'; }
      else { err.textContent=data.msg||'Failed'; err.style.display='block'; }
    }catch(e){ err.textContent='Error'; err.style.display='block'; }
    btn.disabled=false; btn.textContent='Sign In';
  }
  async function handleModalRegister(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const err = document.getElementById('modalRegError');
    btn.disabled=true; btn.textContent='Wait...'; err.style.display='none';
    try{
      const res = await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:document.getElementById('modalRegName').value,email:document.getElementById('modalRegEmail').value,phone:document.getElementById('modalRegPhone').value,password:document.getElementById('modalRegPassword').value})});
      const data = await res.json();
      if(data.success){ localStorage.setItem('navToken',data.token); localStorage.setItem('navUser',JSON.stringify(data.customer)); window.location.href='/account.html'; }
      else { err.textContent=data.msg||'Failed'; err.style.display='block'; }
    }catch(e){ err.textContent='Error'; err.style.display='block'; }
    btn.disabled=false; btn.textContent='Create Account';
  }
  
  // Intercept Account Icon Click
  document.addEventListener('DOMContentLoaded', () => {
    const accBtn = document.getElementById('accountBtn');
    if(accBtn) {
      if(localStorage.getItem('navToken')) {
        accBtn.href = '/account.html';
        accBtn.onclick = null;
      } else {
        accBtn.href = '#';
        accBtn.onclick = (e) => { e.preventDefault(); openAuthModal(); };
      }
    }
  });
</script>
`;

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove previous /login.html manual link if injected via previous step
  // I already overwrote it via inject script previously.
  if (content.includes('id="accountBtn"')) {
    // The link already exists, the DOMContentLoaded logic in modalHTML handles its onclick dynamically.
  }

  // 2. Remove the old trailing logic `<script> if(localStorage.getItem... accountBtn.href = ... </script>` 
  // that was appended before </body>
  content = content.replace(
    /<script>\s*if\(localStorage\.getItem\('navToken'\) && document\.getElementById\('accountBtn'\)\) \{\s*document\.getElementById\('accountBtn'\)\.href = '\/account\.html';\s*\}\s*<\/script>/g,
    ''
  );

  // 3. Inject the Modal before </body> if not present
  if (!content.includes('id="authModalOverlay"')) {
    content = content.replace('</body>', `${modalHTML}\n</body>`);
  }

  fs.writeFileSync(filePath, content);
  console.log('Appended modal to ' + file);
});

// Delete login.html
try {
  fs.unlinkSync(path.join(publicDir, 'login.html'));
  console.log('Deleted login.html');
} catch(e) {}
