import React, { useState, useEffect } from 'react';
import './proyectos.css';

export default function ImpactoProyectos() {
  const proyectosEjemplo = [
    {
      id: 1,
      proyecto: 'Escalando la Innovación en la Región Caribe',
      empresa: 'Futurizza S.A.S.',
      descripcion:
        'Proyecto para impulsar el tejido empresarial de la Región Caribe, financiando prototipos y escalando procesos de innovación con 14 empresas beneficiarias.',
      fechaInicio: '2024-02-15',
      fechaFin: '2024-12-31',
      estado: 'En curso',
    },
    {
      id: 2,
      proyecto: 'Fortalecimiento del Emprendimiento con Enactus Colombia',
      empresa: 'Enactus Colombia',
      descripcion:
        'Alianza estratégica para fortalecer competencias interdisciplinarias en emprendimiento e innovación.',
      fechaInicio: '2025-02-25',
      fechaFin: '2025-08-25',
      estado: 'En curso',
    },
    {
      id: 3,
      proyecto: 'Mesa de Trabajo “Transición Energética Justa en el Cesar”',
      empresa: 'Gobernación del Cesar · UPME · Movimiento No Fracking',
      descripcion:
        'Encuentro técnico para definir políticas y estrategias de transición energética justa en el Cesar.',
      fechaInicio: '2025-04-25',
      fechaFin: '2025-04-25',
      estado: 'Completado',
    },
  ];

  const [proyectos] = useState(proyectosEjemplo);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [empresaFiltro, setEmpresaFiltro] = useState('');
  const [proyectosFiltrados, setProyectosFiltrados] = useState(proyectosEjemplo);

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

  // Función para exportar a CSV los proyectos filtrados
  const exportarCSV = () => {
    if (proyectosFiltrados.length === 0) {
      alert('No hay proyectos para exportar.');
      return;
    }

    const headers = ['Proyecto', 'Empresa', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Estado'];

    const rows = proyectosFiltrados.map(p => [
      p.proyecto,
      p.empresa,
      p.descripcion,
      p.fechaInicio,
      p.fechaFin,
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
        <p>Listado de proyectos con filtros y detalles relevantes.</p>
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
                <th>Empresa</th>
                <th>Descripción</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
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
