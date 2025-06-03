import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Importar las funciones de exportación
import {
  downloadCSV,
  downloadExcel,
  downloadPDF,
  importFromCSV,
} from "./exportUtils";

import "./dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://sistemas-back.onrender.com";

// Colores para gráficos
const CHART_COLORS = {
  primary: "#4CAF50",
  secondary: "#2196F3",
  tertiary: "#FF9800",
  quaternary: "#9C27B0",
  pie: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"],
};

const Dashboard = () => {
  const [estadisticas, setEstadisticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);

  // Función helper optimizada para obtener valor por categoría
  const getValueByCategory = useMemo(() => {
    const statsMap = new Map(
      estadisticas.map((stat) => [stat.categoria, parseInt(stat.value) || 0])
    );
    return (categoria) => statsMap.get(categoria) || 0;
  }, [estadisticas]);

  // Variables de datos que realmente se usan en el dashboard
  const dataVariables = useMemo(
    () => ({
      // Pestaña General - Tarjetas principales
      proyectos: getValueByCategory("Proyectos"),
      beneficiarios: getValueByCategory("Beneficiarios"),
      satisfaccion: getValueByCategory("Satisfacción"),
      metas: getValueByCategory("Metas"),

      // Pestaña General - Gráfico actividades
      eventos: getValueByCategory("Eventos"),
      talleres: getValueByCategory("Talleres"),
      charlas: getValueByCategory("Charlas"),

      // Pestaña General - Gráfico modalidad
      presencial: getValueByCategory("Presencial"),
      virtual: getValueByCategory("Virtual"),
      mixto: getValueByCategory("Mixto"),

      // Pestaña General - Indicadores adicionales
      redesSociales: getValueByCategory("RedesSociales"),
      horasFormacion: getValueByCategory("HorasFormación"),
      financiamiento: getValueByCategory("Financiamiento"),

      // Pestaña Participación - Tarjetas
      participantes: getValueByCategory("Participantes"),
      capacitados: getValueByCategory("Capacitados"),
      jovenes: getValueByCategory("Jovenes"),
      adultosMayores: getValueByCategory("AdultosMayores"),

      // Pestaña Participación - Demografía
      mujeres: getValueByCategory("Mujeres"),
      rural: getValueByCategory("Rural"),
      urbano: getValueByCategory("Urbano"),
      comunidades: getValueByCategory("Comunidades"),
      voluntarios: getValueByCategory("Voluntarios"),

      // Pestaña Alianzas - Tarjetas
      alianzas: getValueByCategory("Alianzas"),
      clientes: getValueByCategory("Clientes"),
      patrocinadores: getValueByCategory("Patrocinadores"),
      paises: getValueByCategory("Países"),

      // Pestaña Alianzas - Indicadores de gestión
      consultorias: getValueByCategory("Consultorias"),
      donaciones: getValueByCategory("Donaciones"),
      premios: getValueByCategory("Premios"),
      estudiosCaso: getValueByCategory("EstudiosCaso"),

      // Pestaña Alianzas - Estadísticas operativas
      reuniones: getValueByCategory("Reuniones"),
      propuestas: getValueByCategory("Propuestas"),
      colaboradores: getValueByCategory("Colaboradores"),

      // Pestaña Innovación - Tarjetas
      innovacion: getValueByCategory("Innovacion"),
      aplicaciones: getValueByCategory("Aplicaciones"),
      tics: getValueByCategory("Tics"),
      sostenibilidad: getValueByCategory("Sostenibilidad"),

      // Pestaña Innovación - Publicaciones y materiales
      publicaciones: getValueByCategory("Publicaciones"),
      materiales: getValueByCategory("Materiales"),
      testimonios: getValueByCategory("Testimonios"),

      // Pestaña Innovación - Participación en eventos
      ferias: getValueByCategory("Ferias"),
      diagnosticos: getValueByCategory("Diagnosticos"),
      practicantes: getValueByCategory("Practicantes"),

      // Pestaña Innovación - Métricas de calidad
      encuestas: getValueByCategory("Encuestas"),
      solicitudes: getValueByCategory("Solicitudes"),
      indicadores: getValueByCategory("Indicadores"),
      visitasWeb: getValueByCategory("VisitasWeb"),
    }),
    [getValueByCategory]
  );

  // Datos para gráficos optimizados
  const chartData = useMemo(
    () => ({
      proyectos: [
        { name: "Proyectos", value: dataVariables.proyectos },
        { name: "Eventos", value: dataVariables.eventos },
        { name: "Talleres", value: dataVariables.talleres },
        { name: "Charlas", value: dataVariables.charlas },
      ],
      participacion: [
        { name: "Participantes", value: dataVariables.participantes },
        { name: "Beneficiarios", value: dataVariables.beneficiarios },
        { name: "Capacitados", value: dataVariables.capacitados },
        { name: "Jóvenes", value: dataVariables.jovenes },
      ],
      alianzas: [
        { name: "Alianzas", value: dataVariables.alianzas },
        { name: "Clientes", value: dataVariables.clientes },
        { name: "Patrocinadores", value: dataVariables.patrocinadores },
        { name: "Países", value: dataVariables.paises },
      ],
      demograficos: [
        { name: "Mujeres", value: dataVariables.mujeres, color: "#FDD835" },
        {
          name: "Hombres",
          value: 100 - dataVariables.mujeres,
          color: "#388E3C",
        },
      ],
      modalidad: [
        {
          name: "Presencial",
          value: dataVariables.presencial,
          color: "#388E3C",
        },
        { name: "Virtual", value: dataVariables.virtual, color: "#FDD835" },
        { name: "Mixto", value: dataVariables.mixto, color: "#52C55A" },
      ],
    }),
    [dataVariables]
  );

  // Cargar estadísticas
  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/estadisticas`);
        const data = await response.json();
        setEstadisticas(data);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarEstadisticas();
  }, []);

  // Funciones de exportación optimizadas
  const handleExport = async (exportFunction, fileType) => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      await exportFunction(estadisticas, `dashboard_estadisticas_${timestamp}`);
      console.log(`${fileType} exportado correctamente`);
    } catch (error) {
      console.error(`Error al exportar ${fileType}:`, error);
      alert(`Error al exportar ${fileType}: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => handleExport(downloadCSV, "CSV");
  const handleExportExcel = () => handleExport(downloadExcel, "Excel");
  const handleExportPDF = () => handleExport(downloadPDF, "PDF");

  // Función para importar datos
  const handleImportData = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file?.type === "text/csv") {
      setIsExporting(true);
      importFromCSV(file, (importedData) => {
        if (importedData.length > 0) {
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
    event.target.value = "";
  };

  // Componente de tarjeta estadística optimizado
  const DashboardStatsCard = React.memo(
    ({ title, value, icon, color = CHART_COLORS.primary, colorClass = "" }) => (
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
    )
  );

  // Componente de gráfico de barras reutilizable
  const BarChartComponent = React.memo(({ data, title }) => (
    <div className="dashboard-chart-container">
      <h3 className="dashboard-chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={CHART_COLORS.primary} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  ));

  // Componente de gráfico de torta reutilizable
  const PieChartComponent = React.memo(({ data, title }) => (
    <div className="dashboard-chart-container">
      <h3 className="dashboard-chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
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
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.color ||
                  CHART_COLORS.pie[index % CHART_COLORS.pie.length]
                }
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  ));

  // Componente de indicador reutilizable
  const IndicatorCard = React.memo(({ title, value, description }) => (
    <div className="dashboard-indicator-card">
      <h4 className="dashboard-indicator-title">{title}</h4>
      <div className="dashboard-indicator-value">{value}</div>
      <div className="dashboard-indicator-description">{description}</div>
    </div>
  ));

  // Renderizado de contenido por pestañas optimizado
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="dashboard-loading-state">
          <div className="dashboard-loading-spinner"></div>
          <div>Cargando datos...</div>
        </div>
      );
    }

    const tabComponents = {
      general: (
        <div className="dashboard-fade-in">
          <div className="dashboard-stats-grid">
            <DashboardStatsCard
              title="Proyectos"
              value={dataVariables.proyectos}
              icon="📊"
            />
            <DashboardStatsCard
              title="Beneficiarios"
              value={dataVariables.beneficiarios.toLocaleString()}
              icon="👥"
              color={CHART_COLORS.secondary}
              colorClass="blue"
            />
            <DashboardStatsCard
              title="Satisfacción"
              value={`${dataVariables.satisfaccion}%`}
              icon="⭐"
              color={CHART_COLORS.tertiary}
              colorClass="orange"
            />
            <DashboardStatsCard
              title="Metas Cumplidas"
              value={`${dataVariables.metas}%`}
              icon="🎯"
              color={CHART_COLORS.quaternary}
              colorClass="purple"
            />
          </div>

          <div className="dashboard-charts-grid">
            <BarChartComponent
              data={chartData.proyectos}
              title="Actividades del Programa"
            />
            <PieChartComponent
              data={chartData.modalidad}
              title="Distribución por Modalidad"
            />
          </div>

          <div className="dashboard-indicators-grid">
            <IndicatorCard
              title="Alcance Digital"
              value={dataVariables.redesSociales.toLocaleString()}
              description="Seguidores en redes sociales"
            />
            <IndicatorCard
              title="Horas de Formación"
              value={dataVariables.horasFormacion}
              description="Total de horas capacitación"
            />
            <IndicatorCard
              title="Financiamiento"
              value={`$${dataVariables.financiamiento.toLocaleString()}`}
              description="Monto recaudado USD"
            />
          </div>
        </div>
      ),

      participacion: (
        <div className="dashboard-fade-in">
          <div className="dashboard-stats-grid">
            <DashboardStatsCard
              title="Total Participantes"
              value={dataVariables.participantes.toLocaleString()}
              icon="👥"
              color={CHART_COLORS.secondary}
              colorClass="blue"
            />
            <DashboardStatsCard
              title="Capacitados"
              value={dataVariables.capacitados}
              icon="🎓"
            />
            <DashboardStatsCard
              title="Jóvenes"
              value={dataVariables.jovenes.toLocaleString()}
              icon="👨‍🎓"
              color={CHART_COLORS.tertiary}
              colorClass="orange"
            />
            <DashboardStatsCard
              title="Adultos Mayores"
              value={dataVariables.adultosMayores}
              icon="👴"
              color={CHART_COLORS.quaternary}
              colorClass="purple"
            />
          </div>

          <div className="dashboard-charts-grid">
            <PieChartComponent
              data={chartData.demograficos}
              title="Participación por Género"
            />
            <BarChartComponent
              data={chartData.participacion}
              title="Distribución de Participantes"
            />
          </div>

          <div className="dashboard-demographic-section">
            <h3 className="dashboard-demographic-title">Datos Demográficos</h3>
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
                    {dataVariables.rural} proyectos
                  </span>
                </div>
                <div className="dashboard-demographic-item">
                  <span className="dashboard-demographic-label">
                    Zona Urbana:
                  </span>
                  <span className="dashboard-demographic-value">
                    {dataVariables.urbano} proyectos
                  </span>
                </div>
              </div>
              <div>
                <h4 className="dashboard-demographic-subtitle">Comunidades</h4>
                <div className="dashboard-demographic-item">
                  <span className="dashboard-demographic-label">
                    Grupos Apoyados:
                  </span>
                  <span className="dashboard-demographic-value">
                    {dataVariables.comunidades}
                  </span>
                </div>
                <div className="dashboard-demographic-item">
                  <span className="dashboard-demographic-label">
                    Voluntarios:
                  </span>
                  <span className="dashboard-demographic-value">
                    {dataVariables.voluntarios}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),

      alianzas: (
        <div className="dashboard-fade-in">
          <div className="dashboard-stats-grid">
            <DashboardStatsCard
              title="Alianzas Estratégicas"
              value={dataVariables.alianzas}
              icon="🤝"
            />
            <DashboardStatsCard
              title="Empresas Clientes"
              value={dataVariables.clientes}
              icon="🏢"
              color={CHART_COLORS.secondary}
              colorClass="blue"
            />
            <DashboardStatsCard
              title="Patrocinadores"
              value={dataVariables.patrocinadores}
              icon="💼"
              color={CHART_COLORS.tertiary}
              colorClass="orange"
            />
            <DashboardStatsCard
              title="Presencia Internacional"
              value={`${dataVariables.paises} países`}
              icon="🌍"
              color={CHART_COLORS.quaternary}
              colorClass="purple"
            />
          </div>

          <div className="dashboard-charts-grid">
            <BarChartComponent
              data={chartData.alianzas}
              title="Red de Alianzas"
            />

            <div className="dashboard-chart-container">
              <h3 className="dashboard-chart-title">Indicadores de Gestión</h3>
              <div className="dashboard-management-indicators">
                <div className="dashboard-management-item">
                  <span>Consultorias Brindadas:</span>
                  <span className="dashboard-management-value">
                    {dataVariables.consultorias}
                  </span>
                </div>
                <div className="dashboard-management-item">
                  <span>Donaciones Recibidas:</span>
                  <span className="dashboard-management-value">
                    {dataVariables.donaciones}
                  </span>
                </div>
                <div className="dashboard-management-item">
                  <span>Premios Obtenidos:</span>
                  <span className="dashboard-management-value">
                    {dataVariables.premios}
                  </span>
                </div>
                <div className="dashboard-management-item">
                  <span>Estudios de Caso:</span>
                  <span className="dashboard-management-value">
                    {dataVariables.estudiosCaso}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-chart-container">
            <h3 className="dashboard-chart-title">Estadísticas Operativas</h3>
            <div className="dashboard-indicators-grid">
              <IndicatorCard
                title=""
                value={dataVariables.reuniones}
                description="Reuniones Anuales"
              />
              <IndicatorCard
                title=""
                value={dataVariables.propuestas}
                description="Propuestas Presentadas"
              />
              <IndicatorCard
                title=""
                value={dataVariables.colaboradores}
                description="Colaboradores"
              />
            </div>
          </div>
        </div>
      ),

      innovacion: (
        <div className="dashboard-fade-in">
          <div className="dashboard-stats-grid">
            <DashboardStatsCard
              title="Proyectos Innovadores"
              value={dataVariables.innovacion}
              icon="💡"
            />
            <DashboardStatsCard
              title="Aplicaciones Desarrolladas"
              value={dataVariables.aplicaciones}
              icon="📱"
              color={CHART_COLORS.secondary}
              colorClass="blue"
            />
            <DashboardStatsCard
              title="Tecnologías Aplicadas"
              value={dataVariables.tics}
              icon="💻"
              color={CHART_COLORS.tertiary}
              colorClass="orange"
            />
            <DashboardStatsCard
              title="Sostenibilidad"
              value={dataVariables.sostenibilidad}
              icon="🌱"
            />
          </div>

          <div className="dashboard-charts-grid">
            <div className="dashboard-chart-container">
              <h3 className="dashboard-chart-title">
                Publicaciones y Materiales
              </h3>
              <div className="dashboard-indicators-grid">
                <IndicatorCard
                  title="Publicaciones"
                  value={dataVariables.publicaciones}
                  description="Artículos e informes"
                />
                <IndicatorCard
                  title="Materiales Educativos"
                  value={dataVariables.materiales}
                  description="Recursos creados"
                />
                <IndicatorCard
                  title="Testimonios"
                  value={dataVariables.testimonios}
                  description="Experiencias compartidas"
                />
              </div>
            </div>

            <div className="dashboard-chart-container">
              <h3 className="dashboard-chart-title">
                Participación en Eventos
              </h3>
              <div className="dashboard-indicators-grid">
                <IndicatorCard
                  title="Ferias"
                  value={dataVariables.ferias}
                  description="Eventos de exposición"
                />
                <IndicatorCard
                  title="Diagnósticos"
                  value={dataVariables.diagnosticos}
                  description="Estudios realizados"
                />
                <IndicatorCard
                  title="Practicantes"
                  value={dataVariables.practicantes}
                  description="Estudiantes en pasantías"
                />
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
                  {dataVariables.encuestas}
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
                  {dataVariables.solicitudes}
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
                  {dataVariables.indicadores}
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
                  {dataVariables.visitasWeb.toLocaleString()}
                </div>
                <div className="dashboard-quality-metric-label">
                  Visitas Web
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    };

    return tabComponents[activeTab] || null;
  };

  // Configuración de pestañas
  const tabs = [
    { id: "general", label: "General" },
    { id: "participacion", label: "Participación" },
    { id: "alianzas", label: "Alianzas" },
    { id: "innovacion", label: "Innovación" },
  ];

  return (
    <div className="dashboard-main-container">
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

      <div className="dashboard-navigation">
        <div className="dashboard-nav-container">
          <nav className="dashboard-nav-tabs">
            {tabs.map((tab) => (
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

      <main className="dashboard-main-content">{renderTabContent()}</main>
    </div>
  );
};

export default Dashboard;
