import React, { useState, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { saveComment } from "../services/commentService"; // Ajuste o caminho para o serviço
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import AuthContext from "../context/authContext";

const FormCommentIncident = ({ idIncident, onClose, onCommentAdded }) => {
  const [description, setDescription] = useState("");
  const { userData } = useContext(AuthContext); 
  const { id: idUser } = userData || {};
  
  const handleSend = async () => {
    if (!description.trim()) {
      Alert.alert("Erro", "O comentário não pode estar vazio.");
      return;
    }

    try {
      const newComment = await saveComment(idIncident, description, idUser);
      Alert.alert("Sucesso", "Comentário enviado!");
      setDescription(""); // Limpa o campo de texto após o envio

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
          style={styles.input}
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
    top: -65,
    right: 20,
    zIndex: 1, // Garante que o botão fique acima dos outros elementos
  },
  inputContainer: {
    position: 'absolute',
    backgroundColor: "#1E293B", // Fundo azul escuro
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 39,
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 5,
  },
  input: {
    backgroundColor: '#f6f6f6',
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
    height: 50,
  },
  iconButton: {
    position: "absolute",
    right: 25,
    top: 75,
  },
});

export default FormCommentIncident;
