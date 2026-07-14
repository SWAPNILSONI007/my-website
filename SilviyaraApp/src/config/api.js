// ─── Silviyara App API Configuration ────────────────────────────────────────
// For web preview: localhost works fine
// For phone testing: use your computer's LAN IP (run 'ipconfig' to find it)
// For production: use your deployed URL

import { Platform } from 'react-native';

const WEB_URL = 'http://localhost:3000';
const MOBILE_URL = 'http://192.168.1.100:3000'; // ← Change to YOUR LAN IP for phone testing
const PROD_URL = 'https://your-domain.vercel.app'; // ← Change to your production URL

const __DEV__ = true; // Set to false for production

export const API_BASE = __DEV__
  ? (Platform.OS === 'web' ? WEB_URL : MOBILE_URL)
  : PROD_URL;

export const ENDPOINTS = {
  // Products
  PRODUCTS: '/api/products',
  PRODUCTS_FLASH_SALE: '/api/products/flash-sale',
  PRODUCT_BY_ID: (id) => `/api/products/${id}`,

  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_PROFILE: '/api/auth/profile',

  // Orders
  ORDERS: '/api/orders',
  ORDERS_MY: '/api/orders/my-orders',
  ORDERS_TRACK: '/api/orders/track',

  // Payment
  PAYMENT_CREATE: '/api/payment/create-order',
  PAYMENT_VERIFY: '/api/payment/verify',

  // Chatbot
  CHATBOT: '/api/chatbot',

  // Contact
  CONTACT: '/api/contact',
};

export const WHATSAPP_NUMBER = '918004703038';
export const RAZORPAY_KEY_ID = 'rzp_test_SZnMjjCzKUmrUg';

export const CATEGORIES = [
  { key: 'pendant', label: 'Pendant', emoji: '🔮' },
  { key: 'ear-jewellery', label: 'Ear Jewellery', emoji: '✨' },
  { key: 'rings', label: 'Rings', emoji: '💍' },
  { key: 'anklets', label: 'Anklets', emoji: '🌿' },
  { key: 'bracelets', label: 'Bracelets', emoji: '🪬' },
  { key: 'necklaces', label: 'Necklaces', emoji: '📿' },
  { key: 'hair-accessories', label: 'Hair Accessories', emoji: '🌸' },
];
