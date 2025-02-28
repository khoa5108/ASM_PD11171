import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { CartProvider } from "../CartContext";
import { NotificationProvider } from "../NotificationContext";

// Import các màn hình
import LoginScreen from "../LoginScreens";
import RegisterScreen from "../Register";
import HomeScreen from "../HomeScreen";
import CartScreen from "../CartScreen";
import NotificationScreen from "../NotificationScreen";
import ProfileScreen from "../ProfileScreen";
import EditProfileScreen from "../EditProfileScreen";
import ProductDetailScreen from "../ProductDetailScreen";
import PaymentScreen from "../PaymentScreen";  // Fix - Đảm bảo PaymentScreen khai báo đúng.

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Cart: "cart",
            NotificationsScreen: "notifications",
            Profile: "person",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ff7f50",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1E1E1E", borderTopWidth: 0 },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="NotificationsScreen" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <CartProvider>
      <NotificationProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} /> 
          </Stack.Navigator>
        </NavigationContainer>
      </NotificationProvider>
    </CartProvider>
  );
}
