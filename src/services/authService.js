import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Importe o Firebase configurado
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";

/**
 * Serviço para criar um usuário com email e senha.
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<string>}
 */
export const signUpWithEmailAndPassword = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return "Usuário registrado com sucesso!";
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Serviço para realizar login com email e senha.
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<string>}
 */
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid; // Obtém o ID do usuário
    await AsyncStorage.setItem("userId", userId); // Salva no AsyncStorage
    return "Login realizado com sucesso!";
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Função para traduzir os códigos de erro do Firebase em mensagens amigáveis.
 * @param {string} errorCode - Código de erro retornado pelo Firebase
 * @returns {string} Mensagem amigável
 */
export const translateFirebaseError = (errorCode) => {
  const errorMessages = {
    "auth/invalid-credential": "Credenciais inválidas. Verifique suas informações e tente novamente.",
    "auth/email-already-in-use": "O email informado já está em uso. Tente outro email ou faça login.",
    "auth/weak-password": "A senha é muito fraca. Escolha uma senha mais forte.",
    "auth/invalid-email": "O email informado não é válido. Verifique e tente novamente.",
    "auth/user-not-found": "Usuário não encontrado. Verifique suas informações ou registre-se.",
    "auth/wrong-password": "Senha incorreta. Verifique e tente novamente.",
    "auth/too-many-requests": "Muitas tentativas. Por favor, aguarde e tente novamente mais tarde.",
  };

  return errorMessages[errorCode] || "Ocorreu um erro desconhecido. Por favor, tente novamente.";
};

/**
 * Função para obter o nome do usuário a partir do Firebase Authentication.
 * @param {string} userId - ID do usuário.
 * @returns {Promise<string>} - Nome do usuário.
 */
export const getUserNameFromAuth = async (userId) => {
  try {
    const user = auth.currentUser;

    if (user && user.uid === userId) {
      return user.displayName || "Usuário Desconhecido"; // Retorna o displayName ou um valor padrão
    } else {
      throw new Error("Usuário não encontrado ou não autenticado.");
    }
  } catch (error) {
    console.error(`Erro ao buscar usuário no Firebase Auth com ID ${userId}: `, error);
    throw error;
  }
};