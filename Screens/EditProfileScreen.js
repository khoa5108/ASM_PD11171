import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, StyleSheet, Pressable, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function EditProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  // Tải thông tin hồ sơ từ AsyncStorage khi vào màn hình
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userProfile");
        if (storedUser) {
          setProfile(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải profile:", error);
      }
    };

    loadUserProfile();
  }, []);

  // Xử lý lưu hồ sơ
  const handleSave = async () => {
    if (!profile.name || !profile.email || !profile.phone) {
      Alert.alert("⚠️ Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
      Alert.alert("✅ Thành công", "Hồ sơ đã được cập nhật!");
      navigation.goBack(); // Quay lại ProfileScreen sau khi lưu
    } catch (error) {
      console.error("❌ Lỗi khi lưu profile:", error);
      Alert.alert("❌ Thất bại", "Không thể lưu hồ sơ.");
    }
  };

  // Cập nhật state khi người dùng gõ dữ liệu mới
  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với nút quay lại */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={28} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
      </View>

      {/* Form chỉnh sửa */}
      <View style={styles.form}>
        <Text style={styles.label}>Tên:</Text>
        <TextInput
          style={styles.input}
          value={profile.name}
          onChangeText={(text) => handleChange("name", text)}
          placeholder="Nhập tên"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          onChangeText={(text) => handleChange("email", text)}
          placeholder="Nhập email"
          placeholderTextColor="#888"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Số điện thoại:</Text>
        <TextInput
          style={styles.input}
          value={profile.phone}
          onChangeText={(text) => handleChange("phone", text)}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Avatar URL:</Text>
        <TextInput
          style={styles.input}
          value={profile.avatar}
          onChangeText={(text) => handleChange("avatar", text)}
          placeholder="Nhập URL ảnh đại diện"
          placeholderTextColor="#888"
        />
      </View>

      {/* Nút Lưu thay đổi */}
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  form: {
    gap: 15,
  },
  label: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
