import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { API_BASE, ENDPOINTS, WHATSAPP_NUMBER } from '../config/api';

export default function ContactScreen() {
  const { colors } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = async () => {
    if (!form.name || !form.email || !form.message) { Alert.alert('Required', 'Name, email and message are required'); return; }
    try {
      await fetch(`${API_BASE}${ENDPOINTS.CONTACT}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      setSent(true);
    } catch (e) { Alert.alert('Error', 'Could not send message'); }
  };

  if (sent) return (
    <View style={[s.container, s.center, { backgroundColor: colors.bg }]}>
      <Text style={{ fontSize: 48 }}>✉️</Text>
      <Text style={[s.sentTitle, { color: colors.text }]}>Message Sent!</Text>
      <Text style={[s.sentDesc, { color: colors.text2 }]}>We'll get back to you within 24 hours</Text>
    </View>
  );

  return (
    <ScrollView style={[s.container, { backgroundColor: colors.bg }]} contentContainerStyle={{ padding: 20 }}>
      {/* Contact Info */}
      <View style={[s.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { icon: 'call-outline', label: 'Phone', val: '+91 8004703038', action: () => Linking.openURL('tel:+918004703038') },
          { icon: 'logo-whatsapp', label: 'WhatsApp', val: 'Chat with us', action: () => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`) },
          { icon: 'time-outline', label: 'Hours', val: 'Mon–Sat, 10am–8pm' },
          { icon: 'location-outline', label: 'Location', val: 'Lucknow, India' },
        ].map((c, i) => (
          <TouchableOpacity key={i} style={[s.infoRow, i < 3 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            onPress={c.action} disabled={!c.action}>
            <Ionicons name={c.icon} size={20} color={colors.gold} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[s.infoLabel, { color: colors.text2 }]}>{c.label}</Text>
              <Text style={[s.infoVal, { color: colors.text }]}>{c.val}</Text>
            </View>
            {c.action && <Ionicons name="chevron-forward" size={16} color={colors.text2} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Form */}
      <Text style={[s.formTitle, { color: colors.text }]}>Send a Message</Text>
      {[
        { key: 'name', label: 'Name *', ph: 'Your name' },
        { key: 'email', label: 'Email *', ph: 'you@email.com', kb: 'email-address' },
        { key: 'phone', label: 'Phone', ph: 'Mobile number', kb: 'phone-pad' },
        { key: 'subject', label: 'Subject', ph: 'How can we help?' },
        { key: 'message', label: 'Message *', ph: 'Your message...', multi: true },
      ].map(f => (
        <View key={f.key} style={s.inputGroup}>
          <Text style={[s.inputLabel, { color: colors.silver }]}>{f.label}</Text>
          <TextInput style={[s.input, { backgroundColor: colors.bg2, borderColor: colors.border, color: colors.text }, f.multi && { height: 100, textAlignVertical: 'top' }]}
            placeholder={f.ph} placeholderTextColor={colors.text2} value={form[f.key]}
            onChangeText={v => update(f.key, v)} keyboardType={f.kb || 'default'} multiline={f.multi} />
        </View>
      ))}
      <TouchableOpacity style={[s.submitBtn, { backgroundColor: colors.text }]} onPress={submit}>
        <Text style={[s.submitTxt, { color: colors.bg }]}>Send Message</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  sentTitle: { fontSize: 22, fontWeight: '300', marginTop: 14 },
  sentDesc: { fontSize: 14, marginTop: 6 },
  infoCard: { borderRadius: 12, borderWidth: 1, marginBottom: 24, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  infoLabel: { fontSize: 10, letterSpacing: 1.5, marginBottom: 2 },
  infoVal: { fontSize: 14 },
  formTitle: { fontSize: 20, fontWeight: '300', marginBottom: 16 },
  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  input: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 6, borderWidth: 1, fontSize: 14 },
  submitBtn: { paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 4, marginBottom: 40 },
  submitTxt: { fontSize: 13, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
});
