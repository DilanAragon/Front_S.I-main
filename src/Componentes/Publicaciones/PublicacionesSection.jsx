// src/Componentes/Publicaciones/PublicacionesSection.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api';                // <-- asegúrate de tener src/api.js
import './Publicaciones.css';

export default function PublicacionesSection() {
  // 1. Estado original y filtrado
  const [allPublicaciones, setAllPublicaciones] = useState([]);
  const [publicaciones, setPublicaciones]       = useState([]);

  // 2. Estado de filtros
  const [areaFilter, setAreaFilter]   = useState('');
  const [tipoFilter, setTipoFilter]   = useState('');

  // 3. Carga inicial
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/api/publicaciones/');
        const arr = Array.isArray(data) ? data : [];
        setAllPublicaciones(arr);
        setPublicaciones(arr);
      } catch (err) {
        console.error('Error al cargar publicaciones:', err);
        setAllPublicaciones([]);
        setPublicaciones([]);
      }
    };
    fetchData();
  }, []);

  // 4. Función para aplicar ambos filtros sobre el array completo
  const applyFilters = (area, tipo) => {
    let filtered = allPublicaciones;
    if (area) filtered = filtered.filter(p => p.area === area);
    if (tipo) filtered = filtered.filter(p => p.tipo === tipo);
    setPublicaciones(filtered);
  };

  // 5. Handlers de cambio de filtro
  const onAreaChange = e => {
    const area = e.target.value;
    setAreaFilter(area);
    applyFilters(area, tipoFilter);
  };

  const onTipoChange = e => {
    const tipo = e.target.value;
    setTipoFilter(tipo);
    applyFilters(areaFilter, tipo);
  };

  // 6. Opciones de select siempre del array completo
  const areaOptions = useMemo(
    () => Array.from(new Set(allPublicaciones.map(p => p.area))),
    [allPublicaciones]
  );
  const tipoOptions = useMemo(
    () => Array.from(new Set(allPublicaciones.map(p => p.tipo))),
    [allPublicaciones]
  );

  return (
    <div className="publicacionesContainer">
      <div className="filtrosPublicaciones">
        <div className="grupoFiltro">
          <label htmlFor="area-filter">Area</label>
          <select id="area-filter" value={areaFilter} onChange={onAreaChange}>
            <option value="">Todos</option>
            {areaOptions.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="grupoFiltro">
          <label htmlFor="tipo-filter">Tipo</label>
          <select id="tipo-filter" value={tipoFilter} onChange={onTipoChange}>
            <option value="">Todos</option>
            {tipoOptions.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button className="botonExportarCSV">Exportar CSV</button>
      </div>

      <table className="tablaPublicaciones">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autores</th>
            <th>Area</th>
            <th>Fecha</th>
            <th>Enlace</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {publicaciones.length > 0 ? (
            publicaciones.map(pub => (
              <tr key={pub.publicacion_id}>
                <td>{pub.titulo}</td>
                <td>{pub.autores}</td>
                <td>{pub.area}</td>
                <td>{new Date(pub.fecha).toLocaleDateString()}</td>
                <td>
                  <a href={pub.enlace} target="_blank" rel="noopener noreferrer">
                    Ver
                  </a>
                </td>
                <td>{pub.tipo}</td>
                <td>
                  <button className="botonVerDetalles">Ver detalle</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="noData">
                No se han recibido datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
