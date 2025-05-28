import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import './convenios.css';
const API_URL = import.meta.env.VITE_API_URL;


export default function ConveniosActivos() {
  const [convenios, setConvenios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [conveniosFiltrados, setFiltrados] = useState([]);

  useEffect(() => {
    const fetchConvenios = async () => {
      try {
       const response = await fetch(`https://sistemas-back.onrender.com/api/convenios`);

        const data = await response.json();
        setConvenios(data);
        setFiltrados(data);
      } catch (error) {
        console.error('Error al obtener convenios:', error);
      }
    };

    fetchConvenios();
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
    const csv = conveniosFiltrados.map(row => ({
      Título: row.titulo_compania,
      Tipo: row.tipo_de_convenio,
      Descripción: row.descripcion,
      Beneficios: row.beneficios,
      Inicio: row.fecha,
      Vence: row.fecha_vencimiento,
      Estado: row.estatus
    }));
    const csvContent = "data:text/csv;charset=utf-8," +
      [Object.keys(csv[0]).join(","), ...csv.map(row => Object.values(row).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "convenios_exportados.csv");
    document.body.appendChild(link);
    link.click();
  };

  const columns = [
    { name: 'Título', selector: row => row.titulo_compania, sortable: true, wrap: true },
    { name: 'Tipo', selector: row => row.tipo_de_convenio, sortable: true, width: '120px' },
    { name: 'Descripción', selector: row => row.descripcion, wrap: true, grow: 2, center: true },
    { name: 'Beneficios', selector: row => row.beneficios, wrap: true },
    { name: 'Inicio', selector: row => row.fecha, sortable: true, width: '120px' },
    { name: 'Vence', selector: row => row.fecha_vencimiento, sortable: true, width: '120px' },
    { name: 'Estado', selector: row => row.estatus, sortable: true, width: '120px' },
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
