import React from "react";
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Card, Text, Button, Avatar, IconButton } from "react-native-paper";

const Timeline = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <IconButton icon="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.flexDirectionRow}>
        <Text style={styles.headerTitle}>Alertas!</Text>
        <Button mode="outlined" style={styles.createButton}>
          Criar novo
        </Button>
      </View>

      {/* Timeline */}
      <ScrollView>
        {/* Post */}
        <Card style={styles.postCard}>
          <Card.Content>
            <Text style={styles.postDate}>Hoje às 10:30</Text>
            <Text style={styles.postTitle}>Acabei de ser assaltada</Text>
            <Text style={styles.postDescription}>
              Hoje foi um dia que certamente não esquecerei tão cedo. Enquanto caminhava pelas movimentadas ruas do centro da cidade, subitamente me vi envolvida em uma situação que me deixou completamente atordoada.
            </Text>
            <Text style={styles.commentCount}>2 Comentários</Text>
            <Button mode="contained" style={styles.commentButton}>
              Comentar
            </Button>
          </Card.Content>

          {/* Comments */}
          <Card style={styles.commentCard}>
            <Card.Content style={styles.commentContent}>
              <Avatar.Text size={32} label="A" style={styles.avatar} />
              <View>
                <Text style={styles.commentDate}>Hoje às 10:30</Text>
                <Text style={styles.commentText}>
                  Hoje foi um dia que certamente não esquecerei tão cedo.
                </Text>
              </View>
              {/* <IconButton icon="dots-horizontal" size={20} /> */}
            </Card.Content>
          </Card>

          <Card style={styles.commentCard}>
            <Card.Content style={styles.commentContent}>
              <Avatar.Text size={32} label="B" style={styles.avatar} />
              <View>
                <Text style={styles.commentDate}>Hoje às 10:30</Text>
                <Text style={styles.commentText}>
                  Hoje foi um dia que certamente não esquecerei tão cedo.
                </Text>
              </View>
              {/* <IconButton icon="dots-horizontal" size={20} /> */}
            </Card.Content>
          </Card>
        </Card>
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.commentInputContainer}>
        <TextInput placeholder="Título" style={styles.input} />
        <TextInput placeholder="Descrição" style={styles.input} />
        <Button mode="contained" icon="send" style={styles.sendButton}></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#001f4d",
    paddingTop: 35,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginVertical: 10,
    marginLeft: 20,
  },
  createButton: {
    width: 180,
    borderRadius: 5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  postCard: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  postDate: {
    fontSize: 12,
    color: "#888",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  postDescription: {
    fontSize: 14,
    marginVertical: 10,
    color: "#555",
  },
  commentCount: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  commentButton: {
    alignSelf: "flex-start",
    borderRadius: 5,
  },
  commentCard: {
    marginBottom: 5,
    padding: 10,
    borderRadius: 10,
    elevation: 0, 
    shadowOpacity: 0,
    shadowColor: 'transparent',
    
  },
  commentContent: {
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    marginRight: 30,
  },
  avatar: {
    marginRight: 10,
  },
  commentDate: {
    fontSize: 12,
    color: "#888",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  sendButton: {
    borderRadius: 5,
  },

  flexDirectionRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default Timeline;
