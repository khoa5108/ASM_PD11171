import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, Image, Pressable, StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await loadCart(); 
    };

    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  const loadCart = async () => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      const items = cart ? JSON.parse(cart) : [];
      setCartItems(items);
      calculateTotal(items);
    } catch (error) {
      console.error("❌ Lỗi khi tải giỏ hàng", error);
    }
  };

  const calculateTotal = async (items) => {
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity,
      0
    );
    setTotalPrice(total.toFixed(2));
  };

  const updateQuantity = async (item, action) => {
    const updatedCart = cartItems.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + (action === "increase" ? 1 : -1)) }
        : cartItem
    );

    setCartItems(updatedCart);
    await calculateTotal(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = async (item) => {
    const updatedCart = cartItems.filter(cartItem => cartItem.id !== item.id);
    setCartItems(updatedCart);
    await calculateTotal(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckout = async () => {
    await AsyncStorage.setItem("totalPrice", totalPrice.toString());  // Lưu totalPrice vào storage
    navigation.navigate("PaymentScreen", { total: totalPrice });     // Chuyển qua PaymentScreen kèm total
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🛒 Giỏ hàng</Text>

      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  ${parseFloat(item.price.replace(/[^0-9.]/g, "")).toLocaleString()} x {item.quantity}
                </Text>
                <View style={styles.quantityContainer}>
                  <Pressable onPress={() => updateQuantity(item, "decrease")} style={styles.iconButton}> 
                    <Icon name="minus-circle-outline" size={28} color="#ff7f50" />
                  </Pressable>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Pressable onPress={() => updateQuantity(item, "increase")} style={styles.iconButton}> 
                    <Icon name="plus-circle-outline" size={28} color="#ff7f50" />
                  </Pressable>
                </View>
              </View>
              <Pressable onPress={() => removeItem(item)} style={styles.deleteButton}>
                <Icon name="trash-can-outline" size={28} color="red" />
              </Pressable>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyCart}>🛍 Giỏ hàng trống</Text>
      )}

      {cartItems.length > 0 && (
        <View style={styles.checkoutContainer}>
          <Text style={styles.totalText}>
            Tổng cộng: <Text style={{ color: "#ff7f50", fontSize: 22 }}>${parseFloat(totalPrice).toLocaleString()}</Text>
          </Text>
          <Pressable 
            style={styles.checkoutButton} 
            onPress={handleCheckout}  // Đã sửa thành gọi hàm handleCheckout
          > 
            <Icon name="credit-card" size={24} color="white" />
            <Text style={styles.checkoutText}>Thanh toán ngay</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", padding: 20 },
  header: { color: "white", fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  cartItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#222", padding: 12, borderRadius: 10, marginBottom: 12 },
  itemImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  itemDetails: { flex: 1 },
  itemTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  itemPrice: { color: "#bbb", fontSize: 16, marginBottom: 8 },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  iconButton: { padding: 5 },
  quantityText: { color: "white", fontSize: 18, marginHorizontal: 15 },
  deleteButton: { padding: 5 },
  emptyCart: { color: "gray", textAlign: "center", fontSize: 20, marginTop: 30 },
  checkoutContainer: { marginTop: 20, padding: 15, backgroundColor: "#222", borderRadius: 10, alignItems: "center" },
  totalText: { color: "white", fontSize: 20, fontWeight: "bold" },
  checkoutButton: { 
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff7f50", 
    padding: 15, 
    borderRadius: 10, 
    marginTop: 15, 
    width: "100%", 
    justifyContent: "center"
  },
  checkoutText: { color: "white", fontSize: 20, fontWeight: "bold", marginLeft: 8 }
});
