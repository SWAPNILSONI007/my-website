import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function AccountScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) { Alert.alert('Missing Fields', 'Please fill in all fields.'); return; }
    setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else { if (!name) { Alert.alert('Missing Name', 'Please enter your name.'); setLoading(false); return; } await register(name, email, password); }
    } catch (e) { Alert.alert('Error', e.message || 'Something went wrong.'); }
    finally { setLoading(false); }
  };

  if (user) {
    return (
      <ScrollView style={[s.container, { backgroundColor: colors.bg }]} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.profileHeader, { backgroundColor: colors.bg2 }]}>
          <View style={[s.avatar, { backgroundColor: colors.card, borderColor: colors.gold }]}>
            <Text style={[s.avatarText, { color: colors.gold }]}>{user.name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
          <Text style={[s.userName, { color: colors.text }]}>{user.name}</Text>
          <Text style={[s.userEmail, { color: colors.text2 }]}>{user.email}</Text>
        </View>
        <View style={s.menuList}>
          {[
            { icon: 'receipt-outline', label: 'My Orders', sub: 'View your order history', nav: 'MyOrders' },
            { icon: 'location-outline', label: 'Track Order', sub: 'Track your package', nav: 'TrackOrder' },
            { icon: 'chatbubble-outline', label: 'Contact Us', sub: 'Get in touch with us', nav: 'Contact' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={[s.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate(item.nav)} activeOpacity={0.7}>
              <Ionicons name={item.icon} size={22} color={colors.gold} />
              <View style={s.menuText}>
                <Text style={[s.menuLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={[s.menuSub, { color: colors.text2 }]}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text2} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[s.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={toggleTheme} activeOpacity={0.7}>
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={22} color={colors.gold} />
            <View style={s.menuText}>
              <Text style={[s.menuLabel, { color: colors.text }]}>{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
              <Text style={[s.menuSub, { color: colors.text2 }]}>Switch appearance</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.text2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.logoutBtn, { borderColor: colors.error }]}
            onPress={() => Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Logout', onPress: logout }])}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
            <Text style={[s.logoutTxt, { color: colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[s.container, { backgroundColor: colors.bg }]} contentContainerStyle={s.authWrap} keyboardShouldPersistTaps="handled">
      <Text style={s.authEmoji}>💍</Text>
      <Text style={[s.authTitle, { color: colors.text }]}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</Text>
      <Text style={[s.authSub, { color: colors.text2 }]}>{mode === 'login' ? 'Sign in to your Silviyara account' : 'Join the Silviyara family'}</Text>

      {mode === 'register' && (
        <View style={s.fieldWrap}>
          <Text style={[s.fieldLabel, { color: colors.silver }]}>FULL NAME *</Text>
          <TextInput style={[s.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Your name" placeholderTextColor={colors.text2} value={name} onChangeText={setName} />
        </View>
      )}
      <View style={s.fieldWrap}>
        <Text style={[s.fieldLabel, { color: colors.silver }]}>EMAIL *</Text>
        <TextInput style={[s.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="you@email.com" placeholderTextColor={colors.text2} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      </View>
      <View style={s.fieldWrap}>
        <Text style={[s.fieldLabel, { color: colors.silver }]}>PASSWORD *</Text>
        <TextInput style={[s.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="••••••••" placeholderTextColor={colors.text2} value={password} onChangeText={setPassword} secureTextEntry />
      </View>

      <TouchableOpacity onPress={handleAuth} activeOpacity={0.85} style={{ borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
        <LinearGradient colors={['#c9a84c', '#e6c56a']} style={s.authBtn}>
          {loading ? <ActivityIndicator color="#0e0d0c" size="small" /> : <Text style={s.authBtnTxt}>{mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</Text>}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')} style={s.toggleWrap}>
        <Text style={[s.toggleTxt, { color: colors.text2 }]}>{mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <Text style={[s.toggleLink, { color: colors.gold }]}>{mode === 'login' ? 'Sign Up' : 'Sign In'}</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: { alignItems: 'center', paddingVertical: 36 },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '300' },
  userName: { fontSize: 20, fontWeight: '300', marginBottom: 4 },
  userEmail: { fontSize: 13 },
  menuList: { padding: 16, gap: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 10, borderWidth: 1 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '400' },
  menuSub: { fontSize: 12, marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 10, borderWidth: 1, marginTop: 6 },
  logoutTxt: { fontSize: 14, fontWeight: '500' },
  authWrap: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  authEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  authTitle: { fontSize: 26, fontWeight: '300', textAlign: 'center', marginBottom: 6 },
  authSub: { fontSize: 14, textAlign: 'center', marginBottom: 28 },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 10, letterSpacing: 1.5, marginBottom: 6 },
  input: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 10, borderWidth: 1, fontSize: 14 },
  authBtn: { paddingVertical: 16, alignItems: 'center' },
  authBtnTxt: { color: '#0e0d0c', fontSize: 13, fontWeight: '700', letterSpacing: 1.5 },
  toggleWrap: { alignItems: 'center', marginTop: 20 },
  toggleTxt: { fontSize: 14 },
  toggleLink: { fontWeight: '500' },
});
