import React from "react";
import { useWindowDimensions } from "react-native";
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

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawerScreens = () => {
  const { width } = useWindowDimensions();

  const drawerStyle = {
    width: width < 768 ? 200 : 300,
  };

  const contentStyle = {
    paddingTop: width < 768 ? 5 : 10,
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false, // O cabeçalho padrão será oculto nas telas do Drawer
        drawerStyle,
        contentStyle,
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Timeline" component={Timeline} />
      <Drawer.Screen name="Conta" component={Conta} />
      <Drawer.Screen name="RelatorioLocal" component={RelatorioLocal} />
      <Drawer.Screen name="RelatorioGeral" component={RelatorioGeral} />
    </Drawer.Navigator>
  );
};

const App = () => {
  const stackScreenOptions = {
    headerShown: false, // Oculta o cabeçalho global por padrão
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={stackScreenOptions}>
        {/* Telas de autenticação com cabeçalho ativado */}
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: true }} // Habilita o cabeçalho para esta tela
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: true }} // Habilita o cabeçalho para esta tela
        />

        {/* Telas principais (Drawer) sem cabeçalho */}
        <Stack.Screen
          name="Home"
          component={DrawerScreens}
          options={{ headerShown: false }} // Mantém o cabeçalho oculto
        />
        <Stack.Screen
          name="Timeline"
          component={DrawerScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Conta"
          component={DrawerScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RelatorioLocal"
          component={DrawerScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RelatorioGeral"
          component={DrawerScreens}
          options={{ headerShown: false }}
        />
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
