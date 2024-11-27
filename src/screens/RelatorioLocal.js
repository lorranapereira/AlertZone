import React, { useState } from "react";
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Card, Text, Button, TextInput,IconButton } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import { format } from "date-fns";

const RelatorioLocal = ({ navigation }) => {
  // Dados do gráfico
  const [data, setData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Meses
    datasets: [
      {
        data: [23, 45, 28, 80, 99, 43], // Quantidade de incidentes por mês
      },
    ],
  });

  // Dados da tabela
  const [tableData, setTableData] = useState([
    { bairro: "Bairro 1", quantidade: 23 },
    { bairro: "Bairro 2", quantidade: 10 },
    { bairro: "Bairro 3", quantidade: 15 },
  ]);

  // Filtro de datas
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    // Implementar lógica de filtragem por data
    console.log(`Filtrando entre ${startDate} e ${endDate}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <IconButton icon="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Relatório - Rio Grande - RS</Text>
      {/* Filtro por Data */}
      <View style={styles.filterContainer}>
        <TextInput
          label="Data Inicial"
          value={startDate}
          onChangeText={setStartDate}
          style={styles.input}
          mode="outlined"
          placeholder="YYYY-MM-DD"
        />
        <TextInput
          label="Data Final"
          value={endDate}
          onChangeText={setEndDate}
          style={styles.input}
          mode="outlined"
          placeholder="YYYY-MM-DD"
        />
        <Button mode="contained" onPress={handleFilter} style={styles.filterButton}>
          Filtrar
        </Button>
      </View>

      {/* Gráfico de Barras */}
      <BarChart
        data={data}
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
          <Text style={styles.headerCell}>Bairro</Text>
          <Text style={styles.headerCell}>Quantidade Incidentes</Text>
        </View>
        <FlatList
          data={tableData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.rowCell}>{item.bairro}</Text>
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
    marginVertical: 30,
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

export default RelatorioLocal;
