import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Certifique-se de ajustar o caminho

export const saveComment = async (idIncident, text, idUser) => {
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        idIncident,
        text,
        idUser,
        createdAt: new Date().toISOString(),
      });
  
      return {
        id: docRef.id,
        idIncident,
        text,
        idUser,
        createdAt: new Date().toISOString(),
      }; // Retorna o comentário criado
    } catch (error) {
      console.error("Erro ao salvar comentário: ", error);
      throw error;
    }
  };

export const getComments = async (idIncident) => {
    try {
        const commentsQuery = query(
            collection(db, "comments"),
            where("idIncident", "==", idIncident)
        );
        const querySnapshot = await getDocs(commentsQuery);
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, incidentId: idIncident, ...doc.data() });
        });
        console.log(comments);
        return comments;
    } catch (error) {
        console.error(`Erro ao buscar comentários do incidente ${idIncident}: `, error);
        throw error;
    }
};

/**
 * Função para deletar um comentário.
 * @param {string} commentId - ID do comentário a ser deletado.
 */
export const deleteComment = async (commentId) => {
    try {
        const commentRef = doc(db, "comments", commentId); // Referência ao comentário no Firestore
        await deleteDoc(commentRef); // Deleta o documento
        console.log(`Comentário com ID ${commentId} foi deletado.`);
    } catch (error) {
        console.error(`Erro ao deletar o comentário com ID ${commentId}: `, error);
        throw error;
    }
};

export const updateComment = async (commentId, data) => {
    try {
        const commentRef = doc(db, "comments", commentId); // Referência ao documento
        await updateDoc(commentRef, data); // Atualiza o documento no Firestore
        console.log(`Alerta com ID ${commentId} foi atualizado.`);
    } catch (error) {
        console.error(`Erro ao atualizar o alerta com ID ${commentId}: `, error);
        throw error;
    }
};
