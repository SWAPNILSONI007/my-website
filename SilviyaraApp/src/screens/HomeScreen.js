import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  StyleSheet, Dimensions, Animated, FlatList, ActivityIndicator, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { API_BASE, ENDPOINTS, CATEGORIES, WHATSAPP_NUMBER } from '../config/api';
import { DEMO_PRODUCTS, CATEGORY_IMAGES, CATEGORY_EMOJIS } from '../config/demoData';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [flashProducts, setFlashProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    fetchProducts();
    fetchFlashSale();
    const endTime = new Date(); endTime.setHours(23, 59, 59, 999);
    const interval = setInterval(() => {
      const diff = endTime - new Date();
      if (diff <= 0) return;
      setCountdown({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}${ENDPOINTS.PRODUCTS}`);
      const data = await res.json();
      setProducts(data.length > 0 ? data.slice(0, 8) : DEMO_PRODUCTS.filter(p => p.isFeatured));
    } catch (e) {
      setProducts(DEMO_PRODUCTS.filter(p => p.isFeatured));
    } finally { setLoading(false); }
  };

  const fetchFlashSale = async () => {
    try {
      const res = await fetch(`${API_BASE}${ENDPOINTS.PRODUCTS_FLASH_SALE}`);
      const data = await res.json();
      setFlashProducts(data.length > 0 ? data.slice(0, 4) : DEMO_PRODUCTS.filter(p => p.isFlashSale));
    } catch (e) {
      setFlashProducts(DEMO_PRODUCTS.filter(p => p.isFlashSale));
    }
  };

  const categoriesWithImages = CATEGORIES.map(c => ({
    ...c,
    image: CATEGORY_IMAGES[c.key],
  }));

  return (
    <View style={[s.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ─── HERO ─── */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <LinearGradient colors={['#1a1410', '#2a2018', '#0e0d0c']} style={s.hero}>
            <View style={s.heroGlow1} />
            <View style={s.heroGlow2} />
            <View style={{ zIndex: 10 }}>
              <View style={s.heroBadge}>
                <View style={s.liveDot} />
                <Text style={s.heroBadgeText}>Pure Silver · Handcrafted in Lucknow</Text>
              </View>
              <Text style={s.heroTitle}>Wear Your{'\n'}
                <Text style={s.heroGold}>Confidence.</Text>{'\n'}
                Own Your <Text style={{ fontStyle: 'italic', color: '#c9a84c' }}>Glow.</Text>
              </Text>
              <Text style={s.heroSub}>Silver that speaks your vibe ✨ — from everyday minimal to statement pieces, crafted for the bold and elegant.</Text>
              <View style={s.heroActions}>
                <TouchableOpacity onPress={() => navigation.navigate('Shop')} style={{ borderRadius: 6, overflow: 'hidden' }}>
                  <LinearGradient colors={['#c9a84c', '#e6c56a']} style={s.heroBtnGrad}>
                    <Text style={s.heroBtnPText}>Shop the Drop ✦</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={s.heroBtnOut} onPress={() => navigation.navigate('Shop', { flashSale: true })}>
                  <Text style={s.heroBtnOutText}>⚡ Flash Sale</Text>
                </TouchableOpacity>
              </View>
              <View style={s.heroStats}>
                {[{ n: '5K+', l: 'Happy Customers' }, { n: '925', l: 'Sterling Silver' }, { n: '₹499+', l: 'Starting At' }].map((st, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <View style={s.statDiv} />}
                    <View>
                      <Text style={s.statNum}>{st.n}</Text>
                      <Text style={s.statLabel}>{st.l}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ─── CATEGORIES with Images ─── */}
        <View style={[s.section, { backgroundColor: colors.bg }]}>
          <Text style={[s.secLabel, { color: colors.silver }]}>✦ Browse By Category</Text>
          <Text style={[s.secTitle, { color: colors.text }]}>Our Collections</Text>
          <FlatList
            data={categoriesWithImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.key}
            contentContainerStyle={{ paddingRight: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[s.catCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate('Shop', { category: item.key })}
                activeOpacity={0.7}
              >
                <View style={[s.catImgWrap, { backgroundColor: colors.bg2 }]}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={s.catImg} resizeMode="cover" />
                  ) : (
                    <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                  )}
                </View>
                <Text style={[s.catName, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* ─── FEATURED PRODUCTS ─── */}
        <View style={[s.section, { backgroundColor: colors.bg2 }]}>
          <Text style={[s.secLabel, { color: colors.silver }]}>✦ Featured</Text>
          <Text style={[s.secTitle, { color: colors.text }]}>New Arrivals</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.gold} style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={products}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={i => i._id}
              contentContainerStyle={{ paddingRight: 16 }}
              renderItem={({ item }) => {
                const disc = item.originalPrice && item.originalPrice > item.price;
                const fallbackImg = CATEGORY_IMAGES[item.category];
                return (
                  <TouchableOpacity
                    style={[s.pCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    activeOpacity={0.8}
                  >
                    {item.image || fallbackImg ? (
                      <Image source={{ uri: item.image || fallbackImg }} style={s.pImg} resizeMode="cover" />
                    ) : (
                      <View style={[s.pImgPh, { backgroundColor: colors.bg2 }]}>
                        <Text style={{ fontSize: 48 }}>{CATEGORY_EMOJIS[item.category] || '💎'}</Text>
                      </View>
                    )}
                    {disc && (
                      <View style={s.discBadge}>
                        <Text style={s.discText}>-{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%</Text>
                      </View>
                    )}
                    <View style={{ padding: 14 }}>
                      <Text style={[s.pCat, { color: colors.silver }]}>{item.category?.replace('-', ' ').toUpperCase()}</Text>
                      <Text style={[s.pName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                      <View style={s.priceRow}>
                        {disc && <Text style={[s.oldP, { color: colors.text2 }]}>₹{item.originalPrice}</Text>}
                        <Text style={[s.newP, { color: colors.text }]}>₹{item.price}</Text>
                      </View>
                      <TouchableOpacity style={[s.addBtn, { backgroundColor: colors.text }]} onPress={() => addToCart(item)}>
                        <Ionicons name="cart-outline" size={14} color={colors.bg} />
                        <Text style={[s.addBtnTxt, { color: colors.bg }]}>Add to Cart</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
          <TouchableOpacity style={[s.viewAll, { borderColor: colors.border }]} onPress={() => navigation.navigate('Shop')}>
            <Text style={[s.viewAllTxt, { color: colors.text2 }]}>View All Products →</Text>
          </TouchableOpacity>
        </View>

        {/* ─── FLASH SALE ─── */}
        <LinearGradient colors={['#0e0a08', '#1a1008', '#0e0a08']} style={s.flashSec}>
          <View style={s.flashBadge}><Text style={s.flashBadgeTxt}>⚡ Limited Time Offer</Text></View>
          <Text style={s.flashTitle}>Flash Sale</Text>
          <Text style={s.flashSub}>Up to 40% Off</Text>
          <View style={s.cdRow}>
            {[{ v: countdown.h, l: 'HRS' }, { v: countdown.m, l: 'MIN' }, { v: countdown.s, l: 'SEC' }].map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Text style={s.cdSep}>:</Text>}
                <View style={s.cdUnit}>
                  <Text style={s.cdNum}>{String(c.v).padStart(2, '0')}</Text>
                  <Text style={s.cdLabel}>{c.l}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
          {flashProducts.length > 0 && (
            <FlatList
              data={flashProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={i => i._id}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              renderItem={({ item }) => {
                const sp = item.flashSaleDiscount ? Math.round(item.price * (1 - item.flashSaleDiscount / 100)) : item.price;
                const fallbackImg = CATEGORY_IMAGES[item.category];
                return (
                  <TouchableOpacity style={s.fCard} onPress={() => navigation.navigate('ProductDetail', { product: item })} activeOpacity={0.8}>
                    {item.image || fallbackImg ? (
                      <Image source={{ uri: item.image || fallbackImg }} style={s.fCardImg} resizeMode="cover" />
                    ) : (
                      <Text style={{ fontSize: 36, marginBottom: 8 }}>{CATEGORY_EMOJIS[item.category] || '✨'}</Text>
                    )}
                    <Text style={s.fName} numberOfLines={1}>{item.name}</Text>
                    <View style={s.fPriceRow}>
                      <Text style={s.fOld}>₹{item.price}</Text>
                      <Text style={s.fNew}>₹{sp}</Text>
                    </View>
                    {item.flashSaleDiscount && (
                      <View style={s.fDiscBadge}>
                        <Text style={s.fDiscTxt}>{item.flashSaleDiscount}% OFF</Text>
                      </View>
                    )}
                    <TouchableOpacity style={s.fBtn} onPress={() => addToCart({ ...item, price: sp })}>
                      <Text style={s.fBtnTxt}>Add to Cart</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
            />
          )}
          <TouchableOpacity
            style={s.flashViewAll}
            onPress={() => navigation.navigate('Shop', { flashSale: true })}
          >
            <LinearGradient colors={['#c9a84c', '#e6c56a']} style={s.flashViewAllGrad}>
              <Text style={s.flashViewAllTxt}>View All Deals ⚡</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* ─── WHY US ─── */}
        <View style={[s.section, { backgroundColor: colors.bg }]}>
          <Text style={[s.secLabel, { color: colors.silver }]}>✦ Why Choose Us</Text>
          <Text style={[s.secTitle, { color: colors.text }]}>The Silviyara Promise</Text>
          <View style={s.whyGrid}>
            {[
              { i: '🪙', t: '925 Sterling Silver', d: 'Every piece is genuine hallmarked & certified silver' },
              { i: '📦', t: 'Free Delivery', d: 'Free shipping across India on orders above ₹999' },
              { i: '↩️', t: 'Easy Returns', d: '7-day hassle-free returns, no questions asked' },
              { i: '💬', t: 'WhatsApp Support', d: 'Quick response within hours on WhatsApp' },
            ].map((w, idx) => (
              <View key={idx} style={[s.whyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={{ fontSize: 30, marginBottom: 10 }}>{w.i}</Text>
                <Text style={[s.whyT, { color: colors.text }]}>{w.t}</Text>
                <Text style={[s.whyD, { color: colors.text2 }]}>{w.d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── TESTIMONIALS ─── */}
        <View style={[s.section, { backgroundColor: colors.bg2, paddingBottom: 40 }]}>
          <Text style={[s.secLabel, { color: colors.silver }]}>✦ Customer Love</Text>
          <Text style={[s.secTitle, { color: colors.text }]}>What They Say</Text>
          {[
            { t: '"The silver pendant I ordered is absolutely stunning. The quality is exceptional and delivery was super fast!"', a: '— Priya S., Lucknow', r: '★★★★★' },
            { t: '"Ordered anklets for my sister\'s wedding. Everyone kept asking where we got them from. Highly recommend!"', a: '— Neha R., Kanpur', r: '★★★★★' },
            { t: '"Best silver jewellery I\'ve bought online. Genuine 925 silver, beautiful finish, and great customer service."', a: '— Anjali M., Delhi', r: '★★★★★' },
          ].map((t, i) => (
            <View key={i} style={[s.testCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[s.stars, { color: colors.gold }]}>{t.r}</Text>
              <Text style={[s.testTxt, { color: colors.text2 }]}>{t.t}</Text>
              <Text style={[s.testAuth, { color: colors.silver }]}>{t.a}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ─── FLOATING WHATSAPP ─── */}
      <TouchableOpacity style={s.waFloat} onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`)}>
        <Ionicons name="logo-whatsapp" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, position: 'relative', overflow: 'hidden', minHeight: 500 },
  heroGlow1: { position: 'absolute', top: '15%', right: -30, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(201,168,76,0.12)' },
  heroGlow2: { position: 'absolute', bottom: '20%', left: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(138,138,154,0.08)' },
  heroBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#25d366', marginRight: 8 },
  heroBadgeText: { fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(201,168,76,0.9)' },
  heroTitle: { fontSize: 36, fontWeight: '300', color: '#f0ebe3', lineHeight: 44 },
  heroGold: { color: '#c9a84c', fontWeight: '400' },
  heroSub: { marginTop: 16, color: 'rgba(240,235,227,0.6)', fontSize: 14, lineHeight: 22, maxWidth: 340 },
  heroActions: { flexDirection: 'row', gap: 12, marginTop: 28 },
  heroBtnGrad: { paddingVertical: 14, paddingHorizontal: 26 },
  heroBtnPText: { color: '#0e0d0c', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroBtnOut: { borderWidth: 1, borderColor: 'rgba(240,235,227,0.2)', paddingVertical: 14, paddingHorizontal: 26, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)' },
  heroBtnOutText: { color: '#f0ebe3', fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' },
  heroStats: { flexDirection: 'row', alignItems: 'center', marginTop: 32 },
  statNum: { fontSize: 22, fontWeight: '300', color: '#f0ebe3' },
  statLabel: { fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(240,235,227,0.4)', marginTop: 3 },
  statDiv: { width: 1, height: 30, backgroundColor: 'rgba(201,168,76,0.3)', marginHorizontal: 18 },
  section: { paddingVertical: 28, paddingHorizontal: 20 },
  secLabel: { fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 },
  secTitle: { fontSize: 24, fontWeight: '300', marginBottom: 20 },
  catCard: { width: 110, alignItems: 'center', borderRadius: 10, borderWidth: 1, marginRight: 12, overflow: 'hidden' },
  catImgWrap: { width: 110, height: 90, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  catImg: { width: '100%', height: '100%' },
  catName: { fontSize: 11, letterSpacing: 0.3, textAlign: 'center', paddingVertical: 10, fontWeight: '500' },
  pCard: { width: width * 0.52, borderRadius: 10, borderWidth: 1, marginRight: 14, overflow: 'hidden' },
  pImg: { width: '100%', height: 170 },
  pImgPh: { width: '100%', height: 170, alignItems: 'center', justifyContent: 'center' },
  discBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#c0392b', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  discText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  pCat: { fontSize: 9, letterSpacing: 1.5, marginBottom: 4 },
  pName: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  oldP: { fontSize: 12, textDecorationLine: 'line-through' },
  newP: { fontSize: 16, fontWeight: '600' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 6 },
  addBtnTxt: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  viewAll: { alignSelf: 'center', marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderRadius: 6 },
  viewAllTxt: { fontSize: 12, letterSpacing: 1 },
  flashSec: { paddingHorizontal: 20, paddingVertical: 40 },
  flashBadge: { backgroundColor: '#8b1a1a', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 14 },
  flashBadgeTxt: { color: '#f0ebe3', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '500' },
  flashTitle: { fontSize: 32, fontWeight: '300', color: '#f0ebe3' },
  flashSub: { fontSize: 22, fontStyle: 'italic', color: '#c9a84c', marginBottom: 20 },
  cdRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 28 },
  cdUnit: { alignItems: 'center' },
  cdNum: { fontSize: 34, fontWeight: '300', color: '#c9a84c' },
  cdLabel: { fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(240,235,227,0.5)', marginTop: 2 },
  cdSep: { fontSize: 24, color: '#c9a84c', marginTop: -8 },
  fCard: { width: 160, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.15)', padding: 14, borderRadius: 10, marginRight: 12, alignItems: 'center' },
  fCardImg: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  fName: { fontSize: 12, color: '#f0ebe3', marginBottom: 8, textAlign: 'center', fontWeight: '500' },
  fPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  fOld: { fontSize: 12, color: 'rgba(240,235,227,0.4)', textDecorationLine: 'line-through' },
  fNew: { fontSize: 15, color: '#c9a84c', fontWeight: '600' },
  fDiscBadge: { backgroundColor: '#8b1a1a', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4, marginBottom: 10 },
  fDiscTxt: { color: '#fff', fontSize: 9, fontWeight: '600', letterSpacing: 0.5 },
  fBtn: { backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6, width: '100%', alignItems: 'center' },
  fBtnTxt: { color: '#c9a84c', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '500' },
  flashViewAll: { borderRadius: 6, overflow: 'hidden', alignSelf: 'flex-start', marginTop: 24 },
  flashViewAllGrad: { paddingVertical: 14, paddingHorizontal: 28 },
  flashViewAllTxt: { color: '#0e0d0c', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  whyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  whyCard: { width: (width - 52) / 2, padding: 20, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  whyT: { fontSize: 14, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  whyD: { fontSize: 11, lineHeight: 17, textAlign: 'center' },
  testCard: { borderWidth: 1, borderRadius: 10, padding: 20, marginBottom: 12 },
  stars: { fontSize: 16, letterSpacing: 3, marginBottom: 10 },
  testTxt: { fontSize: 14, fontStyle: 'italic', lineHeight: 22, marginBottom: 12 },
  testAuth: { fontSize: 12, letterSpacing: 1, fontWeight: '500' },
  waFloat: { position: 'absolute', bottom: 28, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#25d366', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#25d366', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12 },
});
