import { useState, useEffect } from "react";
import Papa from "papaparse";
import "./salidas_practicas.css";

const SalidasPracticas = () => {
  const [salidas, setSalidas] = useState([]);
  const [filteredSalidas, setFilteredSalidas] = useState([]);
  const [filterLugar, setFilterLugar] = useState("");
  const [filterResponsable, setFilterResponsable] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSalida, setSelectedSalida] = useState(null);

useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/salidas-practicas/`);
        const data = await response.json();
        // Aquí mapeamos los campos al formato que ya usas en el frontend
        const mappedData = data.map(p => ({
          fecha_salida: p.fecha_salida,
          lugar_destino: p.lugar_destino,
          responsable: p.responsable,
          cantidad_estudiantes: p.cantidad_estudiantes,
          hora_salida: p.hora_salida,
          hora_regreso: p.hora_regreso,
          observaciones: p.observaciones
          
        }));
          setSalidas(mappedData);
          setFilteredSalidas(mappedData);
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
      }
    };
  
    fetchProyectos();
  }, []);
  

  // Filtrar cuando cambian los filtros o los datos
  useEffect(() => {
    let filtradas = salidas;

    if (filterLugar) {
      filtradas = filtradas.filter(
        (s) => s.lugar_destino === filterLugar
      );
    }

    if (filterResponsable) {
      filtradas = filtradas.filter(
        (s) => s.responsable === filterResponsable
      );
    }

    setFilteredSalidas(filtradas);
  }, [filterLugar, filterResponsable, salidas]);

  // Obtener opciones únicas para filtros
  const lugaresUnicos = Array.from(
    new Set(salidas.map((s) => s.lugar_destino).filter(Boolean))
  );

  const responsablesUnicos = Array.from(
    new Set(salidas.map((s) => s.responsable).filter(Boolean))
  );

  const exportToCSV = () => {
    const csv = Papa.unparse(filteredSalidas);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "salidas_practicas_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVerMas = (salida) => {
    setSelectedSalida(salida);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSalida(null);
  };

  const resetFilters = () => {
    setFilterLugar("");
    setFilterResponsable("");
  };

  return (
    <div className="salidas-container">
      <div className="salidas-header">
        <h1>Salidas Prácticas</h1>
        <p>Universidad Popular del Cesar - Ingeniería de Sistemas</p>
      </div>

      <div className="filter-section">
        <div className="filters-container">
          <div className="filter-group">
            <label>Lugar Destino</label>
            <select
              value={filterLugar}
              onChange={(e) => setFilterLugar(e.target.value)}
            >
              <option value="">Todos</option>
              {lugaresUnicos.map((lugar, idx) => (
                <option key={idx} value={lugar}>
                  {lugar}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Responsable</label>
            <select
              value={filterResponsable}
              onChange={(e) => setFilterResponsable(e.target.value)}
            >
              <option value="">Todos</option>
              {responsablesUnicos.map((resp, idx) => (
                <option key={idx} value={resp}>
                  {resp}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button className="reset-button" onClick={resetFilters}>
            Restablecer filtros
          </button>
          <button className="export-button" onClick={exportToCSV}>
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="salidas-table-container">
        {filteredSalidas.length > 0 ? (
          <table className="salidas-table">
            <thead>
              <tr>
                <th>Fecha Salida</th>
                <th>Lugar Destino</th>
                <th>Responsable</th>
                <th>Cantidad Estudiantes</th>
                <th>Hora Salida</th>
                <th>Hora Regreso</th>
                <th>Observaciones</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalidas.map((salida, index) => (
                <tr key={index}>
                  <td>{salida.fecha_salida}</td>
                  <td>{salida.lugar_destino}</td>
                  <td>{salida.responsable}</td>
                  <td>{salida.cantidad_estudiantes}</td>
                  <td>{salida.hora_salida}</td>
                  <td>{salida.hora_regreso}</td>
                  <td>{salida.observaciones}</td>
                  <td>
                    <button
                      onClick={() => handleVerMas(salida)}
                      className="ver-button"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay salidas prácticas registradas.</p>
        )}
      </div>

      {showModal && selectedSalida && (
        <div className="modal">
          <div className="modal-content">
            <h2>Detalles de la salida</h2>
            <p>
              <strong>Fecha Salida:</strong> {selectedSalida.fecha_salida}
            </p>
            <p>
              <strong>Lugar Destino:</strong> {selectedSalida.lugar_destino}
            </p>
            <p>
              <strong>Responsable:</strong> {selectedSalida.responsable}
            </p>
            <p>
              <strong>Cantidad Estudiantes:</strong>{" "}
              {selectedSalida.cantidad_estudiantes}
            </p>
            <p>
              <strong>Hora Salida:</strong> {selectedSalida.hora_salida}
            </p>
            <p>
              <strong>Hora Regreso:</strong> {selectedSalida.hora_regreso}
            </p>
            <p>
              <strong>Observaciones:</strong> {selectedSalida.observaciones}
            </p>
            <button onClick={closeModal} className="close-modal">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalidasPracticas;
