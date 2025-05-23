import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import DataTable from 'react-data-table-component';
import './convenios.css';

export default function ConveniosActivos() {
  const [convenios, setConvenios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [conveniosFiltrados, setFiltrados] = useState([]);

  useEffect(() => {
    Papa.parse('/convenios_reales.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const datos = results.data.filter(row =>
          Object.values(row).some(cell => cell)
        );
        setConvenios(datos);
        setFiltrados(datos);
      },
    });
  }, []);

  useEffect(() => {
    const lower = filtro.toLowerCase();
    const filtered = convenios.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(lower)
      )
    );
    setFiltrados(filtered);
  }, [filtro, convenios]);

  const exportCSV = () => {
    const csv = Papa.unparse(conveniosFiltrados);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'convenios_exportados.csv');
    link.click();
  };

  const columns = [
    {
      name: 'Título',
      selector: row => row.title,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Tipo',
      selector: row => row.type,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Descripción',
      selector: row => row.description,
      wrap: true,
      grow: 2,
      center: true,
    },
    {
      name: 'Inicio',
      selector: row => row.signedDate,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Vence',
      selector: row => row.expirationDate,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Estado',
      selector: row => row.status,
      sortable: true,
      width: '120px',
    },
  ];

  return (
    <div className="contenedor">
      <h1 className="titulo">Convenios Activos</h1>

      <div className="barra-filtros">
        <input
          type="text"
          placeholder="Buscar por título, tipo, estado..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="input-filtro"
        />
        <button className="btn-exportar" onClick={exportCSV}>
          Exportar CSV
        </button>
      </div>

      <DataTable
        columns={columns}
        data={conveniosFiltrados}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No se encontraron convenios"
        customStyles={{
          headRow: {
            style: {
              backgroundColor: '#34a853',
              color: 'white',
              fontWeight: 'bold',
            },
          },
        }}
      />
    </div>
  );
}
