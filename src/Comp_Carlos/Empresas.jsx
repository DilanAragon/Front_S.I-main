import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import DataTable from 'react-data-table-component';
import './Empresas.css';

const Empresas = () => {
  // Estados
  const [empresas, setEmpresas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [ciudadFiltro, setCiudadFiltro] = useState('');
  const [sectorFiltro, setSectorFiltro] = useState('');
  const [empresasFiltradas, setEmpresasFiltradas] = useState([]);
  const [ciudadesUnicas, setCiudadesUnicas] = useState([]);
  const [sectoresUnicos, setSectoresUnicos] = useState([]);

  // Efectos
  useEffect(() => {
    const cargarDatos = async () => {
      Papa.parse('/empresas_reales.csv', {
        download: true,
        header: true,
        complete: (results) => {
          const datosLimpios = results.data.filter(row => 
            Object.values(row).some(Boolean)
          );
          
          setEmpresas(datosLimpios);
          setEmpresasFiltradas(datosLimpios);
          
          // Extraer valores únicos
          const ciudades = [...new Set(datosLimpios.map(e => e.Ciudad).filter(Boolean))].sort();
          const sectores = [...new Set(datosLimpios.map(e => e.Sector).filter(Boolean))].sort();
          
          setCiudadesUnicas(ciudades);
          setSectoresUnicos(sectores);
        }
      });
    };
    
    cargarDatos();
  }, []);

  useEffect(() => {
    const aplicarFiltros = () => {
      const filtroLower = filtro.toLowerCase();
      const ciudadLower = ciudadFiltro.toLowerCase();
      const sectorLower = sectorFiltro.toLowerCase();

      return empresas.filter(empresa => {
        const nombre = empresa.Nombre?.toLowerCase() || '';
        const ciudad = empresa.Ciudad?.toLowerCase() || '';
        const sector = empresa.Sector?.toLowerCase() || '';

        return (
          (nombre.includes(filtroLower) || 
           ciudad.includes(filtroLower) || 
           sector.includes(filtroLower)) &&
          (!ciudadFiltro || ciudad === ciudadLower) &&
          (!sectorFiltro || sector === sectorLower)
        );
      });
    };

    setEmpresasFiltradas(aplicarFiltros());
  }, [filtro, ciudadFiltro, sectorFiltro, empresas]);

  // Handlers
  const manejarExportacion = () => {
    const csv = Papa.unparse(empresasFiltradas);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.setAttribute('download', 'empresas_filtradas.csv');
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  };

  const limpiarFiltros = () => {
    setFiltro('');
    setCiudadFiltro('');
    setSectorFiltro('');
  };

  // Configuración de columnas
  const columnas = [
    { name: 'Nombre', selector: row => row.Nombre, sortable: true, wrap: true },
    { name: 'Sector', selector: row => row.Sector, sortable: true },
    { name: 'Ciudad', selector: row => row.Ciudad, sortable: true },
    { name: 'Teléfono', selector: row => row.Teléfono },
    { name: 'Correo', selector: row => row.Correo },
    {
      name: 'Sitio Web',
      cell: row => (
        <a
          href={row['Sitio Web']}
          target="_blank"
          rel="noopener noreferrer"
          className="enlace-empresa"
        >
          Visitar
        </a>
      ),
      ignoreRowClick: true,
      button: true,
    },
    { name: 'Contacto', selector: row => row.Contacto },
  ];

  return (
    <div className="contenedor-principal">
      <header className="cabecera-seccion">
        <h1>Directorio de Empresas</h1>
      </header>

      <section className="filter-section">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="ciudadFiltro">Ciudad</label>
            <select
              id="ciudadFiltro"
              value={ciudadFiltro}
              onChange={e => setCiudadFiltro(e.target.value)}
            >
              <option value="">Todas las ciudades</option>
              {ciudadesUnicas.map(ciudad => (
                <option key={ciudad} value={ciudad}>{ciudad}</option>
              ))}
            </select>
          </div>
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
              placeholder="Nombre, ciudad o sector"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
          </div>
        </div>
        <div className="buttons-group">
          <button className="reset-button" onClick={limpiarFiltros}>Reiniciar Filtros</button>
          <button className="export-button" onClick={manejarExportacion}>Exportar Datos</button>
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
          noDataComponent={
            <div className="sin-resultados">
              No se encontraron empresas con los criterios actuales
            </div>
          }
        />
      </section>
    </div>
  );
};

export default Empresas;