const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

// Lazy init — won't crash server startup if key is missing
let _groq = null;
function getGroq() {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) return null;
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}

// ─── Product Catalog (used for recommendations) ───────────────────────────────
// FIXED: Tags now use full, specific phrases instead of short substrings
// This prevents false matches like 'ear' matching 'wear', 'ring' matching 'ordering'
const PRODUCTS = [
  { id: 'ring',      name: 'Twisted Band Ring',   price: '₹699',   originalPrice: '₹999',  emoji: '💍', category: 'rings',      tags: ['twisted band ring', 'band ring', 'silver ring', 'finger ring', 'rings'],   link: '/shop.html' },
  { id: 'anklet',   name: 'Silver Anklet Chain',  price: '₹599',   originalPrice: null,     emoji: '✨', category: 'anklets',    tags: ['anklet', 'payal', 'ankle chain', 'silver anklet', 'anklets'],              link: '/shop.html' },
  { id: 'bracelet', name: 'Charm Bracelet',        price: '₹1,099', originalPrice: null,     emoji: '📿', category: 'bracelets',  tags: ['bracelet', 'charm bracelet', 'wrist band', 'bracelets'],                   link: '/shop.html' },
  { id: 'earring',  name: 'Jhumka Earrings',       price: '₹899',   originalPrice: null,     emoji: '💎', category: 'earrings',   tags: ['earring', 'jhumka', 'jhoomka', 'jhumki', 'earrings', 'ear rings'],         link: '/shop.html' },
  { id: 'choker',   name: 'Silver Choker',         price: '₹1,499', originalPrice: '₹1,999', emoji: '💫', category: 'necklaces',  tags: ['choker', 'silver choker', 'necklace', 'collar necklace', 'necklaces'],     link: '/shop.html' },
  { id: 'moonpend', name: 'Moon Pendant',           price: '₹1,299', originalPrice: null,     emoji: '🌙', category: 'pendants',   tags: ['moon pendant', 'moon locket', 'crescent pendant', 'pendant'],              link: '/shop.html' },
  { id: 'lotus',    name: 'Lotus Pendant',          price: '₹999',   originalPrice: null,     emoji: '🪷', category: 'pendants',   tags: ['lotus pendant', 'lotus locket', 'flower pendant', 'lotus'],                link: '/shop.html' },
  { id: 'hairpin',  name: 'Floral Hair Pin',        price: '₹399',   originalPrice: null,     emoji: '🌸', category: 'hair',       tags: ['hair pin', 'hairpin', 'floral pin', 'hair clip', 'hair accessory'],        link: '/shop.html' },
];

// Complementary product map: if customer bought/asked about X, suggest Y
const COMPLEMENTS = {
  ring:      ['bracelet', 'earring', 'anklet'],
  anklet:    ['ring', 'bracelet', 'earring'],
  bracelet:  ['ring', 'earring', 'anklet'],
  earring:   ['choker', 'moonpend', 'lotus'],
  choker:    ['earring', 'moonpend', 'lotus'],
  moonpend:  ['earring', 'choker', 'lotus'],
  lotus:     ['earring', 'choker', 'moonpend'],
  hairpin:   ['earring', 'lotus', 'moonpend'],
};

// ── FIXED: detectProduct only scans user's own message, using word-boundary regex ──
function detectProduct(text) {
  if (!text || typeof text !== 'string') return null;
  const lower = text.toLowerCase().trim();

  // Skip pure greetings — no product detection needed
  if (/^(hi+|hello+|hey+|hii+|helo|namaste|namaskar|good\s*(morning|evening|afternoon|night)|sup|howdy|yo|hye)[\s!?.]*$/i.test(lower)) {
    return null;
  }

  for (const p of PRODUCTS) {
    // Use word boundaries so 'ring' won't match 'ordering', 'earring' etc.
    if (p.tags.some(tag => {
      const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i').test(lower);
    })) return p;
  }
  return null;
}

// Get recommendation cards for a detected product
function getRecommendations(productId, count = 2) {
  const complementIds = COMPLEMENTS[productId] || [];
  return complementIds
    .slice(0, count)
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter(Boolean);
}

// System prompt with full Silviyara Jewels context
const SYSTEM_PROMPT = `You are Silviyara, the friendly and knowledgeable AI assistant for Silviyara Jewels — a premium silver jewellery brand based in Lucknow, India.

ABOUT THE STORE:
- Name: Silviyara Jewels
- Specialty: Handpicked 925 Sterling Silver Jewellery
- Location: Lucknow, Uttar Pradesh, India
- Working Hours: Monday to Saturday, 10am–8pm
- Phone / WhatsApp: +91 8004703038
- Payment: Cash on Delivery (COD) only

COLLECTIONS & PRODUCTS:
- Pendant: Moon Pendant (₹1,299), Lotus Pendant (₹999)
- Ear Jewellery: Jhumka Earrings (₹899)
- Rings: Twisted Band Ring (₹699, was ₹999)
- Anklets: Silver Anklet Chain (₹599)
- Bracelets: Charm Bracelet (₹1,099)
- Necklaces: Silver Choker (₹1,499, was ₹1,999)
- Hair Accessories: Floral Hair Pin (₹399)
- Gold collection: Coming soon!

POLICIES:
- Free delivery across India on orders above ₹999
- Delivery in 3–5 business days
- 7-day easy returns, no questions asked
- All pieces are hallmarked 925 Sterling Silver

HOW TO ORDER:
1. Browse the website and add items to cart
2. Click "Proceed to Checkout" and fill in your details
3. Or order directly on WhatsApp: +91 8004703038

CURRENT OFFER: Flash Sale is LIVE — up to 40% off on selected pieces!

YOUR PERSONALITY:
- Warm, elegant, and helpful — like a personal jewellery advisor
- Speak in a friendly, conversational tone
- Keep responses concise (2–4 sentences) unless asked for details
- Always help customers find the right piece or answer their questions
- For greetings like "hi" or "hello", simply greet back warmly and ask how you can help — do NOT list products unprompted
- When a customer specifically asks about a piece, you may briefly mention it pairs beautifully with other items, but keep it natural and not pushy
- If asked about something you don't know, suggest contacting via WhatsApp
- Use ✨ and 💍 sparingly for warmth
- Respond in the same language the customer uses (Hindi or English)

IMPORTANT: Never make up prices, policies, or products that aren't listed above.`;

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({
        reply: "I'm currently unavailable. Please contact us on WhatsApp at +91 8004703038 for assistance! 💬",
        product: null,
        suggestions: []
      });
    }

    // Build messages array: system prompt + chat history + new message
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(history || []).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message.trim() }
    ];

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 300,
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I didn't catch that. Could you try again? ✨";

    // ── FIXED Product Recommendation Logic ────────────────────────────────────
    // ONLY scan the USER's own message — NEVER the bot's reply or history
    // This prevents false positives when the bot greets with jewellery words
    const askedProduct = detectProduct(message);
    const suggestions  = askedProduct ? getRecommendations(askedProduct.id, 2) : [];

    console.log(`✅ Groq chatbot replied | product: ${askedProduct?.name || 'none'} | suggestions: ${suggestions.length}`);
    res.json({ reply, product: askedProduct || null, suggestions });

  } catch (err) {
    console.error('Chatbot error:', err.message);
    res.status(200).json({
      reply: "I'm having a little trouble right now. Please try again or reach us on WhatsApp at +91 8004703038 ✨",
      product: null,
      suggestions: []
    });
  }
});

module.exports = router;
