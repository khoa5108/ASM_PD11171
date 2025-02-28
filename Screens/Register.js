import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  // Hàm kiểm tra email hợp lệ
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Load thông tin đã lưu trước đó (nếu có)
  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("user_email");
      const savedPassword = await AsyncStorage.getItem("user_password");
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
      }
    } catch (error) {
      console.error("Không thể tải thông tin người dùng", error);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (!validateEmail(email)) {
      setError("Email không hợp lệ!");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await AsyncStorage.setItem("registered_email", email);
      await AsyncStorage.setItem("registered_password", password);
      Alert.alert("Thành công", "Đăng ký thành công!", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể lưu thông tin người dùng!");
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ Email"
        placeholderTextColor="#bbb"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mật khẩu"
          placeholderTextColor="#bbb"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Icon name={secureText ? "eye-off" : "eye"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Xác nhận mật khẩu"
          placeholderTextColor="#bbb"
          secureTextEntry={secureConfirmText}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setSecureConfirmText(!secureConfirmText)}>
          <Icon name={secureConfirmText ? "eye-off" : "eye"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Hiển thị lỗi */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>

      {/* Điều hướng đến màn hình Đăng Nhập */}
      <Text style={styles.bottomText}>
        Đã có tài khoản?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Đăng nhập
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#121212", 
    paddingHorizontal: 20 
  },
  title: { 
    fontSize: 24, 
    color: "white", 
    fontWeight: "bold", 
    marginBottom: 20 
  },
  input: { 
    width: "100%", 
    padding: 15, 
    backgroundColor: "#1e1e1e", 
    borderRadius: 8, 
    color: "white", 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: "#333" 
  },
  passwordContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    width: "100%", 
    padding: 15, 
    backgroundColor: "#1e1e1e", 
    borderRadius: 8, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: "#333" 
  },
  passwordInput: { 
    flex: 1, 
    color: "white" 
  },
  errorText: { 
    color: "red", 
    marginBottom: 10 
  },
  button: { 
    width: "100%", 
    backgroundColor: "#ff7f50", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginBottom: 10 
  },
  buttonText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  bottomText: { 
    color: "#bbb", 
    marginTop: 5 
  },
  link: { 
    color: "#ff7f50", 
    fontWeight: "bold" 
  }
});
