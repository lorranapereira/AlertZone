import * as Notifications from "expo-notifications";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";

// Configurações padrão para lidar com notificações no background
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Função para salvar o token de notificação no Firestore
export const saveUserNotificationToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permissão para notificações não foi concedida.");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Salva o token no Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      notificationToken: token,
    });

  } catch (error) {
    console.error("Erro ao salvar token de notificação:", error.message);
  }
};

// Função para enviar notificações remotas via Expo Push Notification Service (EPN)
export const notification = async (tokens, message, currentUserToken) => {
  try {
    if (!tokens || tokens.length === 0) {
      console.warn("Nenhum token de notificação fornecido.");
      return;
    }
    console.log("emitir alerta 1000");

    // Filtra o token do usuário atual para não enviar notificações a ele

    const filteredTokens = tokens;
    console.log(filteredTokens);

    if (filteredTokens.length === 0) {
      return;
    }

    // Prepara mensagens para o Expo Push Notification Service
    const expoMessages = filteredTokens.map((token) => ({
      to: token,
      sound: "default",
      title: "Alerta de Incidente",
      body: message,
    }));

    // Envia notificações para o EPN
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expoMessages),
    });

    if (!response.ok) {
      throw new Error(`Erro na API Expo Push Notification: ${response.statusText}`);
    }

  } catch (error) {
    console.error("Erro ao enviar notificações:", error.message);
    throw error;
  }
};

// Função para emitir um alerta
export const emitAlert = async (alertDetails) => {
  try {
    const { title, description, latitude, longitude, city, state } = alertDetails;

    // Salva o incidente no Firestore
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const alertRef = doc(collection(db, "incidents"));
    await setDoc(alertRef, {
      idUser: user.uid,
      title,
      description,
      latitude,
      longitude,
      city,
      state,
      createdAt: new Date().toISOString(),
    });


    // Obtem tokens de notificação de outros usuários
    const usersSnapshot = await getDocs(collection(db, "users"));
    const tokens = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.notificationToken) {
        tokens.push(userData.notificationToken);
      }
    });
    // Envia notificações para os usuários (exceto o atual)
    await notification(tokens, `Um alerta foi emitido em ${city}/${state}.`, user.notificationToken);
  } catch (error) {
    console.error("Erro ao emitir alerta:", error.message);
    throw error;
  }
};
