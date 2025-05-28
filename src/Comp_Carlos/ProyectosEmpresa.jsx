import React, { useState, useEffect } from 'react';
import './proyectos.css';

export default function ImpactoProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [empresaFiltro, setEmpresaFiltro] = useState('');
  const [proyectosFiltrados, setProyectosFiltrados] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar proyectos desde API al montar componente
  useEffect(() => {
    const cargarProyectos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/proyectos`);
        if (!res.ok) throw new Error("Error cargando proyectos");
        const data = await res.json();

        // Transformar datos para que coincidan con los campos usados en la UI
        const proyectosTransformados = data.map(p => ({
          id: p.proyecto_id,
          proyecto: p.titulo,
               // Ajusta si el API no tiene este campo
         
          fechaInicio: p.fecha_inicio || '',
         
          estado: p.estado || 'Planificado', // Ajusta según lo que maneje tu API
        }));

        setProyectos(proyectosTransformados);
        setProyectosFiltrados(proyectosTransformados);
      } catch (error) {
        console.error(error);
        setProyectos([]);
        setProyectosFiltrados([]);
      }
    };

    cargarProyectos();
  }, [API_URL]);

  // Filtrar proyectos según filtros activos
  useEffect(() => {
    let filtrados = proyectos;

    if (estadoFiltro) {
      filtrados = filtrados.filter(p => p.estado === estadoFiltro);
    }

    if (empresaFiltro) {
      filtrados = filtrados.filter(p =>
        p.empresa.toLowerCase().includes(empresaFiltro.toLowerCase())
      );
    }

    setProyectosFiltrados(filtrados);
  }, [estadoFiltro, empresaFiltro, proyectos]);

  const resetFiltros = () => {
    setEstadoFiltro('');
    setEmpresaFiltro('');
  };

  const estadoClase = (estado) => {
    switch (estado.toLowerCase()) {
      case 'completado':
        return 'status-employed';
      case 'en curso':
        return 'status-studying';
      case 'planificado':
        return 'status-searching';
      default:
        return '';
    }
  };

  // Exportar proyectos filtrados a CSV
  const exportarCSV = () => {
    if (proyectosFiltrados.length === 0) {
      alert('No hay proyectos para exportar.');
      return;
    }

    const headers = ['Proyecto', 'Fecha Inicio', 'Estado'];

    const rows = proyectosFiltrados.map(p => [
      p.proyecto,
      p.fechaInicio,
      p.estado,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row
          .map(field => `"${field.replace(/"/g, '""')}"`) // Escapar comillas dobles
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'proyectos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="impacto-container">
      <header className="impacto-header">
        <h1>Proyectos Universidad–Empresa</h1>
      </header>

      <section className="filter-section">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="estadoFiltro">Estado</label>
            <select
              id="estadoFiltro"
              value={estadoFiltro}
              onChange={e => setEstadoFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="En curso">En curso</option>
              <option value="Completado">Completado</option>
              <option value="Planificado">Planificado</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="empresaFiltro">Empresa</label>
            <input
              type="text"
              id="empresaFiltro"
              placeholder="Buscar empresa"
              value={empresaFiltro}
              onChange={e => setEmpresaFiltro(e.target.value)}
            />
          </div>
        </div>
        <div className="buttons-group">
          <button className="reset-button" onClick={resetFiltros}>Limpiar filtros</button>
          <button className="export-button" onClick={exportarCSV}>Exportar CSV</button>
        </div>
      </section>
      <div className="impacto-table-container">
        {proyectosFiltrados.length === 0 ? (
          <div className="no-results">No se encontraron proyectos.</div>
        ) : (
          <table className="impacto-table">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Fecha Inicio</th>
                <th>Estado</th>
                <th>Contacto</th>
              </tr>
            </thead>
            <tbody>
              {proyectosFiltrados.map((p) => (
                <tr key={p.id} className="proyecto-row">
                  <td className="name-cell">{p.proyecto}</td>
                  <td>{p.empresa}</td>
                  <td>{p.descripcion}</td>
                  <td className="fecha-cell">{p.fechaInicio}</td>
                  <td className="fecha-cell">{p.fechaFin}</td>
                  <td className={`status-cell`}>
                    <span className={`status-badge ${estadoClase(p.estado)}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="contact-cell">
                    <button
                      onClick={() => alert(`Contactar sobre proyecto: ${p.proyecto}`)}
                    >
                      Contactar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
