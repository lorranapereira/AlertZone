import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Platform, Alert, Text } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import { saveIncident } from "../services/incidentService"; // Ajuste o caminho para o serviço
import AuthContext from "../context/authContext";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

const FormRegisterIncident = ({ region, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationDetails, setLocationDetails] = useState({ city: "", state: "", road: "" });
  const { userData } = useContext(AuthContext); // Consumindo o AuthContext
  const { id, notificationToken, email } = userData;


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
            const road = data.address.road || "Rua desconhecida"; // Nome da rua
            // Busca a sigla do estado no mapeamento
            const state = stateToAbbreviation[stateFullName] || "UF desconhecida";

            setLocationDetails({ city, state, road });
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
      await saveIncident(id, notificationToken, title, description, region.latitude, region.longitude, locationDetails.city, locationDetails.state, locationDetails.road); 
      Alert.alert("Sucesso", "Incidente salvo com sucesso!");
      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o incidente. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon
          name="close" 
          color="rgb(253, 128, 3)"
          size={24}
        />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor="#999"
          value={title}
          maxLength={30}
          onChangeText={setTitle}
        />
      </View>
      {title.length == 30 && (
        <Text style={styles.errorText}>
          Limite máximo de 30 caracteres atingido no título.
        </Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Descrição do incidente"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={20}
          maxLength={100}
          style={[styles.inputDescription, { height: 100 }]}
          contentStyle={{
            textAlignVertical: 'top', // Alinha o texto ao topo no Android
            paddingTop: Platform.OS === 'ios' ? 10 : 0, // Ajusta padding no topo para iOS
          }}
        />
        <TouchableOpacity style={styles.iconButton} onPress={handleSend}>
          <Icon
            name="send" // Ícone de aviãozinho de papel no MaterialCommunityIcons
            color="rgb(253, 128, 3)" // Cor hexadecimal equivalente
            size={24} // Tamanho do ícone
            style={styles.button}
          />
        </TouchableOpacity>
      </View>
      {description.length == 100 && (
        <Text style={styles.errorText}>
          Limite máximo de 100 caracteresatingido na descrição.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E293B", // Fundo azul escuro
    paddingTop: 50,
    padding: 20,
  },
  errorText: {
    alignSelf: "flex-start",
    color: 'red',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 14,
    fontSize:10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingHorizontal:0,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1, // Garante que o botão fique acima dos outros elementos
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  inputDescription: {
    width: "100%",
    fontSize: 16,
    backgroundColor: "#fff",
    paddingTop:20,
    color: "#000",
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  cityText: {
    color: "#FFF",
    marginBottom: 15,
  },
  iconButton: {
    marginLeft: 10,
    top: 30,
  },
  button:  {
    position: "absolute",
    top: -10,
    right: 20,
    zIndex: 1, // Garante que o botão fique acima dos outros elementos
  },
});

export default FormRegisterIncident;
