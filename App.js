import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, DefaultTheme } from 'react-native-paper';
import Routes from "./src/routes";
import { AuthProvider } from "./src/context/authContext"; // Autenticação
import { MapProvider } from "./src/context/mapContext"; // Autocomplete Map
import { MarkerProvider } from "./src/context/markerContext"; // Marcadores
import { requestNotificationPermissions } from "./src/services/notificationService"; // Notificações

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E293B',
    text: "#1E293B",
    outline: "#1E293B",
  },
};

const App = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      await requestNotificationPermissions();
    };

    setupNotifications();
  }, []);

  return (
    <AuthProvider>
      <Provider theme={theme}>
        <MapProvider>
          <MarkerProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <Routes />
              </NavigationContainer>
            </SafeAreaProvider>
          </MarkerProvider>
        </MapProvider>
      </Provider>
    </AuthProvider>
  );
};

export default App;
