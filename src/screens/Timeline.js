import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Card, Avatar, Menu } from "react-native-paper";
import { fetchIncidents, deleteIncident, updateIncident } from "../services/incidentService"; // Importa o getComments correto
import { updateComment, getComments, deleteComment } from "../services/commentService"; // Importa o getComments correto
import FormCommentIncident from "../components/FormCommentIncident";
import { TextInput } from "react-native-paper";

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

  // Fetch initial data
  useEffect(() => {
    const getIncidents = async () => {
      try {
        const data = await fetchIncidents();
        setIncidents(data);

        // Fetch comments for each incident
        const commentsData = {};
        for (const incident of data) {
          const incidentComments = await getComments(incident.id);
          commentsData[incident.id] = incidentComments;
        }
        setComments(commentsData);
      } catch (error) {
        console.error("Erro ao carregar incidentes: ", error);
      }
    };

    getIncidents();
  }, []);

  // Toggle menu visibility
  const toggleMenu = (id) => {
    setMenuVisible((prev) => ({ 
      ...prev,
      [id]: !prev[id],
    }));
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
      <Text style={styles.headerTitle}>Alertas!</Text>

      <ScrollView>
        {incidents.map((incident) => (
          <Card style={styles.postCard} key={incident.id}>
            <Card.Content>
              <View style={styles.postHeader}>
                <Avatar.Icon size={40} icon="alert" style={styles.avatar} />
                <Text style={styles.postDate}>
                  {new Date(incident.createdAt).toLocaleString()}
                </Text>
                <Menu
                  visible={menuVisible[incident.id] || false}
                  onDismiss={() => toggleMenu(incident.id)}
                  anchor={
                    <TouchableOpacity onPress={() => toggleMenu(incident.id)}>
                      <Text style={styles.menuTrigger}>...</Text>
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item onPress={() => onDeleteIncident(incident.id)} title="Excluir" />
                  <Menu.Item onPress={() => startEditing(incident)} title="Editar" />
                </Menu>
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
                        {new Date(comment.createdAt).toLocaleString()}
                      </Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
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
                      <Menu.Item
                        onPress={() => startEditingComment(comment)}
                        title="Editar"
                      />
                    </Menu>
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
            <Button mode="contained" onPress={saveEditedIncident}>
              Salvar Alterações do alerta
            </Button>
            <Button mode="text" onPress={() => setEditingIncident(null)}>
              Cancelar
            </Button>
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
            <Button mode="contained" onPress={saveEditedComment}>
              Salvar Alterações
            </Button>
            <Button mode="text" onPress={() => setEditingComment(null)}>
              Cancelar
            </Button>
          </View>
        )
      }
      {/* Formulário de Comentário */}
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
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTitle: {
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
    fontSize: 16,
    fontWeight: "bold",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  commentAvatar: {
    marginRight: 10,
    backgroundColor: "#03a9f4",
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
  menuTrigger: {
    fontSize: 18,
    color: "#000",
    marginLeft: 10,
  },
  noCommentsText: {
    fontSize: 14,
    color: "#888",
  },
  commentButton: {
    marginTop: 10,
  },
});

export default Timeline;
