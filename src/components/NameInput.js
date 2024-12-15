import React from "react";
import { StyleSheet } from "react-native";  
import { TextInput } from "react-native-paper";

const NameInput = ({value, setValue}) => {
  return (
    <TextInput
    style={styles.textInput}
    label="Nome"
    mode="flat" 
    left={
      <TextInput.Icon
        icon="account"
        size={25}
        color="black"
      />
    }
    value={value}
    onChangeText={(text) => setValue(text)}
    />
  );
}; 

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 10,
  },
}); 

export default NameInput;