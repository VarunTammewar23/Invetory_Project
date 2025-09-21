// Frontend/screens/HomeScreen.tsx
import { Camera, useCameraDevices } from "react-native-vision-camera";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Switch,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function HomeScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Ask camera permission once
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Fetch table data with polling
  useEffect(() => {
    const fetchData = () => {
      fetch("http://192.168.1.103:5000/oper_table", {
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

    fetch(`http://192.168.1.103:5000/oper_table/${sr_no}/status`, {
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

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  // Unique columns for dropdown
  const uniqueColumns = Array.from(new Set(data.map((item) => item.col_no)));

  // Filter based on selected column
  const filteredData = selectedColumn
    ? data.filter((item) => item.col_no === selectedColumn)
    : data;

  // Sort by row, then tray
  const sortedData = [...filteredData].sort((a, b) => {
    if (a.row_no !== b.row_no) return a.row_no - b.row_no;
    return a.tray_no - b.tray_no;
  });

  // Handle QR Scan result
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScannerActive(false);
    const colNo = parseInt(data, 10);
    if (!isNaN(colNo)) {
      setSelectedColumn(colNo);
      console.log("Scanned Column:", colNo);
    } else {
      console.warn("Invalid QR Code, expected column number but got:", data);
    }
  };

  // If scanner is active → show scanner
  if (scannerActive) {
    if (hasPermission === null) {
      return (
        <SafeAreaView style={styles.center}>
          <Text>Requesting camera permission...</Text>
        </SafeAreaView>
      );
    }
    if (hasPermission === false) {
      return (
        <SafeAreaView style={styles.center}>
          <Text>No access to camera</Text>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={{ flex: 1 }}
        />
        <Button title="Cancel" onPress={() => setScannerActive(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Column Selector + QR Button */}
      <View style={styles.selector}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
            Select Column:
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              backgroundColor: "white",
              width: "100%",
            }}
          >
            <Picker
              selectedValue={selectedColumn}
              onValueChange={(itemValue) => setSelectedColumn(itemValue)}
              style={{
                height: 50,
                width: "100%",
                color: "black",
              }}
            >
              <Picker.Item label="All Columns" value={null} />
              {uniqueColumns.map((col) => (
                <Picker.Item key={col} label={`Column ${col}`} value={col} />
              ))}
            </Picker>
          </View>
        </View>

        {/* QR Scanner Button */}
        <Button title="Scan QR" onPress={() => setScannerActive(true)} />
      </View>

      {/* Data Table */}
      <ScrollView horizontal>
        <View>
          {/* Header Row */}
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

          {/* Data Rows */}
          <ScrollView style={{ maxHeight: 500 }}>
            {sortedData.map((item, index) => (
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
  selector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
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
