import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  // Load email & password nếu đã lưu trước đó
  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("user_email");
      const savedPassword = await AsyncStorage.getItem("user_password");
      const savedRememberMe = await AsyncStorage.getItem("remember_me");

      if (savedEmail && savedPassword && savedRememberMe === "true") {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Không thể tải thông tin đăng nhập", error);
    }
  };

  // Kiểm tra định dạng email hợp lệ
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Xử lý đăng nhập
  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError("Email không hợp lệ!");
      return;
    }
  
    try {
      const storedEmail = await AsyncStorage.getItem("registered_email");
      const storedPassword = await AsyncStorage.getItem("registered_password");
  
      console.log("DEBUG: Email đã lưu:", storedEmail);
      console.log("DEBUG: Mật khẩu đã lưu:", storedPassword);
  
      if (email === storedEmail && password === storedPassword) {
        setError("");
  
        if (rememberMe) {
          await AsyncStorage.setItem("user_email", email);
          await AsyncStorage.setItem("user_password", password);
          await AsyncStorage.setItem("remember_me", "true");
        } else {
          await AsyncStorage.removeItem("user_email");
          await AsyncStorage.removeItem("user_password");
          await AsyncStorage.setItem("remember_me", "false");
        }
  
        Alert.alert("Thành công", "Đăng nhập thành công!", [
          { text: "OK", onPress: () => navigation.reset({ index: 0, routes: [{ name: "Main" }] }) }
        ]);
      } else {
        setError("Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập", error);
      setError("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };
  
  

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/images/avt cafe.png")} style={styles.logo} />

      <Text style={styles.title}>Chào mừng đến với Lungo !!</Text>
      <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ Email"
        placeholderTextColor="#bbb"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
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

      {/* Hiển thị lỗi */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Remember Me */}
      <TouchableOpacity style={styles.rememberContainer} onPress={() => setRememberMe(!rememberMe)}>
        <Icon name={rememberMe ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color="white" />
        <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
      </TouchableOpacity>

      {/* Đăng nhập */}
      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Đăng Nhập</Text>
      </TouchableOpacity>

      {/* Sign In with Google */}
      <TouchableOpacity style={styles.googleButton}>
        <Icon name="google" size={20} color="black" />
        <Text style={styles.googleText}>Đăng nhập với Google</Text>
      </TouchableOpacity>

      {/* Điều hướng đến Đăng Ký & Quên Mật Khẩu */}
      <Text style={styles.bottomText}>
        Chưa có tài khoản?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
          Đăng ký ngay
        </Text>
      </Text>
      <Text style={styles.bottomText}>
        Quên mật khẩu?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("ResetPassword")}>
          Khôi phục
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#121212", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingHorizontal: 20 
  },
  logo: { 
    width: 80, 
    height: 80, 
    marginBottom: 20 
  },
  title: { 
    fontSize: 24, 
    color: "white", 
    fontWeight: "bold" 
  },
  subtitle: { 
    fontSize: 16, 
    color: "#bbb", 
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
  rememberContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    width: "100%", 
    marginBottom: 20 
  },
  rememberText: { 
    color: "white", 
    marginLeft: 10, 
    fontSize: 16 
  },
  errorText: { 
    color: "red", 
    marginBottom: 10 
  },
  signInButton: { 
    width: "100%", 
    backgroundColor: "#ff7f50", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginBottom: 10 
  },
  signInText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  googleButton: { 
    width: "100%", 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "white", 
    padding: 15, 
    borderRadius: 8, 
    justifyContent: "center", 
    marginBottom: 20 
  },
  googleText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "black", 
    marginLeft: 10 
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