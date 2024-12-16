import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, Text } from "react-native";
import { IconButton } from "react-native-paper";
import { saveIncident } from "../services/incidentService"; // Ajuste o caminho para o serviço
import AsyncStorage from "@react-native-async-storage/async-storage";

const FormRegisterIncident = ({ region }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationDetails, setLocationDetails] = useState({ city: "", state: "" });

  

  // Chama a função para buscar a cidade sempre que o `region` mudar
  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (region?.latitude && region?.longitude) {
        const stateToAbbreviation = {
          "Acre": "AC",
          "Alagoas": "AL",
          "Amapá": "AP",
          "Amazonas": "AM",
          "Bahia": "BA",
          "Ceará": "CE",
          "Distrito Federal": "DF",
          "Espírito Santo": "ES",
          "Goiás": "GO",
          "Maranhão": "MA",
          "Mato Grosso": "MT",
          "Mato Grosso do Sul": "MS",
          "Minas Gerais": "MG",
          "Pará": "PA",
          "Paraíba": "PB",
          "Paraná": "PR",
          "Pernambuco": "PE",
          "Piauí": "PI",
          "Rio de Janeiro": "RJ",
          "Rio Grande do Norte": "RN",
          "Rio Grande do Sul": "RS",
          "Rondônia": "RO",
          "Roraima": "RR",
          "Santa Catarina": "SC",
          "São Paulo": "SP",
          "Sergipe": "SE",
          "Tocantins": "TO"
        };
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${region.latitude}&lon=${region.longitude}`,
            {
              headers: {
                "User-Agent": "AlertZone (sp.lorranapereira@gmail.com)" // Substitua com informações reais
              }
            }
          );
        
          if (response.ok) {
            const data = await response.json();
        
            const city = data.address.city || data.address.town || data.address.village || "Desconhecida";
            const stateFullName = data.address.state || "Estado desconhecido";
        
            // Busca a sigla do estado no mapeamento
            const state = stateToAbbreviation[stateFullName] || "UF desconhecida";
        
            setLocationDetails({ city, state });
          } else {
            Alert.alert("Erro", "Não foi possível obter os detalhes da localização.");
          }
        } catch (error) {
          console.error("Erro ao buscar localização:", error);
          Alert.alert("Erro", "Erro ao buscar detalhes da localização.");
        }
      }
    };
  
    fetchLocationDetails();
  }, [region]);

  const handleSend = async () => {
    console.log(title);
    console.log(description);
    console.log(region);

    if (!title || !description || !region) {
      Alert.alert(
        "Erro",
        "Por favor, preencha todos os campos e certifique-se de que a localização está definida."
      );
      return;
    }

    try {
      const idUser = await AsyncStorage.getItem("userId"); // Recupera o ID do usuário
      await saveIncident(idUser, title, description, region.latitude, region.longitude, locationDetails.city, locationDetails.state); // Envia a cidade
      Alert.alert("Sucesso", "Incidente salvo com sucesso!");
      setTitle("");
      setDescription("");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o incidente. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputDescription}
          placeholder="Descrição"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.iconButton} onPress={handleSend}>
          <IconButton
            icon="send" // Ícone de aviãozinho de papel no MaterialCommunityIcons
            color="#FFF" // Cor do ícone
            size={24} // Tamanho do ícone
            style={styles.button}
          />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E293B", // Fundo azul escuro
    padding: 20,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Cor clara para o campo de texto
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#000",
  },
  inputDescription: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    height: "80%",
  },
  cityText: {
    color: "#FFF",
    marginBottom: 15,
  },
  iconButton: {
    marginLeft: 10,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#6200ee",
  },
});

export default FormRegisterIncident;
