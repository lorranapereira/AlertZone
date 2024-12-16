import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Card, Text, Button, IconButton, Menu } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import { getMonthlyIncidents, getIncidentsByLocation, getDistinctYears } from "../services/incidentService";

const RelatorioGeral = ({ navigation }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [tableData, setTableData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetchAvailableYears();
    fetchIncidentData(selectedYear);
  }, [selectedYear]);

  // Busca os anos distintos na coleção "incidents"
  const fetchAvailableYears = async () => {
    try {
      const distinctYears = await getDistinctYears();
      setYears(distinctYears);
      if (distinctYears.length > 0) {
        setSelectedYear(distinctYears[0]); // Define o primeiro ano como selecionado por padrão
      }
    } catch (error) {
      console.error("Erro ao buscar anos disponíveis:", error.message);
    }
  };

  // Busca os dados iniciais com base no ano selecionado
  const fetchIncidentData = async (year) => {
    try {
      // Busca incidentes por mês
      const monthlyData = await getMonthlyIncidents(year);

      // Busca incidentes por localização
      const locationData = await getIncidentsByLocation();

      // Formata dados do gráfico
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const formattedChartData = {
        labels: months,
        datasets: [
          { data: months.map((_, index) => monthlyData[index] || 0) },
        ],
      };

      // Formata dados da tabela
      const formattedTableData = locationData.map((item) => ({
        estado: `${item.city}/${item.state}`,
        quantidade: item.totalIncidentes,
      }));

      setChartData(formattedChartData);
      setTableData(formattedTableData);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatório Geral Brasil</Text>

      {/* Seletor de Ano */}
      <View style={styles.filterContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.yearSelector}
            >
              {selectedYear}
            </Button>
          }
        >
          {years.map((year) => (
            <Menu.Item
              key={year}
              onPress={() => {
                setSelectedYear(year);
                setMenuVisible(false);
              }}
              title={year.toString()}
            />
          ))}
        </Menu>
      </View>

      {/* Gráfico de Barras */}
      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 20}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      {/* Tabela */}
      <Card style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Localização</Text>
          <Text style={styles.headerCell}>Incidentes</Text>
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
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#001f4d", paddingTop: 35 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 25 },
  filterContainer: { padding: 20, alignItems: "center" },
  yearSelector: { width: 150, marginBottom: 15 },
  tableCard: { marginTop: 20, padding: 10, borderRadius: 10, elevation: 2 },
  tableHeader: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#ddd", padding: 10, borderRadius: 5 },
  headerCell: { fontWeight: "bold", fontSize: 14 },
  tableRow: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  rowCell: { fontSize: 14 },
});

export default RelatorioGeral;
