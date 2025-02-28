import React from "react";
import { View, Text, Image, Pressable, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ProductCard = ({ item, navigation, addToCart }) => {
  if (!item || !navigation || !addToCart) {
    console.warn("Thiếu prop item, navigation hoặc addToCart ở ProductCard");
    return null;
  }

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Chặn event 'onPress' của TouchableOpacity
    addToCart(item);
    Alert.alert("🛒 Giỏ hàng", `${item.name} đã được thêm vào giỏ hàng!`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <View style={styles.productCard}>
        <Image 
          source={typeof item.image === "string" ? { uri: item.image } : item.image} 
          style={styles.productImage} 
          resizeMode="cover"
        />
        <Text style={styles.productTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productSubtitle}>{item.category}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>{item.price}</Text>
          <Pressable style={styles.addButton} onPress={handleAddToCart}>
            <Icon name="plus" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: { 
    backgroundColor: "#1f1f1f", 
    borderRadius: 12, 
    padding: 10, 
    marginHorizontal: 5, 
    marginVertical: 8,
    flex: 1, 
    alignItems: "center", 
    elevation: 3,
  },
  productImage: { 
    width: "100%", 
    height: 120, 
    borderRadius: 8, 
    marginBottom: 8,
  },
  productTitle: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold", 
    textAlign: "center",
  },
  productSubtitle: { 
    color: "#aaa", 
    fontSize: 13, 
    marginBottom: 5, 
    textAlign: "center",
  },
  priceRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    width: "100%",
    marginTop: 5,
  },
  productPrice: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold",
  },
  addButton: { 
    backgroundColor: "orange", 
    borderRadius: 15, 
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(ProductCard);
