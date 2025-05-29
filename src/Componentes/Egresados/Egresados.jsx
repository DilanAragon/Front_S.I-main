import { useState, useEffect } from "react";
import "./Egresados.css";
import HistoriaDestacada from "./HistoriaDestacada";
import ContactForm from "./ContactForm";
import Testimonios from "./Testimonios";
import EncuestaLaboral from "./EncuestaLaboral";

const API_URL = import.meta.env.VITE_API_URL;

const Egresados = () => {
  const [activeTab, setActiveTab] = useState("directorio");
  const [egresados, setEgresados] = useState([]);
  const [filteredEgresados, setFilteredEgresados] = useState([]);
  const [filterValues, setFilterValues] = useState({
    graduationYear: "",
    status: "",
  });
  const [uniqueValues, setUniqueValues] = useState({
    graduationYears: [],
    statuses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getYearFromDate = (dateString) => parseInt(dateString.split("-")[0]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/egresados`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        setEgresados(data);
        setFilteredEgresados(data);

        const years = [
          ...new Set(data.map((e) => getYearFromDate(e.año_graduacion))),
        ].sort((a, b) => b - a);
        const statuses = [
          ...new Set(data.map((e) => e.empleabilidad).filter(Boolean)),
        ];

        setUniqueValues({ graduationYears: years, statuses });
        setError(null);
      } catch (error) {
        console.error("Error cargando egresados:", error);
        setError("Error al cargar los datos de egresados");
        setEgresados([]);
        setFilteredEgresados([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilterValues = { ...filterValues, [name]: value };
    setFilterValues(newFilterValues);

    let filtered = [...egresados];
    if (newFilterValues.graduationYear) {
      filtered = filtered.filter(
        (e) =>
          getYearFromDate(e.año_graduacion) == newFilterValues.graduationYear
      );
    }
    if (newFilterValues.status) {
      filtered = filtered.filter(
        (e) => e.empleabilidad === newFilterValues.status
      );
    }

    setFilteredEgresados(filtered);
  };

  const resetFilters = () => {
    setFilterValues({ graduationYear: "", status: "" });
    setFilteredEgresados(egresados);
  };

  const exportToCSV = () => {
    if (filteredEgresados.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const headers = [
      "ID",
      "Nombre Completo",
      "Año de Graduación",
      "Empleabilidad",
      "Email",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredEgresados.map((egresado) =>
        [
          egresado.egresado_id,
          `"${egresado.nombre_completo}"`,
          getYearFromDate(egresado.año_graduacion),
          `"${egresado.empleabilidad}"`,
          `"${egresado.email}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `egresados_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusText = (status) => status || "No especificado";

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "empleado":
        return "status-employed";
      case "emprendedor":
        return "status-entrepreneur";
      case "desempleado":
        return "status-unemployed";
      default:
        return "status-default";
    }
  };

  const PersonIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="person-icon"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    </svg>
  );

  const historiasDestacadas = [
    {
      id: 1,
      nombre: "Carlos Andrés Rodríguez",
      titulo: "Oracle Certified Professional",
      imagen: "/api/placeholder/300/300",
      descripcion:
        "Desarrollador Senior en Oracle Colombia con especialización en bases de datos y desarrollo de aplicaciones empresariales.",
      logros: [
        "Certificación Oracle Certified Professional",
        "Liderazgo en proyectos de migración a la nube",
        "Desarrollo de aplicaciones con más de 10,000 usuarios activos",
      ],
    },
    {
      id: 2,
      nombre: "María Fernanda López Martínez",
      titulo: "Consultora de Soluciones Cloud en IBM",
      imagen: "/api/placeholder/300/300",
      descripcion:
        "Especialista en computación en la nube y arquitecturas escalables con certificaciones en IBM Cloud y AWS.",
      logros: [
        "Certificación IBM Cloud Professional",
        "Implementación de soluciones en más de 15 empresas del sector financiero",
        "Ponente en eventos internacionales sobre Cloud Computing",
      ],
    },
  ];

  const testimoniosEgresados = [
    {
      id: 1,
      nombre: "Luis Eduardo Pérez Castro",
      graduacion: 2020,
      imagen: "/api/placeholder/100/100",
      testimonio:
        "Mi formación en la UPC me brindó las herramientas necesarias para desarrollarme como profesional independiente y emprender mi propio camino en el desarrollo web.",
    },
    {
      id: 2,
      nombre: "Ana María Quintero Rojas",
      graduacion: 2018,
      imagen: "/api/placeholder/100/100",
      testimonio:
        "La formación integral que recibí en la Universidad Popular del Cesar me permitió asumir roles de liderazgo en proyectos de transformación digital en el sector público.",
    },
  ];

  return (
    <div className="egresados-container">
      <div class="egresados-header-banner">
        <h1>Red de Egresados</h1>
        <p>
          Programa de Ingeniería de Sistemas - Universidad Popular del Cesar
        </p>
      </div>

      <div className="egresados-content-wrapper">
        <div className="tab-nav-horizontal">
          {[
            { key: "directorio", label: "Directorio de Egresados" },
            { key: "historias", label: "Historias Destacadas" },
            { key: "testimonios", label: "Testimonios" },
            { key: "contacto", label: "Contacto" },
            { key: "encuesta", label: "Encuesta Laboral" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={
                activeTab === tab.key ? "tab-button active" : "tab-button"
              }
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content-container">
          {activeTab === "historias" && (
            <div className="tab-content">
              <h2>Historias Destacadas de Nuestros Egresados</h2>
              <p className="section-description">
                Conoce las historias de éxito de nuestros graduados que están
                marcando la diferencia en el campo de la tecnología.
              </p>
              <div className="historias-grid">
                {historiasDestacadas.map((historia) => (
                  <HistoriaDestacada key={historia.id} historia={historia} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "directorio" && (
            <div className="tab-content">
              <div className="directory-container">
                <h2 className="filter-title">Filtrar Egresados</h2>

                <div className="filter-section-centered">
                  <div className="filters-container">
                    <div className="filter-group">
                      <label htmlFor="graduationYear">Año de Graduación</label>
                      <select
                        name="graduationYear"
                        id="graduationYear"
                        value={filterValues.graduationYear}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todos</option>
                        {uniqueValues.graduationYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label htmlFor="status">Estado de Empleabilidad</label>
                      <select
                        name="status"
                        id="status"
                        value={filterValues.status}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todos</option>
                        {uniqueValues.statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="buttons-group">
                      <button className="reset-button" onClick={resetFilters}>
                        Resetear Filtros
                      </button>
                      <button className="export-button" onClick={exportToCSV}>
                        Exportar CSV
                      </button>
                    </div>
                  </div>
                </div>

                <div className="egresados-table-container">
                  {loading ? (
                    <div className="loading-message">
                      <p>Cargando datos de egresados...</p>
                    </div>
                  ) : error ? (
                    <div className="error-message">
                      <p>{error}</p>
                    </div>
                  ) : filteredEgresados.length > 0 ? (
                    <table className="egresados-table">
                      <thead>
                        <tr>
                          <th>Perfil</th>
                          <th>Nombre Completo</th>
                          <th>Año de Graduación</th>
                          <th>Estado de Empleabilidad</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEgresados.map((egresado) => (
                          <tr
                            key={egresado.egresado_id}
                            className="egresado-row"
                          >
                            <td className="photo-cell">
                              <div className="photo-wrapper">
                                <PersonIcon />
                              </div>
                            </td>
                            <td className="name-cell">
                              <div className="egresado-name">
                                {egresado.nombre_completo}
                              </div>
                            </td>
                            <td className="year-cell">
                              {getYearFromDate(egresado.año_graduacion)}
                            </td>
                            <td className="status-cell">
                              <span
                                className={`status-badge ${getStatusClass(
                                  egresado.empleabilidad
                                )}`}
                              >
                                {getStatusText(egresado.empleabilidad)}
                              </span>
                            </td>
                            <td className="contact-cell">
                              {egresado.email && (
                                <a
                                  href={`mailto:${egresado.email}`}
                                  className="contact-button-table email"
                                  title="Enviar correo"
                                >
                                  <span className="contact-icon">✉</span>
                                  <span className="contact-text">Email</span>
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-results">
                      No se encontraron egresados con los filtros seleccionados.
                    </p>
                  )}
                </div>

                {!loading && !error && (
                  <div className="results-summary">
                    <p>
                      Mostrando {filteredEgresados.length} de {egresados.length}{" "}
                      egresados
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "testimonios" && (
            <div className="tab-content">
              <h2>Testimonios de Egresados</h2>
              <p className="section-description">
                Conoce lo que nuestros egresados tienen que decir sobre su
                experiencia en el programa de Ingeniería de Sistemas.
              </p>
              <Testimonios testimonios={testimoniosEgresados} />
            </div>
          )}

          {activeTab === "contacto" && (
            <div className="tab-content">
              <h2>Contáctanos</h2>
              <p className="section-description">
                Si tienes alguna pregunta o sugerencia para la red de egresados,
                no dudes en contactarnos.
              </p>
              <ContactForm />
            </div>
          )}

          {activeTab === "encuesta" && (
            <div className="tab-content">
              <h2>Encuesta de Seguimiento Laboral</h2>
              <p className="section-description">
                Tu experiencia laboral es importante para nosotros. Completa
                esta encuesta para ayudarnos a mejorar nuestros programas.
              </p>
              <EncuestaLaboral />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Egresados;
