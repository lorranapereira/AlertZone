import React from "react";
import { StyleSheet, View } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Avatar, Title, Drawer } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

const CustomDrawer = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Icon
          name="close"
          size={24}
          color="#fff"
          style={styles.closeIcon}
          onPress={() => props.navigation.closeDrawer()}
        />
      </View>

      {/* Itens do Menu */}
      <DrawerContentScrollView {...props}>
        <Drawer.Section style={styles.section}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="map-marker" color={color} size={size} />
            )}
            label="Mapa"
            onPress={() => props.navigation.navigate("Home")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="alert" color={color} size={size} />
            )}
            label="Alertas"
            onPress={() => props.navigation.navigate("Timeline")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="chart-bar" color={color} size={size} />
            )}
            label="Relatório"
            onPress={() => props.navigation.navigate("Report")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="account" color={color} size={size} />
            )}
            label="Minha Conta"
            onPress={() => props.navigation.navigate("Account")}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1E293B",
    paddingTop: 90,
    paddingHorizontal: 60,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 40,
    right: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 15,
  },
  section: {
    marginTop: 10,
  },
});

export default CustomDrawer;
