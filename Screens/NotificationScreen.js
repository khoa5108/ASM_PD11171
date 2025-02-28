import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, StyleSheet, Pressable, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem("notifications");
      const notificationList = storedNotifications ? JSON.parse(storedNotifications) : [];
      setNotifications(notificationList);
    } catch (error) {
      console.error("❌ Lỗi khi tải thông báo:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const updatedNotifications = notifications.filter((item) => item.id !== id);
      setNotifications(updatedNotifications);
      await AsyncStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error("❌ Lỗi khi xóa thông báo:", error);
    }
  };

  const clearAllNotifications = async () => {
    Alert.alert(
      "🗑 Xóa tất cả thông báo",
      "Bạn có chắc chắn muốn xóa tất cả thông báo không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("notifications");
              setNotifications([]);
            } catch (error) {
              console.error("❌ Lỗi khi xóa tất cả thông báo:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>🔔 Thông báo</Text>
        {notifications.length > 0 && (
          <Pressable onPress={clearAllNotifications} style={styles.clearAllButton}>
            <Icon name="delete-sweep" size={24} color="white" />
          </Pressable>
        )}
      </View>

      {/* Danh sách thông báo */}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <Pressable onPress={() => deleteNotification(item.id)} style={styles.deleteButton}>
                <Icon name="delete" size={22} color="white" />
              </Pressable>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>Không có thông báo nào 📭</Text>
      )}
    </SafeAreaView>
  );
}

// 🌟 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", padding: 20 },
  
  // Header
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  header: { color: "white", fontSize: 26, fontWeight: "bold" },
  clearAllButton: { padding: 10 },

  // Notification Item
  notificationItem: { flexDirection: "row", backgroundColor: "#333", padding: 15, borderRadius: 10, marginBottom: 10, alignItems: "center" },
  notificationContent: { flex: 1 },
  message: { color: "white", fontSize: 16, fontWeight: "bold" },
  date: { color: "gray", fontSize: 14, marginTop: 5 },
  deleteButton: { padding: 8, marginLeft: 10 },

  // Empty text
  emptyText: { color: "gray", fontSize: 18, textAlign: "center", marginTop: 20 },
});

