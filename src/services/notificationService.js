import * as Notifications from "expo-notifications";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

// Configurações padrão para lidar com notificações no background
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Função para solicitar permissões e configurar notificações
export const requestNotificationPermissions = async () => {
  try {
    // Solicita permissões para notificações
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      console.warn("Permissão de notificações não concedida.");
      return null;
    }

    console.log("Permissões concedidas para notificações locais.");
    return true; // Indica que as permissões foram concedidas
  } catch (error) {
    console.error("Erro ao solicitar permissões para notificações:", error);
    throw error;
  }
};

// Função para agendar uma notificação local
export const scheduleLocalNotification = async (title, body, delayInSeconds = 5) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "Notificação",
        body: body || "Essa é uma notificação local.",
      },
      trigger: {
        seconds: delayInSeconds, // Tempo em segundos para disparar a notificação
      },
    });

    console.log("Notificação local agendada com ID:", notificationId);
    return notificationId;
  } catch (error) {
    console.error("Erro ao agendar notificação local:", error);
    throw error;
  }
};

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

    // Salva o token no Firestore com latitude/longitude padrão (ajuste conforme necessário)
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      notificationToken: token,
      latitude: null, // Adicione a localização real
      longitude: null,
    });

    console.log("Token de notificação salvo no Firestore!");
  } catch (error) {
    console.error("Erro ao salvar token de notificação:", error.message);
  }
};
