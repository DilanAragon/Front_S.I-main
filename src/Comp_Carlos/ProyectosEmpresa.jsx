import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import './Empresas.css'; // reutiliza tus estilos de tabla y filtro

export default function ProyectosEmpresa() {
  // Datos reales hard-codeados
  const sampleData = [
    {
      proyecto: 'Escalando la Innovación en la Región Caribe',
      empresa: 'Futurizza S.A.S.',
      descripcion:
        'Proyecto para impulsar el tejido empresarial de la Región Caribe, financiando prototipos y escalando procesos de innovación con 14 empresas beneficiarias.',
      fechaInicio: '2024-02-15',
      fechaFin:    '2024-12-31',
      estado:      'En curso',
    },
    {
      proyecto: 'Fortalecimiento del Emprendimiento con Enactus Colombia',
      empresa: 'Enactus Colombia',
      descripcion:
        'Alianza estratégica para fortalecer competencias interdisciplinarias en emprendimiento e innovación, incorporando inglés y diseño de proyectos productivos de impacto social.',
      fechaInicio: '2025-02-25',
      fechaFin:    '2025-08-25',
      estado:      'En curso',
    },
    {
      proyecto: 'Mesa de Trabajo “Transición Energética Justa en el Cesar”',
      empresa: 'Gobernación del Cesar · UPME · Movimiento No Fracking',
      descripcion:
        'Encuentro técnico para definir políticas y estrategias de transición energética justa en el Cesar, articulando actores gubernamentales y sociales.',
      fechaInicio: '2025-04-25',
      fechaFin:    '2025-04-25',
      estado:      'Completado',
    },
  ];

  const [proyectos, setProyectos]           = useState([]);
  const [filtro, setFiltro]                 = useState('');
  const [proyectosFiltrados, setFiltrados]  = useState([]);

  useEffect(() => {
    // Cargamos los datos reales de ejemplo
    setProyectos(sampleData);
    setFiltrados(sampleData);
  }, []);

  useEffect(() => {
    const lower = filtro.toLowerCase();
    setFiltrados(
      proyectos.filter(p =>
        Object.values(p).some(v =>
          String(v).toLowerCase().includes(lower)
        )
      )
    );
  }, [filtro, proyectos]);

  const columns = [
    { name: 'Proyecto', selector: row => row.proyecto, sortable: true, wrap: true },
    { name: 'Empresa',  selector: row => row.empresa,  sortable: true, wrap: true },
    {
      name: 'Descripción',
      selector: row => row.descripcion,
      wrap: true,
      grow: 2,
      center: false
    },
    { name: 'Inicio',   selector: row => row.fechaInicio, sortable: true, width: '120px' },
    { name: 'Finaliza', selector: row => row.fechaFin,    sortable: true, width: '120px' },
    { name: 'Estado',   selector: row => row.estado,      sortable: true, width: '100px' },
  ];

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        Proyectos Universidad–Empresa
      </h1>

      {/* Filtro */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Buscar proyecto, empresa, estado..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="border border-gray-300 rounded text-sm w-full sm:w-96 h-10 px-3"
        />
      </div>

      {/* Tabla */}
      <DataTable
        columns={columns}
        data={proyectosFiltrados}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No se encontraron proyectos"
      />
    </div>
  );
}
