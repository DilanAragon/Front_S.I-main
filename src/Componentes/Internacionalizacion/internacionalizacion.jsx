import { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import "./internacionalizacion.css";

const Internacionalizacion = () => {
  const [relaciones, setRelaciones] = useState([]);
  const [filteredRelaciones, setFilteredRelaciones] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRelacion, setSelectedRelacion] = useState(null);
  const [flagUrls, setFlagUrls] = useState({});

  useEffect(() => {
  const fetchProyectos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/relaciones-internacionales/`);
      const data = await response.json();
      // Aquí mapeamos los campos al formato que ya usas en el frontend
      const mappedData = data.map(p => ({
        name:p.nombre,
        country:p.pais,
        institution:p.institucion,
        type:p.tipo,
        startDate:p.fecha_inicio,
        endDate:p.fecha_finalizacion,
        description:p.descripcion,
        participants:p.participantes,
        results:p.resultados,
        status: p.estado
      }));
        // console.log(data[0]);
        setRelaciones(mappedData);
        setFilteredRelaciones(mappedData);
        fetchFlags(mappedData);
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
    }
  };

  fetchProyectos();
}, []);

  const fetchFlags = (relaciones) => {
    const countries = relaciones.map((r) => r.country);
    const uniqueCountries = [...new Set(countries)];

    const fetchFlagsData = async () => {
      const flags = {};
      for (let country of uniqueCountries) {
        try {
          const response = await axios.get(
            `https://flagcdn.com/w320/${country.toLowerCase()}.png`
          );
          flags[country] = response.request.responseURL;
        } catch (error) {
          console.error(`Error al obtener bandera de ${country}:`, error);
        }
      }
      setFlagUrls(flags);
    };

    fetchFlagsData();
  };

  const handleFilterChange = (e, filterTypeField) => {
    const value = e.target.value;
    if (filterTypeField === "status") {
      setFilterStatus(value);
    } else if (filterTypeField === "type") {
      setFilterType(value);
    }

    let filtrados = relaciones;

    if (value && filterTypeField === "status") {
      filtrados = filtrados.filter((r) => r.status === value);
    } else if (filterStatus) {
      filtrados = filtrados.filter((r) => r.status === filterStatus);
    }

    if (value && filterTypeField === "type") {
      filtrados = filtrados.filter((r) => r.type === value);
    } else if (filterType) {
      filtrados = filtrados.filter((r) => r.type === filterType);
    }

    if (filterStatus && filterType && filterTypeField !== "status" && filterTypeField !== "type") {
      filtrados = relaciones.filter((r) => r.status === filterStatus && r.type === filterType);
    }

    if (!value && !filterStatus && !filterType) {
      filtrados = relaciones;
    }

    setFilteredRelaciones(filtrados);
  };

  const resetFilters = () => {
    setFilterStatus("");
    setFilterType("");
    setFilteredRelaciones(relaciones);
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredRelaciones);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "relaciones_internacionales_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusClass = (status) => {
    if (status === "active") return "status-employed";
    if (status === "inactive") return "status-studying";
    if (status === "pending") return "status-searching";
    return "";
  };

  const statusLabel = (status) => {
    if (status === "active") return "Activo";
    if (status === "inactive") return "Inactivo";
    if (status === "pending") return "Pendiente";
    return status;
  };

  const typeLabel = (type) => {
    if (type === "agreement") return "Convenio";
    if (type === "mobility") return "Movilidad";
    if (type === "network") return "Red";
    if (type === "project") return "Proyecto";
    return type;
  };

  const handleVerMasClick = (relacion) => {
    setSelectedRelacion(relacion);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRelacion(null);
  };

  return (
    <div className="impacto-container">
      <div className="impacto-header">
        <h1>Relaciones Internacionales</h1>
        <p>Universidad Popular del Cesar - Ingeniería de Sistemas</p>
      </div>

      <div className="filter-section">
        <div className="filters-container">
          <div className="filter-group">
            <label>Estado</label>
            <select
              name="status"
              id="status"
              value={filterStatus}
              onChange={(e) => handleFilterChange(e, "status")}
            >
              <option value="">Todos</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="pending">Pendiente</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Tipo</label>
            <select
              name="type"
              id="type"
              value={filterType}
              onChange={(e) => handleFilterChange(e, "type")}
            >
              <option value="">Todos</option>
              <option value="agreement">Convenio</option>
              <option value="mobility">Movilidad</option>
              <option value="Network">Red</option>
              <option value="project">Proyecto</option>
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button className="reset-button" onClick={resetFilters}>
            Restablecer
          </button>
          <button className="export-button" onClick={exportToCSV}>
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="impacto-table-container">
        {filteredRelaciones.length > 0 ? (
          <table className="impacto-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>País</th>
                <th>Institución</th>
                <th>Tipo</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {filteredRelaciones.map((relacion, index) => (
                <tr key={index} className="proyecto-row">
                  <td>{relacion.name}</td>
                  <td>
                    {flagUrls[relacion.country] ? (
                      <img
                        src={flagUrls[relacion.country]}
                        alt={relacion.country}
                        className="country-flag"
                      />
                    ) : (
                      relacion.country
                    )}
                  </td>
                  <td>{relacion.institution}</td>
                  <td>{typeLabel(relacion.type)}</td>
                  <td className="year-cell">{relacion.startDate}</td>
                  <td className="year-cell">{relacion.endDate}</td>
                  <td>
                    <span className={`status-badge ${statusClass(relacion.status)}`}>
                      {statusLabel(relacion.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="contact-button-table email"
                      onClick={() => handleVerMasClick(relacion)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-results">No se encontraron relaciones.</p>
        )}
      </div>

      {showModal && selectedRelacion && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedRelacion.name}</h2>
            <p><strong>Descripción:</strong> {selectedRelacion.description}</p>
            <p><strong>Participantes:</strong> {selectedRelacion.participants}</p>
            <p><strong>Resultados:</strong> {selectedRelacion.results}</p>
            <button className="close-modal" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Internacionalizacion;
