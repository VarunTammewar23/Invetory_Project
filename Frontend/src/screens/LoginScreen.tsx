import { ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

type Props = {
  navigation: any;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [otp, setOtp] = useState("");

  const handleLogin = async () => {
    if (otp.trim() === "") {
      return Alert.alert("Please enter OTP");
    }

    try {
      // 🔹 Call backend API to validate OTP
      const response = await fetch("http://192.168.1.103:5000/validate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ OTP valid → navigate with otp
        navigation.navigate("Home", { otp });
      } else {
        Alert.alert("Invalid OTP", "Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
  <SafeAreaView style={styles.container}>
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center" }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Warehouse Management</Text>

      <Image
        source={require("../assets/warehouse.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.subtitle}>Hello!</Text>
      <Text style={styles.text}>Enter OTP to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </ScrollView>
  </SafeAreaView>
);
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginTop: 10, marginBottom: 10 },
  image: { width: 200, height: 200, marginVertical: 10 },
  subtitle: { fontSize: 20, fontWeight: "600", marginTop: 10 },
  text: { fontSize: 14, color: "gray", marginBottom: 15 },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 4,
  },
  button: {
    backgroundColor: "#27ae60",
    padding: 14,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
