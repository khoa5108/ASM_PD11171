import React, { useState, useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params || {};
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không có thông tin sản phẩm!</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={{ color: "white", marginTop: 10 }}>Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  const productImage = product.image
    ? typeof product.image === "string"
      ? { uri: product.image }
      : product.image
    : require("../assets/images/avt cafe.png");

  const handleAddToCart = async () => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      let cartItems = cart ? JSON.parse(cart) : [];

      const existingItem = cartItems.find(
        (item) => item.id === product.id && item.size === selectedSize
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cartItems.push({ ...product, size: selectedSize, quantity });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
      Alert.alert("Thành công", `🛒 Đã thêm ${quantity} ${product.name} - Size ${selectedSize} vào giỏ hàng!`);
      setQuantity(1);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng", error);
      Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={productImage} style={styles.image} />
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>

      <View style={styles.detailContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.subtitle}>with steamed milk</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={18} color="#ffcc00" />
          <Text style={styles.rating}> 4.5 (97.1k)</Text>
        </View>

        <Text style={styles.description}>
          Cappuccino is a latte made with more foam than steamed milk, often with a sprinkle of cocoa powder or cinnamon on top.
        </Text>

        {/* Kích thước & Số lượng */}
        <View style={styles.sizeAndQuantityRow}>
          {/* Chọn Size */}
          <View>
            <Text style={styles.sizeLabel}>Size</Text>
            <View style={styles.sizeRow}>
              {["S", "M", "L"].map((size) => (
                <Pressable
                  key={size}
                  style={[styles.sizeButton, selectedSize === size && styles.sizeSelected]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextSelected]}>
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Chọn số lượng */}
          <View>
            <Text style={styles.sizeLabel}>Quantity</Text>
            <View style={styles.quantityRow}>
              <Pressable style={styles.quantityButton} onPress={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}>
                <Ionicons name="remove" size={18} color="white" />
              </Pressable>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Pressable style={styles.quantityButton} onPress={() => setQuantity((prev) => prev + 1)}>
                <Ionicons name="add" size={18} color="white" />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{product.price * quantity}</Text>
          <Pressable style={styles.addButton} onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  image: { width: "100%", height: 150, resizeMode: "cover", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10 },
  detailContainer: { padding: 20, backgroundColor: "rgba(30,30,30,0.9)", flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  name: { fontSize: 24, fontWeight: "bold", color: "white" },
  subtitle: { fontSize: 16, color: "#aaa", marginBottom: 10 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rating: { fontSize: 16, color: "#ffcc00" },
  description: { fontSize: 14, color: "#bbb", marginBottom: 10, lineHeight: 20 },
  sizeAndQuantityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  sizeLabel: { fontSize: 16, color: "white", marginBottom: 5 },
  sizeRow: { flexDirection: "row", gap: 10 },
  sizeButton: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: "#333", borderRadius: 10 },
  sizeSelected: { backgroundColor: "#ff7f50" },
  sizeText: { color: "white", fontSize: 16 },
  sizeTextSelected: { fontWeight: "bold" },
  quantityRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#222", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  quantityButton: { backgroundColor: "#444", padding: 10, borderRadius: 8 },
  quantityText: { fontSize: 18, color: "white", fontWeight: "bold", textAlign: "center", minWidth: 30 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
  price: { fontSize: 22, fontWeight: "bold", color: "white" },
  addButton: { backgroundColor: "#ff7f50", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10 },
  addButtonText: { fontSize: 16, fontWeight: "bold", color: "white" },
  errorText: { color: "red", fontSize: 18, textAlign: "center", marginTop: 50 },
});
