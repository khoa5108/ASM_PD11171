// src/screens/RegisterScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const existingUser = await AsyncStorage.getItem(email);
      if (existingUser) {
        Alert.alert("Lỗi", "Email này đã được đăng ký!");
        return;
      }

      await AsyncStorage.setItem(email, JSON.stringify({ email, password }));
      Alert.alert("Thành công", "Đăng ký thành công! Hãy đăng nhập.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Lỗi", "Đăng ký thất bại!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text>Đã có tài khoản? Đăng nhập</Text>
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

export default RegisterScreen;
