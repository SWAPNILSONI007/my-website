const fs = require('fs');
const path = require('path');

const pages = [
  'public/index.html',
  'public/shop.html',
  'public/flash-sale.html',
  'public/about.html',
  'public/product.html'
];

const modalCSS = `
/* ======= CONTACT MODAL ======= */
.contact-modal-overlay{position:fixed;inset:0;z-index:3000;background:rgba(10,8,6,0.75);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .4s cubic-bezier(.4,0,.2,1);padding:1rem;}
.contact-modal-overlay.open{opacity:1;pointer-events:all;}
.contact-modal{background:var(--card);border:1px solid var(--border);width:100%;max-width:720px;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 40px 120px rgba(0,0,0,0.3),0 0 0 1px rgba(201,168,76,0.15);transform:translateY(24px) scale(0.97);transition:transform .4s cubic-bezier(.4,0,.2,1);display:grid;grid-template-columns:1fr 1.4fr;}
.contact-modal-overlay.open .contact-modal{transform:translateY(0) scale(1);}
.cmodal-left{background:linear-gradient(160deg,#080402 0%,#1a1410 100%);padding:3rem 2.5rem;display:flex;flex-direction:column;position:relative;overflow:hidden;}
.cmodal-left::before{content:'✦';position:absolute;bottom:-2rem;right:-2rem;font-size:10rem;color:rgba(201,168,76,0.06);line-height:1;}
.cmodal-eyebrow{font-size:.65rem;letter-spacing:.35em;text-transform:uppercase;color:#c9a84c;margin-bottom:1.5rem;}
.cmodal-left h2{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:400;color:#f0ebe3;line-height:1.25;margin-bottom:1rem;}
.cmodal-left h2 em{font-style:italic;color:#c9a84c;}
.cmodal-left p{font-size:.85rem;color:rgba(240,235,227,0.55);line-height:1.8;margin-bottom:2.5rem;}
.cmodal-contacts{display:flex;flex-direction:column;gap:1.5rem;margin-top:auto;}
.cmodal-contact-item{display:flex;align-items:flex-start;gap:.9rem;}
.cmodal-contact-icon{width:36px;height:36px;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.25);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0;}
.cmodal-contact-text p:first-child{font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(240,235,227,0.4);margin-bottom:.2rem;}
.cmodal-contact-text a,.cmodal-contact-text span{color:#f0ebe3;font-size:.88rem;text-decoration:none;transition:color .2s;}
.cmodal-contact-text a:hover{color:#c9a84c;}
.cmodal-wa-btn{display:inline-flex;align-items:center;gap:.6rem;background:#25d366;color:#fff;padding:11px 20px;text-decoration:none;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;transition:all .3s;margin-top:2rem;width:fit-content;}
.cmodal-wa-btn:hover{background:#128c7e;transform:translateY(-2px);}
.cmodal-right{padding:3rem 2.5rem;position:relative;}
.cmodal-close{position:absolute;top:1.25rem;right:1.25rem;background:none;border:1px solid var(--border);width:34px;height:34px;border-radius:50%;cursor:pointer;color:var(--text2);font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all .3s;}
.cmodal-close:hover{border-color:var(--gold);color:var(--text);transform:rotate(90deg);}
.cmodal-right h3{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:400;margin-bottom:.4rem;}
.cmodal-right > p{font-size:.82rem;color:var(--text2);margin-bottom:2rem;line-height:1.6;}
.cmodal-form-group{margin-bottom:1.1rem;}
.cmodal-form-group label{display:block;font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:var(--silver);margin-bottom:.45rem;}
.cmodal-form-input{width:100%;background:var(--bg2);border:1px solid var(--border);padding:11px 14px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;transition:border-color .3s,box-shadow .3s;}
.cmodal-form-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,0.08);}
.cmodal-form-input::placeholder{color:var(--text2);opacity:.5;}
textarea.cmodal-form-input{min-height:88px;resize:vertical;}
.cmodal-form-row{display:grid;grid-template-columns:1fr 1fr;gap:.85rem;}
.cmodal-submit-btn{width:100%;background:var(--text);color:var(--bg);border:none;padding:13px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;transition:all .3s;margin-top:.25rem;position:relative;overflow:hidden;}
.cmodal-submit-btn::after{content:'';position:absolute;inset:0;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.4,0,.2,1);}
.cmodal-submit-btn:hover::after{transform:scaleX(1);}
.cmodal-submit-btn span{position:relative;z-index:1;}
.cmodal-success-msg{display:none;background:linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.05));border:1px solid rgba(201,168,76,0.3);color:var(--gold);padding:12px 16px;margin-top:1rem;font-size:.82rem;letter-spacing:.05em;text-align:center;}
@media(max-width:600px){.contact-modal{grid-template-columns:1fr;}.cmodal-left{padding:2rem 1.5rem;}.cmodal-right{padding:2rem 1.5rem;}.cmodal-form-row{grid-template-columns:1fr;}}
`;

const modalHTML = `
<!-- CONTACT MODAL -->
<div class="contact-modal-overlay" id="contactModalOverlay" onclick="handleContactOverlayClick(event)">
  <div class="contact-modal" id="contactModal">
    <div class="cmodal-left">
      <p class="cmodal-eyebrow">✦ Get in touch</p>
      <h2>Let's talk<br><em>jewellery.</em></h2>
      <p>Whether you have a question about a piece, a custom order, or just want to say hello — we'd love to hear from you.</p>
      <div class="cmodal-contacts">
        <div class="cmodal-contact-item">
          <div class="cmodal-contact-icon">📞</div>
          <div class="cmodal-contact-text"><p>Call / WhatsApp</p><a href="tel:+918004703038">+91 8004703038</a></div>
        </div>
        <div class="cmodal-contact-item">
          <div class="cmodal-contact-icon">🕐</div>
          <div class="cmodal-contact-text"><p>Working Hours</p><span>Mon–Sat: 10am – 8pm</span></div>
        </div>
      </div>
      <a href="https://wa.me/918004703038?text=Hi%20Navyra!%20I%20have%20a%20question." target="_blank" class="cmodal-wa-btn">💬 &nbsp;Chat on WhatsApp</a>
    </div>
    <div class="cmodal-right">
      <button class="cmodal-close" onclick="closeContactModal()">✕</button>
      <h3>Send a Message</h3>
      <p>We reply within 24 hours. For quick answers, WhatsApp is fastest.</p>
      <form onsubmit="submitContactForm(event)">
        <div class="cmodal-form-row">
          <div class="cmodal-form-group"><label>Your Name *</label><input type="text" class="cmodal-form-input" id="cfname" placeholder="Priya Sharma" required/></div>
          <div class="cmodal-form-group"><label>Phone</label><input type="tel" class="cmodal-form-input" id="cfphone" placeholder="+91 9876543210"/></div>
        </div>
        <div class="cmodal-form-group"><label>Email</label><input type="email" class="cmodal-form-input" id="cfemail" placeholder="priya@email.com"/></div>
        <div class="cmodal-form-group"><label>Subject</label><input type="text" class="cmodal-form-input" id="cfsubject" placeholder="Order inquiry, custom piece..."/></div>
        <div class="cmodal-form-group"><label>Message *</label><textarea class="cmodal-form-input" id="cfmessage" placeholder="How can we help you?" required></textarea></div>
        <button type="submit" class="cmodal-submit-btn"><span>Send Message →</span></button>
        <div class="cmodal-success-msg" id="cSuccessMsg">✦ Thank you! We'll be in touch within 24 hours.</div>
      </form>
    </div>
  </div>
</div>
`;

const modalJS = `
function openContactModal(){document.getElementById('contactModalOverlay').classList.add('open');document.body.style.overflow='hidden';}
function closeContactModal(){document.getElementById('contactModalOverlay').classList.remove('open');document.body.style.overflow='';}
function handleContactOverlayClick(e){if(e.target===document.getElementById('contactModalOverlay'))closeContactModal();}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeContactModal();});
async function submitContactForm(e){
  e.preventDefault();
  const data={name:document.getElementById('cfname').value,phone:document.getElementById('cfphone').value,email:document.getElementById('cfemail').value,subject:document.getElementById('cfsubject').value,message:document.getElementById('cfmessage').value};
  try{await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});}catch(err){}
  document.getElementById('cSuccessMsg').style.display='block';
  e.target.reset();
  setTimeout(()=>document.getElementById('cSuccessMsg').style.display='none',5000);
}
`;

pages.forEach(p => {
  const fp = path.join(__dirname, p);
  let content = fs.readFileSync(fp, 'utf8');

  // 1. Inject CSS before </style>
  if (!content.includes('.contact-modal-overlay')) {
    content = content.replace('</style>', modalCSS + '\n</style>');
  }

  // 2. Inject Modal HTML before </body>
  if (!content.includes('id="contactModalOverlay"')) {
    content = content.replace('</body>', modalHTML + '\n</body>');
  }

  // 3. Inject Modal JS before </script></body>
  if (!content.includes('openContactModal')) {
    content = content.replace('</script>\n</body>', '\n' + modalJS + '\n</script>\n</body>');
  }

  // 4. Update Contact nav link to open modal
  content = content.replace(
    /<a href="\/contact"([^>]*)>Contact<\/a>/g,
    '<a href="#" onclick="openContactModal();return false;"$1>Contact</a>'
  );

  // 5. Update Contact mobile nav link
  content = content.replace(
    /<a href="\/contact" class="mobile-nav-item([^"]*)"([^>]*)>Contact<\/a>/g,
    '<a href="#" class="mobile-nav-item$1"$2 onclick="openContactModal();return false;">Contact</a>'
  );

  fs.writeFileSync(fp, content);
  console.log('✅ Injected contact modal into ' + p);
});
