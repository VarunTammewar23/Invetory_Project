import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";

type OperItem = {
  sr_no: number;
  tray_no: string | number;
  row_no: string | number;
  col_no: string | number;
  part_name: string;
  part_code: string;
  part_desp: string;
  oper: string;
  qty_val: number;
  status_val: string;
};

export default function HomeScreen() {
  const route = useRoute();
  const { otp } = route.params as { otp: string }; // OTP from LoginScreen

  const [data, setData] = useState<OperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCol, setSelectedCol] = useState<"All" | string>("All");

  // Fetch data by OTP
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://192.168.216.31:5000/oper_table/${otp}`, {
          headers: { "Cache-Control": "no-cache" },
        });
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Polling
    return () => clearInterval(interval);
  }, [otp]);

  const toggleStatus = async (sr_no: number, currentStatus: string) => {
    const newStatus = currentStatus === "Kept in Rack" ? "" : "Kept in Rack";

    // Optimistic update
    setData((prev) =>
      prev.map((item) =>
        item.sr_no === sr_no ? { ...item, status_val: newStatus } : item
      )
    );

    try {
      await fetch(`http://192.168.216.31:5000/oper_table/${sr_no}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_val: newStatus }),
      });
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Filter by column
  const filteredData =
    selectedCol === "All"
      ? data
      : data.filter((item) => item.col_no.toString() === selectedCol);

  const uniqueCols = Array.from(new Set(data.map((item) => item.col_no.toString())));

  const renderItem = ({ item, index }: { item: OperItem; index: number }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.even : styles.odd]}>
      <Text style={styles.cell}>{item.tray_no}</Text>
      <Text style={styles.cell}>{item.row_no}</Text>
      <Text style={styles.cell}>{item.col_no}</Text>
      <Text style={styles.cell}>{item.part_name}</Text>
      <Text style={styles.cell}>{item.part_code}</Text>
      <Text style={styles.cell}>{item.part_desp}</Text>
      <Text style={styles.cell}>{item.oper}</Text>
      <Text style={styles.cell}>{item.qty_val}</Text>
      <View style={styles.cell}>
        <Switch
           value={item.status_val === "Kept in Rack"}
           onValueChange={() => {
            Alert.alert(
            "Confirm Action",
              `Do you want to ${item.status_val === "Kept in Rack" ? "remove from rack" : "keep in rack"}?`,
               [
                 { text: "No", style: "cancel" },
                 {
                  text: "Yes",
                   onPress: () => toggleStatus(item.sr_no, item.status_val),
                  },
               ], 
            );
        }}
        />

      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Dropdown filter */}
      <View style={styles.filterRow}>
        <Text style={{ fontWeight: "bold", marginRight: 10 }}>Filter by Col:</Text>
        <Picker
          selectedValue={selectedCol}
          style={{ flex: 1, height: 50 }}
          onValueChange={(value) => setSelectedCol(value)}
        >
          <Picker.Item label="All" value="All" />
          {uniqueCols.map((col) => (
            <Picker.Item key={col} label={col} value={col} />
          ))}
        </Picker>
      </View>

      {/* Table */}
      <ScrollView horizontal>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.sr_no.toString()}
          renderItem={renderItem}
          ListHeaderComponent={() => (
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
          )}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ddd", alignItems: "center" },
  header: { backgroundColor: "#333" },
  headerText: { color: "#fff", fontWeight: "bold" },
  cell: { flex: 1, minWidth: 120, padding: 8, fontSize: 14, color: "#000" },
  even: { backgroundColor: "#f9f9f9" },
  odd: { backgroundColor: "#fff" },
  filterRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
});
