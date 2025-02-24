// src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem(email);
      if (!storedUser) {
        Alert.alert("Lỗi", "Tài khoản không tồn tại!");
        return;
      }

      const userData = JSON.parse(storedUser);
      if (userData.password !== password) {
        Alert.alert("Lỗi", "Mật khẩu không đúng!");
        return;
      }

      await AsyncStorage.setItem("loggedInUser", email); // Lưu trạng thái đăng nhập
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Lỗi", "Đăng nhập thất bại!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
  input: { width: "80%", padding: 10, margin: 10, borderWidth: 1, borderRadius: 5 },
  button: { backgroundColor: "blue", padding: 10, margin: 10, borderRadius: 5 },
  buttonText: { color: "white", textAlign: "center" }
};

export default LoginScreen;
