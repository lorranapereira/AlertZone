import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Importe o Firebase configurado

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
    await signInWithEmailAndPassword(auth, email, password);
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
