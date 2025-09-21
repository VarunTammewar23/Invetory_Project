// // App.tsx
// import React from "react";
// //import HomeScreen from "./screens/homescreen";
// import HomeScreen from "./src/screens/HomeScreen";

// export default function App() {
//   return <HomeScreen />;
// }

//App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Warehouse" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
