import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native-paper";
import { Context } from "../context/authContext";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";

const SignIn = ({ navigation }) => {
  const { state, teste } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(true);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.login}>Login</Text>

          <EmailInput value={email} setValue={setEmail} />

          <PasswordInput
            value={password}
            setValue={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <Button
            mode="contained"
            style={styles.loginButton}
            onPress={() => navigation.navigate("Home")}
          >
            Login
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text>
              Não tem uma conta?{" "}
              <Text style={styles.createAccountText}>Crie uma</Text>
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
    backgroundColor: "#f5f5f5", // Fundo claro para destaque
  },
  innerContainer: {
    width: "80%", // Largura do formulário
    maxWidth: 400, // Largura máxima para telas grandes
    padding: 20, // Espaçamento interno
    backgroundColor: "#ffffff", // Fundo branco
    borderRadius: 10, // Borda arredondada
    shadowColor: "#000", // Sombra para destacar
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3, // Sombra para Android
  },
  login: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  createAccountText: {
    fontWeight: "bold",
    color: "#6200ee",
  },
});

export default SignIn;
