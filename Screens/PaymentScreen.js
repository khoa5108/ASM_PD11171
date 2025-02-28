import React, { useEffect, useState, useCallback } from "react";
import { 
  View, Text, Pressable, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function PaymentScreen({ navigation }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [walletBalance, setWalletBalance] = useState(9999999999);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const storedPrice = await AsyncStorage.getItem("totalPrice");
          setTotalPrice(storedPrice ? parseFloat(storedPrice) : 0);

          const storedBalance = await AsyncStorage.getItem("walletBalance");
          setWalletBalance(storedBalance ? parseFloat(storedBalance) : 9999999999);
        } catch (error) {
          console.error("❌ Lỗi khi lấy dữ liệu:", error);
        }
      };
      fetchData();
    }, [])
  );

  const handleAddFunds = async (amount) => {
    try {
      const newBalance = walletBalance + amount;
      await AsyncStorage.setItem("walletBalance", newBalance.toString());
      setWalletBalance(newBalance);
      Alert.alert("✅ Nạp tiền thành công", `Số tiền đã nạp: $${amount.toLocaleString()}`);
    } catch (error) {
      console.error("❌ Lỗi khi nạp tiền:", error);
    }
  };

  const handlePayment = async () => {
    if (totalPrice <= 0) {
      Alert.alert("⚠️ Giỏ hàng trống", "Vui lòng chọn sản phẩm trước khi thanh toán.");
      return;
    }

    if (walletBalance < totalPrice) {
      Alert.alert("⚠️ Số dư không đủ", "Vui lòng nạp thêm tiền.");
      return;
    }

    setIsLoading(true);

    Alert.alert(
      "💳 Xác nhận thanh toán",
      `Xác nhận thanh toán ${totalPrice.toLocaleString()}$?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              const newBalance = walletBalance - totalPrice;
              await AsyncStorage.setItem("walletBalance", newBalance.toString());
              await AsyncStorage.removeItem("cart");
              await AsyncStorage.setItem("totalPrice", "0");

              setTotalPrice(0);
              setWalletBalance(newBalance);

              Alert.alert("✅ Thành công!", "Cảm ơn bạn đã mua hàng.");
              navigation.navigate("Main", { screen: "Cart" });
            } catch (error) {
              console.error("❌ Lỗi thanh toán:", error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={28} color="white" />
            </Pressable>
            <Text style={styles.header}>Thanh toán</Text>
          </View>

          {/* Thẻ tín dụng */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Thẻ tín dụng</Text>
            <View style={styles.card}>
              <Text style={styles.cardNumber}>3897 8923 6745 4638</Text>
              <View style={styles.cardDetails}>
                <Text style={styles.cardHolder}>Robert Evans</Text>
                <Text style={styles.expiryDate}>02/30</Text>
              </View>
              <Text style={styles.cardBrand}>VISA</Text>
            </View>
          </View>

          {/* Phương thức thanh toán */}
          <View style={styles.paymentMethods}>
            <Pressable style={styles.paymentMethod} onPress={() => handleAddFunds(50)}>
              <Icon name="wallet" size={24} color="white" />
              <Text style={styles.methodText}>Ví - ${walletBalance.toLocaleString()}</Text>
            </Pressable>

            <Pressable style={styles.paymentMethod}>
              <Image source={require("../assets/images/ggpay.png")} style={styles.methodIcon} />
              <Text style={styles.methodText}>Google Pay</Text>
            </Pressable>

            <Pressable style={styles.paymentMethod}>
              <Image source={require("../assets/images/Apple.jpg")} style={styles.methodIcon} />
              <Text style={styles.methodText}>Apple Pay</Text>
            </Pressable>

            <Pressable style={styles.paymentMethod}>
              <Image source={require("../assets/images/pay.jpg")} style={styles.methodIcon} />
              <Text style={styles.methodText}>Amazon Pay</Text>
            </Pressable>
          </View>

          {/* Tổng tiền */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Tổng tiền:</Text>
            <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
          </View>

          {/* Nút thanh toán */}
          <Pressable style={styles.payButton} onPress={handlePayment} disabled={isLoading}>
            <Text style={styles.payButtonText}>{isLoading ? "Đang xử lý..." : "Thanh toán ngay"}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Style hoàn thiện
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", paddingHorizontal: 20 },
  scrollContainer: { flexGrow: 1 },
  
  headerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  backButton: { marginRight: 15 },
  header: { color: "white", fontSize: 26, fontWeight: "bold" },

  cardContainer: { backgroundColor: "#222", padding: 15, borderRadius: 10, marginBottom: 20 },
  cardTitle: { color: "white", fontSize: 16, marginBottom: 10 },
  card: { backgroundColor: "#ff7f50", padding: 20, borderRadius: 10, alignItems: "center" },
  cardNumber: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  cardDetails: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cardHolder: { color: "white", fontSize: 16 },
  expiryDate: { color: "white", fontSize: 14 },
  cardBrand: { color: "white", fontSize: 18, fontWeight: "bold", marginTop: 8 },

  paymentMethods: { marginBottom: 20 },
  paymentMethod: { flexDirection: "row", alignItems: "center", backgroundColor: "#333", padding: 12, borderRadius: 10, marginBottom: 10 },
  methodText: { color: "white", fontSize: 16, marginLeft: 10 },
  methodIcon: { width: 24, height: 24 },

  totalContainer: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#444" },
  totalText: { color: "white", fontSize: 18 },
  totalAmount: { color: "#ff7f50", fontSize: 18, fontWeight: "bold" },

  payButton: { backgroundColor: "#ff7f50", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  payButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

