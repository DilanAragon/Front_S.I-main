// src/Componentes/Publicaciones/PublicacionesSection.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api';
import './Publicaciones.css';

export default function PublicacionesSection() {
  // Datos y filtros
  const [allPublicaciones, setAllPublicaciones] = useState([]);
  const [publicaciones, setPublicaciones]       = useState([]);
  const [areaFilter, setAreaFilter]             = useState('');
  const [tipoFilter, setTipoFilter]             = useState('');

  // CSV upload y creación
  const [csvFile, setCsvFile]                   = useState(null);
  const [showCreateForm, setShowCreateForm]     = useState(false);
  const [newPub, setNewPub] = useState({
    titulo: '', autores: '', area: '', fecha: '', enlace: '', tipo: ''
  });

  // Edición inline
  const [editingId, setEditingId] = useState(null);
  const [editPub, setEditPub]     = useState({});

  // Modal de detalles
  const [detailPub, setDetailPub] = useState(null);

  // Carga inicial
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
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

  // Aplica filtros sobre el array completo
  const applyFilters = (area, tipo) => {
    let filtered = allPublicaciones;
    if (area) filtered = filtered.filter(p => p.area === area);
    if (tipo) filtered = filtered.filter(p => p.tipo === tipo);
    setPublicaciones(filtered);
  };

  // Handlers de filtro
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

  // Opciones para selects (siempre del array completo)
  const areaOptions = useMemo(
    () => Array.from(new Set(allPublicaciones.map(p => p.area))),
    [allPublicaciones]
  );
  const tipoOptions = useMemo(
    () => Array.from(new Set(allPublicaciones.map(p => p.tipo))),
    [allPublicaciones]
  );

  // Subir CSV
  const uploadCsv = async () => {
    if (!csvFile) return alert('Selecciona un archivo CSV');
    const form = new FormData();
    form.append('file', csvFile);
    try {
      await api.post('/api/publicaciones/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchAll();
      setCsvFile(null);
    } catch (err) {
      console.error('Error al subir CSV:', err);
      alert('Error al subir CSV');
    }
  };

  // Crear nueva publicación
  const handleCreate = async e => {
    e.preventDefault();
    try {
      await api.post('/api/publicaciones/', newPub);
      fetchAll();
      setNewPub({ titulo: '', autores: '', area: '', fecha: '', enlace: '', tipo: '' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error al crear publicación:', err);
      alert('Error al crear publicación');
    }
  };

  // Eliminar
  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    try {
      await api.delete(`/api/publicaciones/${id}`);
      fetchAll();
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar');
    }
  };

  // Editar inline
  const startEdit = pub => {
    setEditingId(pub.publicacion_id);
    setEditPub({
      titulo: pub.titulo,
      autores: pub.autores,
      area: pub.area,
      fecha: pub.fecha,
      enlace: pub.enlace,
      tipo: pub.tipo
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditPub({});
  };
  const handleSaveEdit = async id => {
    try {
      await api.put(`/api/publicaciones/${id}`, editPub);
      fetchAll();
      cancelEdit();
    } catch (err) {
      console.error('Error al guardar edición:', err);
      alert('Error al guardar edición');
    }
  };

  // Detalles modal
  const openDetail = pub => setDetailPub(pub);
  const closeDetail = () => setDetailPub(null);

  return (
    <div className="publicacionesContainer">
      {/* ===== Acciones Globales ===== */}
      <div className="actionsPublicaciones">
        <div className="csvUpload">
          <input
            type="file"
            accept=".csv"
            onChange={e => setCsvFile(e.target.files[0])}
          />
          <button onClick={uploadCsv}>Subir CSV</button>
        </div>
        <button
          className="botonNuevaPub"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancelar' : 'Nueva publicación'}
        </button>
      </div>

      {/* ===== Formulario de Creación ===== */}
      {showCreateForm && (
        <form className="formCreate" onSubmit={handleCreate}>
          {['titulo','autores','area','fecha','enlace','tipo'].map(field => (
            <div className="formGroup" key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
              <input
                id={field}
                type={field === 'fecha' ? 'date' : 'text'}
                value={newPub[field]}
                onChange={e => setNewPub({ ...newPub, [field]: e.target.value })}
                required
              />
            </div>
          ))}
          <button type="submit" className="botonSubmit">Crear</button>
        </form>
      )}

      {/* ===== Filtros ===== */}
      <div className="filtrosPublicaciones">
        <div className="grupoFiltro">
          <label htmlFor="area-filter">Area</label>
          <select id="area-filter" value={areaFilter} onChange={onAreaChange}>
            <option value="">Todos</option>
            {areaOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="grupoFiltro">
          <label htmlFor="tipo-filter">Tipo</label>
          <select id="tipo-filter" value={tipoFilter} onChange={onTipoChange}>
            <option value="">Todos</option>
            {tipoOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* ===== Tabla ===== */}
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
                {editingId === pub.publicacion_id ? (
                  <>
                    <td><input value={editPub.titulo}  onChange={e => setEditPub({...editPub, titulo: e.target.value})}  /></td>
                    <td><input value={editPub.autores} onChange={e => setEditPub({...editPub, autores: e.target.value})}/></td>
                    <td><input value={editPub.area}    onChange={e => setEditPub({...editPub, area: e.target.value})}   /></td>
                    <td><input type="date" value={editPub.fecha} onChange={e => setEditPub({...editPub, fecha: e.target.value})} /></td>
                    <td><input value={editPub.enlace}  onChange={e => setEditPub({...editPub, enlace: e.target.value})} /></td>
                    <td><input value={editPub.tipo}    onChange={e => setEditPub({...editPub, tipo: e.target.value})}   /></td>
                    <td className="accionCell">
                      <button onClick={() => handleSaveEdit(pub.publicacion_id)}>Guardar</button>
                      <button onClick={cancelEdit}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{pub.titulo}</td>
                    <td>{pub.autores}</td>
                    <td>{pub.area}</td>
                    <td>{new Date(pub.fecha).toLocaleDateString()}</td>
                    <td>
                      <a href={pub.enlace} target="_blank" rel="noopener noreferrer">Ver</a>
                    </td>
                    <td>{pub.tipo}</td>
                    <td className="accionCell">
                      <button onClick={() => openDetail(pub)}>Detalles</button>
                      <button onClick={() => startEdit(pub)}>Editar</button>
                      <button onClick={() => handleDelete(pub.publicacion_id)}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="noData">No se han recibido datos</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ===== Modal de Detalles ===== */}
      {detailPub && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Detalles de Publicación</h3>
            <ul>
              <li><strong>ID:</strong> {detailPub.publicacion_id}</li>
              <li><strong>Título:</strong> {detailPub.titulo}</li>
              <li><strong>Autores:</strong> {detailPub.autores}</li>
              <li><strong>Area:</strong> {detailPub.area}</li>
              <li><strong>Fecha:</strong> {new Date(detailPub.fecha).toLocaleDateString()}</li>
              <li><strong>Enlace:</strong> <a href={detailPub.enlace} target="_blank" rel="noopener noreferrer">Abrir</a></li>
              <li><strong>Tipo:</strong> {detailPub.tipo}</li>
            </ul>
            <button onClick={() => setDetailPub(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
