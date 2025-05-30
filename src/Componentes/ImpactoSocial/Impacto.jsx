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
  const fetchProyectos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/impacto-social/`);
      const data = await response.json();

      // Aquí mapeamos los campos al formato que ya usas en el frontend
      const mappedData = data.map(p => ({
        title: p.titulo,
        beneficiaries: p.beneficiarios,
        location: p.ubicacion,
        startDate: p.fecha_inicio,
        endDate: p.fecha_final,
        status: p.estado || '', // por si no viene estado
        description: p.descripcion || '',
        objectives: p.objetivos || '',
        results: p.resultados || '',
        participants: p.participantes || ''
      }));

      setProyectos(mappedData);
      setFilteredProyectos(mappedData);
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
    }
  };

  fetchProyectos();
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

  const resetFilters = () => {
    setFilterStatus("");
    setFilteredProyectos(proyectos);
  };

  const exportToCSV = () => {
    // Mapea los datos exactamente como en la tabla
    const dataToExport = filteredProyectos.map((p) => ({
      "TÍTULO": p.title || p.name || "",
      "BENEFICIARIOS": p.beneficiaries || "",
      "UBICACIÓN": p.location || "",
      "INICIO": p.startDate || "",
      "FIN": p.endDate || "",
      "ESTADO": statusLabel(p.status),
    }));

    const csv = Papa.unparse(dataToExport);
    const bom = "\uFEFF"; // BOM para UTF-8
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "impacto_social_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusClass = (status) => {
    if (status === "completed") return "status-employed";
    if (status === "in_progress") return "status-studying";
    if (status === "planned") return "status-searching";
    return "";
  };

  const statusLabel = (status) => {
    if (status === "completed") return "Completado";
    if (status === "in_progress") return "En progreso";
    if (status === "planned") return "Planificado";
    return status;
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
          <div className="filter-actions">
            <button className="reset-button" onClick={resetFilters}>
              Reiniciar Filtros
            </button>
            <button className="export-button" onClick={exportToCSV}>
              Exportar Datos
            </button>
          </div>
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
                    <span
                      className={`status-badge ${statusClass(proyecto.status)}`}
                    >
                      {statusLabel(proyecto.status)}
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
            <p>
              <strong>Título:</strong> {selectedProyecto.title}
            </p>
            <p>
              <strong>Descripción:</strong> {selectedProyecto.description}
            </p>
            <p>
              <strong>Objetivos:</strong> {selectedProyecto.objectives}
            </p>
            <p>
              <strong>Resultados:</strong> {selectedProyecto.results}
            </p>
            <p>
              <strong>Participantes:</strong> {selectedProyecto.participants}
            </p>
            <button className="close-modal" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactoSocial;
