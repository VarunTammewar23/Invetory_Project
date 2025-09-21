// screens/LoginScreen.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

type Props = {
  navigation: any;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [rackId, setRackId] = useState("");

  const handleLogin = () => {
    if (rackId.trim() !== "") {
      navigation.navigate("Home", { rackId });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Warehouse Management</Text>

      {/* Illustration */}
      <Image
        source={require("../assets/warehouse.png")} // make sure warehouse.png is in assets/
        style={styles.image}
        resizeMode="contain"
      />

      {/* Subtitle */}
      <Text style={styles.subtitle}>Hello!</Text>
      <Text style={styles.text}>Please enter Rack ID to continue</Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="Rack ID"
        value={rackId}
        onChangeText={setRackId}
      />

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
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