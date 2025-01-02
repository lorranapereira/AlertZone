import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc, getDocs, getDoc,query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Certifique-se de ajustar o caminho
import * as geolib from "geolib"; // Biblioteca para cálculo de distâncias
import { notification } from "../services/notificationService"; // Função para enviar notificações

export const saveIncident = async (idUser, notificationToken, title, description, latitude, longitude, city, state) => {
  try {
    // Salva o incidente no Firestore
    const docRef = await addDoc(collection(db, "incidents"), {
      idUser,
      title,
      description,
      latitude,
      longitude,
      city,
      state,
      createdAt: new Date().toISOString(),
    });
    console.log("Documento salvo com ID: ", docRef.id);

    // Busca usuários no Firestore para enviar notificações
    const usersSnapshot = await getDocs(collection(db, "users"));
    const nearbyUsers = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      console.log(userData);
      if (
        userData.latitude &&
        userData.longitude &&
        geolib.isPointWithinRadius(
          { latitude: userData.latitude, longitude: userData.longitude },
          { latitude, longitude },
          1000
        )
      ) {
        if (userData.notificationToken) {
          nearbyUsers.push(userData.notificationToken);
        }
      }
    });

    // Envia notificações para os usuários próximos
    if (nearbyUsers.length > 0) {
      await notification(nearbyUsers, "Alguém registrou um alerta na sua região", notificationToken);
      console.log("Notificações enviadas com sucesso!");
    } else {
      console.log("Nenhum usuário encontrado no raio de 1km.");
    }

    return docRef.id;
  } catch (e) {
    console.error("Erro ao salvar incidente e enviar notificações: ", e);
    throw e;
  }
};

  
export const fetchIncidents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "incidents"));
      const incidents = [];
      querySnapshot.forEach((doc) => {
        incidents.push({ id: doc.id, ...doc.data() });
      });
      console.log(incidents);
      return incidents;
    } catch (error) {
      console.error("Erro ao buscar incidentes: ", error);
      throw error;
    }
};

export const deleteIncident = async (incidentId) => {
  try {
    const incidentRef = doc(db, "incidents", incidentId);
    await deleteDoc(incidentRef);
    console.log(`Comentário com ID ${incidentId} foi deletado.`);
  } catch (error) {
    console.error(`Erro ao deletar o comentário com ID ${incidentId}: `, error);
    throw error;
  }
};

export const updateIncident = async (incidentId, data) => {
  try {
      const incidentRef = doc(db, "incidents", incidentId); // Referência ao documento
      await updateDoc(incidentRef, data); // Atualiza o documento no db
      console.log(`Alerta com ID ${incidentId} foi atualizado.`);
  } catch (error) {
      console.error(`Erro ao atualizar o alerta com ID ${incidentId}: `, error);
      throw error;
  }
};

// Busca um incidente pelo ID
export const getIncident = async (incidentId) => {
  try {
    const incidentRef = doc(db, "incidents", incidentId); // Referência ao documento
    const incidentSnap = await getDoc(incidentRef); // Busca o documento

    if (incidentSnap.exists()) {
      return { id: incidentSnap.id, ...incidentSnap.data() }; // Retorna o incidente
    } else {
      throw new Error(`Incidente com ID ${incidentId} não encontrado.`);
    }
  } catch (error) {
    console.error(`Erro ao buscar incidente com ID ${incidentId}: `, error);
    throw error;
  }
};


export const fetchMarkers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "incidents"));
    const markers = [];
    const uniqueSet = new Set(); // Para rastrear coordenadas únicas

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const coordKey = `${data.latitude}-${data.longitude}`; // Chave única para coordenadas

      if (!uniqueSet.has(coordKey)) {
        uniqueSet.add(coordKey);
        markers.push({
          latitude: data.latitude,
          longitude: data.longitude,
          incidentId: doc.id,
        });
      } else {
        console.warn(`Marcador duplicado ignorado: ${coordKey}`);
      }
    });
    return markers;
  } catch (error) {
    console.error("Erro ao buscar marcadores:", error);
    throw error;
  }
};

/**
 * Retorna os incidentes por mês para o ano fornecido.
 * @param {number} year - Ano atual ou específico
 * @returns {Promise<number[]>} - Array com a contagem de incidentes por mês
 */
export const getMonthlyIncidents = async (year) => {
  try {
    const incidentsRef = collection(db, "incidents");
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

    const q = query(
      incidentsRef,
      where("createdAt", ">=", startOfYear.toISOString()),
      where("createdAt", "<=", endOfYear.toISOString())
    );

    const querySnapshot = await getDocs(q);

    // Inicializa um array com 12 posições, uma para cada mês
    const incidentsByMonth = Array(12).fill(0);

    querySnapshot.forEach((doc) => {
      const incident = doc.data();
      if (incident.createdAt) {
        // Converte o `createdAt` para um objeto `Date`
        const date = new Date(incident.createdAt);

        if (!isNaN(date.getTime())) { // Verifica se a data é válida
          const month = date.getMonth(); // Índice do mês (0 = Jan, 11 = Dez)
          incidentsByMonth[month] += 1; // Incrementa o contador do mês correspondente
        }
      }
    });

    return incidentsByMonth;
  } catch (error) {
    console.error("Erro ao buscar incidentes mensais:", error.message);
    return Array(12).fill(0); // Retorna 0 para todos os meses em caso de erro
  }
};


/**
 * Retorna os incidentes agrupados por localização (city/state).
 * @returns {Promise<{ city: string, state: string, totalIncidentes: number }[]>}
 */
export const getIncidentsByLocation = async () => {
  try {
    const incidentsRef = collection(db, "incidents");
    const querySnapshot = await getDocs(incidentsRef);

    const locationMap = {};

    querySnapshot.forEach((doc) => {
      const incident = doc.data();
      const key = `${incident.city}/${incident.state}`;

      if (!locationMap[key]) {
        locationMap[key] = { city: incident.city, state: incident.state, totalIncidentes: 0 };
      }
      locationMap[key].totalIncidentes += 1;
    });

    return Object.values(locationMap); // Retorna o array formatado
  } catch (error) {
    console.error("Erro ao buscar incidentes por localização:", error.message);
    return []; // Retorna uma lista vazia em caso de erro
  }
};

/**
 * Filtra os incidentes por intervalo de datas.
 * @param {string} start - Data inicial no formato YYYY-MM-DD
 * @param {string} end - Data final no formato YYYY-MM-DD
 * @returns {Promise<{ months: string[], values: number[], locations: { city: string, state: string, totalIncidentes: number }[] }>}
 */
export const filterIncidentsByDate = async (start, end) => {
  try {
    const incidentsRef = collection(db, "incidents");
    const startDate = new Date(start);
    const endDate = new Date(end);

    const q = query(
      incidentsRef,
      where("createdAt", ">=", startDate),
      where("createdAt", "<=", endDate)
    );

    const querySnapshot = await getDocs(q);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const incidentsByMonth = Array(12).fill(0);
    const locationMap = {};

    querySnapshot.forEach((doc) => {
      const incident = doc.data();

      // Contagem mensal
      if (incident.createdAt) {
        const month = incident.createdAt.toDate().getMonth();
        incidentsByMonth[month] += 1;
      }

      // Contagem por localização
      const key = `${incident.city}/${incident.state}`;
      if (!locationMap[key]) {
        locationMap[key] = { city: incident.city, state: incident.state, totalIncidentes: 0 };
      }
      locationMap[key].totalIncidentes += 1;
    });

    return {
      months,
      values: incidentsByMonth,
      locations: Object.values(locationMap),
    };
  } catch (error) {
    console.error("Erro ao filtrar incidentes:", error.message);
    return {
      months: [],
      values: [],
      locations: [],
    };
  }
};
export const getDistinctYears = async () => {
  try {
    const incidentsRef = collection(db, "incidents");
    const querySnapshot = await getDocs(incidentsRef);

    const yearsSet = new Set();

    querySnapshot.forEach((doc) => {
      const incident = doc.data();
      if (incident.createdAt) {
        let year;

        // Verifica se `createdAt` é um Timestamp do Firestore
        if (typeof incident.createdAt.toDate === "function") {
          year = incident.createdAt.toDate().getFullYear();
        }
        // Verifica se `createdAt` é uma string ISO
        else if (typeof incident.createdAt === "string") {
          year = new Date(incident.createdAt).getFullYear();
        }

        if (year) {
          yearsSet.add(year);
        }
      }
    });

    // Retorna os anos como um array ordenado
    return Array.from(yearsSet).sort((a, b) => b - a);
  } catch (error) {
    console.error("Erro ao buscar anos distintos:", error.message);
    return [];
  }
};
