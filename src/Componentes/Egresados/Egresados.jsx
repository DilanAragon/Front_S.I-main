import { useState, useEffect } from "react";
import "./Egresados.css";
import HistoriaDestacada from "./HistoriaDestacada";
import ContactForm from "./ContactForm";
import Testimonios from "./Testimonios";
import EncuestaLaboral from "./EncuestaLaboral";
import Papa from "papaparse";

const Egresados = () => {
  const [activeTab, setActiveTab] = useState("directorio");
  const [egresados, setEgresados] = useState([]);
  const [filteredEgresados, setFilteredEgresados] = useState([]);
  const [filterValues, setFilterValues] = useState({
    graduationYear: "",
    status: "",
    city: "",
    academicDegree: "",
  });
  const [uniqueValues, setUniqueValues] = useState({
    graduationYears: [],
    statuses: [],
    cities: [],
    academicDegrees: [],
  });

  // Función para cargar datos desde el CSV - MODIFICADA para usar Papa.parse directamente
  useEffect(() => {
    Papa.parse("/egresados_reales.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          // Filtrar filas vacías
          const datosLimpios = results.data.filter((row) =>
            Object.values(row).some((v) => v)
          );

          // Inspeccionar qué campos de nombre están disponibles en los datos
          console.log("Ejemplo de datos:", datosLimpios[0]);

          // Mapear los datos para asegurarnos de tener nombres
          const egresadosConNombres = datosLimpios.map((egresado) => {
            // Verificamos todos los posibles campos de nombre y usamos los primeros disponibles
            const posibleNombre =
              egresado.nombre ||
              egresado.name ||
              egresado.firstName ||
              "Nombre";
            const posibleApellido =
              egresado.apellido || egresado.lastName || "";

            return {
              ...egresado,
              nombre: posibleNombre,
              apellido: posibleApellido,
              // Mantenemos también los campos firstName y lastName por compatibilidad
              firstName: posibleNombre,
              lastName: posibleApellido,
            };
          });

          setEgresados(egresadosConNombres);
          setFilteredEgresados(egresadosConNombres);

          // Extraer valores únicos para los filtros
          const years = [
            ...new Set(egresadosConNombres.map((e) => e.graduationYear)),
          ].sort((a, b) => b - a);
          const statuses = [
            ...new Set(egresadosConNombres.map((e) => e.status)),
          ];
          const cities = [...new Set(egresadosConNombres.map((e) => e.city))];
          const degrees = [
            ...new Set(egresadosConNombres.map((e) => e.academicDegree)),
          ];

          setUniqueValues({
            graduationYears: years,
            statuses: statuses,
            cities: cities,
            academicDegrees: degrees,
          });
        }
      },
      error: (error) => {
        console.error("Error al cargar los datos:", error);
        setEgresados([]);
      },
    });
  }, []);

  // Función para filtrar egresados
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    const newFilterValues = {
      ...filterValues,
      [name]: value,
    };

    setFilterValues(newFilterValues);

    // Aplicar filtros
    let filtered = [...egresados];

    if (newFilterValues.graduationYear) {
      filtered = filtered.filter(
        (e) => e.graduationYear == newFilterValues.graduationYear
      );
    }

    if (newFilterValues.status) {
      filtered = filtered.filter((e) => e.status === newFilterValues.status);
    }

    if (newFilterValues.city) {
      filtered = filtered.filter((e) => e.city === newFilterValues.city);
    }

    if (newFilterValues.academicDegree) {
      filtered = filtered.filter(
        (e) =>
          e.academicDegree &&
          e.academicDegree.includes(newFilterValues.academicDegree)
      );
    }

    setFilteredEgresados(filtered);
  };

  // Función para resetear los filtros
  const resetFilters = () => {
    setFilterValues({
      graduationYear: "",
      status: "",
      city: "",
      academicDegree: "",
    });
    setFilteredEgresados(egresados);
  };

  // Función para determinar el estado del egresado en español
  const getStatusText = (status) => {
    switch (status) {
      case "employed":
        return "Empleado";
      case "studying":
        return "Estudiando";
      case "searching":
        return "Buscando empleo";
      default:
        return status;
    }
  };

  // Función para determinar la clase CSS del estado
  const getStatusClass = (status) => {
    switch (status) {
      case "employed":
        return "status-employed";
      case "studying":
        return "status-studying";
      case "searching":
        return "status-searching";
      default:
        return "status-default";
    }
  };

  // Obtener nombre completo
  const getNombreCompleto = (egresado) => {
    // Verificar todas las posibles combinaciones de campos para el nombre
    const nombre = egresado.nombre || egresado.name || egresado.firstName || "";
    const apellido = egresado.apellido || egresado.lastName || "";

    // Si hay un nombre completo ya formateado, usarlo
    if (egresado.nombreCompleto) return egresado.nombreCompleto;

    // Verificar si hay un campo que podría contener el nombre completo
    if (egresado.nombre && egresado.nombre.includes(" ")) {
      return egresado.nombre;
    }

    // Formar el nombre completo con los valores disponibles
    const nombreCompleto = `${nombre} ${apellido}`.trim();
    return nombreCompleto || "Nombre no disponible";
  };

  // Componente para el icono de persona
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

  // Datos para Historias Destacadas (normalmente vendrían de una API)
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
    {
      id: 3,
      nombre: "Marina Isabel Méndez Castaño",
      titulo: "Coordinadora de Programa - Universidad Popular del Cesar",
      imagen: "/api/placeholder/300/300",
      descripcion:
        "Ingeniera de Sistemas con Doctorado en Educación y amplia experiencia académica y administrativa.",
      logros: [
        "Doctorado en Educación",
        "Publicación de investigaciones sobre metodologías de enseñanza en ingeniería",
        "Liderazgo en procesos de acreditación de alta calidad",
      ],
    },
  ];

  // Testimonios de egresados
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
    {
      id: 3,
      nombre: "Miguel Ángel Suárez Villar",
      graduacion: 2016,
      imagen: "/api/placeholder/100/100",
      testimonio:
        "Las bases sólidas en ciencias de la computación que obtuve en la UPC fueron fundamentales para mi desarrollo profesional en Google Cloud, donde actualmente me desempeño como Cloud Engineer.",
    },
  ];

  return (
    <div className="egresados-container">
      <div className="egresados-header">
        <h1>Red de Egresados</h1>
        <p>
          Programa de Ingeniería de Sistemas - Universidad Popular del Cesar
        </p>
      </div>

      <div className="egresados-content-wrapper">
        <div className="tab-nav-horizontal">
          <button
            className={
              activeTab === "directorio" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("directorio")}
          >
            Directorio de Egresados
          </button>
          <button
            className={
              activeTab === "historias" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("historias")}
          >
            Historias Destacadas
          </button>
          <button
            className={
              activeTab === "testimonios" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("testimonios")}
          >
            Testimonios
          </button>
          <button
            className={
              activeTab === "contacto" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("contacto")}
          >
            Contacto
          </button>
          <button
            className={
              activeTab === "encuesta" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("encuesta")}
          >
            Encuesta Laboral
          </button>
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
              <h2>Directorio de Egresados</h2>
              <p className="section-description">
                Explora nuestra base de datos de egresados y mantente conectado
                con la comunidad de Ingeniería de Sistemas.
              </p>

              <div className="filter-section">
                <h3>Filtrar Egresados</h3>
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
                    <label htmlFor="status">Estado</label>
                    <select
                      name="status"
                      id="status"
                      value={filterValues.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">Todos</option>
                      {uniqueValues.statuses.map((status) => (
                        <option key={status} value={status}>
                          {status === "employed"
                            ? "Empleado"
                            : status === "studying"
                            ? "Estudiando"
                            : status === "searching"
                            ? "Buscando empleo"
                            : status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="city">Ciudad</label>
                    <select
                      name="city"
                      id="city"
                      value={filterValues.city}
                      onChange={handleFilterChange}
                    >
                      <option value="">Todas</option>
                      {uniqueValues.cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="academicDegree">Formación Académica</label>
                    <select
                      name="academicDegree"
                      id="academicDegree"
                      value={filterValues.academicDegree}
                      onChange={handleFilterChange}
                    >
                      <option value="">Todas</option>
                      <option value="Especialista">Especialización</option>
                      <option value="Magíster">Maestría</option>
                      <option value="Doctorado">Doctorado</option>
                    </select>
                  </div>

                  <button className="reset-button" onClick={resetFilters}>
                    Resetear Filtros
                  </button>
                </div>
              </div>

              {/* TABLA DE EGRESADOS MEJORADA */}
              <div className="egresados-table-container">
                {filteredEgresados.length > 0 ? (
                  <table className="egresados-table">
                    <thead>
                      <tr>
                        <th>Perfil</th>
                        <th>Nombre</th>
                        <th>Graduación</th>
                        <th>Estado</th>
                        <th>Empresa</th>
                        <th>Cargo</th>
                        <th>Ubicación</th>
                        <th>Formación adicional</th>
                        <th>Contacto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEgresados.map((egresado, index) => {
                        // Verificar y mostrar datos para depuración
                        if (index === 0) {
                          console.log("Datos de primer egresado:", egresado);
                        }
                        return (
                          <tr key={index} className="egresado-row">
                            <td className="photo-cell">
                              <div className="photo-wrapper">
                                <PersonIcon />
                              </div>
                            </td>
                            <td className="name-cell">
                              <div className="egresado-name">
                                {getNombreCompleto(egresado)}
                              </div>
                            </td>
                            <td className="year-cell">
                              {egresado.graduationYear}
                            </td>
                            <td className="status-cell">
                              <span
                                className={`status-badge ${getStatusClass(
                                  egresado.status
                                )}`}
                              >
                                {getStatusText(egresado.status)}
                              </span>
                            </td>
                            <td className="company-cell">
                              {egresado.company || "-"}
                            </td>
                            <td className="position-cell">
                              {egresado.position || "-"}
                            </td>
                            <td className="location-cell">
                              {egresado.city || ""}
                              {egresado.city && egresado.country ? ", " : ""}
                              {egresado.country || ""}
                            </td>
                            <td className="degree-cell">
                              {egresado.academicDegree || "-"}
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
                              {egresado.linkedin && (
                                <a
                                  href={egresado.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="contact-button-table linkedin"
                                  title="Ver perfil de LinkedIn"
                                >
                                  <span className="contact-icon">in</span>
                                  <span className="contact-text">LinkedIn</span>
                                </a>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-results">
                    No se encontraron egresados con los filtros seleccionados.
                  </p>
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
