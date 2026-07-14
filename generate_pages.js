const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const aboutHtml = fs.readFileSync(path.join(publicDir, 'about.html'), 'utf8');

// Find where main content starts and ends
const contentStartIdx = aboutHtml.indexOf('<section class="about-hero">');
const contentEndIdx = aboutHtml.indexOf('<footer>');

if(contentStartIdx === -1 || contentEndIdx === -1) {
    console.error("Could not find content bounds");
    process.exit(1);
}

const headerPart = aboutHtml.substring(0, contentStartIdx);
const footerPart = aboutHtml.substring(contentEndIdx);

// Pages to generate
const pages = [
    {
        file: 'shipping-policy.html',
        title: 'Shipping Policy — Silviyara Jewels',
        heroTitle: 'Shipping <em>Policy</em>',
        content: `
<section class="story-section" style="padding-top: 60px;">
  <div style="max-width:800px; margin:0 auto; background:var(--card); border:1px solid var(--border); padding:40px;">
    <h2 style="font-family:'Playfair Display',serif; font-size:2rem; margin-bottom:1rem; font-weight:400;">Delivery Information</h2>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">At Silviyara Jewels, we ensure that your precious pieces reach you safely and swiftly.</p>
    
    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Shipping Costs</h3>
    <ul style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem; padding-left:20px;">
      <li><strong>Free Shipping:</strong> On all orders above ₹999.</li>
      <li><strong>Standard Shipping:</strong> A flat rate of ₹49 applies to orders under ₹999.</li>
    </ul>

    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Delivery Timeframes</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">All orders are processed within 24-48 hours. Standard delivery takes 3-5 business days across India. For local deliveries within Lucknow, you can expect your order within 1-2 days.</p>
    
    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Tracking Your Order</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">Once your order is shipped, tracking details will be provided via WhatsApp for your convenience.</p>

    <div style="background:var(--bg2); padding:20px; border-left:4px solid var(--gold); margin-top:2rem;">
      <p style="font-size:0.9rem; color:var(--text2);"><em>Currently, we only ship within India. Special handling is applied for delicate items to ensure they reach you in perfect condition.</em></p>
    </div>
  </div>
</section>
`
    },
    {
        file: 'return-policy.html',
        title: 'Return Policy — Silviyara Jewels',
        heroTitle: 'Return <em>Policy</em>',
        content: `
<section class="story-section" style="padding-top: 60px;">
  <div style="max-width:800px; margin:0 auto; background:var(--card); border:1px solid var(--border); padding:40px;">
    <h2 style="font-family:'Playfair Display',serif; font-size:2rem; margin-bottom:1rem; font-weight:400;">Returns & Exchanges</h2>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">We want you to love your Silviyara Jewels. If you're not completely satisfied, we're here to help.</p>
    
    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">7-Day Return Window</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">You have 7 days from the date of delivery to initiate a return or exchange. Items must be in their original condition with all packaging intact.</p>

    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Return Process & Refunds</h3>
    <ul style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem; padding-left:20px;">
      <li>Return shipping is free for defective or damaged items.</li>
      <li>Refunds are processed within 5-7 business days to your original payment method.</li>
      <li>Exchanges are available if you need a different size or design.</li>
      <li><strong>Note:</strong> Custom-made items are non-returnable.</li>
    </ul>

    <div style="background:var(--bg2); padding:20px; border:1px solid var(--border); text-align:center; margin-top:2rem;">
      <p style="margin-bottom:1rem; color:var(--text2);">To initiate a return or exchange, please contact us on WhatsApp.</p>
      <a href="https://wa.me/918004703038" target="_blank" class="btn-primary" style="text-decoration:none;">Contact Support</a>
    </div>
  </div>
</section>
`
    },
    {
        file: 'privacy-policy.html',
        title: 'Privacy Policy — Silviyara Jewels',
        heroTitle: 'Privacy <em>Policy</em>',
        content: `
<section class="story-section" style="padding-top: 60px;">
  <div style="max-width:800px; margin:0 auto; background:var(--card); border:1px solid var(--border); padding:40px;">
    <p style="color:var(--text2); line-height:1.8; margin-bottom:2rem;">At Silviyara Jewels, your privacy is our priority. This policy outlines how we collect, use, and protect your data.</p>
    
    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Information We Collect</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">We collect basic information required to process your orders, including your name, email address, phone number, and delivery address. We use cookies to enhance site functionality.</p>

    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">How We Use Your Data</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">Your data is used solely for order processing, delivery, and communication regarding your purchase. <strong>We never sell your data to third parties.</strong></p>

    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Payment Security</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">We use Razorpay for secure payments. Your payment details are processed securely by Razorpay, and we do not store your credit card or bank details on our servers.</p>

    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Your Rights</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">You have the right to access, update, or request the deletion of your personal data. For any privacy concerns, please contact our support team.</p>
  </div>
</section>
`
    },
    {
        file: 'terms.html',
        title: 'Terms & Conditions — Silviyara Jewels',
        heroTitle: 'Terms & <em>Conditions</em>',
        content: `
<section class="story-section" style="padding-top: 60px;">
  <div style="max-width:800px; margin:0 auto; background:var(--card); border:1px solid var(--border); padding:40px;">
    <p style="color:var(--text2); line-height:1.8; margin-bottom:2rem;">Welcome to Silviyara Jewels. By using our website and purchasing our products, you agree to the following terms.</p>
    
    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Orders & Pricing</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">All prices are in Indian Rupees (₹) and are inclusive of GST. We reserve the right to modify prices without prior notice. Account registration is optional but recommended for tracking orders.</p>

    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Payments</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">We accept online payments via Razorpay as well as Cash on Delivery (COD) for eligible pin codes.</p>

    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Intellectual Property</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">All content, designs, and images on this website are the intellectual property of Silviyara Jewels and may not be used without permission.</p>

    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Governing Law</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Lucknow, Uttar Pradesh.</p>
  </div>
</section>
`
    },
    {
        file: 'size-guide.html',
        title: 'Size Guide — Silviyara Jewels',
        heroTitle: 'Size <em>Guide</em>',
        content: `
<section class="story-section" style="padding-top: 60px;">
  <div style="max-width:800px; margin:0 auto; background:var(--card); border:1px solid var(--border); padding:40px;">
    <h2 style="font-family:'Playfair Display',serif; font-size:2rem; margin-bottom:1rem; font-weight:400;">Find Your Perfect Fit</h2>
    
    <h3 style="font-size:1.4rem; margin-bottom:1rem; margin-top:2rem; font-family:'Playfair Display',serif;">Ring Sizing</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1rem;">Measure the circumference of your finger using a string, then check our chart.</p>
    <table style="width:100%; border-collapse:collapse; margin-bottom:2rem; text-align:left;">
      <tr style="background:var(--bg2); border-bottom:1px solid var(--border);">
        <th style="padding:12px; font-weight:500;">Indian Size</th>
        <th style="padding:12px; font-weight:500;">Circumference (mm)</th>
      </tr>
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:12px;">10</td><td style="padding:12px;">50 mm</td>
      </tr>
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:12px;">12</td><td style="padding:12px;">52 mm</td>
      </tr>
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:12px;">14</td><td style="padding:12px;">54 mm</td>
      </tr>
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:12px;">16</td><td style="padding:12px;">56 mm</td>
      </tr>
    </table>

    <h3 style="font-size:1.4rem; margin-bottom:1rem; margin-top:2rem; font-family:'Playfair Display',serif;">Necklace Lengths</h3>
    <ul style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem; padding-left:20px;">
      <li><strong>14" Choker:</strong> Wraps closely around the neck.</li>
      <li><strong>16" Collar:</strong> Rests perfectly around the base of the neck.</li>
      <li><strong>18" Princess:</strong> Falls just below the throat at the collarbone.</li>
      <li><strong>20" Matinee:</strong> Sits nicely on the collarbone.</li>
    </ul>

    <div style="background:var(--bg2); padding:20px; border:1px solid var(--border); text-align:center; margin-top:2rem;">
      <p style="margin-bottom:1rem; color:var(--text2);">Still unsure about your size? We're here to help.</p>
      <a href="https://wa.me/918004703038" target="_blank" class="btn-primary" style="text-decoration:none;">Chat on WhatsApp</a>
    </div>
  </div>
</section>
`
    },
    {
        file: 'care-instructions.html',
        title: 'Care Instructions — Silviyara Jewels',
        heroTitle: 'Care <em>Instructions</em>',
        content: `
<section class="story-section" style="padding-top: 60px;">
  <div style="max-width:800px; margin:0 auto; background:var(--card); border:1px solid var(--border); padding:40px;">
    <h2 style="font-family:'Playfair Display',serif; font-size:2rem; margin-bottom:1rem; font-weight:400;">Caring for Sterling Silver</h2>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:2rem;">With the right care, your 925 sterling silver jewellery will retain its brilliance for generations.</p>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:2rem;">
      <div style="background:var(--bg2); padding:20px; border:1px solid var(--border);">
        <h3 style="font-size:1.1rem; margin-bottom:10px;">✅ Do's</h3>
        <ul style="color:var(--text2); padding-left:20px; line-height:1.6;">
          <li>Store in anti-tarnish pouches or separate compartments.</li>
          <li>Clean gently with mild soap and water.</li>
          <li>Use a silver polishing cloth to restore shine.</li>
          <li>Wear it often — natural oils keep silver shining!</li>
        </ul>
      </div>
      <div style="background:var(--bg2); padding:20px; border:1px solid var(--border);">
        <h3 style="font-size:1.1rem; margin-bottom:10px;">❌ Don'ts</h3>
        <ul style="color:var(--text2); padding-left:20px; line-height:1.6;">
          <li>Avoid exposure to harsh chemicals or bleach.</li>
          <li>Keep away from perfumes, lotions, and hairspray.</li>
          <li>Remove before swimming in pools (chlorine) or oceans.</li>
          <li>Avoid sleeping in delicate pieces.</li>
        </ul>
      </div>
    </div>

    <h3 style="font-size:1.2rem; margin-bottom:0.5rem; margin-top:2rem;">Tarnish Prevention</h3>
    <p style="color:var(--text2); line-height:1.8; margin-bottom:1.5rem;">Silver naturally tarnishes when exposed to air and humidity. Keep your pieces in an airtight zip-lock bag when not in use. If severe tarnishing occurs, professional cleaning is recommended.</p>
  </div>
</section>
`
    }
];

pages.forEach(page => {
    // Replace title
    let newHeader = headerPart.replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`);
    
    // Remove "active" class from nav items
    newHeader = newHeader.replace(/class="active"/g, 'class=""');
    newHeader = newHeader.replace(/class="mobile-nav-item active"/g, 'class="mobile-nav-item"');
    
    const heroSection = `
<section class="about-hero" style="padding-bottom: 40px;">
  <p class="section-label">✦ Silviyara Jewels</p>
  <h1>${page.heroTitle}</h1>
</section>
`;

    // Also inject updated footer with all links
    const newFooterPart = footerPart.replace(/<div class="footer-grid">[\s\S]*?<\/div>\s*<div class="footer-bottom">/, `
  <div class="footer-grid">
    <div class="footer-brand">
      <a href="/" class="logo">Silviyara <span style="color:var(--silver);font-style:italic">Jewels</span></a>
      <p>Handpicked sterling silver jewellery from Lucknow. Crafted for the modern woman who values elegance and authenticity.</p>
    </div>
    <div class="footer-col">
      <h4>Collections</h4>
      <a href="/shop?cat=pendant">Pendant</a>
      <a href="/shop?cat=ear-jewellery">Ear Jewellery</a>
      <a href="/shop?cat=rings">Rings</a>
      <a href="/shop?cat=anklets">Anklets</a>
      <a href="/shop?cat=bracelets">Bracelets</a>
      <a href="/shop?cat=necklaces">Necklaces</a>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <a href="/shop">Shop All</a>
      <a href="/flash-sale">Flash Sale</a>
      <a href="/custom-design">Custom Design</a>
      <a href="/about">About Us</a>
      <a href="#" onclick="openContactModal();return false;">Contact</a>
      <a href="/size-guide">Size Guide</a>
      <a href="/care-instructions">Care Instructions</a>
    </div>
    <div class="footer-col">
      <h4>Policies</h4>
      <a href="/shipping-policy">Shipping Policy</a>
      <a href="/return-policy">Return Policy</a>
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/terms">Terms & Conditions</a>
    </div>
  </div>
  <div class="footer-bottom">`);

    const finalHtml = newHeader + heroSection + page.content + newFooterPart;
    fs.writeFileSync(path.join(publicDir, page.file), finalHtml);
    console.log("Generated:", page.file);
});
