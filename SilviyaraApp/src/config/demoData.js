import { API_BASE } from './api';

// Helper to build image URLs from your website's public folder
const img = (path) => `${API_BASE}/images/${path}`;

// Demo products with real images from your website
export const DEMO_PRODUCTS = [
  { _id: 'd1', name: 'Moon Pendant Silver', price: 1299, originalPrice: 1699, category: 'pendant', image: img('pendant.png'), inStock: true, isFeatured: true, isFlashSale: false, sku: 'SLV-PND-001', description: 'Beautiful crescent moon pendant crafted in 925 sterling silver. Perfect for everyday elegance.' },
  { _id: 'd2', name: 'Jhumka Earrings', price: 899, originalPrice: 1199, category: 'ear-jewellery', image: img('ear-jewellery.png'), inStock: true, isFeatured: true, isFlashSale: false, sku: 'SLV-EAR-001', description: 'Traditional silver jhumka earrings with intricate detailing. Lightweight and comfortable.' },
  { _id: 'd3', name: 'Twisted Band Ring', price: 699, originalPrice: 999, category: 'rings', image: img('rings.png'), inStock: true, isFeatured: true, isFlashSale: true, flashSaleDiscount: 30, sku: 'SLV-RNG-001', description: 'Elegant twisted band ring in pure 925 silver. Adjustable fit for all finger sizes.' },
  { _id: 'd4', name: 'Silver Anklet Chain', price: 599, originalPrice: null, category: 'anklets', image: img('anklets.png'), inStock: true, isFeatured: false, isFlashSale: false, sku: 'SLV-ANK-001', description: 'Delicate silver anklet chain with tiny charm details. Perfect for summer.' },
  { _id: 'd5', name: 'Charm Bracelet', price: 1099, originalPrice: 1499, category: 'bracelets', image: img('bracelets.png'), inStock: true, isFeatured: true, isFlashSale: true, flashSaleDiscount: 25, sku: 'SLV-BRC-001', description: 'Sterling silver charm bracelet with 5 removable charms. Makes a great gift.' },
  { _id: 'd6', name: 'Silver Choker', price: 1499, originalPrice: 1999, category: 'necklaces', image: img('necklaces.png'), inStock: true, isFeatured: true, isFlashSale: true, flashSaleDiscount: 25, sku: 'SLV-NCK-001', description: 'Minimalist silver choker necklace. Sits perfectly on the collarbone.' },
  { _id: 'd7', name: 'Lotus Pendant', price: 999, originalPrice: null, category: 'pendant', image: img('pendant.png'), inStock: true, isFeatured: false, isFlashSale: false, sku: 'SLV-PND-002', description: 'Sacred lotus flower pendant in pure silver. Symbol of purity and beauty.' },
  { _id: 'd8', name: 'Floral Hair Pin', price: 399, originalPrice: 599, category: 'hair-accessories', image: img('hair-accessories.png'), inStock: true, isFeatured: false, isFlashSale: true, flashSaleDiscount: 33, sku: 'SLV-HAR-001', description: 'Handcrafted floral hair pin in sterling silver. Adds sparkle to any hairstyle.' },
  { _id: 'd9', name: 'Oxidised Stud Earrings', price: 499, originalPrice: null, category: 'ear-jewellery', image: img('ear-jewellery.png'), inStock: true, isFeatured: true, isFlashSale: false, sku: 'SLV-EAR-002', description: 'Oxidised silver stud earrings with traditional motifs. Daily wear essentials.' },
  { _id: 'd10', name: 'Snake Chain Necklace', price: 1799, originalPrice: 2299, category: 'necklaces', image: img('necklaces.png'), inStock: true, isFeatured: true, isFlashSale: false, sku: 'SLV-NCK-002', description: 'Sleek snake chain necklace in polished 925 silver. A modern classic.' },
  { _id: 'd11', name: 'Toe Ring Set (4 pcs)', price: 349, originalPrice: null, category: 'rings', image: img('rings.png'), inStock: true, isFeatured: false, isFlashSale: false, sku: 'SLV-RNG-002', description: 'Set of 4 adjustable silver toe rings with different designs.' },
  { _id: 'd12', name: 'Temple Anklet Heavy', price: 1299, originalPrice: 1699, category: 'anklets', image: img('anklets.png'), inStock: true, isFeatured: false, isFlashSale: false, sku: 'SLV-ANK-002', description: 'Traditional temple design heavy anklet with ghungroo bells.' },
];

export const CATEGORY_IMAGES = {
  'pendant': img('pendant.png'),
  'ear-jewellery': img('ear-jewellery.png'),
  'rings': img('rings.png'),
  'anklets': img('anklets.png'),
  'bracelets': img('bracelets.png'),
  'necklaces': img('necklaces.png'),
  'hair-accessories': img('hair-accessories.png'),
};

export const CATEGORY_EMOJIS = {
  'pendant': '🔮',
  'ear-jewellery': '✨',
  'rings': '💍',
  'anklets': '🌿',
  'bracelets': '🪬',
  'necklaces': '📿',
  'hair-accessories': '🌸',
};
