import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList, StyleSheet } from "react-native";

export default function ItemsList({ route }: any) {
  const { rackId } = route.params;
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://192.168.139.31:5000/rack/${rackId}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, [rackId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rack {rackId} - Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.tray_no.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.part_name} ({item.part_code}) - Qty: {item.qty_val}
          </Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  item: { fontSize: 16, marginBottom: 10 }
});
