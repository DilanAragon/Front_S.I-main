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
    fetch(`${import.meta.env.VITE_API_URL}/api/relaciones-internacionales/`)
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(p => ({
          name: p.nombre,
          country: p.pais.toLowerCase(),
          institution: p.institucion,
          type: p.tipo,
          startDate: p.fecha_inicio,
          endDate: p.fecha_finalizacion,
          description: p.descripcion,
          participants: p.participantes,
          results: p.resultados,
          status: p.estado,
        }));
        setRelaciones(mapped);
        setFilteredRelaciones(mapped);
        fetchFlags(mapped);
      })
      .catch(err => console.error("Error al obtener relaciones:", err));
  }, []);

  const fetchFlags = list => {
    const codes = [...new Set(list.map(r => r.country))];
    codes.forEach(async code => {
      try {
        const resp = await axios.get(`https://flagcdn.com/w40/${code}.png`);
        setFlagUrls(u => ({ ...u, [code]: resp.request.responseURL }));
      } catch {
        setFlagUrls(u => ({ ...u, [code]: null }));
      }
    });
  };

  useEffect(() => {
    let tmp = relaciones;
    if (filterStatus) tmp = tmp.filter(r => r.status === filterStatus);
    if (filterType)   tmp = tmp.filter(r => r.type   === filterType);
    setFilteredRelaciones(tmp);
  }, [relaciones, filterStatus, filterType]);

  const resetFilters = () => {
    setFilterStatus("");
    setFilterType("");
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredRelaciones);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relaciones_internacionales.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusLabel = s =>
    s === "active"   ? "Activo" :
    s === "inactive" ? "Inactivo" :
    s === "pending"  ? "Pendiente" : s;

  const statusClass = s =>
    s === "active"   ? "status-employed" :
    s === "inactive" ? "status-studying" :
    s === "pending"  ? "status-searching" : "";

  const typeLabel = t =>
    t === "agreement" ? "Convenio" :
    t === "mobility"  ? "Movilidad" :
    t === "network"   ? "Red" :
    t === "project"   ? "Proyecto" : t;

  const handleVerMas = r => {
    setSelectedRelacion(r);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  return (
    <div className="impacto-container">
      <div className="impacto-header">
        <h1>Relaciones Internacionales</h1>
        <p>Universidad Popular del Cesar – Ingeniería de Sistemas</p>
      </div>

      <div className="filter-section">
        <div className="filters-container">
          <div className="filter-group">
            <label>Estado</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
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
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="agreement">Convenio</option>
              <option value="mobility">Movilidad</option>
              <option value="network">Red</option>
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
              {filteredRelaciones.map((r,i) => (
                <tr key={i} className="proyecto-row">
                  <td>{r.name}</td>
                  <td>
                    {flagUrls[r.country] 
                      ? <img src={flagUrls[r.country]} alt={r.country} className="country-flag"/>
                      : r.country}
                  </td>
                  <td>{r.institution}</td>
                  <td>{typeLabel(r.type)}</td>
                  <td className="year-cell">{r.startDate}</td>
                  <td className="year-cell">{r.endDate}</td>
                  <td>
                    <span className={`status-badge ${statusClass(r.status)}`}>
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleVerMas(r)} className="contact-button-table email">
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
