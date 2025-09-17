import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList, StyleSheet, View } from "react-native";

export default function App() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://192.168.2.226:5000/oper_table")
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error("Fetch error:", err));
    };

    fetchData(); // first load
    const interval = setInterval(fetchData, 5000); // refresh every 5s

    return () => clearInterval(interval); // cleanup
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.tray_no}</Text>
      <Text style={styles.cell}>{item.row_no}</Text>
      <Text style={styles.cell}>{item.col_no}</Text>
      <Text style={styles.cell}>{item.part_name}</Text>
      <Text style={styles.cell}>{item.part_code}</Text>
      <Text style={styles.cell}>{item.qty_val}</Text>
      <Text style={styles.cell}>{item.status_val}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Oper Table</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc", paddingVertical: 5 },
  cell: { flex: 1, fontSize: 14, textAlign: "center" },
});
