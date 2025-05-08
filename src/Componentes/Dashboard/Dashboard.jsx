// Dashboard.jsx - Actualizado con funcionalidad de importación
import { useState, useEffect } from "react";
import Papa from "papaparse";
import StatsCard from "./StatsCard";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import DataTable from "./DataTable";
import ImportData from "./importData";
import { downloadCSV, downloadExcel, downloadPDF } from "./exportUtils";
import "./Dashboard.css";

const Dashboard = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [statsData, setStatsData] = useState({
    current_students: 0,
    total_graduates: 0,
    employment_rate: 0,
    graduation_rate: 0,
    total_agreements: 0,
    specialized_laboratories: 0,
    total_professors: 0,
    phd_professors: 0,
    masters_professors: 0,
    specialization_professors: 0,
    national_presentations: 0,
    international_presentations: 0,
    scientific_articles: 0,
    technical_productions: 0,
    book_chapters: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    // Cargar datos del CSV
    Papa.parse("/estadisticas_upc.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const data = {};

        // Convertir los datos del CSV a un objeto plano
        results.data.forEach((row) => {
          if (row.category && row.value) {
            // Convertir valores numéricos a números
            const numValue = !isNaN(parseFloat(row.value))
              ? parseFloat(row.value)
              : row.value;
            data[row.category] = numValue;
          }
        });

        setStatsData(data);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error al cargar el archivo CSV:", error);
        setLoading(false);
      },
    });
  }, []);

  // Función para procesar los datos importados
  const handleDataImported = (importedData) => {
    // Fusionar datos importados con los existentes
    const updatedData = { ...statsData, ...importedData };
    setStatsData(updatedData);

    // Ocultar el panel de importación después de una importación exitosa
    setShowImport(false);
  };

  // Datos para gráficos basados en los datos cargados
  const professorData = [
    { name: "Docentes con Doctorado", value: statsData.phd_professors || 0 },
    { name: "Docentes con Maestría", value: statsData.masters_professors || 0 },
    {
      name: "Docentes con Especialización",
      value: statsData.specialization_professors || 0,
    },
  ];

  const productionData = [
    {
      name: "Ponencias Nacionales",
      value: statsData.national_presentations || 0,
    },
    {
      name: "Ponencias Internacionales",
      value: statsData.international_presentations || 0,
    },
    {
      name: "Artículos Científicos",
      value: statsData.scientific_articles || 0,
    },
    { name: "Producción Técnica", value: statsData.technical_productions || 0 },
    { name: "Capítulos de Libros", value: statsData.book_chapters || 0 },
  ];

  // Datos estáticos para algunos gráficos (podrían ser dinámicos con más datos en el CSV)
  const graduatesPerYearData = [
    { year: "2017", value: 60 },
    { year: "2018", value: 65 },
    { year: "2019", value: 67 },
    { year: "2020", value: 63 },
    { year: "2021", value: 70 },
  ];

  const employmentData = [
    { name: "Empleados", value: statsData.employment_rate || 0 },
    { name: "Desempleados", value: 100 - (statsData.employment_rate || 0) },
  ];

  const handleExportData = (format) => {
    const data = {
      statsData: statsData,
      professorData,
      productionData,
      graduatesPerYearData,
    };

    switch (format) {
      case "csv":
        downloadCSV(data, "estadisticas-ingenieria-sistemas");
        break;
      case "excel":
        downloadExcel(data, "estadisticas-ingenieria-sistemas");
        break;
      case "pdf":
        downloadPDF(data, "estadisticas-ingenieria-sistemas");
        break;
      default:
        break;
    }
  };

  const toggleImportPanel = () => {
    setShowImport(!showImport);
  };

  const renderTabContent = () => {
    if (loading) {
      return <div className="loading-indicator">Cargando datos...</div>;
    }

    switch (activeTab) {
      case "general":
        return (
          <div className="tab-content">
            <div className="stats-cards">
              <StatsCard
                title="Estudiantes Actuales"
                value={statsData.current_students}
                icon="users"
              />
              <StatsCard
                title="Total Egresados"
                value={statsData.total_graduates}
                icon="graduation-cap"
              />
              <StatsCard
                title="Tasa de Empleabilidad"
                value={`${statsData.employment_rate}%`}
                icon="briefcase"
              />
              <StatsCard
                title="Tasa de Graduación"
                value={`${statsData.graduation_rate}%`}
                icon="chart-line"
              />
            </div>

            <div className="charts-row">
              <div className="chart-container">
                <h3>Estadísticas de Empleabilidad</h3>
                <PieChart data={employmentData} />
              </div>
              <div className="chart-container">
                <h3>Evolución de Egresados</h3>
                <LineChart data={graduatesPerYearData} />
              </div>
            </div>

            <div className="data-section">
              <h3>Convenios y Alianzas Académicas</h3>
              <p>Total de convenios y alianzas: {statsData.total_agreements}</p>
              <DataTable
                headers={[
                  "Tipo de Convenio",
                  "Institución",
                  "Fecha de Inicio",
                  "Estado",
                ]}
                data={[
                  ["Académico", "Oracle Academy", "2020-01-15", "Activo"],
                  ["Investigación", "Colciencias", "2021-05-10", "Activo"],
                  [
                    "Networking",
                    "Cisco Networking Academy",
                    "2019-08-22",
                    "Activo",
                  ],
                  [
                    "Internacional",
                    "Universidad Politécnica de Madrid",
                    "2022-01-15",
                    "Activo",
                  ],
                  ["Académico", "Microsoft", "2020-11-30", "Activo"],
                ]}
              />
            </div>
          </div>
        );

      case "graduates":
        return (
          <div className="tab-content">
            <div className="stats-cards">
              <StatsCard
                title="Total Egresados"
                value={statsData.total_graduates}
                icon="graduation-cap"
              />
              <StatsCard
                title="Tasa de Empleabilidad"
                value={`${statsData.employment_rate}%`}
                icon="briefcase"
              />
              <StatsCard
                title="Promedio Anual de Egresados"
                value="63"
                icon="users"
              />
              <StatsCard
                title="Relación Estudiante/Egresado"
                value={(
                  statsData.current_students / statsData.total_graduates
                ).toFixed(2)}
                icon="balance-scale"
              />
            </div>

            <div className="charts-row">
              <div className="chart-container">
                <h3>Empleabilidad de Egresados</h3>
                <PieChart data={employmentData} />
              </div>
              <div className="chart-container">
                <h3>Egresados por Año</h3>
                <BarChart
                  data={graduatesPerYearData}
                  dataKey="value"
                  nameKey="year"
                />
              </div>
            </div>

            <div className="data-section">
              <h3>Estadísticas de Inserción Laboral</h3>
              <DataTable
                headers={["Sector", "Porcentaje", "Salario Promedio"]}
                data={[
                  ["Tecnología", "45%", "3.2 SMMLV"],
                  ["Educación", "25%", "2.8 SMMLV"],
                  ["Servicios", "15%", "2.6 SMMLV"],
                  ["Gobierno", "10%", "3.0 SMMLV"],
                  ["Otros", "5%", "2.5 SMMLV"],
                ]}
              />
            </div>
          </div>
        );

      case "professors":
        return (
          <div className="tab-content">
            <div className="stats-cards">
              <StatsCard
                title="Total Docentes"
                value={statsData.total_professors}
                icon="chalkboard-teacher"
              />
              <StatsCard
                title="Docentes con Doctorado"
                value={statsData.phd_professors}
                icon="user-graduate"
              />
              <StatsCard
                title="Docentes con Maestría"
                value={statsData.masters_professors}
                icon="user-tie"
              />
              <StatsCard
                title="Docentes con Especialización"
                value={statsData.specialization_professors}
                icon="user"
              />
            </div>

            <div className="charts-row">
              <div className="chart-container">
                <h3>Nivel Académico de Docentes</h3>
                <PieChart data={professorData} />
              </div>
              <div className="chart-container">
                <h3>Distribución por Tipo de Vinculación</h3>
                <BarChart
                  data={[
                    {
                      name: "Planta",
                      value: statsData.permanent_professors || 0,
                    },
                    {
                      name: "Tiempo Completo",
                      value: statsData.full_time_professors || 0,
                    },
                    {
                      name: "Catedráticos",
                      value: statsData.part_time_professors || 0,
                    },
                    {
                      name: "Ad Honorem",
                      value: statsData.ad_honorem_professors || 0,
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                />
              </div>
            </div>
          </div>
        );

      case "production":
        return (
          <div className="tab-content">
            <div className="stats-cards">
              <StatsCard
                title="Ponencias Nacionales"
                value={statsData.national_presentations}
                icon="map-marker-alt"
              />
              <StatsCard
                title="Ponencias Internacionales"
                value={statsData.international_presentations}
                icon="globe"
              />
              <StatsCard
                title="Artículos Científicos"
                value={statsData.scientific_articles}
                icon="file-alt"
              />
              <StatsCard
                title="Producción Técnica"
                value={statsData.technical_productions}
                icon="cogs"
              />
            </div>

            <div className="charts-row">
              <div className="chart-container">
                <h3>Producción Académica</h3>
                <BarChart
                  data={productionData}
                  dataKey="value"
                  nameKey="name"
                />
              </div>
              <div className="chart-container">
                <h3>Distribución Porcentual</h3>
                <PieChart data={productionData} />
              </div>
            </div>

            <div className="data-section">
              <h3>Capítulos de Libros Publicados</h3>
              <p>Total: {statsData.book_chapters}</p>
              <DataTable
                headers={["Título", "Autores", "Año", "Editorial"]}
                data={[
                  [
                    "Inteligencia Artificial en la Educación",
                    "Pérez, J., Gómez, L.",
                    "2023",
                    "Editorial Académica",
                  ],
                  [
                    "Desarrollo Web Moderno",
                    "Martínez, A., Rodríguez, C.",
                    "2022",
                    "Springer",
                  ],
                  [
                    "Machine Learning Aplicado",
                    "López, S., Torres, M.",
                    "2021",
                    "IEEE Press",
                  ],
                ]}
              />
            </div>
          </div>
        );

      case "import":
        return (
          <div className="tab-content">
            <ImportData onDataImported={handleDataImported} />

            <div className="import-help-section">
              <h3>Ayuda para Importación</h3>
              <div className="import-instructions">
                <h4>Formato de Archivos</h4>
                <p>
                  Para importar datos correctamente, asegúrate de que tus
                  archivos cumplan con el siguiente formato:
                </p>

                <div className="format-example">
                  <h5>CSV</h5>
                  <pre>
                    category,value current_students,850 total_graduates,1245
                    employment_rate,87 ...
                  </pre>
                </div>

                <div className="format-example">
                  <h5>Excel</h5>
                  <p>
                    Columnas A y B con encabezados "category" y "value", o
                    múltiples pestañas con datos específicos para cada sección.
                  </p>
                </div>

                <h4>Categorías Soportadas</h4>
                <ul className="categories-list">
                  <li>
                    <code>current_students</code> - Estudiantes actuales
                  </li>
                  <li>
                    <code>total_graduates</code> - Total de egresados
                  </li>
                  <li>
                    <code>employment_rate</code> - Tasa de empleabilidad (%)
                  </li>
                  <li>
                    <code>graduation_rate</code> - Tasa de graduación (%)
                  </li>
                  <li>
                    <code>total_professors</code> - Total de docentes
                  </li>
                  <li>
                    <code>phd_professors</code> - Docentes con doctorado
                  </li>
                  <li>
                    <code>masters_professors</code> - Docentes con maestría
                  </li>
                  <li>
                    <code>specialization_professors</code> - Docentes con
                    especialización
                  </li>
                  <li>
                    <code>national_presentations</code> - Ponencias nacionales
                  </li>
                  <li>
                    <code>international_presentations</code> - Ponencias
                    internacionales
                  </li>
                  <li>
                    <code>scientific_articles</code> - Artículos científicos
                  </li>
                  <li>
                    <code>technical_productions</code> - Producción técnica
                  </li>
                  <li>
                    <code>book_chapters</code> - Capítulos de libros
                  </li>
                  <li>
                    <code>total_agreements</code> - Total de convenios
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`dashboard-main-container ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="dashboard-header">
        <h1>Dashboard Analítico</h1>
        <p>
          Programa de Ingeniería de Sistemas - Universidad Popular del Cesar
        </p>

        <div className="dashboard-actions">
          <div className="export-buttons">
            <button className="import-button" onClick={toggleImportPanel}>
              {showImport ? "Ocultar Importación" : "Importar Datos"}
            </button>
            <button onClick={() => handleExportData("csv")}>
              Exportar CSV
            </button>
            <button onClick={() => handleExportData("excel")}>
              Exportar Excel
            </button>
            <button onClick={() => handleExportData("pdf")}>
              Exportar PDF
            </button>
          </div>
        </div>

        {showImport && (
          <div className="quick-import-panel">
            <ImportData onDataImported={handleDataImported} />
          </div>
        )}
      </div>

      <div
        className={`dashboard-content-wrapper ${
          isDarkMode ? "dark-mode" : "light-mode"
        }`}
      >
        <div className="tab-nav-horizontal">
          <button
            className={
              activeTab === "general" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={
              activeTab === "graduates" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("graduates")}
          >
            Egresados
          </button>
          <button
            className={
              activeTab === "professors" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("professors")}
          >
            Docentes
          </button>
          <button
            className={
              activeTab === "production" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("production")}
          >
            Producción Académica
          </button>
          <button
            className={
              activeTab === "import" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("import")}
          >
            Importar
          </button>
        </div>

        <div className="tab-content-container">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
