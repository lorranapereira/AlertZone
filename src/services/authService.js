import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, deleteUser, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth, db } from "../../firebaseConfig"; // Importe o Firebase configurado
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  setDoc,
  updateDoc 
} from "firebase/firestore";
/**
 * Serviço para criar um usuário com email e senha.
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<string>}
 */
export const signUpWithEmailAndPassword = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await saveNotificationToken(auth.currentUser.uid);
    // Atualiza o perfil do usuário com o nome
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    return "Usuário registrado com sucesso!";
  } catch (error) {
    console.error("Erro ao registrar usuário:", error.message);
    throw new Error(error.message);
  }
};


export const updateCoord = async (userId, coords) => {
  try {
    if (!userId || !coords) {
      throw new Error("ID do usuário ou coordenadas inválidas.");
    }

    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
        updatedAt: new Date().toISOString(),
      },
      { merge: true } // Garante que não sobrescreva outros campos
    );

    console.log("Coordenadas do usuário atualizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar as coordenadas:", error.message);
    throw new Error("Não foi possível atualizar as coordenadas.");
  }
};

export const saveNotificationToken = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    // Solicita permissões para notificações
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permissão para notificações não foi concedida.");
      return;
    }

    // Obtém o token de notificação
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Salva ou atualiza o token no Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        email: user.email,
        notificationToken: token,
        updatedAt: new Date().toISOString(), // Adiciona um timestamp para controle
      },
      { merge: true } // Garante que o documento seja mesclado e não sobrescrito
    );

    console.log("Token de notificação salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar o token de notificação:", error.message);
  }
};

export const loginWithEmailAndPassword = async (email, password) => {
  console.log("sdsdsd");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("kkkkkkkk");

    const userId = userCredential.user.uid; // Obtém o ID do usuário
    await AsyncStorage.setItem("userId", userId); // Salva no AsyncStorage
    console.log("login");
    return "Login realizado com sucesso!";
  } catch (error) {
    console.log(error);
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

export const deactivateAccount = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    await deleteUser(user);
    return "Conta desativada com sucesso!";
  } catch (error) {
    console.error("Erro ao desativar a conta:", error.message);
    throw new Error(error.message);
  }
};

export const formatEmail = (email) => {
  if (!email || typeof email !== "string") return "";

  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return "";

  const maskedLocal = localPart.slice(0, 2).padEnd(localPart.length, ".");
  return `${maskedLocal}@${domain}`;
};

export const getUserName = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    return user.displayName || "Usuário sem nome"; // Retorna o displayName ou uma mensagem padrão
  } catch (error) {
    console.error("Erro ao buscar o nome do usuário:", error.message);
    throw new Error("Erro ao buscar o nome do usuário.");
  }
};

export const reauthenticateUser = async (email, currentPassword) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Você precisa estar autenticado para realizar esta ação.");
    }

    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {

    // Mapeia erros do Firebase para mensagens amigáveis
    const errorMessages = {
      "auth/wrong-password": "A senha atual está incorreta. Tente novamente.",
      "auth/user-mismatch": "O e-mail informado não corresponde ao usuário atual.",
      "auth/too-many-requests": "Muitas tentativas de login. Aguarde um momento e tente novamente.",
    };

    const friendlyMessage = errorMessages[error.code] || "A senha atual está incorreta. Tente novamente.";
    throw new Error(friendlyMessage);
  }
};


export const updateUserData = async ({ displayName, password }, email, currentPassword) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Você precisa estar autenticado para realizar esta ação.");
    }

    // Reautentica o usuário antes de alterar a senha
    if (password && email && currentPassword) {
      await reauthenticateUser(email, currentPassword);
    }

    // Atualiza o nome do usuário
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Atualiza a senha do usuário
    if (password) {
      await updatePassword(user, password);
    }

    return "Dados atualizados com sucesso!";
  } catch (error) {
    throw new Error(error.message); // Propaga a mensagem amigável
  }
};
