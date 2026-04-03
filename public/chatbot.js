(function () {
  // ─── Inject CSS ──────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
  /* ── Chatbot Widget ─────────────────────────────────── */
  #navyra-chat-btn {
    position: fixed;
    bottom: 100px;
    right: 28px;
    z-index: 9998;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1c1814 0%, #2a2218 100%);
    border: 1.5px solid rgba(201,168,76,0.5);
    box-shadow: 0 4px 24px rgba(0,0,0,0.35), 0 0 0 0 rgba(201,168,76,0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(.4,0,.2,1);
    animation: navyra-pulse 2.8s infinite;
    outline: none;
  }
  #navyra-chat-btn:hover {
    transform: scale(1.1) translateY(-2px);
    border-color: rgba(201,168,76,0.9);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 6px rgba(201,168,76,0.12);
  }
  #navyra-chat-btn svg {
    width: 24px;
    height: 24px;
    fill: #c9a84c;
    transition: transform 0.3s;
  }
  #navyra-chat-btn.open svg.icon-chat { display: none; }
  #navyra-chat-btn.open svg.icon-close { display: block !important; }
  #navyra-chat-btn svg.icon-close { display: none; }
  .navyra-unread-dot {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 11px;
    height: 11px;
    background: #c9a84c;
    border-radius: 50%;
    border: 2px solid var(--card, #fff);
    animation: navyra-dot-bounce 1s ease infinite;
  }

  @keyframes navyra-pulse {
    0%,100% { box-shadow: 0 4px 24px rgba(0,0,0,0.35), 0 0 0 0 rgba(201,168,76,0.4); }
    50% { box-shadow: 0 4px 24px rgba(0,0,0,0.35), 0 0 0 8px rgba(201,168,76,0); }
  }
  @keyframes navyra-dot-bounce {
    0%,100% { transform: scale(1); }
    50% { transform: scale(1.3); }
  }

  #navyra-chat-window {
    position: fixed;
    bottom: 168px;
    right: 28px;
    z-index: 9999;
    width: 368px;
    max-width: calc(100vw - 32px);
    max-height: 580px;
    background: var(--card, #ffffff);
    border: 1px solid var(--border, #e8e0d5);
    border-radius: 16px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(201,168,76,0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: scale(0.92) translateY(16px);
    opacity: 0;
    pointer-events: none;
    transition: all 0.35s cubic-bezier(.4,0,.2,1);
    transform-origin: bottom right;
  }
  #navyra-chat-window.open {
    transform: scale(1) translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  /* Header */
  .nch-header {
    background: linear-gradient(135deg, #0e0a08 0%, #1c1410 100%);
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(201,168,76,0.2);
    flex-shrink: 0;
  }
  .nch-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(201,168,76,0.15);
    border: 1.5px solid rgba(201,168,76,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  .nch-info { flex: 1; }
  .nch-name {
    font-family: 'Playfair Display', serif;
    font-size: 0.95rem;
    color: #f0ebe3;
    font-weight: 400;
    letter-spacing: 0.03em;
  }
  .nch-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.68rem;
    color: rgba(240,235,227,0.55);
    letter-spacing: 0.05em;
    margin-top: 2px;
  }
  .nch-online-dot {
    width: 7px;
    height: 7px;
    background: #4caf7a;
    border-radius: 50%;
  }
  .nch-close-btn {
    background: none;
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(240,235,227,0.6);
    font-size: 0.85rem;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .nch-close-btn:hover {
    border-color: #c9a84c;
    color: #c9a84c;
    transform: rotate(90deg);
  }

  /* Messages */
  .nch-messages {
    flex: 1;
    overflow-y: auto;
    padding: 18px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scroll-behavior: smooth;
  }
  .nch-messages::-webkit-scrollbar { width: 4px; }
  .nch-messages::-webkit-scrollbar-track { background: transparent; }
  .nch-messages::-webkit-scrollbar-thumb { background: var(--border, #e8e0d5); border-radius: 2px; }

  .nch-bubble-wrap {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    animation: nch-fadeIn 0.3s ease;
  }
  .nch-bubble-wrap.user { flex-direction: row-reverse; }
  @keyframes nch-fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .nch-bubble-avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    flex-shrink: 0;
    margin-bottom: 2px;
  }
  .nch-bubble-wrap.user .nch-bubble-avatar {
    width: 22px;
    height: 22px;
    background: var(--text, #1c1814);
    border-color: transparent;
    font-size: 0.6rem;
    color: var(--bg, #faf8f5);
  }

  .nch-bubble {
    max-width: 78%;
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 0.85rem;
    line-height: 1.55;
    position: relative;
  }
  .nch-bubble-wrap.bot .nch-bubble {
    background: var(--bg2, #f2ede6);
    color: var(--text, #1c1814);
    border: 1px solid var(--border, #e8e0d5);
    border-bottom-left-radius: 4px;
  }
  .nch-bubble-wrap.user .nch-bubble {
    background: linear-gradient(135deg, #1c1814, #2a2218);
    color: #f0ebe3;
    border-bottom-right-radius: 4px;
    font-size: 0.8rem;
    padding: 8px 12px;
  }
  [data-theme="dark"] .nch-bubble-wrap.bot .nch-bubble {
    background: #1a1816;
    color: #f0ebe3;
    border-color: #2a2520;
  }

  /* Typing indicator */
  .nch-typing {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 12px 14px;
  }
  .nch-typing span {
    width: 7px;
    height: 7px;
    background: var(--silver, #8a8a9a);
    border-radius: 50%;
    animation: nch-typing-bounce 1.4s infinite;
  }
  .nch-typing span:nth-child(2) { animation-delay: 0.2s; }
  .nch-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes nch-typing-bounce {
    0%,60%,100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-5px); opacity: 1; }
  }

  /* Quick replies — rendered inside the message scroll area */
  .nch-quick-replies {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 4px 0 2px;
  }
  .nch-qr {
    background: none;
    border: 1px solid var(--border, #e8e0d5);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 0.75rem;
    color: var(--text2, #6b5f52);
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    white-space: nowrap;
  }
  .nch-qr:hover {
    border-color: #c9a84c;
    color: #c9a84c;
    background: rgba(201,168,76,0.06);
  }

  /* Input */
  .nch-input-area {
    border-top: 1px solid var(--border, #e8e0d5);
    padding: 12px 14px;
    display: flex;
    align-items: flex-end;
    gap: 8px;
    flex-shrink: 0;
    background: var(--card, #fff);
  }
  #navyra-chat-input {
    flex: 1;
    background: var(--bg2, #f2ede6);
    border: 1px solid var(--border, #e8e0d5);
    border-radius: 20px;
    padding: 9px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    color: var(--text, #1c1814);
    outline: none;
    resize: none;
    max-height: 100px;
    line-height: 1.4;
    transition: border-color 0.2s, box-shadow 0.2s;
    overflow-y: auto;
  }
  #navyra-chat-input:focus {
    border-color: #c9a84c;
    box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
  }
  #navyra-chat-input::placeholder { color: var(--text2, #6b5f52); opacity: 0.6; }
  [data-theme="dark"] #navyra-chat-input {
    background: #1a1816;
    color: #f0ebe3;
    border-color: #2a2520;
  }
  [data-theme="dark"] #navyra-chat-input::placeholder { color: #a89b8c; }

  .nch-send-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #c9a84c;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .nch-send-btn:hover { background: #b8963e; transform: scale(1.08); }
  .nch-send-btn:disabled { background: var(--border, #e8e0d5); cursor: not-allowed; transform: none; }
  .nch-send-btn svg { width: 16px; height: 16px; fill: #fff; }

  /* Powered by */
  .nch-footer {
    text-align: center;
    font-size: 0.6rem;
    color: var(--text2, #6b5f52);
    padding: 4px 0 10px;
    opacity: 0.5;
    letter-spacing: 0.05em;
  }

  /* ── Product Suggestion Cards ────────────────── */
  .nch-suggestions-label {
    padding: 4px 0 2px;
    font-size: 0.68rem;
    color: var(--text2, #6b5f52);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    opacity: 0.7;
  }
  .nch-suggestions {
    display: flex;
    gap: 8px;
    padding: 4px 0 2px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
  .nch-suggestions::-webkit-scrollbar { display: none; }
  .nch-suggestion-card {
    flex-shrink: 0;
    scroll-snap-align: start;
    width: 130px;
    background: var(--bg2, #f5f0e8);
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 12px;
    padding: 10px 10px 8px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    animation: nch-fadeIn 0.35s ease;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .nch-suggestion-card:hover {
    border-color: rgba(201,168,76,0.6);
    box-shadow: 0 4px 16px rgba(201,168,76,0.12);
  }
  [data-theme="dark"] .nch-suggestion-card {
    background: #1a1816;
    border-color: rgba(201,168,76,0.2);
  }
  .nch-scard-emoji { font-size: 1.4rem; line-height: 1; margin-bottom: 2px; }
  .nch-scard-name {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text, #1c1814);
    line-height: 1.3;
  }
  [data-theme="dark"] .nch-scard-name { color: #f0ebe3; }
  .nch-scard-price { font-size: 0.8rem; font-weight: 700; color: #c9a84c; }
  .nch-scard-orig {
    font-size: 0.65rem;
    color: var(--text2, #9e8e7e);
    text-decoration: line-through;
  }
  .nch-scard-btn {
    margin-top: 5px;
    background: linear-gradient(135deg, #c9a84c, #b8963e);
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 5px 0;
    font-size: 0.7rem;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    letter-spacing: 0.04em;
    transition: opacity 0.2s;
    text-decoration: none;
    display: block;
  }
  .nch-scard-btn:hover { opacity: 0.82; }

  /* Primary card — the exact product the customer asked about */
  .nch-primary-card {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 2px 0 0;
    padding: 10px 12px;
    background: var(--bg2, #f5f0e8);
    border: 1.5px solid rgba(201,168,76,0.45);
    border-left: 3px solid #c9a84c;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.22s;
    animation: nch-fadeIn 0.35s ease;
    cursor: pointer;
  }
  .nch-primary-card:hover {
    border-color: #c9a84c;
    box-shadow: 0 4px 18px rgba(201,168,76,0.18);
    transform: translateY(-1px);
  }
  [data-theme="dark"] .nch-primary-card {
    background: #1a1816;
    border-color: rgba(201,168,76,0.4);
    border-left-color: #c9a84c;
  }
  .nch-primary-emoji { font-size: 1.6rem; flex-shrink: 0; }
  .nch-primary-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .nch-primary-arrow {
    font-size: 1rem;
    color: #c9a84c;
    font-weight: 700;
    flex-shrink: 0;
    transition: transform 0.2s;
  }
  .nch-primary-card:hover .nch-primary-arrow { transform: translateX(3px); }

  @media (max-width: 420px) {
    #navyra-chat-window { right: 12px; bottom: 156px; width: calc(100vw - 24px); }
    #navyra-chat-btn { right: 12px; bottom: 90px; }
  }
  `;
  document.head.appendChild(style);

  // ─── Inject HTML ─────────────────────────────────────────────────────────────
  const QUICK_REPLIES = [
    '💍 View collections',
    '📦 Delivery info',
    '↩️ Return policy',
    '⚡ Flash sale',
    '💬 Contact us'
  ];

  const html = `
  <!-- Navyra Chatbot Button -->
  <button id="navyra-chat-btn" aria-label="Open chat assistant" title="Chat with Navyra">
    <svg class="icon-chat" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.02 2 11c0 2.73 1.28 5.16 3.3 6.82L4 22l4.55-1.97C9.64 20.64 10.79 21 12 21c5.52 0 10-4.02 10-9s-4.48-9-10-9zm1 13H7v-2h6v2zm4-4H7V9h10v2z"/>
    </svg>
    <svg class="icon-close" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
    <span class="navyra-unread-dot" id="navyraDot"></span>
  </button>

  <!-- Navyra Chat Window -->
  <div id="navyra-chat-window" role="dialog" aria-label="Navyra chat assistant">
    <div class="nch-header">
      <div class="nch-avatar">✨</div>
      <div class="nch-info">
        <div class="nch-name">Navyra Assistant</div>
        <div class="nch-status"><span class="nch-online-dot"></span>Online — replies instantly</div>
      </div>
      <button class="nch-close-btn" onclick="navyraCloseChat()" aria-label="Close chat">✕</button>
    </div>
    <div class="nch-messages" id="navyraMsgs"></div>
    <div class="nch-input-area">
      <textarea id="navyra-chat-input" placeholder="Ask me anything about jewellery..." rows="1" aria-label="Type your message"></textarea>
      <button class="nch-send-btn" id="navyraSendBtn" onclick="navyraSend()" aria-label="Send message">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div class="nch-footer">Powered by Gemini AI · Navyra Jewellers</div>
  </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  // ─── State ───────────────────────────────────────────────────────────────────
  let chatHistory = [];
  let isTyping = false;
  let chatOpened = false;

  const btn = document.getElementById('navyra-chat-btn');
  const win = document.getElementById('navyra-chat-window');
  const msgs = document.getElementById('navyraMsgs');
  const input = document.getElementById('navyra-chat-input');
  const sendBtn = document.getElementById('navyraSendBtn');
  const dot = document.getElementById('navyraDot');

  // Suggestion slot + quick-replies live inside the scrollable messages div
  const suggestSlot = document.createElement('div');
  suggestSlot.id = 'navyraSuggestSlot';
  msgs.appendChild(suggestSlot);

  const qrContainer = document.createElement('div');
  qrContainer.id = 'navyraQR';
  qrContainer.className = 'nch-quick-replies';
  msgs.appendChild(qrContainer);

  // ─── Init ────────────────────────────────────────────────────────────────────
  function navyraInit() {
    // Greet after a short delay to attract attention
    setTimeout(() => {
      if (!chatOpened) dot.style.display = 'block';
    }, 2500);

    btn.addEventListener('click', navyraToggleChat);

    // Enter to send, Shift+Enter for newline
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        navyraSend();
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });
  }

  function navyraToggleChat() {
    const isOpen = win.classList.contains('open');
    if (isOpen) {
      navyraCloseChat();
    } else {
      navyraOpenChat();
    }
  }

  function navyraOpenChat() {
    win.classList.add('open');
    btn.classList.add('open');
    dot.style.display = 'none';
    chatOpened = true;
    input.focus();

    // Show welcome message if first open
    if (chatHistory.length === 0) {
      navyraShowWelcome();
    }
  }

  window.navyraCloseChat = function () {
    win.classList.remove('open');
    btn.classList.remove('open');
  };

  function navyraShowWelcome() {
    const greeting = getGreeting();
    navyraAddBotMessage(`${greeting} I'm Navyra, your personal jewellery advisor! ✨\n\nI can help you explore our sterling silver collections, check prices, delivery info, and more. What can I help you with today?`);
    // Move suggest slot & QR to end of messages after the welcome bubble
    msgs.appendChild(suggestSlot);
    msgs.appendChild(qrContainer);
    renderQuickReplies();
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return '🌅 Good morning!';
    if (h < 17) return '☀️ Good afternoon!';
    return '🌙 Good evening!';
  }

  // ─── Quick Replies ───────────────────────────────────────────────────────────
  function renderQuickReplies() {
    qrContainer.innerHTML = QUICK_REPLIES.map(q =>
      `<button class="nch-qr" onclick="navyraQuickReply('${q}')">${q}</button>`
    ).join('');
  }

  window.navyraQuickReply = function (text) {
    qrContainer.innerHTML = '';
    suggestSlot.innerHTML = '';
    // move containers back to end so they stay below messages
    msgs.appendChild(suggestSlot);
    msgs.appendChild(qrContainer);
    navyraSendMessage(text);
  };

  // ─── Messaging ───────────────────────────────────────────────────────────────
  window.navyraSend = function () {
    const text = input.value.trim();
    if (!text || isTyping) return;
    input.value = '';
    input.style.height = 'auto';
    qrContainer.innerHTML = '';
    suggestSlot.innerHTML = '';
    // keep containers at the bottom of the scroll area
    msgs.appendChild(suggestSlot);
    msgs.appendChild(qrContainer);
    navyraSendMessage(text);
  };

  async function navyraSendMessage(text) {
    navyraAddUserMessage(text);
    chatHistory.push({ role: 'user', text });
    // keep suggest/QR containers pinned to end
    msgs.appendChild(suggestSlot);
    msgs.appendChild(qrContainer);

    isTyping = true;
    sendBtn.disabled = true;
    const typingId = navyraShowTyping();
    // keep suggest/QR containers pinned to end
    msgs.appendChild(suggestSlot);
    msgs.appendChild(qrContainer);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory.slice(-10) })
      });
      const data = await res.json();
      const reply = data.reply || "I'm sorry, I couldn't understand that. Please try again!";

      navyraRemoveTyping(typingId);
      navyraAddBotMessage(reply);
      chatHistory.push({ role: 'model', text: reply });
      // keep suggest/QR containers pinned to end
      msgs.appendChild(suggestSlot);
      msgs.appendChild(qrContainer);

      // Show the asked-about product + complementary suggestions
      if (data.product || (data.suggestions && data.suggestions.length > 0)) {
        setTimeout(() => renderSuggestions(data.product, data.suggestions || []), 300);
      }
    } catch (err) {
      navyraRemoveTyping(typingId);
      navyraAddBotMessage("I'm having trouble connecting right now. Please reach us on WhatsApp at +91 8004703038 for immediate help! 💬");
      msgs.appendChild(suggestSlot);
      msgs.appendChild(qrContainer);
    }

    isTyping = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ── Product Cards (asked-about + complementary suggestions) ───────────────
  function renderSuggestions(product, suggestions) {
    suggestSlot.innerHTML = '';

    // ── 1. Primary card: the product the customer asked about ────────────────
    if (product) {
      const primaryLabel = document.createElement('div');
      primaryLabel.className = 'nch-suggestions-label';
      primaryLabel.textContent = '💍 Here’s what you’re looking for';
      suggestSlot.appendChild(primaryLabel);

      const primaryCard = document.createElement('a');
      primaryCard.className = 'nch-primary-card';
      primaryCard.href = product.link;
      primaryCard.target = '_blank';
      primaryCard.innerHTML = `
        <span class="nch-primary-emoji">${product.emoji}</span>
        <span class="nch-primary-info">
          <span class="nch-scard-name">${escapeHtml(product.name)}</span>
          <span class="nch-scard-price">${product.price}${product.originalPrice
            ? ` <span class="nch-scard-orig">${product.originalPrice}</span>` : ''}</span>
        </span>
        <span class="nch-primary-arrow">→</span>
      `;
      suggestSlot.appendChild(primaryCard);
    }

    // ── 2. Complementary suggestions row ────────────────────────────────
    if (suggestions && suggestions.length > 0) {
      const label = document.createElement('div');
      label.className = 'nch-suggestions-label';
      label.style.marginTop = product ? '6px' : '0';
      label.textContent = '✨ You might also love';
      suggestSlot.appendChild(label);

      const row = document.createElement('div');
      row.className = 'nch-suggestions';

      suggestions.forEach(p => {
        const card = document.createElement('div');
        card.className = 'nch-suggestion-card';
        card.innerHTML = `
          <div class="nch-scard-emoji">${p.emoji}</div>
          <div class="nch-scard-name">${escapeHtml(p.name)}</div>
          <div class="nch-scard-price">${p.price}${p.originalPrice
            ? ` <span class="nch-scard-orig">${p.originalPrice}</span>` : ''}</div>
          <a class="nch-scard-btn" href="${p.link}" target="_blank">View →</a>
        `;
        row.appendChild(card);
      });

      suggestSlot.appendChild(row);
    }

    scrollToBottom();
  }

  function navyraAddUserMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'nch-bubble-wrap user';
    wrap.innerHTML = `
      <div class="nch-bubble-avatar">👤</div>
      <div class="nch-bubble">${escapeHtml(text).replace(/\n/g, '<br>')}</div>
    `;
    msgs.appendChild(wrap);
    scrollToBottom();
  }

  function navyraAddBotMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'nch-bubble-wrap bot';
    // Convert markdown-ish formatting
    const formatted = escapeHtml(text)
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    wrap.innerHTML = `
      <div class="nch-bubble-avatar">✨</div>
      <div class="nch-bubble">${formatted}</div>
    `;
    msgs.appendChild(wrap);
    scrollToBottom();
  }

  function navyraShowTyping() {
    const id = 'typing-' + Date.now();
    const wrap = document.createElement('div');
    wrap.className = 'nch-bubble-wrap bot';
    wrap.id = id;
    wrap.innerHTML = `
      <div class="nch-bubble-avatar">✨</div>
      <div class="nch-bubble"><div class="nch-typing"><span></span><span></span><span></span></div></div>
    `;
    msgs.appendChild(wrap);
    scrollToBottom();
    return id;
  }

  function navyraRemoveTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function scrollToBottom() {
    msgs.scrollTop = msgs.scrollHeight;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ─── Boot ────────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', navyraInit);
  } else {
    navyraInit();
  }
})();
