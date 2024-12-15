import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { IconButton } from "react-native-paper";
import { saveIncident } from "../services/incidentService"; // Ajuste o caminho para o serviço
import AsyncStorage from "@react-native-async-storage/async-storage";

const FormRegisterIncident = ({ region }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSend = async () => {
    if (!title || !description || !region) {
      Alert.alert("Erro", "Por favor, preencha todos os campos e certifique-se de que a localização está definida.");
      return;
    }

    try {
      const idUser = await AsyncStorage.getItem("userId"); // Recupera o ID do usuário
      await saveIncident(idUser, title, description, region.latitude, region.longitude);
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
        <TouchableOpacity style={styles.iconButton} onPress={handleSend}>
          <IconButton
            icon="send" // Ícone de aviãozinho de papel no MaterialCommunityIcons
            color="#FFF" // Cor do ícone
            size={24} // Tamanho do ícone
            style={styles.button}
          />
        </TouchableOpacity>
      </View>
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
  iconButton: {
    marginLeft: 10,
  },
});

export default FormRegisterIncident;
