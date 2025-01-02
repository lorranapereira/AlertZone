import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { saveComment } from "../services/commentService"; // Ajuste o caminho para o serviço
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";

const FormCommentIncident = ({ idIncident, onClose, onCommentAdded }) => {
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
      onClose();
    } catch (error) {
      console.error("Erro ao salvar comentário: ", error);
      Alert.alert("Erro", "Não foi possível salvar o comentário. Tente novamente.");
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
          style={styles.inputDescription}
          placeholder="Escreva seu comentário"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity style={styles.iconButton} onPress={handleSend}>
          <Icon
            name="send" 
            color="rgb(253, 128, 3)"
            size={24}
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
    paddingTop: 40,
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1, // Garante que o botão fique acima dos outros elementos
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
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
