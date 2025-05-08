import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import DataTable from 'react-data-table-component';
import './Empresas.css'; // Reutiliza estilos de filtro y tabla

export default function ConveniosActivos() {
  const [convenios, setConvenios]             = useState([]);
  const [filtro, setFiltro]                   = useState('');
  const [conveniosFiltrados, setFiltrados]    = useState([]);

  // 1) Cargar CSV limpio
  useEffect(() => {
    Papa.parse('/convenios_reales.csv', {
      download: true,
      header: true,
      complete: (results) => {
        // eliminamos filas vacías
        const datos = results.data.filter(row =>
          Object.values(row).some(cell => cell)
        );
        setConvenios(datos);
        setFiltrados(datos);
      },
    });
  }, []);

  // 2) Filtrar al cambiar el texto
  useEffect(() => {
    const lower = filtro.toLowerCase();
    const filtered = convenios.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(lower)
      )
    );
    setFiltrados(filtered);
  }, [filtro, convenios]);

  // 3) Definición de columnas para DataTable
  const columns = [
    {
      name: 'Título',
      selector: row => row.title,
      sortable: true,
      wrap: true
    },
    {
      name: 'Tipo',
      selector: row => row.type,
      sortable: true,
      width: '120px'
    },
    {
          name: 'Descripción',
         selector: row => row.description,
         wrap: true,
         grow: 2,
          center: true          // ← esto centra header y celdas
        },
    
    {
      name: 'Inicio',
      selector: row => row.signedDate,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Vence',
      selector: row => row.expirationDate,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Estado',
      selector: row => row.status,
      sortable: true,
      width: '100px'
    },
  ];

  return (
    <div className="p-6 w-full">
      {/* Título */}
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        Convenios Activos
      </h1>

      {/* Filtro */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Buscar título, tipo, estado..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="border border-gray-300 rounded text-sm w-full sm:w-96 h-10 px-3"
        />
      </div>

      {/* Tabla de convenios */}
      <DataTable
        columns={columns}
        data={conveniosFiltrados}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No se encontraron convenios"
      />
    </div>
  );
}
