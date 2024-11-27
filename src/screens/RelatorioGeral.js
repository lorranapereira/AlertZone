import React from "react";
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Card, Text, Button, TextInput, IconButton } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";

const RelatorioGeral = ({ navigation }) => {
  // Dados do gráfico
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Meses
    datasets: [
      {
        data: [500, 700, 800, 650, 900, 1200], // Quantidade de incidentes por mês
      },
    ],
  };

  // Dados da tabela
  const tableData = [
    { estado: "Rio Grande do Sul", quantidade: 350 },
    { estado: "Santa Catarina", quantidade: 270 },
    { estado: "Paraná", quantidade: 400 },
    { estado: "São Paulo", quantidade: 1200 },
    { estado: "Rio de Janeiro", quantidade: 980 },
  ];

  const handleFilter = () => {
    // Lógica de filtragem futura
    console.log("Filtragem realizada");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <IconButton icon="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Relatório Geral Brasil</Text>
      {/* Filtro por Data */}
      <View style={styles.filterContainer}>
        <TextInput
          label="Data Inicial"
          placeholder="YYYY-MM-DD"
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Data Final"
          placeholder="YYYY-MM-DD"
          style={styles.input}
          mode="outlined"
        />
        <Button mode="contained" onPress={handleFilter} style={styles.filterButton}>
          Filtrar
        </Button>
      </View>

      {/* Gráfico de Barras */}
      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 20} // Largura do gráfico
        height={220} // Altura do gráfico
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      {/* Tabela */}
      <Card style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Estado</Text>
          <Text style={styles.headerCell}>Quantidade Incidentes</Text>
        </View>
        <FlatList
          data={tableData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.rowCell}>{item.estado}</Text>
              <Text style={styles.rowCell}>{item.quantidade}</Text>
            </View>
          )}
        />
      </Card>
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
    alignItems: "center",
    backgroundColor: "#001f4d",
    paddingTop: 35,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 25,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 20,

  },
  input: {
    flex: 1,
    marginRight: 5,
  },
  filterButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  tableCard: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowCell: {
    fontSize: 14,
  },
});

export default RelatorioGeral;
