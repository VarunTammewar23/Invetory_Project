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
import { ScaledSheet } from "react-native-size-matters" ;

export default function QRScanner({ navigation, route }: any) {
  const [scanned, setScanned] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // vision-camera hooks
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();

  // support both shapes: array (older) or object with .back (newer)
  let device: any | undefined;
  if (Array.isArray(devices)) {
    device = devices.find((d) => d.position === "back") ?? devices[0];
  } else {
    device = (devices as any)?.back ?? (devices as any)?.front ?? undefined;
  }

  useEffect(() => {
    // ask permission on mount if not already granted
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // Code scanner: gets called with an array of detected codes
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      if (!codes || codes.length === 0) return;
      // try multiple common property names for value
      const first = codes[0] as any;
      const value = first?.value ?? first?.rawValue ?? first?.data ?? null;
      if (value && value !== scanned) {
        setScanned(String(value));
      }
    },
  });

  const onUse = useCallback(() => {
    if (!scanned) return;
    setConfirmed(true);

    // Preferred: invoke callback passed from HomeScreen
    const cb = route?.params?.onScan;
    if (typeof cb === "function") {
      try {
        cb(scanned);
      } catch (e) {
        console.warn("onScan callback threw:", e);
      }
      navigation.goBack();
      return;
    }

    // Fallback: navigate to Home and pass scannedColumn as param
    // (If you prefer different behaviour, use the callback approach from Home)
    navigation.navigate("Home", { scannedColumn: scanned });
  }, [scanned, route, navigation]);

  const onScanAgain = () => {
    setScanned(null);
    setConfirmed(false);
  };

  // UI: no camera or permission states
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
      {/* Camera preview */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!confirmed}
        codeScanner={codeScanner}
      />

      {/* Footer overlay */}
      <View style={styles.footer}>
        <Text style={styles.text}>Scanning QR Code...</Text>

        {scanned ? (
          <View>
            <Text selectable style={styles.value}>
              {scanned}
            </Text>

            <View style={styles.actionsRow}>
              <Pressable style={styles.useBtn} onPress={onUse}>
                <Text style={styles.useBtnText}>Use this column</Text>
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

const styles =ScaledSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center",  },

  footer: {
    position: "absolute",
    bottom: "28@vs",
    left: "12@s",
    right: "12@s",
    backgroundColor: "#ffffffdd",
    paddingHorizontal: "16@s",
    borderRadius: "10@ms",
    height: '150@vs',
    justifyContent: "center",
  },

  text:{fontSize: '24@s', color: "#010000ff" }, //Scanning QR Code Text
  value:{ fontSize:'24@ms', marginTop: '6@vs', color: "#000000ff", fontWeight: "400", }, 

  actionsRow: {
    flexDirection: "row",
    marginTop: '10@vs',
    justifyContent: "center",
    gap: '8@s',
    padding: '10@s',
  },  // uthis column and scan again button row

  useBtn: {
    paddingVertical: '8@vs',
    paddingHorizontal: '12@s',
    backgroundColor: "#10a52eff",
    borderRadius: '8@ms',
    marginRight: '8@ms',
    height: '50@vs',
    width: '130@vs',
    },

    useBtnText: { color: "#fff", fontWeight: "500", fontSize:'16.5@ms' },
    scanAgainText: {color: "#000000ff", fontWeight: "600", fontSize: '16@ms'},

    scanAgainBtn: {
      paddingVertical: '8@vs',
      paddingHorizontal: '12@s',
      backgroundColor: "#eee",
      borderRadius: '8@ms',
      height: '50@vs',
      width: '130@vs',
      },

      btn: {
        padding: '12@s',
        backgroundColor: "#eee",
        borderRadius: '8@ms',
        },
      });

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },

//   footer: {
//     position: "absolute",
//     bottom: 28,
//     left: 12,
//     right: 12,
//     backgroundColor: "#ffffffdd",
//     padding: 12,
//     borderRadius: 10,
//   },

//   text: { fontSize: 12, color: "#222" },
//   value: { fontSize: 16, marginTop: 6, color: "#111" },

//   actionsRow: {
//     flexDirection: "row",
//     marginTop: 10,
//     justifyContent: "flex-start",
//     gap: 8,
//   },
//   useBtn: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#007aff",
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   useBtnText: { color: "#fff", fontWeight: "600" },
//   scanAgainBtn: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#eee",
//     borderRadius: 8,
//   },
//   btn: {
//     padding: 10,
//     backgroundColor: "#eee",
//     borderRadius: 8,
//   },
// });
