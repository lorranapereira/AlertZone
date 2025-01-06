import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {Image, View, StyleSheet, Text } from "react-native";

import Home from "./screens/Home";
import Timeline from "./screens/Timeline";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Account from "./screens/Account";
import Report from "./screens/Report";
import CustomDrawer from "./components/CustomDrawer";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Configuração do Drawer para telas principais
const DrawerRoutes = () => {
    return (
        <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
            headerShown: true,
            gestureEnabled: true, // Certifique-se de que está ativado
            headerRight: () => (
                <View style={styles.headerTitleContainer}>
                  <Image
                    source={require("../assets/logo.png")} // Substitua pelo caminho do seu logo
                    style={styles.headerLogo}
                  />
                </View>
              ),
        }}
        
        >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Timeline" component={Timeline} options={{ title: "Alertas" }} />
            <Drawer.Screen name="Account" component={Account} options={{ title: "Conta" }} />
            <Drawer.Screen name="Report" component={Report} options={{ title: "Relatório" }} />
        </Drawer.Navigator>
    );
};

// Configuração do Stack Navigator
const Routes = () => {
    return (
        <Stack.Navigator>
            {/* Rotas de autenticação */}
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: true, title: "Login" }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerShown: true, title: "Criar Conta" }}
            />
            {/* Telas principais após autenticação */}
            <Stack.Screen
                name="Main"
                component={DrawerRoutes}
                options={{ headerShown: false }} // Remove o cabeçalho para o Drawer
            />
        </Stack.Navigator>
    );
};
const styles = StyleSheet.create({
    headerTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerTitleText: {
      fontSize: 18,
      fontWeight: "bold",
      marginRight: 10, // Espaçamento entre o texto e o logo
    },
    headerLogo: {
      width: 50, // Ajuste conforme necessário
      height: 50,
      marginEnd:20,
      resizeMode: "contain",
    },
  });
  
export default Routes;
