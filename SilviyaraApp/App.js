import React from 'react';
import { StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';

import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import AccountScreen from './src/screens/AccountScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import TrackOrderScreen from './src/screens/TrackOrderScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import ContactScreen from './src/screens/ContactScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack navigators for each tab
function HomeStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { fontWeight: '300', fontSize: 18 },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product' }} />
    </Stack.Navigator>
  );
}

function ShopStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { fontWeight: '300', fontSize: 18 },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="ShopMain" component={ShopScreen} options={{ title: 'Shop' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product' }} />
    </Stack.Navigator>
  );
}

function CartStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { fontWeight: '300', fontSize: 18 },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="CartMain" component={CartScreen} options={{ title: 'Cart' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { fontWeight: '300', fontSize: 18 },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="AccountMain" component={AccountScreen} options={{ title: 'Account' }} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} options={{ title: 'Track Order' }} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
    </Stack.Navigator>
  );
}

function ChatStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      headerTitleStyle: { fontWeight: '300', fontSize: 18 },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="ChatMain" component={ChatbotScreen} options={{ title: 'Silviyara AI ✨' }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { colors, isDark } = useTheme();
  const { cartCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 78,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.text2,
        tabBarLabelStyle: { fontSize: 10, letterSpacing: 0.5 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Shop') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Chat') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          else if (route.name === 'Account') iconName = focused ? 'person' : 'person-outline';
          return (
            <View>
              <Ionicons name={iconName} size={22} color={color} />
              {route.name === 'Cart' && cartCount > 0 && (
                <View style={{
                  position: 'absolute', top: -4, right: -10,
                  backgroundColor: colors.gold, borderRadius: 9,
                  width: 18, height: 18, alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#0e0d0c', fontSize: 10, fontWeight: '600' }}>{cartCount}</Text>
                </View>
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Shop" component={ShopStack} />
      <Tab.Screen name="Cart" component={CartStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isDark, colors } = useTheme();
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
