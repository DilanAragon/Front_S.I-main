// PieChart.jsx
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Colores más distintivos como en la imagen de referencia
const COLORS = [
  "#f4e242", // Amarillo brillante
  "#4a9d5c", // Verde
  "#36a9e1", // Azul claro
  "#aad576", // Verde claro
  "#ff7e50", // Naranja
  "#9c59b6", // Morado
];

// Componente de tooltip personalizado para imitar el estilo de la imagen
const CustomTooltip = ({ active, payload, data }) => {
  if (active && payload && payload.length) {
    const item = payload[0];

    // Calcular el porcentaje
    const allData = item.payload.payload.chart;
    const total = allData
      ? allData.reduce((sum, d) => sum + d.value, 0)
      : data
      ? data.reduce((sum, d) => sum + d.value, 0)
      : 0;

    const percent = total > 0 ? ((item.value / total) * 100).toFixed(2) : 0;

    return (
      <div
        style={{
          backgroundColor: "#333",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "4px",
          border: "none",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        }}
      >
        <p style={{ margin: "0", fontWeight: "bold" }}>{item.name}</p>
        <p style={{ margin: "0" }}>
          {item.value} ({percent}%)
        </p>
      </div>
    );
  }
  return null;
};

const PieChart = ({ data }) => {
  // Agregar una referencia al dataset completo para el cálculo de porcentajes
  const chartData = data.map((item) => ({ ...item, chart: data }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          // Sin etiquetas en el gráfico para evitar superposición
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip data={data} />} />
        <Legend
          layout="horizontal"
          verticalAlign="top"
          align="center"
          iconType="rect"
          wrapperStyle={{ paddingBottom: "20px" }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
