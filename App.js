import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Routes from "./src/routes";
import { AuthProvider } from "./src/context/authContext"; // Importando o AuthProvider
import { MapProvider } from "./src/context/mapContext"; // Importando o MapProvider para lidar com o AutocompleteMap

const App = () => {
  return (
    <AuthProvider> {/* Use o AuthProvider para autenticação */}
      <MapProvider> {/* Use o MapProvider para lidar com o mapa e o autocomplete */}
        <SafeAreaProvider>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </SafeAreaProvider>
      </MapProvider>
    </AuthProvider>
  );
};

export default App;
