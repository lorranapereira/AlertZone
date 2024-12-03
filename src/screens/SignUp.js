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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Importe o auth configurado

import NameInput from "../components/NameInput";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";

const SignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");
    setIsLoading(true);
    try {
      // Firebase: Criar usuário com email e senha
      await createUserWithEmailAndPassword(auth, email, password);

      alert("Usuário registrado com sucesso!");
      navigation.navigate("SignIn"); // Navegar para a tela de login após o cadastro
    } catch (err) {
      setError(err.message); // Exibir erro caso ocorra
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback touchSoundDisabled onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.createAccount}>Criar conta</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <NameInput value={name} setValue={setName} />
          <EmailInput value={email} setValue={setEmail} />
          <PasswordInput
            value={password}
            setValue={setPassword}
            showPassword
            setShowPassword={() => {}}
          />

          <Button
            style={styles.createButton}
            mode="contained"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading}
          >
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
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default SignUp;
