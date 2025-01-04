// Home.js
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import Map from "../components/Map";
import FormRegisterIncident from "../components/FormRegisterIncident";
import { fetchMarkers, saveIncidentToFirestore } from "../services/incidentService"; // Assegure-se de implementar saveIncidentToFirestore

const Home = () => {
  const [existingMarkers, setExistingMarkers] = useState([]); // Marcadores do Firestore
  const [newMarker, setNewMarker] = useState(null); // Novo marcador do usuário
  const [permissionMarker, setPermissionMarker] = useState(false); // Permissão para adicionar marcador
  const [showContent, setShowContent] = useState(true); // Estado para controlar a visibilidade
  useEffect(() => {
    // Escutar marcadores salvos no Firestore em tempo real
    const loadMarkers = () => {
      try {
        // Escuta os marcadores em tempo real
        const unsubscribe = fetchMarkers((fetchedMarkers) => {
          setExistingMarkers(fetchedMarkers);
        });
  
        // Retorna a função de limpeza para interromper a escuta
        return unsubscribe;
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os marcadores.");
      }
    };
  
    const unsubscribe = loadMarkers();
  
    // Limpeza ao desmontar o componente
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    if (permissionMarker) {
      setNewMarker({ latitude, longitude }); // Define apenas um novo marcador
    }
  };

  const handleSaveIncident = async (incidentData) => {
    if (!newMarker) {
      Alert.alert("Erro", "Nenhum marcador selecionado para o incidente.");
      return;
    }

    // Combinar os dados do incidente com as coordenadas do novo marcador
    const incidentWithLocation = {
      ...incidentData,
      coordinate: newMarker,
    };

    try {
      // Salvar o incidente no Firestore (implemente esta função conforme sua lógica)
      await saveIncidentToFirestore(incidentWithLocation);

      // Atualizar os marcadores existentes com o novo marcador
      setExistingMarkers([...existingMarkers, newMarker]);

      // Resetar o marcador e a permissão
      setNewMarker(null);
      setPermissionMarker(false);

      Alert.alert("Sucesso", "Incidente salvo com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o incidente.");
      console.error(error);
    }
  };

  const handleCloseForm = () => {
    // Função para fechar o formulário
    setNewMarker(null);
    setPermissionMarker(false);
  };
  
  return (
    <View style={styles.container}>
      <Map
        onMapPress={handleMapPress}
        markers={[...existingMarkers, ...(newMarker ? [newMarker] : [])]} // Combina marcadores existentes com o novo
        onMarkerPress={() => setShowContent(false)}
        onModalClose={() => setShowContent(true)} // Restaura o conteúdo principal
      />
      {showContent && (permissionMarker && newMarker ? (
        <FormRegisterIncident
          region={newMarker}
          onClose={handleCloseForm} 
        />
      ) : (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonBackground}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setPermissionMarker(true)}
            >
              <Text style={styles.buttonText}>       
              { !newMarker && (
                  permissionMarker
                    ? "Toque no mapa onde ocorreu o incidente"
                    : "Registrar Incidente"
                )
              }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 0.1, // Espaço do fundo
    alignItems: "center",
    zIndex: 10,
    width: "100%",
  },
  buttonBackground: {
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: "100%",
    height: 100,
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
