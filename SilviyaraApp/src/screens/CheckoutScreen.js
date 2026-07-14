import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Linking, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE, ENDPOINTS, WHATSAPP_NUMBER } from '../config/api';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

export default function CheckoutScreen({ navigation }) {
  const { colors } = useTheme();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', mobile: user?.phone || '',
    address: '', landmark: '', city: '', pin: '', state: '',
  });
  const [payMethod, setPayMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const update = (key, val) => setForm({ ...form, [key]: val });

  const validate = () => {
    if (!form.name || !form.mobile || !form.address || !form.city || !form.pin) {
      Alert.alert('Missing Fields', 'Please fill all required fields.'); return false;
    }
    if (form.mobile.length !== 10) { Alert.alert('Invalid', 'Enter 10-digit mobile number.'); return false; }
    if (form.pin.length !== 6) { Alert.alert('Invalid', 'Enter 6-digit PIN code.'); return false; }
    return true;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const orderData = {
        customerId: user?.id || null,
        customerName: form.name, customerEmail: form.email, customerMobile: form.mobile,
        customerAddress: form.address, customerLandmark: form.landmark,
        customerCity: form.city, customerState: form.state, customerPin: form.pin,
        items: cart.map(i => ({ name: i.name, price: i.price, qty: i.qty || 1, emoji: '💎', id: i._id, sku: i.sku || '', image: i.image || '' })),
        totalAmount: cartTotal, paymentMethod: payMethod,
      };
      const res = await fetch(`${API_BASE}${ENDPOINTS.ORDERS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'x-auth-token': token } : {}) },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success) {
        setOrderId(data.orderId);
        setSuccess(true);
        clearCart();
      } else { Alert.alert('Error', data.message || 'Order failed'); }
    } catch (e) { Alert.alert('Error', 'Could not connect to server'); }
    finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <View style={[s.container, s.successWrap, { backgroundColor: colors.bg }]}>
        <View style={s.successIcon}><Text style={{ fontSize: 32, color: '#fff' }}>✓</Text></View>
        <Text style={[s.successLabel, { color: '#27ae60' }]}>✦ Order Confirmed</Text>
        <Text style={[s.successTitle, { color: colors.text }]}>Order Placed Successfully!</Text>
        <Text style={[s.successDesc, { color: colors.text2 }]}>Thank you for shopping with Silviyara Jewels</Text>
        <View style={[s.orderIdBox, { backgroundColor: colors.bg2, borderColor: colors.border }]}>
          <Text style={[s.orderIdTxt, { color: colors.silver }]}>Order ID: {orderId}</Text>
        </View>
        <View style={[s.etaBox, { borderColor: 'rgba(39,174,96,0.2)' }]}>
          <Text style={s.etaLabel}>Estimated Delivery</Text>
          <Text style={[s.etaVal, { color: colors.text }]}>Within 5–7 business days</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('HomeTab')} style={{ borderRadius: 8, overflow: 'hidden', width: '100%', marginTop: 16 }}>
          <LinearGradient colors={['#c9a84c','#e6c56a']} style={s.continueBtn}>
            <Text style={s.continueTxt}>Continue Shopping</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={[s.trackBtn, { borderColor: colors.border }]} onPress={() => navigation.navigate('TrackOrder')}>
          <Text style={[s.trackTxt, { color: colors.text2 }]}>📍 Track Order</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[s.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Order Summary */}
        <Text style={[s.secLabel, { color: colors.silver }]}>ORDER SUMMARY</Text>
        <View style={[s.summaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {cart.map((item, i) => (
            <View key={i} style={[s.summItem, i < cart.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Text style={[s.summName, { color: colors.text }]}>{item.name} × {item.qty || 1}</Text>
              <Text style={[s.summPrice, { color: colors.gold }]}>₹{item.price * (item.qty || 1)}</Text>
            </View>
          ))}
          <View style={[s.summTotal, { borderTopColor: colors.border }]}>
            <Text style={[s.summTotalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[s.summTotalVal, { color: colors.gold }]}>₹{cartTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Delivery Details */}
        <Text style={[s.secLabel, { color: colors.silver, marginTop: 20 }]}>DELIVERY DETAILS</Text>
        {[
          { key: 'name', label: 'Full Name *', ph: 'Aditi Sharma' },
          { key: 'email', label: 'Email', ph: 'aditi@gmail.com', kb: 'email-address' },
          { key: 'mobile', label: 'Mobile *', ph: '10-digit number', kb: 'phone-pad', ml: 10 },
          { key: 'address', label: 'Address *', ph: 'House/Flat No., Street', multi: true },
          { key: 'landmark', label: 'Landmark', ph: 'Near temple, school...' },
        ].map(f => (
          <View key={f.key} style={s.inputGroup}>
            <Text style={[s.inputLabel, { color: colors.silver }]}>{f.label}</Text>
            <TextInput style={[s.input, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
              placeholder={f.ph} placeholderTextColor={colors.text2} value={form[f.key]}
              onChangeText={v => update(f.key, v)} keyboardType={f.kb || 'default'}
              maxLength={f.ml} multiline={f.multi} />
          </View>
        ))}
        <View style={s.row}>
          <View style={[s.inputGroup, { flex: 1 }]}>
            <Text style={[s.inputLabel, { color: colors.silver }]}>City *</Text>
            <TextInput style={[s.input, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
              value={form.city} onChangeText={v => update('city', v)} />
          </View>
          <View style={[s.inputGroup, { flex: 1 }]}>
            <Text style={[s.inputLabel, { color: colors.silver }]}>PIN *</Text>
            <TextInput style={[s.input, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
              value={form.pin} onChangeText={v => update('pin', v)} keyboardType="number-pad" maxLength={6} />
          </View>
        </View>

        {/* Payment Method */}
        <Text style={[s.secLabel, { color: colors.silver, marginTop: 20 }]}>PAYMENT METHOD</Text>
        <View style={s.payRow}>
          <TouchableOpacity style={[s.payCard, payMethod === 'COD' && s.payActive, { backgroundColor: payMethod === 'COD' ? 'rgba(201,168,76,0.06)' : colors.bg2, borderColor: payMethod === 'COD' ? '#c9a84c' : colors.border }]}
            onPress={() => setPayMethod('COD')}>
            <Text style={{ fontSize: 24 }}>🏠</Text>
            <Text style={[s.payLabel, { color: colors.text }]}>Cash on Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.payCard, payMethod === 'Razorpay' && s.payActive, { backgroundColor: payMethod === 'Razorpay' ? 'rgba(201,168,76,0.06)' : colors.bg2, borderColor: payMethod === 'Razorpay' ? '#c9a84c' : colors.border }]}
            onPress={() => setPayMethod('Razorpay')}>
            <Text style={{ fontSize: 24 }}>💳</Text>
            <Text style={[s.payLabel, { color: colors.text }]}>Pay Online</Text>
            <Text style={[s.payDesc, { color: colors.text2 }]}>UPI · Card · Wallet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={[s.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity onPress={placeOrder} disabled={submitting} style={{ borderRadius: 8, overflow: 'hidden', width: '100%' }}>
          <LinearGradient colors={submitting ? ['#888','#999'] : ['#c9a84c','#e6c56a']} style={s.placeBtn}>
            <Text style={s.placeTxt}>{submitting ? 'Placing Order...' : `Place Order — ₹${cartTotal.toLocaleString()}`}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  secLabel: { fontSize: 10, letterSpacing: 2, marginBottom: 10 },
  summaryBox: { borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
  summItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  summName: { fontSize: 13, flex: 1 }, summPrice: { fontSize: 13, fontWeight: '500' },
  summTotal: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderTopWidth: 1 },
  summTotalLabel: { fontSize: 15, fontWeight: '500' }, summTotalVal: { fontSize: 18, fontWeight: '600' },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 10, letterSpacing: 1.5, marginBottom: 6 },
  input: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 6, borderWidth: 1, fontSize: 14 },
  row: { flexDirection: 'row', gap: 12 },
  payRow: { flexDirection: 'row', gap: 12 },
  payCard: { flex: 1, padding: 16, borderRadius: 8, borderWidth: 2, alignItems: 'center' },
  payActive: { borderWidth: 2 },
  payLabel: { fontSize: 13, fontWeight: '500', marginTop: 8 },
  payDesc: { fontSize: 10, marginTop: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1 },
  placeBtn: { paddingVertical: 16, alignItems: 'center', borderRadius: 8 },
  placeTxt: { color: '#0e0d0c', fontSize: 14, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  // Success
  successWrap: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  successIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#27ae60', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successLabel: { fontSize: 11, letterSpacing: 3, marginBottom: 8 },
  successTitle: { fontSize: 22, fontWeight: '300', marginBottom: 8 },
  successDesc: { fontSize: 14, marginBottom: 16 },
  orderIdBox: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, marginBottom: 16 },
  orderIdTxt: { fontSize: 12, letterSpacing: 1 },
  etaBox: { borderWidth: 1, borderRadius: 8, padding: 14, width: '100%', marginBottom: 8, backgroundColor: 'rgba(39,174,96,0.04)' },
  etaLabel: { fontSize: 10, letterSpacing: 1.5, color: '#27ae60', marginBottom: 4 },
  etaVal: { fontSize: 14, fontWeight: '500' },
  continueBtn: { paddingVertical: 16, alignItems: 'center' },
  continueTxt: { color: '#0e0d0c', fontSize: 13, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  trackBtn: { width: '100%', paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderRadius: 8, marginTop: 10 },
  trackTxt: { fontSize: 13, letterSpacing: 1 },
});
