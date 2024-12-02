import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import NameInput from "../components/NameInput";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";

const SignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(true);

  return (
    <TouchableWithoutFeedback touchSoundDisabled onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.createAccount}>Criar conta</Text>

          <NameInput value={name} setValue={setName} />
          <EmailInput value={email} setValue={setEmail} />
          <PasswordInput
            value={password}
            setValue={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <Button style={styles.createButton} mode="contained">
            Criar
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text>
              Já tem uma conta? <Text style={styles.loginText}>Faça o login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda a altura
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
    backgroundColor: "#f5f5f5", // Fundo claro
  },
  innerContainer: {
    width: "80%", // Largura do formulário
    maxWidth: 400, // Largura máxima para telas grandes
    padding: 20, // Espaçamento interno
    backgroundColor: "#ffffff", // Fundo branco
    borderRadius: 10, // Borda arredondada
    shadowColor: "#000", // Sombra
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3, // Sombra no Android
  },
  createAccount: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  createButton: {
    marginTop: 20,
    paddingVertical: 10,
    alignSelf: "center",
  },
  loginText: {
    fontWeight: "bold",
    color: "#6200ee",
  },
});

export default SignUp;
