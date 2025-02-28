import React, { useState, useEffect, useMemo } from "react";
import { 
  View, Text, TextInput, ScrollView, 
  Pressable, StyleSheet, FlatList, ActivityIndicator, Dimensions, ToastAndroid 
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../Screens/ProductCard";

const { width } = Dimensions.get("window");
const itemWidth = (width - 60) / 2; 

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user_email");
        if (!storedUser) {
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        } else {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigation]);

  const addToCart = async (item) => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      let cartItems = cart ? JSON.parse(cart) : [];
      if (!Array.isArray(cartItems)) cartItems = [];

      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ ...item, quantity: 1 });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
      ToastAndroid.show(`🛒 Đã thêm ${item.name} vào giỏ hàng!`, ToastAndroid.SHORT);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  const categories = ["All", "Cappuccino", "Espresso", "Americano", "Macchiato"];

  const products = [
    { id: 1, name: "Cappuccino", category: "Cappuccino", price: "$4.20", image: require("../assets/images/avt_capu.png") },
    { id: 2, name: "Espresso", category: "Espresso", price: "$3.50", image: require("../assets/images/avt_capu.png") },
    { id: 3, name: "Americano", category: "Americano", price: "$3.80", image: require("../assets/images/avt_capu.png") },
    { id: 4, name: "Macchiato", category: "Macchiato", price: "$4.00", image: require("../assets/images/avt_capu.png") },
  ];

  const filteredProducts = useMemo(() => {
    return selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7f50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ry Coffe</Text>
        {user && (
          <Pressable onPress={() => AsyncStorage.removeItem("user_email").then(() => navigation.reset({ index: 0, routes: [{ name: "Login" }] }))}>
            <Icon name="logout" size={24} color="white" style={{ marginRight: 15 }} />
          </Pressable>
        )}
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#bbb" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search coffee..." placeholderTextColor="#bbb" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <Pressable key={index} onPress={() => setSelectedCategory(category)}>
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryActive]}>{category}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={[styles.productContainer, { width: itemWidth }]}> 
            <ProductCard item={item} navigation={navigation} addToCart={() => addToCart(item)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  headerText: { color: "white", fontSize: 20, fontWeight: "bold" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#333", borderRadius: 10, padding: 6, marginBottom: 5 },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, color: "white", fontSize: 12 },
  categoryContainer: { flexDirection: "row", marginBottom: 5 },
  categoryText: { color: "white", fontSize: 14, marginRight: 10, padding: 3 },
  categoryActive: { fontWeight: "bold", borderBottomWidth: 2, borderBottomColor: "orange" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  row: { justifyContent: "space-between" },
  productContainer: { marginBottom: 10 },
});
