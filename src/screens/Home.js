import React, { useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configuração de ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Home = ({ navigation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Inicializa o mapa
    const map = L.map(mapRef.current).setView([-32.035, -52.0986], 14);

    // Adiciona o tile layer do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Adiciona marcadores
    L.marker([-32.035, -52.0986])
      .addTo(map)
      .bindPopup("Suspeito vendendo celular")
      .openPopup();

    L.marker([-32.04, -52.11])
      .addTo(map)
      .bindPopup("Suspeito em atividade");

    return () => {
      // Remove o mapa ao desmontar o componente
      map.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <IconButton icon="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alertas da Região</Text>
      </View>

      <Card style={styles.alertCard}>
        <Card.Content>
          <Text style={styles.title}>Alertas da região Rio Grande - RS</Text>
          <Text style={styles.subTitle}>⚠️ 4 Alertas na sua região</Text>
        </Card.Content>
      </Card>

      {/* Div para renderizar o mapa com Leaflet */}
      <View style={styles.mapContainer}>
        <div ref={mapRef} style={styles.map}></div>
      </View>
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
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default Home;
