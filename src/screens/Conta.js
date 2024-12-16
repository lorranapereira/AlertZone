import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Avatar, Text, TextInput, Button, IconButton } from "react-native-paper";
import { updateUserData, deactivateAccount, formatEmail, getUserName } from "../services/authService";
import { auth } from "../../firebaseConfig";

const Conta = ({ navigation }) => {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Busca o nome e o e-mail do usuário logado
    const fetchUserData = async () => {
      try {
        const userName = await getUserName();
        const userEmail = auth.currentUser?.email;
        setName(userName);
        setEmail(formatEmail(userEmail)); // Formata o e-mail antes de exibir
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      if (!name && !newPassword) {
        Alert.alert("Atenção", "Nenhuma alteração foi realizada.");
        return;
      }
  
      const userEmail = auth.currentUser?.email;
      if (!userEmail) {
        Alert.alert("Erro", "Não foi possível obter o e-mail do usuário.");
        return;
      }
  
      await updateUserData(
        { displayName: name, password: newPassword },
        userEmail,
        currentPassword // Necessário para reautenticação
      );
  
      Alert.alert("Sucesso", "Alterações salvas com sucesso!");
    } catch (error) {
      // Exibe a mensagem amigável no alert
      Alert.alert("Erro", error.message);
    }
  };
  
  

  // Função para desativar a conta
  const handleDeactivate = async () => {
    Alert.alert(
      "Desativar Conta",
      "Tem certeza que deseja desativar sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: async () => {
            try {
              await deactivateAccount();
              Alert.alert("Sucesso", "Conta desativada com sucesso!");
              navigation.replace("Login"); // Redireciona para a tela de login
            } catch (error) {
              Alert.alert("Erro", error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Conta</Text>
      <View style={styles.avatarContainer}>
        <Avatar.Icon size={80} icon="account" />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          label="Nome"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
        />

        {/* Email (desabilitado) */}
        <TextInput
          label="E-mail"
          value={email}
          style={styles.input}
          mode="outlined"
          disabled
        />

        {/* Senha Atual */}
        <TextInput
          label="Senha Atual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />

        {/* Nova Senha */}
        <TextInput
          label="Nova Senha"
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />

        {/* Botões */}
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleSave}
        >
          Salvar Alterações
        </Button>
        <Button
          mode="contained"
          style={styles.deactivateButton}
          onPress={handleDeactivate}
        >
          Desativar Conta
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#4CAF50",
  },
  deactivateButton: {
    backgroundColor: "#f44336",
  },
});

export default Conta;
