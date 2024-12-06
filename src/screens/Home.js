import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
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
        city: "Rio Grande",
        state: "RS",
        country: "Brazil",
        format: "json",
        q: text,
      });
  
      try {
        const response = await fetch(`${baseUrl}?${params.toString()}`, {
          headers: {
            "User-Agent": "AlertZoneApp/1.0 (sp.lorranapereira@gmail.com)", // Adicione seu contato
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          const newSuggestions = data.map((item) => ({
            display_name: item.display_name,
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
          <Text style={styles.title}>Alertas da região Rio Grande - RS</Text>
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
  inputContainer: {
    padding: 10,
    backgroundColor: "#001f4d",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "90%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#6200ee",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  suggestionsContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    maxHeight: 100,
    overflow: "scroll",
  },
  suggestion: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default Home;
