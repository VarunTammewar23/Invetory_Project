// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView, View, Text, Button, StyleSheet } from "react-native";
import QRScanner from "./Screens/QRScanner";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Welcome to QR App</Text>
        <Button
          title="Open QR Scanner"
          onPress={() => navigation.navigate("QRScanner")}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QRScanner" component={QRScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 20 },
});
