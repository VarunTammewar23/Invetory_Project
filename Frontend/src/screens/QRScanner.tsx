// src/screens/QRScanner.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Camera,
  useCameraDevices,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { ScaledSheet } from "react-native-size-matters";

export default function QRScanner({ navigation, route }: any) {
  const [scanned, setScanned] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();

  let device: any | undefined;
  if (Array.isArray(devices)) {
    device = devices.find((d) => d.position === "back") ?? devices[0];
  } else {
    device = (devices as any)?.back ?? (devices as any)?.front ?? undefined;
  }

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      if (!codes || codes.length === 0) return;
      const first = codes[0] as any;
      const value = first?.value ?? first?.rawValue ?? first?.data ?? null;
      if (value && value !== scanned) {
        setScanned(String(value).trim()); // Trim spaces here
      }
    },
  });

  const onUse = useCallback(() => {
    if (!scanned) return;
    setConfirmed(true);

    const cb = route?.params?.onScan;
    if (typeof cb === "function") {
      cb(scanned.trim()); // send trimmed aisle number back
      navigation.goBack();
      return;
    }

    navigation.navigate("Home", { scannedAisle: scanned.trim() });
  }, [scanned, route, navigation]);

  const onScanAgain = () => {
    setScanned(null);
    setConfirmed(false);
  };

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
        <Text style={{ marginBottom: 10 }}>Camera permission required</Text>
        <Pressable onPress={requestPermission} style={styles.btn}>
          <Text>Request Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!confirmed}
        codeScanner={codeScanner}
      />

      <View style={styles.footer}>
        <Text style={styles.text}>Scanning QR Code...</Text>

        {scanned ? (
          <View>
            <Text selectable style={styles.value}>
              {scanned}
            </Text>

            <View style={styles.actionsRow}>
              <Pressable style={styles.useBtn} onPress={onUse}>
                <Text style={styles.useBtnText}>Use this Aisle</Text>
              </Pressable>

              <Pressable style={styles.scanAgainBtn} onPress={onScanAgain}>
                <Text style={styles.scanAgainText}>Scan Again</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <ActivityIndicator color="#333" style={{ marginTop: 8 }} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  footer: {
    position: "absolute",
    bottom: "28@vs",
    left: "12@s",
    right: "12@s",
    backgroundColor: "#ffffffdd",
    paddingHorizontal: "16@s",
    borderRadius: "10@ms",
    height: "150@vs",
    justifyContent: "center",
  },
  text: { fontSize: "24@s", color: "#010000ff" },
  value: { fontSize: "24@ms", marginTop: "6@vs", color: "#000", fontWeight: "400" },
  actionsRow: { flexDirection: "row", marginTop: "10@vs", justifyContent: "center", gap: "8@s", padding: "10@s" },
  useBtn: { paddingVertical: "8@vs", paddingHorizontal: "12@s", backgroundColor: "#10a52eff", borderRadius: "8@ms", marginRight: "8@ms", height: "50@vs", width: "130@vs" },
  useBtnText: { color: "#fff", fontWeight: "500", fontSize: "16.5@ms" },
  scanAgainText: { color: "#000", fontWeight: "600", fontSize: "16@ms" },
  scanAgainBtn: { paddingVertical: "8@vs", paddingHorizontal: "12@s", backgroundColor: "#eee", borderRadius: "8@ms", height: "50@vs", width: "130@vs" },
  btn: { padding: "12@s", backgroundColor: "#eee", borderRadius: "8@ms" },
});
