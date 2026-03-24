const fs = require('fs');

const pages = [
  'public/index.html',
  'public/shop.html',
  'public/flash-sale.html',
  'public/about.html',
  'public/product.html'
];

const jsBlock = `<script>
function openContactModal(){document.getElementById("contactModalOverlay").classList.add("open");document.body.style.overflow="hidden";}
function closeContactModal(){document.getElementById("contactModalOverlay").classList.remove("open");document.body.style.overflow="";}
function handleContactOverlayClick(e){if(e.target===document.getElementById("contactModalOverlay"))closeContactModal();}
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeContactModal();});
async function submitContactForm(e){
  e.preventDefault();
  const data={name:document.getElementById("cfname").value,phone:document.getElementById("cfphone").value,email:document.getElementById("cfemail").value,subject:document.getElementById("cfsubject").value,message:document.getElementById("cfmessage").value};
  try{await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});}catch(err){}
  document.getElementById("cSuccessMsg").style.display="block";
  e.target.reset();
  setTimeout(()=>document.getElementById("cSuccessMsg").style.display="none",5000);
}
</script>`;

pages.forEach(p => {
  let content = fs.readFileSync(p, 'utf8');

  // Check if function is already INSIDE </body> (i.e., before </body>)
  const bodyClose = content.lastIndexOf('</body>');
  const funcPos = content.lastIndexOf('function openContactModal');

  if (funcPos === -1) {
    // Not present at all - insert before </body>
    content = content.replace('</body>', jsBlock + '\n</body>');
    console.log('Inserted (missing): ' + p);
  } else if (funcPos > bodyClose) {
    // Function exists but after </body> - move it inside
    // Remove trailing appended script
    const scriptStart = content.lastIndexOf('<script>', funcPos);
    const scriptEnd = content.indexOf('</script>', funcPos) + '</script>'.length;
    const trailingScript = content.substring(scriptStart, scriptEnd);
    content = content.substring(0, scriptStart) + content.substring(scriptEnd);
    // Now insert before </body>
    content = content.replace('</body>', jsBlock + '\n</body>');
    console.log('Moved inside body: ' + p);
  } else {
    console.log('Already correct: ' + p);
  }

  fs.writeFileSync(p, content);
});
