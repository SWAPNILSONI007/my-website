import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Linking, Share, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER } from '../config/api';
import { CATEGORY_IMAGES, CATEGORY_EMOJIS } from '../config/demoData';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { addToCart } = useCart();
  const product = route.params?.product;
  if (!product) return null;
  const fallbackImage = CATEGORY_IMAGES[product.category];
  const productImage = product.image || fallbackImage;

  const disc = product.originalPrice && product.originalPrice > product.price;
  const discPct = disc ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => { addToCart(product); navigation.navigate('Cart'); };
  const handleWhatsApp = () => {
    const msg = `Hi! I'm interested in *${product.name}* (₹${product.price}). Is it available?`;
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  };
  const handleShare = () => { Share.share({ message: `Check out ${product.name} for ₹${product.price} on Silviyara Jewels! ✨` }); };

  return (
    <View style={[s.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={s.imgWrap}>
          {productImage ? <Image source={{ uri: productImage }} style={s.img} resizeMode="cover" /> :
           <View style={[s.imgPh, { backgroundColor: colors.bg2 }]}><Text style={{ fontSize: 80 }}>{CATEGORY_EMOJIS[product.category] || '💎'}</Text></View>}
          {disc && <View style={s.discBadge}><Text style={s.discTxt}>-{discPct}% OFF</Text></View>}
          <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#f0ebe3" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={[s.info, { backgroundColor: colors.bg }]}>
          <Text style={[s.cat, { color: colors.silver }]}>{product.category?.toUpperCase()}</Text>
          <Text style={[s.name, { color: colors.text }]}>{product.name}</Text>
          
          <View style={s.priceRow}>
            <Text style={[s.price, { color: colors.text }]}>₹{product.price}</Text>
            {disc && <Text style={[s.origPrice, { color: colors.text2 }]}>₹{product.originalPrice}</Text>}
            {disc && <View style={s.saveBadge}><Text style={s.saveTxt}>Save ₹{product.originalPrice - product.price}</Text></View>}
          </View>

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          {product.description ? (
            <View style={s.descSection}>
              <Text style={[s.descLabel, { color: colors.silver }]}>DESCRIPTION</Text>
              <Text style={[s.descText, { color: colors.text2 }]}>{product.description}</Text>
            </View>
          ) : null}

          {/* Features */}
          <View style={s.featGrid}>
            {[
              { icon: '🪙', label: '925 Sterling Silver' },
              { icon: '📦', label: 'Free Delivery 999+' },
              { icon: '↩️', label: '7-Day Returns' },
              { icon: '✅', label: product.inStock ? 'In Stock' : 'Out of Stock' },
            ].map((f, i) => (
              <View key={i} style={[s.featItem, { backgroundColor: colors.bg2, borderColor: colors.border }]}>
                <Text style={{ fontSize: 18 }}>{f.icon}</Text>
                <Text style={[s.featLabel, { color: colors.text2 }]}>{f.label}</Text>
              </View>
            ))}
          </View>

          {product.sku ? (
            <Text style={[s.sku, { color: colors.silver }]}>SKU: {product.sku}</Text>
          ) : null}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[s.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity style={s.waBtn} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={s.addCartBtn} onPress={handleAddToCart}>
          <LinearGradient colors={['#c9a84c', '#e6c56a']} style={s.addCartGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Ionicons name="cart-outline" size={18} color="#0e0d0c" />
            <Text style={s.addCartTxt}>Add to Cart</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  imgWrap: { width, height: width * 0.9, position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgPh: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  discBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#c0392b', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 4 },
  discTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  shareBtn: { position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  info: { padding: 20 },
  cat: { fontSize: 11, letterSpacing: 3, marginBottom: 6 },
  name: { fontSize: 24, fontWeight: '300', lineHeight: 30, marginBottom: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  price: { fontSize: 24, fontWeight: '500' },
  origPrice: { fontSize: 16, textDecorationLine: 'line-through' },
  saveBadge: { backgroundColor: 'rgba(39,174,96,0.12)', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4 },
  saveTxt: { color: '#27ae60', fontSize: 11, fontWeight: '500' },
  divider: { height: 1, marginVertical: 16 },
  descSection: { marginBottom: 20 },
  descLabel: { fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  descText: { fontSize: 14, lineHeight: 22 },
  featGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  featItem: { width: (width - 50) / 2, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, borderWidth: 1 },
  featLabel: { fontSize: 12 },
  sku: { fontSize: 11, letterSpacing: 1, marginTop: 8, marginBottom: 20 },
  bottomBar: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1 },
  waBtn: { width: 52, height: 52, borderRadius: 8, backgroundColor: '#25d366', alignItems: 'center', justifyContent: 'center' },
  addCartBtn: { flex: 1, borderRadius: 8, overflow: 'hidden' },
  addCartGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  addCartTxt: { color: '#0e0d0c', fontSize: 14, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
});
