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
    // Inicializa o mapa com preferCanvas habilitado
    const map = L.map(mapRef.current, {
      preferCanvas: true, // Usa Canvas para renderização mais leve
      zoomSnap: 0.5, // Suaviza níveis de zoom
      zoomDelta: 0.25, // Pequenas mudanças no zoom
      scrollWheelZoom: false, // Desativa zoom com scroll no mobile
      doubleClickZoom: false, // Desativa zoom com clique duplo
    }).setView([-32.035, -52.0986], 13); // Zoom inicial ajustado

    // Adiciona o tile layer do OpenStreetMap com carregamento progressivo
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18, // Limita o zoom máximo para evitar sobrecarga
      updateWhenIdle: true, // Reduz requests desnecessários
    }).addTo(map);

    // Adiciona marcadores com popups
    const markers = [
      { lat: -32.035, lng: -52.0986, popup: "Suspeito vendendo celular" },
      { lat: -32.04, lng: -52.11, popup: "Suspeito em atividade" },
    ];

    markers.forEach(({ lat, lng, popup }) =>
      L.marker([lat, lng]).addTo(map).bindPopup(popup)
    );

    // Remove o mapa ao desmontar o componente
    return () => {
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
