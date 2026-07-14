import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { API_BASE, ENDPOINTS } from '../config/api';

const STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const STEP_ICONS = ['📦', '⚙️', '🚚', '✅'];

export default function TrackOrderScreen() {
  const { colors } = useTheme();
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async () => {
    if (!orderId || !contact) { Alert.alert('Required', 'Enter Order ID and Email/Phone'); return; }
    setLoading(true); setError(''); setOrder(null);
    try {
      const res = await fetch(`${API_BASE}${ENDPOINTS.ORDERS_TRACK}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, contact }),
      });
      const data = await res.json();
      if (data.success) setOrder(data.order);
      else setError(data.msg || 'Order not found');
    } catch (e) { setError('Could not connect to server'); }
    finally { setLoading(false); }
  };

  const statusIndex = order ? STEPS.indexOf(order.status) : 0;

  return (
    <View style={[s.container, { backgroundColor: colors.bg }]}>
      <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={{ fontSize: 36, marginBottom: 12, textAlign: 'center' }}>📍</Text>
        <Text style={[s.title, { color: colors.text }]}>Track Your Order</Text>
        <Text style={[s.desc, { color: colors.text2 }]}>Enter your order details below</Text>
        
        <View style={s.inputGroup}>
          <Text style={[s.label, { color: colors.silver }]}>ORDER ID *</Text>
          <TextInput style={[s.input, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
            placeholder="e.g. 682abc123..." placeholderTextColor={colors.text2} value={orderId} onChangeText={setOrderId} autoCapitalize="none" />
        </View>
        <View style={s.inputGroup}>
          <Text style={[s.label, { color: colors.silver }]}>EMAIL OR PHONE *</Text>
          <TextInput style={[s.input, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }]}
            placeholder="aditi@gmail.com or 9876543210" placeholderTextColor={colors.text2} value={contact} onChangeText={setContact} autoCapitalize="none" />
        </View>

        <TouchableOpacity style={[s.trackBtn, { backgroundColor: colors.text }]} onPress={trackOrder} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.bg} /> :
           <Text style={[s.trackBtnTxt, { color: colors.bg }]}>Track Order</Text>}
        </TouchableOpacity>
        {error ? <Text style={s.error}>{error}</Text> : null}
      </View>

      {order && (
        <View style={[s.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[s.resultLabel, { color: colors.silver }]}>ORDER STATUS</Text>
          <View style={s.steps}>
            {STEPS.map((step, i) => (
              <View key={i} style={s.stepItem}>
                <View style={[s.stepDot, i <= statusIndex && s.stepActive]}>
                  <Text style={{ fontSize: 16 }}>{STEP_ICONS[i]}</Text>
                </View>
                <Text style={[s.stepLabel, { color: i <= statusIndex ? colors.text : colors.text2 }]}>{step}</Text>
                {i < STEPS.length - 1 && <View style={[s.stepLine, { backgroundColor: i < statusIndex ? '#27ae60' : colors.border }]} />}
              </View>
            ))}
          </View>
          <View style={[s.orderInfo, { borderTopColor: colors.border }]}>
            <View style={s.infoRow}><Text style={[s.infoLabel, { color: colors.text2 }]}>Name</Text><Text style={[s.infoVal, { color: colors.text }]}>{order.customerName}</Text></View>
            <View style={s.infoRow}><Text style={[s.infoLabel, { color: colors.text2 }]}>Total</Text><Text style={[s.infoVal, { color: colors.gold }]}>₹{order.totalAmount}</Text></View>
            <View style={s.infoRow}><Text style={[s.infoLabel, { color: colors.text2 }]}>Payment</Text><Text style={[s.infoVal, { color: colors.text }]}>{order.paymentMethod}</Text></View>
            <View style={s.infoRow}><Text style={[s.infoLabel, { color: colors.text2 }]}>Items</Text><Text style={[s.infoVal, { color: colors.text }]}>{order.items?.length} items</Text></View>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 12, borderWidth: 1, padding: 24, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '300', textAlign: 'center', marginBottom: 4 },
  desc: { fontSize: 13, textAlign: 'center', marginBottom: 20 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  input: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 6, borderWidth: 1, fontSize: 14 },
  trackBtn: { paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  trackBtnTxt: { fontSize: 13, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  error: { color: '#c0392b', fontSize: 13, textAlign: 'center', marginTop: 12 },
  resultCard: { borderRadius: 12, borderWidth: 1, padding: 20 },
  resultLabel: { fontSize: 10, letterSpacing: 2, marginBottom: 16 },
  steps: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  stepItem: { alignItems: 'center', flex: 1, position: 'relative' },
  stepDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2a2520', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  stepActive: { backgroundColor: '#27ae60' },
  stepLabel: { fontSize: 9, letterSpacing: 0.5, textAlign: 'center' },
  stepLine: { position: 'absolute', top: 18, left: '60%', right: '-40%', height: 2 },
  orderInfo: { borderTopWidth: 1, paddingTop: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 13 }, infoVal: { fontSize: 13, fontWeight: '500' },
});
