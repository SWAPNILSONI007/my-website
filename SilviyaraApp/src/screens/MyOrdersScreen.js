import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE, ENDPOINTS } from '../config/api';

export default function MyOrdersScreen({ navigation }) {
  const { colors } = useTheme();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}${ENDPOINTS.ORDERS_MY}`, {
        headers: { 'x-auth-token': token },
      });
      setOrders(await res.json());
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const statusColor = (status) => {
    const map = { Pending: '#f39c12', Processing: '#3498db', Shipped: '#8e44ad', Delivered: '#27ae60', Cancelled: '#c0392b' };
    return map[status] || colors.text2;
  };

  if (loading) return <View style={[s.center, { backgroundColor: colors.bg }]}><ActivityIndicator size="large" color={colors.gold} /></View>;
  if (orders.length === 0) return (
    <View style={[s.center, { backgroundColor: colors.bg }]}>
      <Text style={{ fontSize: 48 }}>📦</Text>
      <Text style={[s.emptyTxt, { color: colors.text }]}>No Orders Yet</Text>
      <Text style={[s.emptyDesc, { color: colors.text2 }]}>Start shopping to see your orders here</Text>
    </View>
  );

  return (
    <View style={[s.container, { backgroundColor: colors.bg }]}>
      <FlatList data={orders} keyExtractor={i => i._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={s.cardHead}>
              <View>
                <Text style={[s.orderId, { color: colors.silver }]}>#{item._id?.slice(-8)}</Text>
                <Text style={[s.orderDate, { color: colors.text2 }]}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={[s.statusBadge, { backgroundColor: statusColor(item.status) + '20' }]}>
                <Text style={[s.statusTxt, { color: statusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>
            <View style={[s.cardBody, { borderTopColor: colors.border }]}>
              <Text style={[s.itemCount, { color: colors.text }]}>{item.items?.length} item{item.items?.length > 1 ? 's' : ''}</Text>
              <Text style={[s.total, { color: colors.gold }]}>₹{item.totalAmount}</Text>
            </View>
            <View style={s.cardFoot}>
              <Text style={[s.payMethod, { color: colors.text2 }]}>{item.paymentMethod} · {item.paymentStatus}</Text>
            </View>
          </View>
        )} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTxt: { fontSize: 20, fontWeight: '300', marginTop: 14 },
  emptyDesc: { fontSize: 13, marginTop: 6 },
  card: { borderRadius: 12, borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  orderId: { fontSize: 12, letterSpacing: 1, marginBottom: 2 },
  orderDate: { fontSize: 11 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  statusTxt: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderTopWidth: 1 },
  itemCount: { fontSize: 14 },
  total: { fontSize: 18, fontWeight: '500' },
  cardFoot: { paddingHorizontal: 14, paddingBottom: 12 },
  payMethod: { fontSize: 11, letterSpacing: 0.5 },
});
