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

import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";

import { loginWithEmailAndPassword, translateFirebaseError, updateCoord } from "../services/authService";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      
      const message = await loginWithEmailAndPassword(email, password);
      alert(message);
      console.log("uuuu");

      const location = await Location.getCurrentPositionAsync({});
      console.log(await AsyncStorage.getItem("userId"));
      const { latitude, longitude } = location.coords;
      console.log( location.coords);

      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        await updateCoord(userId, { latitude, longitude });
      } else {
        throw new Error("Usuário não autenticado.");
      }

      navigation.navigate("Main");
    } catch (err) {
      const friendlyMessage = translateFirebaseError(err.code);
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
