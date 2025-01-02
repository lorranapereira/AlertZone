import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

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
            }}
        >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Timeline" component={Timeline} />
            <Drawer.Screen name="Account" component={Account} />
            <Drawer.Screen name="Report" component={Report} />
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
                options={{ headerShown: true, title: "Criar Account" }}
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

export default Routes;
