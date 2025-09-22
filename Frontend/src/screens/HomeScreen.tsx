// HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Switch,
  Platform,
  PermissionsAndroid,
  Alert,
  Button
} from "react-native";

// QR scanner imports
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

// ---------------------------
// Camera permission function
// ---------------------------
const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to scan QR codes',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // iOS permissions are handled automatically
};

export default function HomeScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scannerActive, setScannerActive] = useState(false);

  // Fetch table data with polling
  useEffect(() => {
    const fetchData = () => {
      fetch("http://192.168.216.31:5000/oper_table", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          setData(json);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = (sr_no: number, newValue: boolean) => {
    const newStatus = newValue ? "Kept in Rack" : "";

    fetch(`http://192.168.216.31:5000/oper_table/${sr_no}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status_val: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setData((prev) =>
          prev.map((item) =>
            item.sr_no === sr_no ? { ...item, status_val: newStatus } : item
          )
        );
      })
      .catch((err) => console.error("Update error:", err));
  };

  // Handle QR code scan
  const handleQRCodeRead = ({ data }: { data: string }) => {
    Alert.alert("QR Code Data", data);
    setScannerActive(false); // close scanner after reading
  };

  // Request permission on scanner open
  const openScanner = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) setScannerActive(true);
    else Alert.alert("Camera permission denied");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  // Show QR scanner if active
  if (scannerActive) {
    return (
      <QRCodeScanner
        onRead={handleQRCodeRead}
        flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={<Text style={{ padding: 10 }}>Scan a QR code</Text>}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Scan QR Code" onPress={openScanner} />

      <ScrollView horizontal>
        <View>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.headerText]}>Tray</Text>
            <Text style={[styles.cell, styles.headerText]}>Row</Text>
            <Text style={[styles.cell, styles.headerText]}>Col</Text>
            <Text style={[styles.cell, styles.headerText]}>Part Name</Text>
            <Text style={[styles.cell, styles.headerText]}>Part Code</Text>
            <Text style={[styles.cell, styles.headerText]}>Description</Text>
            <Text style={[styles.cell, styles.headerText]}>Operation</Text>
            <Text style={[styles.cell, styles.headerText]}>Qty</Text>
            <Text style={[styles.cell, styles.headerText]}>Status</Text>
          </View>

          <ScrollView style={{ maxHeight: 500 }}>
            {data.map((item, index) => (
              <View
                key={item.sr_no}
                style={[styles.row, index % 2 === 0 ? styles.even : styles.odd]}
              >
                <Text style={styles.cell}>{item.tray_no}</Text>
                <Text style={styles.cell}>{item.row_no}</Text>
                <Text style={styles.cell}>{item.col_no}</Text>
                <Text style={styles.cell}>{item.part_name}</Text>
                <Text style={styles.cell}>{item.part_code}</Text>
                <Text style={styles.cell}>{item.part_desp}</Text>
                <Text style={styles.cell}>{item.oper}</Text>
                <Text style={styles.cell}>{item.qty_val}</Text>

                <Switch
                  value={item.status_val === "Kept in Rack"}
                  onValueChange={(val) => toggleStatus(item.sr_no, val)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  header: { backgroundColor: "#333" },
  headerText: { color: "#fff", fontWeight: "bold" },
  cell: { flex: 1, minWidth: 100, padding: 8, fontSize: 14, color: "#000" },
  even: { backgroundColor: "#f9f9f9" },
  odd: { backgroundColor: "#fff" },
});
