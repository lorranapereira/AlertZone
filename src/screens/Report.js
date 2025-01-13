import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Card, Text, Button, IconButton, Menu } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import { getMonthlyIncidents, getIncidentsByLocation, getDistinctYears } from "../services/incidentService";

const Report = ({ navigation }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [tableData, setTableData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetchAvailableYears();
    fetchIncidentData(selectedYear);
  }, [selectedYear]);


  const fetchAvailableYears = async () => {
    try {
      const distinctYears = await getDistinctYears();
      setYears(distinctYears);
  
      // Só define o ano inicial se `selectedYear` ainda não estiver definido
      if (distinctYears.length > 0 && !years.length) {
        setSelectedYear(distinctYears[0]); // Define o primeiro ano como padrão apenas na inicialização
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
  
      // Busca incidentes por localização, filtrados pelo ano
      const locationData = await getIncidentsByLocation(year);
  
      // Formata dados do gráfico
      const months = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez",
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
        <Text style={styles.textYear}>Selecione o ano</Text>
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
                setSelectedYear(year); // Atualiza o ano selecionado
                setMenuVisible(false); // Fecha o menu
              }}
              title={year.toString()}
            />
          ))}
        </Menu>
      </View>
      <Text  style={[styles.axisLabel, { position: "absolute",left: -10, top: 250, transform: [{ rotate: "270deg" }], },]} >
        Total de Incidentes
      </Text>
      <BarChart
        data={chartData}
        width={335 } // Largura da tela com margem
        height={250} // Altura ajustada
        yAxisLabel=""
        chartConfig={{
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          barPercentage: 0.3, // Largura das barras ajustada
          propsForLabels: {
            fontSize: 10, // Tamanho das etiquetas
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          right:-20,
        }}
      />
    <Text style={[styles.axisLabel, { textAlign: "center", marginTop: -20 }]}>
      Meses do Ano
    </Text>

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
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingHorizontal: 10 },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#001f4d", paddingTop: 35 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 25 },
  filterContainer: { paddingTop:20, flexDirection: "row", verticalAlign: "center"},
  yearSelector: { width: 100, height:40, marginBottom: 5 },
  tableCard: { marginTop: 20, padding: 10, borderRadius: 10, elevation: 2 },
  tableHeader: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#ddd", padding: 10, borderRadius: 5 },
  headerCell: { fontWeight: "bold", fontSize: 14 },
  tableRow: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  rowCell: { fontSize: 14 },
  textYear: {fontSize:18, top:10, marginEnd: 10,},
  axisLabel: {fontSize: 14, zIndex:1,elevation:1},
  
});

export default Report;
