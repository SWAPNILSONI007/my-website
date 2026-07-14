import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { API_BASE, ENDPOINTS, CATEGORIES } from '../config/api';
import { DEMO_PRODUCTS, CATEGORY_IMAGES, CATEGORY_EMOJIS } from '../config/demoData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function ShopScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const initialCat = route?.params?.category;
  const flashSale = route?.params?.flashSale;

  useEffect(() => {
    if (flashSale) fetchFlashSale();
    else fetchProducts(initialCat);
    if (initialCat) setActiveFilter(initialCat);
  }, [initialCat, flashSale]);

  const fetchProducts = async (cat) => {
    try {
      const url = cat ? `${API_BASE}${ENDPOINTS.PRODUCTS}?category=${cat}` : `${API_BASE}${ENDPOINTS.PRODUCTS}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        setProducts(data); setFiltered(data);
      } else {
        const demo = cat ? DEMO_PRODUCTS.filter(p => p.category === cat) : DEMO_PRODUCTS;
        setProducts(demo); setFiltered(demo);
      }
    } catch (e) {
      const demo = cat ? DEMO_PRODUCTS.filter(p => p.category === cat) : DEMO_PRODUCTS;
      setProducts(demo); setFiltered(demo);
    } finally { setLoading(false); }
  };

  const fetchFlashSale = async () => {
    try {
      const res = await fetch(`${API_BASE}${ENDPOINTS.PRODUCTS_FLASH_SALE}`);
      const data = await res.json();
      if (data && data.length > 0) { setProducts(data); setFiltered(data); }
      else { const demo = DEMO_PRODUCTS.filter(p => p.isFlashSale); setProducts(demo); setFiltered(demo); }
    } catch (e) {
      const demo = DEMO_PRODUCTS.filter(p => p.isFlashSale); setProducts(demo); setFiltered(demo);
    } finally { setLoading(false); }
  };

  const filterByCategory = (cat) => {
    setActiveFilter(cat);
    if (cat === 'all') { setFiltered(products); return; }
    setFiltered(products.filter(p => p.category === cat));
  };

  const searchProducts = (text) => {
    setSearch(text);
    const base = activeFilter === 'all' ? products : products.filter(p => p.category === activeFilter);
    if (!text.trim()) { setFiltered(base); return; }
    const q = text.toLowerCase();
    setFiltered(base.filter(p => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)));
  };

  const renderProduct = ({ item }) => {
    const disc = item.originalPrice && item.originalPrice > item.price;
    const fallbackImg = CATEGORY_IMAGES[item.category];
    return (
      <TouchableOpacity
        style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        activeOpacity={0.8}
      >
        {item.image || fallbackImg ? (
          <Image source={{ uri: item.image || fallbackImg }} style={s.cardImg} resizeMode="cover" />
        ) : (
          <View style={[s.cardImgPh, { backgroundColor: colors.bg2 }]}>
            <Text style={{ fontSize: 40 }}>{CATEGORY_EMOJIS[item.category] || '💎'}</Text>
          </View>
        )}
        {disc && (
          <View style={s.discBadge}>
            <Text style={s.discTxt}>-{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%</Text>
          </View>
        )}
        {item.isFeatured && (
          <View style={[s.featBadge, { backgroundColor: colors.gold }]}>
            <Text style={s.featTxt}>★</Text>
          </View>
        )}
        <View style={s.cardBody}>
          <Text style={[s.cardCat, { color: colors.silver }]}>{item.category?.replace('-', ' ').toUpperCase()}</Text>
          <Text style={[s.cardName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
          <View style={s.priceRow}>
            {disc && <Text style={[s.oldP, { color: colors.text2 }]}>₹{item.originalPrice}</Text>}
            <Text style={[s.newP, { color: colors.text }]}>₹{item.price}</Text>
          </View>
          <TouchableOpacity
            style={[s.cartBtn, { backgroundColor: colors.text }]}
            onPress={() => addToCart(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={14} color={colors.bg} />
            <Text style={[s.cartBtnTxt, { color: colors.bg }]}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const filters = [{ key: 'all', label: 'All', emoji: '✦' }, ...CATEGORIES];

  return (
    <View style={[s.container, { backgroundColor: colors.bg }]}>
      <View style={[s.searchWrap, { backgroundColor: colors.bg2, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.text2} />
        <TextInput
          style={[s.searchInput, { color: colors.text }]}
          placeholder="Search jewellery..."
          placeholderTextColor={colors.text2}
          value={search}
          onChangeText={searchProducts}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => searchProducts('')}>
            <Ionicons name="close-circle" size={18} color={colors.text2} />
          </TouchableOpacity>
        )}
      </View>

      {flashSale && (
        <View style={[s.flashHeader, { backgroundColor: 'rgba(139,26,26,0.1)', borderColor: 'rgba(139,26,26,0.2)' }]}>
          <Text style={s.flashIcon}>⚡</Text>
          <Text style={[s.flashTxt, { color: colors.gold }]}>Flash Sale — Up to 40% Off</Text>
        </View>
      )}

      {!flashSale && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}
          style={s.filterScroll}
        >
          {filters.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                s.filterBtn,
                { borderColor: colors.border },
                activeFilter === item.key && { backgroundColor: colors.text, borderColor: colors.text },
              ]}
              onPress={() => filterByCategory(item.key)}
              activeOpacity={0.7}
            >
              <Text style={[
                s.filterTxt,
                { color: activeFilter === item.key ? colors.bg : colors.text2 },
              ]}>
                {item.emoji ? `${item.emoji} ` : ''}{item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={s.resultRow}>
        <Text style={[s.resultTxt, { color: colors.text2 }]}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={[s.loadingTxt, { color: colors.text2 }]}>Loading jewellery...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.emptyWrap}>
          <Text style={{ fontSize: 56 }}>🔍</Text>
          <Text style={[s.emptyTitle, { color: colors.text }]}>No products found</Text>
          <Text style={[s.emptyDesc, { color: colors.text2 }]}>Try a different search or category</Text>
          <TouchableOpacity
            style={[s.resetBtn, { borderColor: colors.gold }]}
            onPress={() => { setSearch(''); filterByCategory('all'); }}
          >
            <Text style={[s.resetTxt, { color: colors.gold }]}>Show All Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={(i) => i._id}
          contentContainerStyle={s.grid}
          columnWrapperStyle={s.gridRow}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 10, borderWidth: 1, gap: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  flashHeader: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, marginBottom: 12 },
  flashIcon: { fontSize: 18, marginRight: 8 },
  flashTxt: { fontSize: 15, fontWeight: '500' },
  filterScroll: { maxHeight: 44, minHeight: 44, marginBottom: 8 },
  filterRow: { paddingHorizontal: 16, gap: 8, alignItems: 'center', height: 40 },
  filterBtn: { height: 36, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  filterTxt: { fontSize: 11, letterSpacing: 0.8, fontWeight: '500' },
  resultRow: { paddingHorizontal: 16, paddingBottom: 8 },
  resultTxt: { fontSize: 12, letterSpacing: 0.5 },
  grid: { paddingHorizontal: 16, paddingBottom: 100 },
  gridRow: { gap: 12, marginBottom: 12 },
  card: { width: CARD_WIDTH, borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
  cardImg: { width: '100%', height: CARD_WIDTH * 0.85 },
  cardImgPh: { width: '100%', height: CARD_WIDTH * 0.85, alignItems: 'center', justifyContent: 'center' },
  discBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#c0392b', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  discTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },
  featBadge: { position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featTxt: { color: '#fff', fontSize: 12 },
  cardBody: { padding: 12 },
  cardCat: { fontSize: 9, letterSpacing: 1.5, marginBottom: 4 },
  cardName: { fontSize: 13, fontWeight: '500', marginBottom: 6, lineHeight: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  oldP: { fontSize: 11, textDecorationLine: 'line-through' },
  newP: { fontSize: 15, fontWeight: '600' },
  cartBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 6 },
  cartBtnTxt: { fontSize: 10, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  loadingTxt: { fontSize: 13, marginTop: 12 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  emptyTitle: { fontSize: 18, fontWeight: '400', marginTop: 14 },
  emptyDesc: { fontSize: 13, marginTop: 6, marginBottom: 20 },
  resetBtn: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, borderWidth: 1 },
  resetTxt: { fontSize: 12, fontWeight: '500', letterSpacing: 0.5 },
});
