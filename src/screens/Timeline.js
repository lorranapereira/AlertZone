import React, { useEffect, useContext, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Card, Avatar, Menu } from "react-native-paper";
import { fetchIncidents, deleteIncident, updateIncident } from "../services/incidentService"; // Importa o getComments correto
import { updateComment, getComments, deleteComment } from "../services/commentService"; // Importa o getComments correto
import FormCommentIncident from "../components/FormCommentIncident";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import AuthContext from "../context/authContext";

const Timeline = () => {
  const [incidents, setIncidents] = useState([]);
  const [comments, setComments] = useState({});
  const [menuVisible, setMenuVisible] = useState({});
  const [editingIncident, setEditingIncident] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const { userData } = useContext(AuthContext); // Consumindo o AuthContext
  const { id: userId, isAdmin } = userData || {};
  // Fetch initial data
  useEffect(() => {
    const unsubscribeIncidents = fetchIncidents((data) => {
      setIncidents(data);

      // Atualizar comentários em tempo real para cada incidente
      const commentsData = {};
      const unsubscribeComments = [];

      data.forEach((incident) => {
        const unsubscribe = getComments(incident.id, (incidentComments) => {
          commentsData[incident.id] = incidentComments;

          // Atualizar o estado de comentários após cada alteração
          setComments({ ...commentsData });
        });

        unsubscribeComments.push(unsubscribe);
      });

      // Retornar função para limpar todas as inscrições de comentários
      return () => {
        unsubscribeComments.forEach((unsubscribe) => unsubscribe());
      };
    });

    // Limpar inscrição ao desmontar
    return () => {
      unsubscribeIncidents();
    };
  }, []);

  // Toggle menu visibility
  const toggleMenu = (id) => {
    setMenuVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCloseForm = () => {
    // Função para fechar o formulário
    setEditingIncident(null);
    setSelectedIncident(null);
  };

  // Start editing an incident
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  // Delete an incident
  const onDeleteIncident = async (incidentId) => {
    try {
      await deleteIncident(incidentId);
      setIncidents((prev) => prev.filter((incident) => incident.id !== incidentId));
      console.log("Alerta excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir o alerta:", error);
    }
  };

  // Start editing a comment
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
      console.log("Comentário editado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar o comentário:", error);
    }
  };

  // Delete a comment
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.headerTitle}>Alertas
          <Icon
            name="alert"
            size={24}
            color="rgb(253, 128, 3)"
            style={styles.icon}
          />
        </Text>
        {incidents.map((incident) => (
          <Card style={styles.postCard} key={incident.id}>
            {(isAdmin != "false" || incident.idUser == userId) && (
              <Menu
                visible={menuVisible[incident.id] || false}
                onDismiss={() => toggleMenu(incident.id)}
                style= {styles.menuPost}
                anchor={
                  <TouchableOpacity onPress={() => toggleMenu(incident.id)}>
                    <Text style={styles.menuTrigger}>...</Text>
                  </TouchableOpacity>
                }
              >
                {console.log("id incidente", incident.idUser)}
                {console.log("userId", userId)}
                <Menu.Item onPress={() => onDeleteIncident(incident.id)} title="Excluir" />

                {incident.idUser == userId && (
                  <Menu.Item onPress={() => startEditing(incident)} title="Editar" />
                )}
              </Menu>
            )}
            <Card.Content>
              <View style={styles.postHeader}>
                <Avatar.Icon size={40} icon="alert" style={styles.avatar} />
                <Text style={styles.postDate}>
                  {incident.updatedAt
                    ? `${formatDate(incident.updatedAt)} (editado)`
                    : formatDate(incident.createdAt)}
                                    {"\n"}
                </Text>
              </View>
              <Text style={styles.address}>{incident.state}, {incident.city}, {incident.road} </Text>

              <Text style={styles.postTitle}>{incident.title}</Text>
              <Text style={styles.postDescription}>{incident.description}</Text>

              <Text style={styles.commentsTitle}>Comentários ({comments[incident.id]?.length || 0})</Text>
              {comments[incident.id] && comments[incident.id].length > 0 ? (
                comments[incident.id].map((comment) => (
                  <View key={comment.id} style={styles.commentContainer}>
                    <Avatar.Icon size={40} icon="account" style={styles.commentAvatar} />
                    <View style={styles.commentContent}>
                      <Text style={styles.commentDate}>
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
                        anchor={
                          <TouchableOpacity
                            style={styles.menuTriggerContainer}
                            onPress={() => toggleMenu(comment.id)}>
                            <Text>...</Text>
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
                onPress={() => {
                  setSelectedIncident(incident);
                  setEditingComment(null);
                  setEditingIncident(null);
                }}
                style={styles.commentButton}
              >
                Comentar
              </Button>

            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {
        editingIncident && (
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
            <Button mode="contained" style={styles.button} onPress={saveEditedIncident}>
              Salvar Alterações do alerta
            </Button>
            <TouchableOpacity style={styles.closeButton} onPress={() => setEditingIncident(null)}>
              <Icon
                name="close"
                color="rgb(253, 128, 3)"
                size={24}
              />
            </TouchableOpacity>
          </View>
        )
      }

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
            <Button mode="contained" style={styles.button} onPress={saveEditedComment}>
              Salvar Alterações
            </Button>
            <TouchableOpacity style={styles.closeButton} onPress={() => setEditingComment(null)}>
              <Icon
                name="close"
                color="rgb(253, 128, 3)"
                size={24}
              />
            </TouchableOpacity>
          </View>
        )
      }
      {/* Formulário de Comentário */}
      {selectedIncident && (
      <FormCommentIncident
        idIncident={selectedIncident.id}
        onClose={handleCloseForm}
        onCommentAdded={(newComment) => {
          setComments((prevComments) => {
            const updatedComments = { ...prevComments };
            
            // Obtem a lista de comentários atual para o incidente
            const existingComments = updatedComments[selectedIncident.id] || [];

            // Verifica se o comentário já existe
            const isDuplicate = existingComments.some((comment) => comment.id === newComment.id);

            if (!isDuplicate) {
              updatedComments[selectedIncident.id] = [...existingComments, newComment];
            }

            return updatedComments;
          });
        }}
      />
    )}

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  address: {
    top: -25,
    right:-48,
    fontSize: 12,
  },
  menuTriggerContainer: {
    padding: 10, // Aumenta a área de clique
    alignItems: 'center', // Centraliza o texto na área de clique
    justifyContent: 'center',
  },
  closeButton: {
    position: "absolute",
    right: 25,
    top: 15,
  },
  headerTitle: {
    padding: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  flexDirectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  postCard: {
    margin: 10,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    marginRight: 10,
    backgroundColor: "#6200ee",
  },
  postDate: {
    fontSize: 12,
    color: "#888",
  },
  button: {
    backgroundColor: "rgb(253, 128, 3)",
    marginVertical: 20,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postDescription: {
    marginVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  commentsTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "bold",
    color: "#888",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 2,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    position: 'relative', // Adicionado para posicionamento absoluto do menu
  },
  commentAvatar: {
    marginRight: 10,
    backgroundColor: "#03a9f4",
  },
  commentContent: {
    flex: 1,
    // Para garantir que o conteúdo não fique atrás do menu
    paddingRight: 30, // Ajuste conforme necessário
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
  menuTrigger: {
    fontSize: 20,
    color: "#000",
    marginLeft:285,
    top: 15,
    textAlign: "center",
  },
  menuPost: {
    marginLeft:185,
    marginTop: 50,
    textAlign: "center",

  },
  noCommentsText: {
    fontSize: 14,
    color: "#888",
  },
  commentButton: {
    marginTop: 10,
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
  editFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
  },
  input: {
    backgroundColor: '#f6f6f6',
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
});

export default Timeline;
