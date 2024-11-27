import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity} from "react-native";
import { Avatar, Text, TextInput, Switch, Divider, IconButton } from "react-native-paper";

const Conta = ({ navigation }) => {
  const [alertProximidade, setAlertProximidade] = useState(true);
  const [alertBairro, setAlertBairro] = useState(false);

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Minha Conta</Text>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <IconButton icon="menu" size={24} color="#fff" />
      </TouchableOpacity>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar.Icon size={80} icon="account" />
      </View>

      {/* Formulário */}
      <View style={styles.formContainer}>
        {/* Nome */}
        <TextInput
          label="Nome"
          value="Lorrana Pereira"
          style={styles.input}
          mode="outlined"
        />

        {/* Email */}
        <TextInput
          label="E-mail"
          value="sp............@gmail.com"
          style={styles.input}
          mode="outlined"
          disabled
          right={<TextInput.Icon icon="lock" />}
        />

        {/* Senha Atual */}
        <TextInput
          label="Senha atual"
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />

        {/* Nova Senha */}
        <TextInput
          label="Nova senha"
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />

        {/* Permissões */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Permitir receber alertas</Text>
          <View style={styles.switchOptions}>
            <View style={styles.switchOption}>
              <Text>Proximidades</Text>
              <Switch
                value={alertProximidade}
                onValueChange={() => setAlertProximidade(!alertProximidade)}
              />
            </View>
            <View style={styles.switchOption}>
              <Text>Meu bairro</Text>
              <Switch
                value={alertBairro}
                onValueChange={() => setAlertBairro(!alertBairro)}
              />
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Cidade */}
        <TextInput label="Cidade" style={styles.input} mode="outlined" />

        {/* Bairro */}
        <TextInput label="Bairro" style={styles.input} mode="outlined" />
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
  switchContainer: {
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  switchOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  switchOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    marginVertical: 10,
  },
});

export default Conta;
