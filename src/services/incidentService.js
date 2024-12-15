import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc, getDocs, getDoc,query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Certifique-se de ajustar o caminho

export const saveIncident = async (idUser,title, description, latitude, longitude) => {
  try {
    const docRef = await addDoc(collection(db, "incidents"), {
      idUser,
      title,
      description,
      latitude,
      longitude,
      createdAt: new Date().toISOString(), // Salva a data em formato ISO
    });
    console.log("Documento salvo com ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Erro ao salvar incidente: ", e);
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
      await updateDoc(incidentRef, data); // Atualiza o documento no Firestore
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
