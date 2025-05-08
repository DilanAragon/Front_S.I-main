import { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import "./internacionalizacion.css"; // reutilizamos el estilo existente

const Internacionalizacion = () => {
  const [relaciones, setRelaciones] = useState([]);
  const [filteredRelaciones, setFilteredRelaciones] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRelacion, setSelectedRelacion] = useState(null);
  const [flagUrls, setFlagUrls] = useState({});

  useEffect(() => {
 
    Papa.parse("/relaciones_internacionales.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRelaciones(results.data);
        setFilteredRelaciones(results.data);
       
        fetchFlags(results.data);
      },
      error: (error) => {
        console.error("Error al cargar los datos:", error);
      },
    });
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
        <h3>Filtrar por Estado y Tipo</h3>
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="status">Estado</label>
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
            <label htmlFor="type">Tipo</label>
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
          <button className="reset-button" onClick={resetFilters}>
            Restablecer
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
