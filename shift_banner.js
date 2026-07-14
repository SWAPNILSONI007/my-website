const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const bannerCss = `
/* FLASH SALE BANNER */
.flash-banner{position:fixed;top:0;left:0;width:100%;z-index:2000;background:var(--flash,#1a0a0a);color:#f0ebe3;padding:5px 0;text-align:center;font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;}
.flash-banner a{color:var(--gold-accent,#c9a84c);text-decoration:none;margin-left:.5rem;font-weight:600;}
`;

const bannerHtml = `
<!-- Flash Banner -->
<div class="flash-banner">⚡ Flash Sale Live — Up to 40% Off Selected Pieces <a href="/flash-sale">Shop Now →</a></div>
`;

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update nav top position
  content = content.replace(/nav\{position:fixed;top:0;/g, 'nav{position:fixed;top:26px;');

  // 2. Remove old flash banner css if exists
  content = content.replace(/\/\* FLASH SALE BANNER \*\/\s*\.flash-banner\{[^}]+\}\s*\.flash-banner a\{[^}]+\}/g, '');
  
  // 3. Insert new flash banner css before </style>
  if(!content.includes('position:fixed;top:0;left:0;width:100%;z-index:2000;background:var(--flash')) {
      content = content.replace('</style>', bannerCss + '\n</style>');
  }

  // 4. Remove old flash banner html if exists
  content = content.replace(/<!-- Flash Banner -->\s*<div class="flash-banner">.*?<\/div>/g, '');

  // 5. Insert new flash banner html just before <!-- NAV -->
  if(!content.includes('class="flash-banner"')) {
      content = content.replace('<!-- NAV -->', bannerHtml + '\n<!-- NAV -->');
  }

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
