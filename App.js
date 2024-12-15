import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper"; // Importando o Provider do react-native-paper
import Routes from "./src/routes";
import { AuthProvider } from "./src/context/authContext"; // Importando o AuthProvider
import { MapProvider } from "./src/context/mapContext"; // Importando o MapProvider para lidar com o AutocompleteMap
import { MarkerProvider } from "./src/context/markerContext"; // Importando o MarkerProvider

const App = () => {
  return (
    <PaperProvider> {/* Envolvendo toda a aplicação com o PaperProvider */}
      <AuthProvider> {/* Use o AuthProvider para autenticação */}
        <MapProvider> {/* Use o MapProvider para lidar com o mapa e o autocomplete */}
          <MarkerProvider> {/* Use o MarkerProvider para gerenciar o marcador selecionado */}
            <SafeAreaProvider>
              <NavigationContainer>
                <Routes />
              </NavigationContainer>
            </SafeAreaProvider>
          </MarkerProvider>
        </MapProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
