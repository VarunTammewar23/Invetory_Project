// Screens/QRScanner.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Pressable, StyleSheet } from "react-native";
import { Camera, useCameraDevices, useCameraPermission, useCodeScanner } from "react-native-vision-camera";

export default function QRScanner({ navigation: _navigation }: any) {
  const [scanned, setScanned] = useState<string | null>(null);

  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const devices = useCameraDevices();
  const device = devices.find(d => d.position === "back");

  const codeScanner = useCodeScanner({
  codeTypes: ['qr'],
  onCodeScanned: (codes) => {
    if (codes.length > 0) {
      const value = codes[0].value;
      if (value && value !== scanned) {
        setScanned(value);
        // 👇 DO NOT auto-navigate here
        // Instead, show it on screen and let user confirm
      }
    }
  },
});


  if (!device) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No camera available</Text>
      </SafeAreaView>
    );
  }

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Camera permission required</Text>
        <Pressable onPress={requestPermission} style={styles.btn}>
          <Text>Request</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      <View style={styles.footer}>
        <Text style={styles.text}>Scanning QR Code...</Text>
        {scanned && <Text selectable style={styles.value}>{scanned}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 12,
    right: 12,
    backgroundColor: "#ffffffaa",
    padding: 12,
    borderRadius: 8,
  },
  text: { fontSize: 12, color: "#333" },
  value: { fontSize: 16, marginTop: 6 },
  btn: {
    marginTop: 8,
    padding: 8,
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    borderRadius: 6,
  },
});
