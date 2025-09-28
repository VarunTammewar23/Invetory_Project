// src/screens/HomeScreen.tsx  (replace your existing file)
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Switch,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";

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

export default function HomeScreen({ navigation }: any) {
  const route = useRoute();
  const { otp } = (route.params as { otp: string }) ?? { otp: "" };

  const [data, setData] = useState<OperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCol, setSelectedCol] = useState<"All" | string>("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://192.168.1.110:5000/oper_table/${otp}`,
          { headers: { "Cache-Control": "no-cache" } }
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [otp]);

  const toggleStatus = async (sr_no: number, currentStatus: string) => {
    const newStatus = currentStatus === "Kept in Rack" ? "" : "Kept in Rack";
    setData((prev) =>
      prev.map((it) => (it.sr_no === sr_no ? { ...it, status_val: newStatus } : it))
    );
    try {
      await fetch(`http://192.168.1.110:5000/oper_table/${sr_no}/status`, {
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

  const filteredData =
    selectedCol === "All"
      ? data
      : data.filter((item) => item.col_no.toString() === selectedCol);

  // Small helper component to keep markup concise and consistent
  const Cell = ({ style, children, textStyle, lines = 1 }: any) => (
    <View style={[styles.cellContainer, style]}>
      <Text
        numberOfLines={lines}
        ellipsizeMode={lines === 1 ? "tail" : "clip"}
        style={[styles.cellText, textStyle]}
      >
        {children}
      </Text>
    </View>
  );

  const renderItem = ({ item, index }: { item: OperItem; index: number }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.even : styles.odd]}>
      <Cell style={styles.tray}>{item.tray_no}</Cell>
      <Cell style={styles.rowCol}>{item.row_no}</Cell>
      <Cell style={styles.rowCol}>{item.col_no}</Cell>

      {/* left aligned text for names/descriptions */}
      <Cell style={styles.partName} textStyle={styles.leftText}>
        {item.part_name}
      </Cell>

      <Cell style={styles.partCode} textStyle={styles.leftText}>
        {item.part_code}
      </Cell>

      <Cell style={styles.partDesc} textStyle={styles.leftText}>
        {item.part_desp}
      </Cell>

      <Cell style={styles.operation} textStyle={styles.leftText}>
        {item.oper}
      </Cell>

      <Cell style={styles.qty}>{item.qty_val}</Cell>

      <View style={[styles.cellContainer, styles.status]}>
        <Switch
          value={item.status_val === "Kept in Rack"}
          onValueChange={() => {
            Alert.alert(
              "Confirm Action",
              `Do you want to ${
                item.status_val === "Kept in Rack" ? "remove from rack" : "keep in rack"
              }?`,
              [
                { text: "No", style: "cancel" },
                {
                  text: "Yes",
                  onPress: () => toggleStatus(item.sr_no, item.status_val),
                },
              ]
            );
          }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* styled button (TouchableOpacity) for better control */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() =>
          navigation.navigate("QRScanner", {
            onScan: (columnNo: string) => setSelectedCol(columnNo),
          })
        }
      >
        <Text style={styles.scanButtonText}>SCAN QR CODE</Text>
      </TouchableOpacity>

      <Text style={styles.currentColText}>Current Column: {selectedCol}</Text>

      {/* Horizontal scroll wrapper - header + rows use same column widths */}
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.sr_no.toString()}
            renderItem={renderItem}
            ListHeaderComponent={() => (
              <View style={[styles.row, styles.header]}>
                <Cell style={styles.tray} textStyle={[styles.headerText, styles.centerText]}>
                  Tray
                </Cell>
                <Cell style={styles.rowCol} textStyle={[styles.headerText, styles.centerText]}>
                  Row
                </Cell>
                <Cell style={styles.rowCol} textStyle={[styles.headerText, styles.centerText]}>
                  Col
                </Cell>
                <Cell style={styles.partName} textStyle={[styles.headerText, styles.leftText]}>
                  Part Name
                </Cell>
                <Cell style={styles.partCode} textStyle={[styles.headerText, styles.leftText]}>
                  Part Code
                </Cell>
                <Cell style={styles.partDesc} textStyle={[styles.headerText, styles.leftText]}>
                  Description
                </Cell>
                <Cell style={styles.operation} textStyle={[styles.headerText, styles.leftText]}>
                  Operation
                </Cell>
                <Cell style={styles.qty} textStyle={[styles.headerText, styles.centerText]}>
                  Qty
                </Cell>
                <Cell style={styles.status} textStyle={[styles.headerText, styles.centerText]}>
                  Status
                </Cell>
              </View>
            )}
            // ensure list grows vertically
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: "10@s" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  scanButton: {
    backgroundColor: "#0a84ff",
    paddingVertical: "10@vs",
    paddingHorizontal: "16@s",
    borderRadius: "8@ms",
    alignSelf: "stretch",
    marginBottom: "10@vs",
    alignItems: "center",
  },
  scanButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "15@ms",
  },

  currentColText: {
    marginBottom: "8@vs",
    fontWeight: "700",
    fontSize: "15@ms",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    minHeight: "44@vs",
  },

  header: {
    backgroundColor: "#333",
  },

  // cell container: used for every column (header + rows)
  cellContainer: {
    paddingVertical: "8@vs",
    paddingHorizontal: "6@s",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#e0e0e0",
  },

  // text inside cells
  cellText: {
    fontSize: "16@ms",
    color: "#000",
  },
  headerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "15@ms",
    textAlign: "left",
  },

  // text alignment helpers
  leftText: { textAlign: "left" as const },
  centerText: { textAlign: "center" as const },

  // IMPORTANT: fixed widths (scaled)
  tray: { width: "50@s" }, // small numeric
  rowCol: { width: "50@s" },
  partName: { width: "180@s" }, // allows more room but fixed
  partCode: { width: "120@s" },
  partDesc: { width: "220@s" },
  operation: { width: "120@s" },
  qty: { width: "70@s" },
  status: { width: "100@s", alignItems: "center" },

  even: { backgroundColor: "#fafafa" },
  odd: { backgroundColor: "#fff" },
});
