const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt with full Navyra Jewellers context
const SYSTEM_PROMPT = `You are Navyra, the friendly and knowledgeable AI assistant for Navyra Jewellers — a premium silver jewellery brand based in Lucknow, India.

ABOUT THE STORE:
- Name: Navyra Jewellers
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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        reply: "I'm currently unavailable. Please contact us on WhatsApp at +91 8004703038 for assistance! 💬"
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    // Build chat history for context
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error('Chatbot error:', err.message);
    res.status(500).json({ 
      reply: "I'm having a little trouble right now. Please try again or reach us on WhatsApp at +91 8004703038 ✨"
    });
  }
});

module.exports = router;
