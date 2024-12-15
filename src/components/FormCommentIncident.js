import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { IconButton } from "react-native-paper";
import { saveComment } from "../services/commentService"; // Ajuste o caminho para o serviço
import AsyncStorage from "@react-native-async-storage/async-storage";

const FormCommentIncident = ({ idIncident, onCommentAdded }) => {
  const [description, setDescription] = useState("");

  const handleSend = async () => {
    if (!description.trim()) {
      Alert.alert("Erro", "O comentário não pode estar vazio.");
      return;
    }

    try {
      const idUser = await AsyncStorage.getItem("userId"); 
      const newComment = await saveComment(idIncident, description, idUser);
      Alert.alert("Sucesso", "Comentário enviado!");
      setDescription(""); // Limpa o campo de texto após o envio

      // Notifica o componente pai
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (error) {
      console.error("Erro ao salvar comentário: ", error);
      Alert.alert("Erro", "Não foi possível salvar o comentário. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputDescription}
          placeholder="Escreva seu comentário"
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
  inputDescription: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    height: 50,
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default FormCommentIncident;
