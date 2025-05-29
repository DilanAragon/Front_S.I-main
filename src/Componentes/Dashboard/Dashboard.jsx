import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Importar las funciones de exportación
import {
  downloadCSV,
  downloadExcel,
  downloadPDF,
  importFromCSV,
} from "./exportUtils";

// Importa el CSS del dashboard
import "./dashboard.css"; // Asegúrate de que la ruta sea correcta

const API_URL =
  import.meta.env.VITE_API_URL || "https://sistemas-back.onrender.com";

const Dashboard = () => {
  const [estadisticas, setEstadisticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/estadisticas`);
        const data = await response.json();
        setEstadisticas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
        setLoading(false);
      }
    };
    cargarEstadisticas();
  }, []);

  // Función helper para obtener valor por categoría
  const getValueByCategory = (categoria) => {
    const item = estadisticas.find((stat) => stat.categoria === categoria);
    return item ? parseInt(item.value) : 0;
  };

  // Funciones de exportación
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      await downloadCSV(estadisticas, `dashboard_estadisticas_${timestamp}`);
      console.log("CSV exportado correctamente");
    } catch (error) {
      console.error("Error al exportar CSV:", error);
      alert("Error al exportar CSV: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      await downloadExcel(estadisticas, `dashboard_estadisticas_${timestamp}`);
      console.log("Excel exportado correctamente");
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      alert("Error al exportar Excel: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      await downloadPDF(estadisticas, `dashboard_estadisticas_${timestamp}`);
      console.log("PDF exportado correctamente");
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Error al exportar PDF: " + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Función para importar datos
  const handleImportData = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setIsExporting(true);
      importFromCSV(file, (importedData) => {
        if (importedData.length > 0) {
          // Actualizar estadísticas con los datos importados
          const updatedStats = [...estadisticas];
          importedData.forEach((imported) => {
            const existingIndex = updatedStats.findIndex(
              (stat) => stat.categoria === imported.categoria
            );
            if (existingIndex >= 0) {
              updatedStats[existingIndex].value = imported.value;
            } else {
              updatedStats.push(imported);
            }
          });
          setEstadisticas(updatedStats);
          alert(`Se importaron ${importedData.length} registros correctamente`);
        } else {
          alert("No se encontraron datos válidos en el archivo CSV");
        }
        setIsExporting(false);
      });
    } else {
      alert("Por favor selecciona un archivo CSV válido");
    }
    // Limpiar el input
    event.target.value = "";
  };

  // Datos para gráficos
  const proyectosData = [
    { name: "Proyectos", value: getValueByCategory("Proyectos") },
    { name: "Eventos", value: getValueByCategory("Eventos") },
    { name: "Talleres", value: getValueByCategory("Talleres") },
    { name: "Charlas", value: getValueByCategory("Charlas") },
  ];

  const participacionData = [
    { name: "Participantes", value: getValueByCategory("Participantes") },
    { name: "Beneficiarios", value: getValueByCategory("Beneficiarios") },
    { name: "Capacitados", value: getValueByCategory("Capacitados") },
    { name: "Jóvenes", value: getValueByCategory("Jovenes") },
  ];

  const alianzasData = [
    { name: "Alianzas", value: getValueByCategory("Alianzas") },
    { name: "Clientes", value: getValueByCategory("Clientes") },
    { name: "Patrocinadores", value: getValueByCategory("Patrocinadores") },
    { name: "Países", value: getValueByCategory("Países") },
  ];

  const demograficosData = [
    { name: "Mujeres", value: getValueByCategory("Mujeres"), color: "#FDD835" },
    {
      name: "Hombres",
      value: 100 - getValueByCategory("Mujeres"),
      color: "#388E3C",
    },
  ];

  const modalidadData = [
    {
      name: "Presencial",
      value: getValueByCategory("Presencial"),
      color: "#388E3C",
    },
    { name: "Virtual", value: getValueByCategory("Virtual"), color: "#FDD835" },
    { name: "Mixto", value: getValueByCategory("Mixto"), color: "#52C55A" },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // Componente de tarjeta estadística
  const DashboardStatsCard = ({
    title,
    value,
    icon,
    color = "#4CAF50",
    colorClass = "",
  }) => (
    <div
      className={`dashboard-stats-card ${
        colorClass ? `dashboard-card-${colorClass}` : ""
      }`}
    >
      <div className="dashboard-stats-card-content">
        <div className="dashboard-stats-card-info">
          <h4>{title}</h4>
          <div className="dashboard-stats-card-value">{value}</div>
        </div>
        <div className="dashboard-stats-card-icon" style={{ color }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="dashboard-loading-state">
          <div className="dashboard-loading-spinner"></div>
          <div>Cargando datos...</div>
        </div>
      );
    }

    switch (activeTab) {
      case "general":
        return (
          <div className="dashboard-fade-in">
            {/* Tarjetas principales */}
            <div className="dashboard-stats-grid">
              <DashboardStatsCard
                title="Proyectos"
                value={getValueByCategory("Proyectos")}
                icon="📊"
                color="#4CAF50"
              />
              <DashboardStatsCard
                title="Beneficiarios"
                value={getValueByCategory("Beneficiarios").toLocaleString()}
                icon="👥"
                color="#2196F3"
                colorClass="blue"
              />
              <DashboardStatsCard
                title="Satisfacción"
                value={`${getValueByCategory("Satisfacción")}%`}
                icon="⭐"
                color="#FF9800"
                colorClass="orange"
              />
              <DashboardStatsCard
                title="Metas Cumplidas"
                value={`${getValueByCategory("Metas")}%`}
                icon="🎯"
                color="#9C27B0"
                colorClass="purple"
              />
            </div>

            {/* Gráficos principales */}
            <div className="dashboard-charts-grid">
              <div className="dashboard-chart-container">
                <h3 className="dashboard-chart-title">
                  Actividades del Programa
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={proyectosData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="dashboard-chart-container">
                <h3 className="dashboard-chart-title">
                  Distribución por Modalidad
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={modalidadData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#388E3C"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {modalidadData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Indicadores adicionales */}
            <div className="dashboard-indicators-grid">
              <div className="dashboard-indicator-card">
                <h4 className="dashboard-indicator-title">Alcance Digital</h4>
                <div className="dashboard-indicator-value">
                  {getValueByCategory("RedesSociales").toLocaleString()}
                </div>
                <div className="dashboard-indicator-description">
                  Seguidores en redes sociales
                </div>
              </div>
              <div className="dashboard-indicator-card">
                <h4 className="dashboard-indicator-title">
                  Horas de Formación
                </h4>
                <div className="dashboard-indicator-value">
                  {getValueByCategory("HorasFormación")}
                </div>
                <div className="dashboard-indicator-description">
                  Total de horas capacitación
                </div>
              </div>
              <div className="dashboard-indicator-card">
                <h4 className="dashboard-indicator-title">Financiamiento</h4>
                <div className="dashboard-indicator-value">
                  ${getValueByCategory("Financiamiento").toLocaleString()}
                </div>
                <div className="dashboard-indicator-description">
                  Monto recaudado USD
                </div>
              </div>
            </div>
          </div>
        );

      case "participacion":
        return (
          <div className="dashboard-fade-in">
            <div className="dashboard-stats-grid">
              <DashboardStatsCard
                title="Total Participantes"
                value={getValueByCategory("Participantes").toLocaleString()}
                icon="👥"
                color="#2196F3"
                colorClass="blue"
              />
              <DashboardStatsCard
                title="Capacitados"
                value={getValueByCategory("Capacitados")}
                icon="🎓"
                color="#4CAF50"
              />
              <DashboardStatsCard
                title="Jóvenes"
                value={getValueByCategory("Jovenes").toLocaleString()}
                icon="👨‍🎓"
                color="#FF9800"
                colorClass="orange"
              />
              <DashboardStatsCard
                title="Adultos Mayores"
                value={getValueByCategory("AdultosMayores")}
                icon="👴"
                color="#9C27B0"
                colorClass="purple"
              />
            </div>

            <div className="dashboard-charts-grid">
              <div className="dashboard-chart-container">
                <h3 className="dashboard-chart-title">
                  Participación por Género
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={demograficosData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {demograficosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="dashboard-chart-container">
                <h3 className="dashboard-chart-title">
                  Distribución de Participantes
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={participacionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-demographic-section">
              <h3 className="dashboard-demographic-title">
                Datos Demográficos
              </h3>
              <div className="dashboard-demographic-grid">
                <div>
                  <h4 className="dashboard-demographic-subtitle">
                    Por Ubicación
                  </h4>
                  <div className="dashboard-demographic-item">
                    <span className="dashboard-demographic-label">
                      Zona Rural:
                    </span>
                    <span className="dashboard-demographic-value">
                      {getValueByCategory("Rural")} proyectos
                    </span>
                  </div>
                  <div className="dashboard-demographic-item">
                    <span className="dashboard-demographic-label">
                      Zona Urbana:
                    </span>
                    <span className="dashboard-demographic-value">
                      {getValueByCategory("Urbano")} proyectos
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="dashboard-demographic-subtitle">
                    Comunidades
                  </h4>
                  <div className="dashboard-demographic-item">
                    <span className="dashboard-demographic-label">
                      Grupos Apoyados:
                    </span>
                    <span className="dashboard-demographic-value">
                      {getValueByCategory("Comunidades")}
                    </span>
                  </div>
                  <div className="dashboard-demographic-item">
                    <span className="dashboard-demographic-label">
                      Voluntarios:
                    </span>
                    <span className="dashboard-demographic-value">
                      {getValueByCategory("Voluntarios")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "alianzas":
        return (
          <div className="dashboard-fade-in">
            <div className="dashboard-stats-grid">
              <DashboardStatsCard
                title="Alianzas Estratégicas"
                value={getValueByCategory("Alianzas")}
                icon="🤝"
                color="#4CAF50"
              />
              <DashboardStatsCard
                title="Empresas Clientes"
                value={getValueByCategory("Clientes")}
                icon="🏢"
                color="#2196F3"
                colorClass="blue"
              />
              <DashboardStatsCard
                title="Patrocinadores"
                value={getValueByCategory("Patrocinadores")}
                icon="💼"
                color="#FF9800"
                colorClass="orange"
              />
              <DashboardStatsCard
                title="Presencia Internacional"
                value={`${getValueByCategory("Países")} países`}
                icon="🌍"
                color="#9C27B0"
                colorClass="purple"
              />
            </div>

            <div className="dashboard-charts-grid">
              <div className="dashboard-chart-container">
                <h3 className="dashboard-chart-title">Red de Alianzas</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={alianzasData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="dashboard-chart-container">
                <h3 className="dashboard-chart-title">
                  Indicadores de Gestión
                </h3>
                <div className="dashboard-management-indicators">
                  <div className="dashboard-management-item">
                    <span>Consultorias Brindadas:</span>
                    <span className="dashboard-management-value">
                      {getValueByCategory("Consultorias")}
                    </span>
                  </div>
                  <div className="dashboard-management-item">
                    <span>Donaciones Recibidas:</span>
                    <span className="dashboard-management-value">
                      {getValueByCategory("Donaciones")}
                    </span>
                  </div>
                  <div className="dashboard-management-item">
                    <span>Premios Obtenidos:</span>
                    <span className="dashboard-management-value">
                      {getValueByCategory("Premios")}
                    </span>
                  </div>
                  <div className="dashboard-management-item">
                    <span>Estudios de Caso:</span>
                    <span className="dashboard-management-value">
                      {getValueByCategory("EstudiosCaso")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-chart-container">
              <h3 className="dashboard-chart-title">Estadísticas Operativas</h3>
              <div className="dashboard-indicators-grid">
                <div className="dashboard-indicator-card">
                  <div className="dashboard-indicator-value">
                    {getValueByCategory("Reuniones")}
                  </div>
                  <div className="dashboard-indicator-description">
                    Reuniones Anuales
                  </div>
                </div>
                <div className="dashboard-indicator-card">
                  <div className="dashboard-indicator-value">
                    {getValueByCategory("Propuestas")}
                  </div>
                  <div className="dashboard-indicator-description">
                    Propuestas Presentadas
                  </div>
                </div>
                <div className="dashboard-indicator-card">
                  <div className="dashboard-indicator-value">
                    {getValueByCategory("Colaboradores")}
                  </div>
                  <div className="dashboard-indicator-description">
                    Colaboradores
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "innovacion":
        return (
          <div className="dashboard-fade-in">
            <div className="dashboard-stats-grid">
              <DashboardStatsCard
                title="Proyectos Innovadores"
                value={getValueByCategory("Innovacion")}
                icon="💡"
                color="#4CAF50"
              />
              <DashboardStatsCard
                title="Aplicaciones Desarrolladas"
                value={getValueByCategory("Aplicaciones")}
                icon="📱"
                color="#2196F3"
                colorClass="blue"
              />
              <DashboardStatsCard
                title="Tecnologías Aplicadas"
                value={getValueByCategory("Tics")}
                icon="💻"
                color="#FF9800"
                colorClass="orange"
              />
              <DashboardStatsCard
                title="Sostenibilidad"
                value={getValueByCategory("Sostenibilidad")}
                icon="🌱"
                color="#4CAF50"
              />
            </div>

            <div className="dashboard-charts-grid">
              <div className="dashboard-chart-container">
                <h3 className="dashboard-chart-title">
                  Publicaciones y Materiales
                </h3>
                <div className="dashboard-indicators-grid">
                  <div className="dashboard-indicator-card">
                    <div className="dashboard-indicator-title">
                      Publicaciones
                    </div>
                    <div className="dashboard-indicator-value">
                      {getValueByCategory("Publicaciones")}
                    </div>
                    <div className="dashboard-indicator-description">
                      Artículos e informes
                    </div>
                  </div>
                  <div className="dashboard-indicator-card">
                    <div className="dashboard-indicator-title">
                      Materiales Educativos
                    </div>
                    <div className="dashboard-indicator-value">
                      {getValueByCategory("Materiales")}
                    </div>
                    <div className="dashboard-indicator-description">
                      Recursos creados
                    </div>
                  </div>
                  <div className="dashboard-indicator-card">
                    <div className="dashboard-indicator-title">Testimonios</div>
                    <div className="dashboard-indicator-value">
                      {getValueByCategory("Testimonios")}
                    </div>
                    <div className="dashboard-indicator-description">
                      Experiencias compartidas
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-chart-container">
                <h3 className="dashboard-chart-title">
                  Participación en Eventos
                </h3>
                <div className="dashboard-indicators-grid">
                  <div className="dashboard-indicator-card">
                    <div className="dashboard-indicator-title">Ferias</div>
                    <div className="dashboard-indicator-value">
                      {getValueByCategory("Ferias")}
                    </div>
                    <div className="dashboard-indicator-description">
                      Eventos de exposición
                    </div>
                  </div>
                  <div className="dashboard-indicator-card">
                    <div className="dashboard-indicator-title">
                      Diagnósticos
                    </div>
                    <div className="dashboard-indicator-value">
                      {getValueByCategory("Diagnosticos")}
                    </div>
                    <div className="dashboard-indicator-description">
                      Estudios realizados
                    </div>
                  </div>
                  <div className="dashboard-indicator-card">
                    <div className="dashboard-indicator-title">
                      Practicantes
                    </div>
                    <div className="dashboard-indicator-value">
                      {getValueByCategory("Practicantes")}
                    </div>
                    <div className="dashboard-indicator-description">
                      Estudiantes en pasantías
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-chart-container">
              <h3 className="dashboard-chart-title">Métricas de Calidad</h3>
              <div className="dashboard-quality-metrics">
                <div
                  className="dashboard-quality-metric"
                  style={{
                    background: "linear-gradient(135deg, #2196F3, #1976D2)",
                  }}
                >
                  <div className="dashboard-quality-metric-value">
                    {getValueByCategory("Encuestas")}
                  </div>
                  <div className="dashboard-quality-metric-label">
                    Encuestas Realizadas
                  </div>
                </div>
                <div
                  className="dashboard-quality-metric"
                  style={{
                    background: "linear-gradient(135deg, #4CAF50, #388E3C)",
                  }}
                >
                  <div className="dashboard-quality-metric-value">
                    {getValueByCategory("Solicitudes")}
                  </div>
                  <div className="dashboard-quality-metric-label">
                    Solicitudes Atendidas
                  </div>
                </div>
                <div
                  className="dashboard-quality-metric"
                  style={{
                    background: "linear-gradient(135deg, #9C27B0, #7B1FA2)",
                  }}
                >
                  <div className="dashboard-quality-metric-value">
                    {getValueByCategory("Indicadores")}
                  </div>
                  <div className="dashboard-quality-metric-label">
                    Indicadores Monitoreados
                  </div>
                </div>
                <div
                  className="dashboard-quality-metric"
                  style={{
                    background: "linear-gradient(135deg, #FF9800, #F57C00)",
                  }}
                >
                  <div className="dashboard-quality-metric-value">
                    {getValueByCategory("VisitasWeb").toLocaleString()}
                  </div>
                  <div className="dashboard-quality-metric-label">
                    Visitas Web
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-main-container">
      {/* Header */}
      <header className="dashboard-main-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-main-title">Dashboard Analítico</h1>
          <p className="dashboard-main-subtitle">
            Sistema Integrado de Visibilidad y Vinculación Externa - Programa de
            Ingeniería de Sistemas
          </p>
          <p className="dashboard-institution-name">
            Universidad Popular del Cesar
          </p>

          {/* Botones de exportación */}
          <div className="dashboard-export-buttons">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              style={{ display: "none" }}
            />
            <button
              className="dashboard-export-btn"
              onClick={handleImportData}
              disabled={isExporting}
            >
              {isExporting ? "⏳ Procesando..." : "📥 Importar CSV"}
            </button>
            <button
              className="dashboard-export-btn"
              onClick={handleExportCSV}
              disabled={isExporting}
            >
              {isExporting ? "⏳ Exportando..." : "📄 Exportar CSV"}
            </button>
            <button
              className="dashboard-export-btn"
              onClick={handleExportExcel}
              disabled={isExporting}
            >
              {isExporting ? "⏳ Exportando..." : "📊 Exportar Excel"}
            </button>
            <button
              className="dashboard-export-btn"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? "⏳ Exportando..." : "📋 Exportar PDF"}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="dashboard-navigation">
        <div className="dashboard-nav-container">
          <nav className="dashboard-nav-tabs">
            {[
              { id: "general", label: "General" },
              { id: "participacion", label: "Participación" },
              { id: "alianzas", label: "Alianzas" },
              { id: "innovacion", label: "Innovación" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`dashboard-nav-tab ${
                  activeTab === tab.id ? "dashboard-tab-active" : ""
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-main-content">{renderTabContent()}</main>
    </div>
  );
};

export default Dashboard;
