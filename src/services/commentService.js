import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc,
  onSnapshot,
  orderBy
} from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Certifique-se de ajustar o caminho

/**
 * Salva um comentário no Firestore.
 * @param {string} idIncident - ID do incidente relacionado.
 * @param {string} text - Texto do comentário.
 * @param {string} idUser - ID do usuário que fez o comentário.
 * @returns {Object} - Objeto do comentário salvo.
 */
export const saveComment = async (idIncident, text, idUser) => {
  try {
    if (!idIncident || !text || !idUser) {
      throw new Error("Todos os campos (idIncident, text, idUser) são obrigatórios.");
    }

    const docRef = await addDoc(collection(db, "comments"), {
      idIncident,
      text,
      idUser,
      createdAt: new Date().toISOString(), // Salva a data em formato ISO
    });

    return {
      id: docRef.id,
      idIncident,
      text,
      idUser,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erro ao salvar comentário: ", error);
    throw error;
  }
};

/**
 * Busca todos os comentários relacionados a um incidente.
 * @param {string} idIncident - ID do incidente relacionado.
 * @returns {Array} - Lista de comentários.
 */
export const getComments = (idIncident, callback) => {
  try {
    if (!idIncident) {
      throw new Error("O ID do incidente (idIncident) é obrigatório.");
    }

    const commentsQuery = query(
      collection(db, "comments"),
      where("idIncident", "==", idIncident),
      orderBy("createdAt", "asc") 
    );

    const unsubscribe = onSnapshot(commentsQuery, (querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          idIncident,
          ...doc.data(),
        });
      });

      callback(comments); // Chama o callback com os dados atualizados
    });

    // Retorna a função de limpeza
    return unsubscribe;
  } catch (error) {
    console.error(`Erro ao buscar comentários do incidente ${idIncident}: `, error);
    throw error;
  }
};

/**
 * Deleta um comentário pelo ID.
 * @param {string} commentId - ID do comentário a ser deletado.
 */
export const deleteComment = async (commentId) => {
  try {
    if (!commentId) {
      throw new Error("O ID do comentário (commentId) é obrigatório.");
    }

    const commentRef = doc(db, "comments", commentId);
    await deleteDoc(commentRef);

  } catch (error) {
    console.error(`Erro ao deletar o comentário com ID ${commentId}: `, error);
    throw error;
  }
};

/**
 * Atualiza um comentário pelo ID.
 * @param {string} commentId - ID do comentário a ser atualizado.
 * @param {Object} data - Dados a serem atualizados.
 */
export const updateComment = async (commentId, data) => {
  try {
    if (!commentId || !data) {
      throw new Error("O ID do comentário (commentId) e os dados (data) são obrigatórios.");
    }

    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, {...data, updatedAt: new Date().toISOString()});

  } catch (error) {
    console.error(`Erro ao atualizar o comentário com ID ${commentId}: `, error);
    throw error;
  }
};
