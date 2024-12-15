import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Details from "./Details";

const Map = ({ onMapPress, markers }) => {
  const [region, setRegion] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null); // Armazena o marcador clicado

  useEffect(() => {
    // Obter localização atual do usuário
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Precisamos da sua localização para mostrar o mapa.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker); // Define o marcador selecionado
    setModalVisible(true); // Exibe a modal
  };
  return (
    <View style={styles.mapContainer}>
      {isModalVisible && selectedMarker ? (
        <Details
          visibleValue={isModalVisible} // Passa a visibilidade
          onClose={() => setModalVisible(false)} // Fecha a modal
          marker={selectedMarker} // Passa os dados do marcador selecionado
          style={styles.map} // Use 'style' em vez de 'styles'
        />
      ) : (
        region && (
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={onMapPress}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker}
                onPress={() => handleMarkerPress(marker)} // Passa o marcador clicado
              />
            ))}
          </MapView>
        )
      )}
    </View>
  );  
};

const styles = StyleSheet.create({

  map: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
});

export default Map;
