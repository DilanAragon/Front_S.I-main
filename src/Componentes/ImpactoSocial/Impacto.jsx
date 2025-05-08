import { useState, useEffect } from "react";
import Papa from "papaparse";
import "./Impacto.css"; 

const ImpactoSocial = () => {
  const [proyectos, setProyectos] = useState([]);
  const [filteredProyectos, setFilteredProyectos] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);

  useEffect(() => {
    Papa.parse("/impacto_social.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setProyectos(results.data);
        setFilteredProyectos(results.data);
      },
      error: (error) => {
        console.error("Error al cargar los datos:", error);
      },
    });
  }, []);

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    if (status) {
      const filtrados = proyectos.filter((p) => p.status === status);
      setFilteredProyectos(filtrados);
    } else {
      setFilteredProyectos(proyectos);
    }
  };

  const statusClass = (status) => {
    if (status === "completed") return "status-employed";
    if (status === "in_progress") return "status-studying";
    if (status === "planned") return "status-searching";
    return "";
  };

  const handleVerMasClick = (proyecto) => {
    setSelectedProyecto(proyecto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProyecto(null);
  };

  return (
    <div className="impacto-container">
      <div className="impacto-header">
        <h1>Proyectos de Impacto Social</h1>
        <p>Universidad Popular del Cesar - Ingeniería de Sistemas</p>
      </div>

      <div className="filter-section">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="status">Filtro por Estado</label>
            <select
              name="status"
              id="status"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="completed">Completado</option>
              <option value="in_progress">En progreso</option>
              <option value="planned">Planificado</option>
            </select>
          </div>
          <button className="reset-button" onClick={() => setFilteredProyectos(proyectos)}>
            Resetear Filtros
          </button>
        </div>
      </div>

      <div className="impacto-table-container">
        {filteredProyectos.length > 0 ? (
          <table className="impacto-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Beneficiarios</th>
                <th>Ubicación</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {filteredProyectos.map((proyecto, index) => (
                <tr key={index} className="proyecto-row">
                  <td className="name-cell">
                    <div className="proyecto-name">{proyecto.title}</div>
                  </td>
                  <td className="company-cell">{proyecto.beneficiaries}</td>
                  <td className="location-cell">{proyecto.location}</td>
                  <td className="year-cell">{proyecto.startDate}</td>
                  <td className="year-cell">{proyecto.endDate}</td>
                  <td className="status-cell">
                    <span className={`status-badge ${statusClass(proyecto.status)}`}>
                      {proyecto.status === "completed"
                        ? "Completado"
                        : proyecto.status === "in_progress"
                        ? "En progreso"
                        : proyecto.status === "planned"
                        ? "Planificado"
                        : proyecto.status}
                    </span>
                  </td>
                  <td className="contact-cell">
                    <button
                      className="contact-button-table email"
                      onClick={() => handleVerMasClick(proyecto)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-results">No se encontraron proyectos.</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Detalles del Proyecto</h2>
            <p><strong>Título:</strong> {selectedProyecto.title}</p>
            <p><strong>Descripción:</strong> {selectedProyecto.description}</p>
            <p><strong>Objetivos:</strong> {selectedProyecto.objectives}</p>
            <p><strong>Resultados:</strong> {selectedProyecto.results}</p>
            <p><strong>Participantes:</strong> {selectedProyecto.participants}</p>
            <button className="close-modal" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactoSocial;
