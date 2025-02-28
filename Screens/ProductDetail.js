import React, { useContext, useCallback, useEffect } from "react";
import { 
  View, Text, Image, TouchableOpacity, 
  StyleSheet, ScrollView 
} from "react-native";
import { CartContext } from "../Screens/CartContext"; 
import { useToast } from "react-native-toast-notifications";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

export default function ProductDetail({ route, navigation }) {
  const { product } = route.params || {}; 
  const { addToCart } = useContext(CartContext);
  const toast = useToast();

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: "none" } });
    return () => navigation.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ Không tìm thấy sản phẩm</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const productImage = product.image || "https://via.placeholder.com/250"; 

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    toast.show(`🛒 Đã thêm ${product.name} vào giỏ hàng!`, { type: "success" });
  }, [addToCart, product, toast]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Icon name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chi tiết sản phẩm</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: productImage }} style={styles.image} />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toLocaleString()}</Text>

        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}

        <TouchableOpacity activeOpacity={0.8} onPress={handleAddToCart}>
          <LinearGradient colors={["#ff7f50", "#ff4500"]} style={styles.addButton}>
            <Icon name="cart-plus" size={24} color="white" />
            <Text style={styles.addButtonText}>Thêm vào giỏ hàng</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#1e1e1e", elevation: 5 },
  headerText: { color: "white", fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  content: { alignItems: "center", padding: 20 },
  image: { width: 250, height: 250, borderRadius: 15, marginBottom: 15, resizeMode: "cover" },
  name: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 5, textAlign: "center" },
  price: { color: "#ff7f50", fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  description: { color: "#bbb", fontSize: 16, textAlign: "center", marginBottom: 20, paddingHorizontal: 10 },
  addButton: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center", justifyContent: "center", elevation: 5, shadowColor: "#ff7f50", shadowOpacity: 0.5, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5 },
  addButtonText: { color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 8 },
  backButton: { marginTop: 20, backgroundColor: "#ff7f50", padding: 10, borderRadius: 5 },
  backButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 10 },
});
