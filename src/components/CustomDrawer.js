import React from "react";
import { StyleSheet, View } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Avatar, Title, Drawer, Text, IconButton } from "react-native-paper";

const CustomDrawer = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <IconButton
          icon="close"
          size={24}
          color="#fff"
          onPress={() => props.navigation.closeDrawer()}
        />
        <View style={styles.profileContainer}>
          <Avatar.Text size={35} label="AP" />
          <Title style={styles.userName}>Ana Pereira</Title>
        </View>
      </View>

      {/* Itens do Menu */}
      <DrawerContentScrollView {...props}>
        <Drawer.Section style={styles.section} >
          <DrawerItem
            icon={({ color, size }) => (
              <IconButton icon="map-marker" color={color} size={size} />
            )}
            label="Mapa"
            onPress={() => props.navigation.navigate("Home")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <IconButton icon="alert" color={color} size={size} />
            )}
            label="Alertas"
            onPress={() => props.navigation.navigate("Timeline")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <IconButton icon="chart-bar" color={color} size={size} />
            )}
            label="Relatório Local"
            onPress={() => props.navigation.navigate("RelatorioLocal")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <IconButton icon="chart-bar" color={color} size={size} />
            )}
            label="Relatório Geral"
            onPress={() => props.navigation.navigate("RelatorioGeral")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <IconButton icon="account" color={color} size={size} />
            )}
            label="Minha Conta"
            onPress={() => props.navigation.navigate("Conta")}
          />
        </Drawer.Section> 
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#001f4d",
    paddingHorizontal: 0,
    paddingVertical: 30,
  },
  profileContainer: {
    flexDirection: "row",
    marginTop:10,
    marginLeft: 20,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    marginTop: 5,
    marginLeft: 15,
  },
  section: {
    marginTop: -40,
  }
});

export default CustomDrawer;
