import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Card, Text, Button } from "react-native-paper";
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
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [userLocation, setUserLocation] = useState({
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    // Obter a localização do usuário
    const getUserLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
              );
              if (response.ok) {
                const data = await response.json();
                setUserLocation({
                  city: data.address.city || data.address.town || "Cidade desconhecida",
                  state: data.address.state || "Estado desconhecido",
                  country: data.address.country || "País desconhecido",
                });
              } else {
                Alert.alert("Erro ao buscar localização", response.statusText);
              }
            } catch (error) {
              Alert.alert("Erro", "Não foi possível obter a localização.");
            }
          },
          (error) => {
            console.error("Erro ao obter localização:", error);
          }
        );
      } else {
        Alert.alert("Erro", "Geolocalização não é suportada pelo dispositivo.");
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    // Inicializa o mapa
    const map = L.map(mapRef.current).setView([-32.035, -52.0986], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Adiciona evento de clique no mapa
    map.on("click", (e) => {
      if (selectedCoordinates) {
        selectedCoordinates.remove();
      }

      const marker = L.marker(e.latlng).addTo(map);
      setSelectedCoordinates(marker);

      // Atualiza o endereço no input com base no clique
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          const formattedAddress = data.address.road || "Endereço desconhecido";
          setAddress(formattedAddress);
        })
        .catch(() => {
          setAddress("Erro ao obter o endereço");
        });
    });

    return () => {
      map.remove();
    };
  }, [selectedCoordinates]);

  // Lógica para buscar sugestões no Nominatim
  const handleAutocomplete = async (text) => {
    setAddress(text);
    setSuggestions([]); // Limpa as sugestões antes de atualizar

    if (text.length > 2) {
      const baseUrl = "https://nominatim.openstreetmap.org/search";
      const params = new URLSearchParams({
        format: "json",
        addressdetails: 1, // Para obter detalhes no resultado
        limit: 5, // Limita os resultados
        city: userLocation.city,
        state: userLocation.state,
        country: userLocation.country,
        street: text, // Filtra apenas ruas e bairros
      });

      try {
        const response = await fetch(`${baseUrl}?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          const newSuggestions = data.map((item) => ({
            display_name: item.name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
          }));
          setSuggestions(newSuggestions);
        } else {
          console.error("Erro ao buscar sugestões:", response.statusText);
        }
      } catch (error) {
        console.error("Erro na requisição do Nominatim:", error);
      }
    }
  };

  // Lógica para selecionar um item do autocomplete
  const handleSelectSuggestion = (suggestion) => {
    setAddress(suggestion.display_name);
    setSuggestions([]);

    if (selectedCoordinates) {
      selectedCoordinates.remove();
    }

    const marker = L.marker([suggestion.lat, suggestion.lon]).addTo(mapRef.current);
    setSelectedCoordinates(marker);

    // Centraliza o mapa no endereço selecionado
    mapRef.current.setView([suggestion.lat, suggestion.lon], 15);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={styles.headerTitle}>Menu</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alertas da Região</Text>
      </View>

      <Card style={styles.alertCard}>
        <Card.Content>
          <Text style={styles.title}>
            Alertas da região {userLocation.city} - {userLocation.state}
          </Text>
          <Text style={styles.subTitle}>⚠️ 4 Alertas na sua região</Text>
        </Card.Content>
      </Card>

      <View style={styles.mapContainer}>
        <div ref={mapRef} style={styles.map}></div>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Qual é o endereço?"
          value={address}
          onChangeText={handleAutocomplete}
        />
        <Button mode="contained" style={styles.button}>
          Registrar Incidente
        </Button>
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectSuggestion(suggestion)}
              >
                <Text style={styles.suggestion}>{suggestion.display_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#001f4d", paddingTop: 35 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  alertCard: { margin: 10, padding: 10, borderRadius: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
  subTitle: { fontSize: 14, marginTop: 5, color: "#555" },
  mapContainer: { flex: 1 },
  map: { width: "100%", height: "100%", borderRadius: 10 },
  inputContainer: { padding: 10, backgroundColor: "#001f4d", flexDirection: "column", alignItems: "center" },
  input: { width: "90%", height: 40, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 10, marginBottom: 10 },
  button: { alignSelf: "center", backgroundColor: "#6200ee", paddingVertical: 10, paddingHorizontal: 20 },
  suggestionsContainer: { marginTop: 10, backgroundColor: "#fff", borderRadius: 10, padding: 10, maxHeight: 100, overflow: "scroll" },
  suggestion: { paddingVertical: 5, paddingHorizontal: 10 },
});

export default Home;
