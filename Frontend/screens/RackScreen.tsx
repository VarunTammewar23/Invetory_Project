// screens/RackScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

type Props = {
  route: any;
};

const RackScreen: React.FC<Props> = ({ route }) => {
  const { rackId } = route.params || {};   // ✅ safety fallback
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    if (!rackId) {
      setMsg("No Rack ID provided");
      return;
    }

    fetch(`http://192.168.2.31:5000/items/${rackId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setItems(data.items);
          setMsg(`Rack ${rackId} items:`);
        } else {
          setItems([]);
          setMsg(`No items found for Rack ${rackId}`);
        }
      })
      .catch((err) => setMsg("Error: " + err.message));
  }, [rackId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rack Details</Text>
      <Text style={styles.msg}>{msg}</Text>

      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            • {item.part_name} ({item.qty_val})
          </Text>
        )}
      />
    </View>
  );
};

export default RackScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  msg: { fontSize: 16, marginBottom: 10, textAlign: "center" },
  item: { fontSize: 16, marginTop: 5 },
});
