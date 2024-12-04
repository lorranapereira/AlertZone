import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Routes from "./src/routes";
import { AuthProvider } from "./src/context/authContext"; // Importando o AuthProvider

const App = () => {
  return (
    <AuthProvider> {/* Use o AuthProvider aqui */}
      <SafeAreaProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
