import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { API_BASE, ENDPOINTS } from '../config/api';

const SUGGESTIONS = ['Show me pendants', 'What\'s on sale?', 'Return policy?', 'Delivery time?', 'Best sellers?'];

export default function ChatbotScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([
    { id: 'init', role: 'assistant', text: 'Hi! I\'m the Silviyara AI assistant. Ask me anything about our jewellery, orders, or policies! ✨' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput('');
    const userMsg = { id: Date.now().toString(), role: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${ENDPOINTS.CHATBOT}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: data.reply || data.message || 'Sorry, I couldn\'t get a response.' }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: 'Unable to reach the server. Please make sure the backend is running.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView style={[s.container, { backgroundColor: colors.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={i => i.id}
        contentContainerStyle={s.msgList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListHeaderComponent={
          <View style={s.suggestionWrap}>
            <Text style={[s.suggestLabel, { color: colors.text2 }]}>Quick questions:</Text>
            <View style={s.suggestRow}>
              {SUGGESTIONS.map(q => (
                <TouchableOpacity key={q} onPress={() => send(q)} style={[s.suggestChip, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <Text style={[s.suggestTxt, { color: colors.text2 }]}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[s.msgRow, item.role === 'user' ? s.msgRowUser : s.msgRowBot]}>
            <View style={[
              s.bubble,
              item.role === 'user'
                ? { backgroundColor: colors.text }
                : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }
            ]}>
              <Text style={[s.bubbleTxt, { color: item.role === 'user' ? colors.bg : colors.text }]}>{item.text}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={loading
          ? <View style={[s.msgRow, s.msgRowBot]}>
              <View style={[s.bubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                <ActivityIndicator size="small" color={colors.gold} />
              </View>
            </View>
          : null}
      />
      <View style={[s.inputBar, { backgroundColor: colors.bg, borderTopColor: colors.border }]}>
        <TextInput
          style={[s.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="Ask about jewellery..."
          placeholderTextColor={colors.text2}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send()}
          multiline
        />
        <TouchableOpacity onPress={() => send()} disabled={!input.trim() || loading} activeOpacity={0.8} style={{ borderRadius: 8, overflow: 'hidden' }}>
          <LinearGradient colors={input.trim() ? ['#c9a84c', '#e6c56a'] : [colors.border, colors.border]} style={s.sendBtn}>
            <Ionicons name="arrow-up" size={18} color={input.trim() ? '#0e0d0c' : colors.text2} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  msgList: { padding: 16, paddingBottom: 20 },
  suggestionWrap: { marginBottom: 16 },
  suggestLabel: { fontSize: 11, letterSpacing: 0.5, marginBottom: 8 },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
  suggestTxt: { fontSize: 12 },
  msgRow: { flexDirection: 'row', marginBottom: 10 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowBot: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14 },
  bubbleTxt: { fontSize: 14, lineHeight: 20 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, paddingBottom: 16, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
