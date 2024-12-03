import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";

const translateFirebaseError = (errorCode) => {
  const errorMessages = {
    "auth/invalid-credential": "Credenciais inválidas. Verifique suas informações e tente novamente.",
    "auth/email-already-in-use": "O email informado já está em uso. Tente outro email ou faça login.",
    "auth/weak-password": "A senha é muito fraca. Escolha uma senha mais forte.",
    "auth/invalid-email": "O email informado não é válido. Verifique e tente novamente.",
    "auth/user-not-found": "Usuário não encontrado. Verifique suas informações ou registre-se.",
    "auth/wrong-password": "Senha incorreta. Verifique e tente novamente.",
    "auth/too-many-requests": "Muitas tentativas. Por favor, aguarde e tente novamente mais tarde.",
    // Outros códigos podem ser adicionados aqui
  };

  return errorMessages[errorCode] || "Ocorreu um erro desconhecido. Por favor, tente novamente.";
};

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login realizado com sucesso!");
      navigation.navigate("Home");
    } catch (err) {
      const friendlyMessage = translateFirebaseError(err.code);
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.login}>Login</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <EmailInput value={email} setValue={setEmail} />

          <PasswordInput
            value={password}
            setValue={setPassword}
            showPassword
            setShowPassword={() => {}}
          />

          <Button
            mode="contained"
            style={styles.loginButton}
            onPress={handleSignIn}
            loading={isLoading}
            disabled={isLoading}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    width: "80%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
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
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default SignIn;
