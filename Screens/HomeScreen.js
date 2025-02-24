// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const userEmail = await AsyncStorage.getItem("loggedInUser");
      setEmail(userEmail || "Người dùng");
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    navigation.replace("Login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Chào {email}!</Text>
      <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20, backgroundColor: "red", padding: 10 }}>
        <Text style={{ color: "white" }}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
