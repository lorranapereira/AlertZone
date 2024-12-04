import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Home from "./screens/Home";
import Timeline from "./screens/Timeline";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Conta from "./screens/Conta";
import RelatorioLocal from "./screens/RelatorioLocal";
import RelatorioGeral from "./screens/RelatorioGeral";
import CustomDrawer from "./components/CustomDrawer";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Configuração do Drawer para telas principais
const DrawerRoutes = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false, // Oculta o cabeçalho padrão
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

// Configuração do Stack Navigator
const Routes = () => {
    return (
        <Stack.Navigator>
            {/* Rota inicial redirecionando para SignIn */}
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
            {/* Telas principais acessíveis após autenticação */}
            <Stack.Screen
                name="Drawer"
                component={DrawerRoutes}
                options={{ headerShown: false }} // Remove o cabeçalho para o Drawer
            />
            <Stack.Screen
                name="Home"
                component={DrawerRoutes}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Timeline"
                component={DrawerRoutes}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Conta"
                component={DrawerRoutes}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RelatorioLocal"
                component={DrawerRoutes}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RelatorioGeral"
                component={DrawerRoutes}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default Routes;
