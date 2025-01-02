import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from "react-native";
import { Button, Modal, Portal, Provider, Card, Avatar, Menu, IconButton } from "react-native-paper";
import FormCommentIncident from "./FormCommentIncident";
import { getIncident, updateIncident, deleteIncident } from "../services/incidentService"; // Ajuste os caminhos conforme necessário
import { getComments, updateComment, deleteComment } from "../services/commentService"; // Ajuste os caminhos conforme necessário

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
  const [userId, setUserId]= useState(null);
  const [isAdmin, setIsAdmin]= useState(null);
  const [menuVisible, setMenuVisible] = useState({});

  useEffect(() => {
    const fetchData = async () => {

      setUserId(await AsyncStorage.getItem("userId"));
      setIsAdmin(await AsyncStorage.getItem("isAdmin"));

      if (marker) {
        const fetchedIncidents = [];
        const fetchedComments = {};

        try {
          // Verifica se o objeto `marker` possui a propriedade `incidentId`
          if (marker.incidentId) {
            console.log("Processando o marker:", marker);

            // Busca os dados do incidente
            const incident = await getIncident(marker.incidentId);

            // Busca os comentários associados ao incidente
            const incidentComments = await getComments(marker.incidentId);

            // Adiciona o incidente e os comentários às listas locais
            fetchedIncidents.push({ id: marker.incidentId, ...incident });
            fetchedComments[marker.incidentId] = incidentComments || []; // Garante que seja um array vazio, se não houver comentários
          } else {
            console.warn("O objeto marker não contém um incidentId válido.");
          }
        } catch (error) {
          console.error(`Erro ao buscar dados para o incidente ${marker.incidentId}:`, error);
        }
        console.log("celular!!!");
        console.log("Incidents carregados localmente:", fetchedIncidents);
        console.log("Comments carregados localmente:", fetchedComments);

        // Define os estados com os dados carregados
        setIncidents([...fetchedIncidents]);
        setComments({ ...fetchedComments });
        console.log(incidents);
        console.log(comments);
      }
    };

    fetchData();
  }, [marker]);

  // Adicione useEffect para depurar mudanças em incidents e comments
  useEffect(() => {
    console.log("Incidents atualizados:", incidents);
  }, [incidents]);

  useEffect(() => {
    console.log("Comments atualizados:", comments);
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
      console.log("Alerta editado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar o alerta:", error);
    }
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
      console.log("Alerta excluído com sucesso!");
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

      console.log("Comentário excluído com sucesso!");
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
        const incidentId = editingComment.incidentId;

        updatedComments[incidentId] = updatedComments[incidentId].map((c) =>
          c.id === editingComment.id ? { ...c, text: editingCommentText } : c
        );

        return updatedComments;
      });

      setEditingComment(null);
      setEditingCommentText("");
      console.log("Comentário editado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar o comentário:", error);
    }
  };

  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.container}>
            <IconButton
              icon="close"
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
                      <Text style={styles.postDate}>{formatDate(incident.createdAt)}</Text>
                      {(isAdmin != "false" || incident.idUser == userId) && (
                      <Menu
                        visible={menuVisible[incident.id] || false}
                        onDismiss={() => toggleMenu(incident.id)}
                        anchor={
                          <TouchableOpacity onPress={() => toggleMenu(incident.id)}>
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

                    <Text style={styles.commentsTitle}>Comentários:</Text>
                    {comments[incident.id] && comments[incident.id].length > 0 ? (
                      comments[incident.id].map((comment) => (
                        <View key={comment.id} style={styles.commentContainer}>
                          <Avatar.Icon size={40} icon="account" style={styles.commentAvatar} />
                          <View style={styles.commentContent}>
                            <Text style={styles.commentDate}>
                              {formatDate(comment.createdAt)}
                            </Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                          </View>
                          {(isAdmin != "false" || comment.idUser == userId) && (
                          <Menu
                            visible={menuVisible[comment.id] || false}
                            onDismiss={() => toggleMenu(comment.id)}
                            anchor={
                              <TouchableOpacity onPress={() => toggleMenu(comment.id)}>
                                <Text style={styles.menuTrigger}>...</Text>
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
                  style={styles.input}
                  value={editingDescription}
                  onChangeText={setEditingDescription}
                  placeholder="Descrição"
                  multiline
                />
                <Button mode="contained" onPress={saveEditedIncident}>
                  Salvar Alterações do alerta
                </Button>
                <Button mode="text" onPress={() => setEditingIncident(null)}>
                  Cancelar
                </Button>
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
                  <Button mode="contained" onPress={saveEditedComment}>
                    Salvar Alterações
                  </Button>
                  <Button mode="text" onPress={() => setEditingComment(null)}>
                    Cancelar
                  </Button>
                </View>
              )
            }
            {selectedIncident && (
              <FormCommentIncident
                idIncident={selectedIncident.id}
                onCommentAdded={(newComment) => {
                  setComments((prevComments) => {
                    const updatedComments = { ...prevComments };
                    updatedComments[selectedIncident.id] = [
                      ...(updatedComments[selectedIncident.id] || []),
                      newComment,
                    ];
                    return updatedComments;
                  });
                }}
              />
            )}
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 0,
    marginBottom: 100,
    position: "relative",
  },
  postCard: {
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postDate: {
    fontSize: 12,
    color: "#888",
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
  commentDate: {
    fontSize: 12,
    color: "#888",
  },
  commentText: {
    fontSize: 14,
  },
});

export default Details;
