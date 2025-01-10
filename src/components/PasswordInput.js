import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

const PasswordInput = ({ value, setValue, showPassword, setShowPassword }) => {

  const handleSubmit = () => {
    if (!password) {
      setError(true); // Marca erro se o campo estiver vazio
    } else {
      setError(false); // Limpa o erro
      console.log("Senha enviada:", password);
      // Continue com a lógica de login
    }
  };
  return (
    <TextInput
      style={styles.textInput}
      label="Senha"
      value={value}
      secureTextEntry
      onChangeText={(text) => setValue(text)}
      right={
        showPassword ? (
          <TextInput.Icon
            icon="eye"
            size={25}
            color="black"
            onPress={() => setShowPassword(!showPassword)}
          />
        ) : (
          <TextInput.Icon
            icon="eye-off"
            size={25}
            color="black"
            onPress={() => setShowPassword(showPassword)}
          />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 10,
  },
});

export default PasswordInput;