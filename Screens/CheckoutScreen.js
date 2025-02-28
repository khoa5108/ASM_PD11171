import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";

export default function CheckoutScreen({ route, navigation }) {
  const { order } = route.params;

  const handlePayment = () => {
    Alert.alert("Thanh toán thành công", `Cảm ơn bạn đã mua ${order.product.name}!`);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận thanh toán</Text>
      <Text style={styles.detail}>Sản phẩm: {order.product.name}</Text>
      <Text style={styles.detail}>Size: {order.selectedSize}</Text>
      <Text style={styles.detail}>Số lượng: {order.quantity}</Text>
      <Text style={styles.detail}>Tổng tiền: {order.totalPrice.toLocaleString()} VND</Text>

      <Pressable style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Thanh toán ngay</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  detail: { color: "#ccc", marginBottom: 10 },
  payButton: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 10, marginTop: 20, alignItems: "center" },
  payButtonText: { color: "white", fontWeight: "bold" },
});
