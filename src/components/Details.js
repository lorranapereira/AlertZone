import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Platform, TextInput } from "react-native";
import { Button, Modal, Portal, PaperProvider, Card, Avatar, Menu, IconButton } from "react-native-paper";
import FormCommentIncident from "./FormCommentIncident";
import { getIncident, updateIncident, deleteIncident } from "../services/incidentService"; // Ajuste os caminhos conforme necessário
import { getComments, updateComment, deleteComment } from "../services/commentService"; // Ajuste os caminhos conforme necessário
import AuthContext from "../context/authContext";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

const Details = ({ marker, visibleValue, onClose }) => {
  const [visible, setVisible] = useState(visibleValue || false);
  const [incidents, setIncidents] = useState([]);
  const [comments, setComments] = useState({});
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [editingIncident, setEditingIncident] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [menuVisible, setMenuVisible] = useState({});
  const { userData } = useContext(AuthContext);
  const { id: userId, isAdmin } = userData || {};
  const [showForm, setShowForm] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      if (marker) {
        const fetchedIncidents = [];
        const fetchedComments = {};
        let unsubscribe = null;
  
        try {
          // Verifica se o objeto `marker` possui a propriedade `incidentId`
          if (marker.incidentId) {
  
            // Busca os dados do incidente
            const incident = await getIncident(marker.incidentId);
            fetchedIncidents.push({ id: marker.incidentId, ...incident });
  
            // Atualiza o estado dos incidentes
            setIncidents([...fetchedIncidents]);

            // Escuta mudanças em tempo real para os comentários
            unsubscribe = getComments(marker.incidentId, (incidentComments) => {
              fetchedComments[marker.incidentId] = incidentComments || []; // Garante que seja um array vazio
              setComments({ ...fetchedComments });
            });
          } else {
            console.warn("O objeto marker não contém um incidentId válido.");
          }
        } catch (error) {
          console.error(`Erro ao buscar dados para o incidente ${marker.incidentId}:`, error);
        }
  
  
        // Retorna a função de limpeza ao desmontar o componente
        return () => {
          if (unsubscribe) unsubscribe();
        };
      }
    };
  
    fetchData();
  }, [marker]);
  
  

  // Adicione useEffect para depurar mudanças em incidents e comments
  useEffect(() => {
  }, [incidents]);

  useEffect(() => {
  }, [comments]);



  const hideModal = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const startEditing = (incident) => {
    setSelectedIncident(null);
    setEditingComment(null);
    setEditingIncident(incident);
    setEditingTitle(incident.title);
    setEditingDescription(incident.description);
    toggleMenu(incident.id);

  };

  // Save edited incident
  const saveEditedIncident = async () => {
    try {
      await updateIncident(editingIncident.id, {
        title: editingTitle,
        description: editingDescription,
      });

      setIncidents((prev) =>
        prev.map((incident) =>
          incident.id === editingIncident.id
            ? { ...incident, title: editingTitle, description: editingDescription }
            : incident
        )
      );

      setEditingIncident(null);
      setEditingTitle("");
      setEditingDescription("");
    } catch (error) {
      console.error("Erro ao editar o alerta:", error);
    }
  };

  const handleCloseForm = () => {
    // Função para fechar o formulário
    setEditingIncident(null);
    setSelectedIncident(null);
  };

  const toggleMenu = (id) => {
    setMenuVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  const onDeleteIncident = async (incidentId) => {
    try {
      await deleteIncident(incidentId);
      setIncidents((prev) => prev.filter((incident) => incident.id !== incidentId));
    } catch (error) {
      console.error("Erro ao excluir o alerta:", error);
    }
  };

  const onDeleteComment = async (comment, incidentId) => {
    try {
      await deleteComment(comment.id);

      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        updatedComments[incidentId] = updatedComments[incidentId].filter(
          (c) => c.id !== comment.id
        );

        return updatedComments;
      });

    } catch (error) {
      console.error("Erro ao excluir o comentário:", error);
    }
  };

  const startEditingComment = (comment) => {
    setSelectedIncident(null);
    setEditingComment(null);
    setEditingComment(comment);
    setEditingCommentText(comment.text);
    toggleMenu(comment.id);
  };


  // Save edited comment
  const saveEditedComment = async () => {
    try {
      await updateComment(editingComment.id, { text: editingCommentText });

      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        const incidentId = editingComment.idIncident;

        updatedComments[incidentId] = updatedComments[incidentId].map((c) =>
          c.id === editingComment.id ? { ...c, text: editingCommentText } : c
        );

        return updatedComments;
      });

      setEditingComment(null);
      setEditingCommentText("");
    } catch (error) {
      console.error("Erro ao editar o comentário:", error);
    }
  };

  return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.container}>
            <Icon
              name="close"
              size={24}
              onPress={hideModal}
              style={styles.closeButton}
              color="black"
            />
            <ScrollView>
              {incidents.map((incident) => (
                <Card style={styles.postCard} key={incident.id}>
                  <Card.Content>
                    
                    <View style={styles.postHeader}>
                      <Avatar.Icon size={40} icon="alert" style={styles.avatar} />
                      <Text style={styles.postDate}>
                          {incident.updatedAt
                        ? `${formatDate(incident.updatedAt)} (editado)`
                        : formatDate(incident.createdAt)}
                      </Text>
                      {(isAdmin != "false" || incident.idUser == userId) && (
                      <Menu
                        visible={menuVisible[incident.id] || false}
                        onDismiss={() => toggleMenu(incident.id)}
                        style= {styles.menuPost}
                        anchor={
                          <TouchableOpacity 
                          onPress={() => toggleMenu(incident.id)}>
                            <Text style={styles.menuTrigger}>...</Text>
                          </TouchableOpacity>
                        }
                      >
                        <Menu.Item onPress={() => onDeleteIncident(incident.id)}
                          title="Excluir"
                        />
                        {incident.idUser == userId && (
                          <Menu.Item onPress={() => startEditing(incident)} title="Editar" />
                        )}
                      </Menu>
                    )}
                    </View>
                    <Text style={styles.postTitle}>{incident.title}</Text>
                    <Text style={styles.postDescription}>{incident.description}</Text>
                    <Text style={styles.commentsTitle}>Comentários ({comments[incident.id]?.length  || 0})</Text>
                    {comments[incident.id] && comments[incident.id].length > 0 ? (
                      Array.from(
                        new Map(comments[incident.id].map((comment) => [comment.id, comment])).values()
                      ).map((comment, index) => (
                        <View key={comment.id} style={styles.commentContainer}>
                          <Avatar.Icon size={40} icon="account" style={styles.commentAvatar} />
                          <View style={styles.commentContent}>
                          <Text style={styles.postDateComment}>
                              {comment.updatedAt
                            ? `${formatDate(comment.updatedAt)} (editado)`
                            : formatDate(comment.createdAt)}
                          </Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                          </View>
                          {(isAdmin != "false" || comment.idUser == userId) && (
                          <Menu
                            visible={menuVisible[comment.id] || false}
                            onDismiss={() => toggleMenu(comment.id)}
                            style={styles.menuComment}
                            anchor={
                              <TouchableOpacity onPress={() => toggleMenu(comment.id)}>
                                <Text style={styles.menuTouch} >...</Text>
                              </TouchableOpacity>
                            }
                          >
                            <Menu.Item
                              onPress={() => onDeleteComment(comment, incident.id)}
                              title="Excluir"
                            />
                            {comment.idUser == userId && (
                            <Menu.Item
                              onPress={() => startEditingComment(comment)}
                              title="Editar"
                            />
                          )}
                          </Menu>
                          )}
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noCommentsText}>Sem comentários.</Text>
                    )}

                    <Button
                      mode="contained"
                      onPress={() => setSelectedIncident(incident)}
                      style={styles.commentButton}
                    >
                      Comentar
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>

            {editingIncident && (
              <View style={styles.editForm}>
                <Text style={styles.editFormTitle}>Editar Alerta</Text>
                <TextInput
                  style={styles.input}
                  value={editingTitle}
                  onChangeText={setEditingTitle}
                  placeholder="Título"
                />
                <TextInput
                  value={editingDescription}
                  onChangeText={setEditingDescription}
                  placeholder="Descrição"
                  numberOfLines={20}
                  maxLength={100}
                  style={[styles.input, { height: 100 }]}
                  multiline
                  contentStyle={{
                    textAlignVertical: 'top', // Alinha o texto ao topo no Android
                    paddingTop: Platform.OS === 'ios' ? 10 : 0, // Ajusta padding no topo para iOS
                  }}
                />
                <Button mode="contained" style={styles.commentButtonOrange} onPress={saveEditedIncident}>
                  Salvar Alterações do alerta
                </Button>
                <TouchableOpacity style={styles.closeButtonForm} onPress={() => setEditingIncident(null)}>
                  <Icon
                    name="close"
                    color="rgb(253, 128, 3)"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            )}
            {
              editingComment && (
                <View style={styles.editForm}>
                  <Text style={styles.editFormTitle}>Editar Comentário</Text>
                  <TextInput
                    style={styles.input}
                    value={editingCommentText}
                    onChangeText={setEditingCommentText}
                    placeholder="Texto do comentário"
                    multiline
                  />
                  <Button mode="contained" style={styles.commentButtonOrange} onPress={saveEditedComment}>
                    Salvar Alterações
                  </Button>
                  <TouchableOpacity style={styles.closeButtonForm} onPress={() => setEditingComment(null)}>
                    <Icon
                      name="close"
                      color="rgb(253, 128, 3)"
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              )
            }
            
            {selectedIncident && (
              <FormCommentIncident
                idIncident={selectedIncident.id}
                onClose={handleCloseForm}
              />
            )}
          </View>
        </Modal>
      </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  commentButton: {
    backgroundColor: "#1E293B",
  },
  commentButtonOrange: {
    backgroundColor: "rgb(253, 128, 3)",
  },
  editFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
  },
  closeButton: {
    marginLeft: 'auto', // Empurra o ícone para a direita
    left: 290,
    top:5
  },
  modalContainer: {
    flex: 1,
    padding: 0,
    marginBottom: 10,
    position: "relative",
    backgroundColor: 'white',
  },
  postCard: {
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  postDate: {
    fontSize: 12,
    color: "#888",
    left: 10,
  },
  postDateComment: {
    fontSize: 12,
    color: "#888",
  },
  menuTriggerContainer: {
    padding: 10,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  commentAvatar: {
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  commentDate: {
    fontSize: 12,
    color: "#888",
  },
  commentsTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "bold",
    color: "#888",
  },
  menuPost: {
    position: "absolute",
    margin: 4,
    top: 115,
    left: 225,
  },
  menuTrigger: {
    fontSize: 20,
    color: "#000",
    top: -5,
    left: 95,
    textAlign: "center",
    fontSize: 18,
  },
  menuTouch: {
    fontSize: 20,
    color: "#000",
    top: -5,
    textAlign: "center",
    fontSize: 18,
  },
  menuComment: {
    marginTop:-28,
  },
  editForm: {
    backgroundColor: "#1E293B",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    marginTop:2,
    borderRadius: 5,
    marginBottom:15,
    textAlignVertical: 'top',
    backgroundColor: "#fff",
  },
});


export default Details;
