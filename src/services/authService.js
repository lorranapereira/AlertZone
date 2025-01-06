// src/services/authService.js
import { 
	createUserWithEmailAndPassword, 
	signInWithEmailAndPassword, 
	updateProfile, 
	deleteUser, 
	updatePassword, 
	reauthenticateWithCredential, 
	EmailAuthProvider 
  } from "firebase/auth";
  import { auth, db } from "../../firebaseConfig"; // Importe o Firebase configurado
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
   * @param {string} displayName - Nome de exibição do usuário
   * @returns {Promise<string>}
   */
  export const signUpWithEmailAndPassword = async (email, password, displayName) => {
	try {
	  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	  const user = userCredential.user; // Obtenha o usuário a partir de userCredential
  
	  await saveNotificationToken(user); // Passe o usuário como parâmetro
  
	  // Atualiza o perfil do usuário com o nome
	  if (displayName) {
		await updateProfile(user, { displayName });
	  }
  
	  return "Usuário registrado com sucesso!";
	} catch (error) {
	  console.error("Erro ao registrar usuário:", error.message);
	  throw new Error(error.message);
	}
  };
  
  /**
   * Função para salvar o token de notificação do usuário no Firestore.
   * @param {Object} user - Objeto do usuário do Firebase Authentication
   * @returns {Promise<void>}
   */
  export const saveNotificationToken = async (user) => {
	try {
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
  
	} catch (error) {
	  console.error("Erro ao salvar o token de notificação:", error.message);
	}
  };
  
  /**
   * Atualiza as coordenadas do usuário no Firestore.
   * @param {string} userId - ID do usuário
   * @param {Object} coords - { latitude: number, longitude: number }
   * @returns {Promise<void>}
   */
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
  
	} catch (error) {
	  console.error("Erro ao atualizar as coordenadas:", error.message);
	  throw new Error("Não foi possível atualizar as coordenadas.");
	}
  };
  
  /**
   * Realiza o login com email e senha.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<string>} Mensagem de sucesso.
   */
// src/services/authService.js

export const loginWithEmailAndPassword = async (email, password) => {  
	try {
	  const userCredential = await signInWithEmailAndPassword(auth, email, password);
	  const user = userCredential.user; // Obtenha o usuário a partir de userCredential
  
	  const userId = user.uid; // Obtém o ID do usuário
  
	  const adminStatus = await isAdmin(userId);
  
	  return { message: "Login realizado com sucesso!", user };
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
  
  /**
   * Desativa a conta do usuário autenticado.
   * @returns {Promise<string>}
   */
  export const deactivateAccount = async () => {
	try {
	  const user = auth.currentUser;
  
	  if (!user) {
		throw new Error("Usuário não autenticado.");
	  }
  
	  await deleteUser(user);
	  return "Conta excluída!";
	} catch (error) {
	  console.error("Erro ao excluir a conta:", error.message);
	  throw new Error(error.message);
	}
  };
  
  /**
   * Formata o email para exibição.
   * @param {string} email 
   * @returns {string}
   */
  export const formatEmail = (email) => {
	if (!email || typeof email !== "string") return "";
  
	const [localPart, domain] = email.split("@");
	if (!localPart || !domain) return "";
  
	const maskedLocal = localPart.slice(0, 2).padEnd(localPart.length, ".");
	return `${maskedLocal}@${domain}`;
  };
  
  /**
   * Obtém o nome do usuário autenticado.
   * @returns {Promise<string>}
   */
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
  
  /**
   * Reautentica o usuário com email e senha atuais.
   * @param {string} email 
   * @param {string} currentPassword 
   * @returns {Promise<void>}
   */
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
  
  /**
   * Atualiza os dados do usuário.
   * @param {Object} param0 - Contém displayName e/ou password
   * @param {string} email 
   * @param {string} currentPassword 
   * @returns {Promise<string>}
   */
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
  
  /**
   * Verifica se o usuário é administrador.
   * @param {string} userId 
   * @returns {Promise<boolean>}
   */
  const isAdmin = async (userId) => {
	try {
	  const usersRef = collection(db, "users");
	  const q = query(usersRef, where("id", "==", userId));
	  const querySnapshot = await getDocs(q);
  
	  if (!querySnapshot.empty) {
		const userData = querySnapshot.docs[0].data();
		return userData.isAdmin === true; // Verifica se isAdmin é true
	  }
  
	  return false; // Retorna falso se o usuário não for encontrado
	} catch (error) {
	  console.error("Erro ao verificar se o usuário é administrador:", error);
	  return false;
	}
  };
  
  /**
   * Busca os dados do usuário no Firestore.
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  export const fetchUserData = async (userId) => {
	try {
	  // Obter o usuário pelo ID
	  const user = auth.currentUser;
  
	  if (!user || user.uid !== userId) {
		throw new Error('Usuário não está autenticado ou ID não corresponde.');
	  }
  
	  const { uid, email } = user;
  
	  // Consultar a coleção 'users' no Firestore onde o email corresponde
	  const usersRef = collection(db, 'users');
	  const q = query(usersRef, where('email', '==', email));
	  const querySnapshot = await getDocs(q);
  
	  if (querySnapshot.empty) {
		throw new Error('Nenhum documento encontrado na coleção users para o e-mail especificado.');
	  }
  
	  // Supondo que o e-mail é único, pegamos o primeiro documento
	  const userDoc = querySnapshot.docs[0].data();
	  const { notificationToken, latitude, longitude } = userDoc;
  
	  return {
		id: uid,
		email,
		notificationToken,
		latitude,
		longitude,
	  };
	} catch (error) {
	  console.error('Erro ao buscar dados do usuário:', error);
	  throw error;
	}
  };
  