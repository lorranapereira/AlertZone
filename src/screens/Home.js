import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import Map from "../components/Map";
import FormRegisterIncident from "../components/FormRegisterIncident";
import { fetchMarkers } from "../services/incidentService";

const Home = () => {
  const [markers, setMarkers] = useState([]);
  const [permissionMarker, setPermissionMarker] = useState(false);

  useEffect(() => {
    // Buscar marcadores salvos no Firestore
    const loadMarkers = async () => {
      try {
        const fetchedMarkers = await fetchMarkers();
        setMarkers(fetchedMarkers);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os marcadores.");
      }
    };

    loadMarkers();
  }, []);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    if (permissionMarker) {
      setMarkers((prevMarkers) => [...prevMarkers, { incidentId, latitude, longitude }]);
    }
  };

  return (
    <View style={styles.container}>
      <Map onMapPress={handleMapPress} markers={markers} />

      {permissionMarker ? (
        <FormRegisterIncident region={markers[markers.length - 1]} />
      ) : (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonBackground}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setPermissionMarker(true)}
            >
              <Text style={styles.buttonText}>Registrar Incidente</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 1,
    alignItems: "center",
    zIndex: 10,
    width: "100%",
  },
  buttonBackground: {
    backgroundColor: "#001f4d",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    width: "100%",
  },
  button: {
    backgroundColor: "#D1D5DB",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Home;
