import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
const API_URL = import.meta.env.VITE_API_URL;

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [sectorFiltro, setSectorFiltro] = useState('');
  const [empresasFiltradas, setEmpresasFiltradas] = useState([]);
  const [sectoresUnicos, setSectoresUnicos] = useState([]);


  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/empresas`);
        const data = await response.json();

        setEmpresas(data);
        setEmpresasFiltradas(data);

        // Extraer sectores únicos
        const sectores = [...new Set(data.map(e => e.sector).filter(Boolean))].sort();
        setSectoresUnicos(sectores);
      } catch (error) {
        console.error("Error cargando empresas:", error);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const filtroLower = filtro.toLowerCase();
    const sectorLower = sectorFiltro.toLowerCase();

    const filtradas = empresas.filter(e => {
      const nombre = e.nombre_empresa?.toLowerCase() || '';
      const sector = e.sector?.toLowerCase() || '';

      return (
        (nombre.includes(filtroLower) || sector.includes(filtroLower)) &&
        (!sectorFiltro || sector === sectorLower)
      );
    });
    setEmpresasFiltradas(filtradas);
  }, [filtro, sectorFiltro, empresas]);

  const columnas = [
    { name: 'Nombre', selector: row => row.nombre_empresa, sortable: true, wrap: true },
    { name: 'Sector', selector: row => row.sector, sortable: true },
    { name: 'NIT', selector: row => row.nit },
    { name: 'Fecha Convenio', selector: row => row.fecha_convenio },
  ];

  return (
    <div className="contenedor-principal">
      <header className="cabecera-seccion">
        <h1>Directorio de Empresas</h1>
      </header>

      <section className="filter-section">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="sectorFiltro">Sector</label>
            <select
              id="sectorFiltro"
              value={sectorFiltro}
              onChange={e => setSectorFiltro(e.target.value)}
            >
              <option value="">Todos los sectores</option>
              {sectoresUnicos.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="nombreFiltro">Buscar</label>
            <input
              type="text"
              id="nombreFiltro"
              placeholder="Nombre o sector"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="tabla-datos">
        <DataTable
          columns={columnas}
          data={empresasFiltradas}
          pagination
          responsive
          highlightOnHover
          striped
          noDataComponent={<div className="sin-resultados">No se encontraron empresas con los criterios actuales</div>}
        />
      </section>
    </div>
  );
};

export default Empresas;
