import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Card, Text, IconButton } from "react-native-paper";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Botão de Menu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <IconButton icon="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alertas da Região</Text>
      </View>

      {/* Alertas */}
      <Card style={styles.alertCard}>
        <Card.Content>
          <Text style={styles.title}>Alertas da região Rio Grande - RS</Text>
          <Text style={styles.subTitle}>⚠️ 4 Alertas na sua região</Text>
        </Card.Content>
      </Card>

      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -32.035,
          longitude: -52.0986,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Marcadores */}
        <Marker
          coordinate={{ latitude: -32.035, longitude: -52.0986 }}
          title="Suspeito vendendo celular"
          description="Próximo ao centro"
        />
        <Marker
          coordinate={{ latitude: -32.04, longitude: -52.11 }}
          title="Suspeito em atividade"
          description="Avenida principal"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#001f4d",
    paddingTop: 35,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  alertCard: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 14,
    marginTop: 5,
    color: "#555",
  },
  map: {
    flex: 1,
  },
});

export default Home;
