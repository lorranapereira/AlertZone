// src/screens/SignIn.js
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput as PaperTextInput } from "react-native-paper";

import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";

import { loginWithEmailAndPassword, translateFirebaseError, updateCoord } from "../services/authService";
import * as Location from "expo-location";
import AuthContext from "../context/authContext"; // Certifique-se que o caminho está correto

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { userData } = useContext(AuthContext);

  useEffect(() => {
    if (userData) {
      navigation.navigate("Main");
    }
  }, [userData]);

  const handleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Realiza o login
      const { message, user } = await loginWithEmailAndPassword(email, password);
      alert(message);

      // Solicita permissões de localização
      console.log("Solicitando permissões...");
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Permissões concedidas: ", status);
      
      if (status === "granted") {
        console.log("Obtendo localização...");
        const location = await Location.getCurrentPositionAsync({});
        console.log("Localização obtida: ", location);
        const { latitude, longitude } = location.coords;

        // Atualiza as coordenadas no Firestore usando o usuário retornado
        if (user && user.uid) {
          await updateCoord(user.uid, { latitude, longitude });
        } else {
          throw new Error("Usuário não autenticado.");
        }
        console.log("Coordenadas atualizadas.");
      } else {
        console.log("Permissão de localização negada.");
      }
    } catch (err) {
      console.error(err);
      // Se o erro não tiver o campo 'code', forneça uma mensagem padrão
      const friendlyMessage = err.code ? translateFirebaseError(err.code) : err.message;
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
      </TouchableWithoutFeedback>
    </SafeAreaView>
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
