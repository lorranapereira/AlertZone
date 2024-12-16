import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper"; // Provider do react-native-paper
import Routes from "./src/routes";
import { AuthProvider } from "./src/context/authContext"; // Autenticação
import { MapProvider } from "./src/context/mapContext"; // Autocomplete Map
import { MarkerProvider } from "./src/context/markerContext"; // Marcadores
import { requestNotificationPermissions } from "./src/services/notificationService"; // Notificações

const App = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      await requestNotificationPermissions();
    };

    setupNotifications();
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <MapProvider>
          <MarkerProvider>
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
