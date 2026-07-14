import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { CATEGORY_IMAGES, CATEGORY_EMOJIS } from '../config/demoData';

const { width } = Dimensions.get('window');

export default function CartScreen({ navigation }) {
  const { colors } = useTheme();
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <View style={[s.container, s.emptyWrap, { backgroundColor: colors.bg }]}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>🛒</Text>
        <Text style={[s.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
        <Text style={[s.emptySub, { color: colors.text2 }]}>Add some beautiful pieces to get started</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Shop')} style={{ borderRadius: 6, overflow: 'hidden', marginTop: 24 }}>
          <LinearGradient colors={['#c9a84c', '#e6c56a']} style={s.shopBtn}>
            <Text style={s.shopBtnTxt}>Shop Now →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[s.container, { backgroundColor: colors.bg }]}>
      <FlatList
        data={cartItems}
        keyExtractor={i => i._id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const fallbackImg = CATEGORY_IMAGES[item.category];
          return (
            <View style={[s.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[s.imgWrap, { backgroundColor: colors.bg2 }]}>
                {item.image || fallbackImg
                  ? <Image source={{ uri: item.image || fallbackImg }} style={s.img} resizeMode="cover" />
                  : <Text style={{ fontSize: 28 }}>{CATEGORY_EMOJIS[item.category] || '💎'}</Text>}
              </View>
              <View style={s.itemInfo}>
                <Text style={[s.itemCat, { color: colors.silver }]}>{(item.category || '').replace('-', ' ').toUpperCase()}</Text>
                <Text style={[s.itemName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
                <Text style={[s.itemPrice, { color: colors.text }]}>₹{item.price}</Text>
                <View style={s.qtyRow}>
                  <TouchableOpacity style={[s.qtyBtn, { borderColor: colors.border }]} onPress={() => item.qty <= 1 ? removeFromCart(item._id) : updateQty(item._id, item.qty - 1)}>
                    <Ionicons name={item.qty <= 1 ? 'trash-outline' : 'remove'} size={14} color={item.qty <= 1 ? colors.error : colors.text2} />
                  </TouchableOpacity>
                  <Text style={[s.qtyNum, { color: colors.text }]}>{item.qty}</Text>
                  <TouchableOpacity style={[s.qtyBtn, { borderColor: colors.border }]} onPress={() => updateQty(item._id, item.qty + 1)}>
                    <Ionicons name="add" size={14} color={colors.text2} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item._id)} style={s.removeBtn}>
                <Ionicons name="close" size={18} color={colors.text2} />
              </TouchableOpacity>
            </View>
          );
        }}
        ListFooterComponent={
          <View style={[s.summary, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={s.summaryRow}>
              <Text style={[s.summaryLabel, { color: colors.text2 }]}>Subtotal</Text>
              <Text style={[s.summaryVal, { color: colors.text }]}>₹{cartTotal}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={[s.summaryLabel, { color: colors.text2 }]}>Delivery</Text>
              <Text style={[s.summaryVal, { color: colors.success }]}>{cartTotal >= 999 ? 'FREE 🎉' : '₹49'}</Text>
            </View>
            <View style={[s.divider, { backgroundColor: colors.border }]} />
            <View style={s.summaryRow}>
              <Text style={[s.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[s.totalVal, { color: colors.text }]}>₹{cartTotal >= 999 ? cartTotal : cartTotal + 49}</Text>
            </View>
            {cartTotal < 999 && (
              <View style={[s.freeShip, { backgroundColor: 'rgba(201,168,76,0.08)', borderColor: 'rgba(201,168,76,0.2)' }]}>
                <Text style={[s.freeShipTxt, { color: colors.gold }]}>Add ₹{999 - cartTotal} more for free delivery!</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Checkout', { cartItems, cartTotal })} activeOpacity={0.85} style={{ borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
              <LinearGradient colors={['#c9a84c', '#e6c56a']} style={s.checkoutBtn}>
                <Text style={s.checkoutBtnTxt}>Proceed to Checkout →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  emptyWrap: { alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '300', marginBottom: 8 },
  emptySub: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
  shopBtn: { paddingVertical: 14, paddingHorizontal: 32 },
  shopBtnTxt: { color: '#0e0d0c', fontSize: 13, fontWeight: '600', letterSpacing: 1 },
  list: { padding: 16, paddingBottom: 110 },
  item: { flexDirection: 'row', borderRadius: 10, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  imgWrap: { width: 90, height: 100, alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%' },
  itemInfo: { flex: 1, padding: 12 },
  itemCat: { fontSize: 9, letterSpacing: 1.5, marginBottom: 3 },
  itemName: { fontSize: 13, fontWeight: '500', marginBottom: 4, lineHeight: 17 },
  itemPrice: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyNum: { fontSize: 14, fontWeight: '500', minWidth: 20, textAlign: 'center' },
  removeBtn: { padding: 12 },
  summary: { borderRadius: 10, borderWidth: 1, padding: 18, marginTop: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14 },
  summaryVal: { fontSize: 14, fontWeight: '500' },
  divider: { height: 1, marginBottom: 12 },
  totalLabel: { fontSize: 16, fontWeight: '500' },
  totalVal: { fontSize: 18, fontWeight: '600' },
  freeShip: { padding: 12, borderRadius: 8, borderWidth: 1, marginTop: 12, alignItems: 'center' },
  freeShipTxt: { fontSize: 12, fontWeight: '500' },
  checkoutBtn: { paddingVertical: 16, alignItems: 'center' },
  checkoutBtnTxt: { color: '#0e0d0c', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
});
