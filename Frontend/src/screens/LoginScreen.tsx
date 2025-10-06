import { ScrollView, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";

type Props = {
  navigation: any;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [otp_val, setOtpVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (otp_val.trim() === "") {
      setErrorMsg("Please enter OTP");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      console.log("Sending OTP request to server with value:", otp_val);

      const response = await fetch("http://192.168.1.5:5000/validate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp_val }),
      });

      console.log("Response status:", response.status);

      // Get raw response text first for debugging
      const rawText = await response.text();
      console.log("Raw response text:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.log("Error parsing JSON:", e);
        setErrorMsg("Invalid server response: " + rawText);
        return;
      }

      if (data.success) {
        Alert.alert("Success", "OTP is valid 🎉");
        navigation.navigate("Home", { otp: otp_val });
      } else {
        setErrorMsg("Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      setErrorMsg("Error connecting to server: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          <Text>Warehouse </Text>
          <Text>Management</Text>
        </Text>

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
          value={otp_val}
          onChangeText={setOtpVal}
          keyboardType="numeric"
        />

        {errorMsg !== "" && (
          <Text style={styles.errorText}>{errorMsg}</Text>
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#27ae60"
            style={{ marginTop: 10 }}
          />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: "20@s",
  },
  title: {
    fontSize: "28@ms",
    fontWeight: "bold",
    marginTop: "10@vs",
    marginBottom: "10@vs",
    textAlign: "center",
  },
  image: { width: "250@s", height: "250@vs", marginVertical: "10@vs" },
  subtitle: { fontSize: "22@ms", fontWeight: "600", marginTop: "10@vs" },
  text: { fontSize: "16@ms", color: "gray", marginBottom: "15@vs" },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: "12@ms",
    borderRadius: "8@ms",
    marginBottom: "10@vs",
    fontSize: "16@ms",
    textAlign: "center",
    letterSpacing: 4,
  },
  button: {
    backgroundColor: "#27ae60",
    paddingVertical: "12@vs",
    borderRadius: "8@ms",
    width: "90%",
    alignItems: "center",
    marginTop: "5@vs",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: "16@ms" },
  errorText: { color: "red", fontSize: "14@ms", marginBottom: "5@vs" },
});