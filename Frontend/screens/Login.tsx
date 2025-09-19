import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Login({ navigation }: any) {
  const [rackId, setRackId] = useState("");

  const handleLogin = () => {
    if (!rackId) return Alert.alert("Please enter Rack ID");

    navigation.navigate("ItemsList", { rackId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>Warehouse Management</Text>
      <Text style={styles.subtitle}>Hello! Please enter Rack ID</Text>

      <TextInput
        placeholder="Rack ID"
        style={styles.input}
        keyboardType="numeric"
        value={rackId}
        onChangeText={setRackId}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 10,
    width: "80%", padding: 12, marginBottom: 20
  },
  button: {
    backgroundColor: "#4CAF50", padding: 15,
    borderRadius: 10, width: "80%", alignItems: "center"
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});
