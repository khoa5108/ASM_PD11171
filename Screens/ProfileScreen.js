import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, Image, Pressable, Alert, ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123 456 789",
    balance: 0,
    avatar: "https://i.pravatar.cc/150?img=3",
  });

  useEffect(() => {
    loadUserData();

    // Khi quay lại từ màn hình EditProfile thì cập nhật lại luôn dữ liệu
    const unsubscribe = navigation.addListener('focus', loadUserData);
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userProfile");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải thông tin người dùng:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("🚪 Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userProfile");
            navigation.replace("Login");
          } catch (error) {
            console.error("❌ Lỗi khi đăng xuất:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Avatar + Info */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar || "https://i.pravatar.cc/150?img=3" }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Thông tin cá nhân */}
        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Icon name="phone" size={24} color="white" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="wallet" size={24} color="white" />
            <Text style={styles.infoText}>Số dư: ${user.balance?.toLocaleString() ?? '0'}</Text>
          </View>
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>💳 Tài khoản thanh toán</Text>
          <Pressable
            style={({ pressed }) => [styles.paymentMethod, pressed && styles.pressed]}
            onPress={() => navigation.navigate("PaymentScreen")}
          >
            <Icon name="credit-card" size={24} color="white" />
            <Text style={styles.paymentMethodText}>Quản lý phương thức thanh toán</Text>
          </Pressable>
        </View>

        {/* Cài đặt */}
        <View style={styles.settingsSection}>
          <SettingItem
            icon="account-edit"
            label="Chỉnh sửa hồ sơ"
            onPress={() => navigation.navigate("EditProfile")}
          />
          <SettingItem
            icon="lock-reset"
            label="Đổi mật khẩu"
            onPress={() => navigation.navigate("ChangePassword")}
          />
          <SettingItem
            icon="bell-ring"
            label="Cài đặt thông báo"
            onPress={() => navigation.navigate("NotificationSettings")}
          />
          <SettingItem
            icon="logout"
            label="Đăng xuất"
            color="red"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable Setting Item
function SettingItem({ icon, label, onPress, color = "white" }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.settingItem, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.settingText, { color }]}>{label}</Text>
    </Pressable>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e" },
  scrollContainer: { padding: 20 },

  profileHeader: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  name: { fontSize: 22, color: "white", fontWeight: "bold" },
  email: { fontSize: 16, color: "gray" },

  infoBox: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  infoItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoText: { marginLeft: 10, color: "white", fontSize: 16 },

  paymentSection: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  paymentTitle: { fontWeight: "bold", fontSize: 16, color: "red", marginBottom: 10 },
  paymentMethod: { flexDirection: "row", alignItems: "center" },
  paymentMethodText: { marginLeft: 10, color: "white", fontSize: 16 },

  settingsSection: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 12,
  },
  settingItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  settingText: { marginLeft: 10, fontSize: 16 },

  pressed: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 8 },
});
