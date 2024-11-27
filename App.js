import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./src/screens/Home";
import Timeline from "./src/screens/Timeline";
import SignIn from "./src/screens/SignIn";
import SignUp from "./src/screens/SignUp";
import Conta from "./src/screens/Conta";
import RelatorioLocal from "./src/screens/RelatorioLocal";
import RelatorioGeral from "./src/screens/RelatorioGeral";

import CustomDrawer from "./src/components/CustomDrawer";

import { Provider } from "./src/context/authContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
//Tanstack react query - problema com realtime
//react-iphone-screen-helper
// Drawer Navigator para o menu
//flatlist para pagina de fedd

const Drawer = createDrawerNavigator();

// Stack Navigator para autenticação
const Stack = createNativeStackNavigator();

// Configuração do Menu com Drawer Navigator
const DrawerScreens = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false, // Oculta o cabeçalho padrão
        drawerStyle: { width: 250},
        contentStyle: {
          paddingTop: 20,
        },
      }}
    >
      {/* Telas dentro do Menu */}
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Timeline" component={Timeline} />
      <Drawer.Screen name="Conta" component={Conta} />
      <Drawer.Screen name="RelatorioLocal" component={RelatorioLocal} />
      <Drawer.Screen name="RelatorioGeral" component={RelatorioGeral} />

    </Drawer.Navigator>
  );
};

// Configuração principal da aplicação
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false,  drawerStyle: { paddingVertical: 250 }}}>
        {/* Fluxo de autenticação */}
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />

        {/* Menu principal com o Drawer */}
        <Stack.Screen name="Home" component={DrawerScreens} />
        <Stack.Screen name="Timeline" component={DrawerScreens} />
        <Stack.Screen name="Conta" component={DrawerScreens} />
        <Stack.Screen name="RelatorioLocal" component={DrawerScreens} />
        <Stack.Screen name="RelatorioGeral" component={DrawerScreens} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default () => {
  return (
    <Provider>
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>
    </Provider>
  );
};
