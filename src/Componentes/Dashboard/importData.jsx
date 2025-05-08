// ImportData.jsx
import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const ImportData = ({ onDataImported }) => {
  const [importStatus, setImportStatus] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus(`Procesando archivo: ${file.name}...`);

    const fileExt = file.name.split(".").pop().toLowerCase();

    switch (fileExt) {
      case "csv":
        handleCSVImport(file);
        break;
      case "xlsx":
      case "xls":
        handleExcelImport(file);
        break;
      case "pdf":
        handlePDFImport(file);
        break;
      default:
        setImportStatus(`Formato de archivo no soportado: ${fileExt}`);
        setIsImporting(false);
    }
  };

  const handleCSVImport = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        processImportedData(results.data);
      },
      error: (error) => {
        setImportStatus(`Error al procesar CSV: ${error.message}`);
        setIsImporting(false);
      },
    });
  };

  const handleExcelImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });

        // Asumimos que la primera hoja contiene los datos principales
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        processImportedData(jsonData);
      } catch (error) {
        setImportStatus(`Error al procesar Excel: ${error.message}`);
        setIsImporting(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePDFImport = () => {
    // La importación desde PDF es más compleja y requiere extracción de texto
    // Por simplicidad, mostramos una notificación
    setImportStatus(
      "La importación desde PDF está en desarrollo. Por favor, usa CSV o Excel para mejores resultados."
    );
    setIsImporting(false);

    /* Una implementación completa requeriría:
    1. Una biblioteca para extraer texto/tablas de PDF (como pdf.js)
    2. Procesamiento del texto para convertirlo en datos estructurados
    3. Mapping de los datos a la estructura necesaria para actualizar el dashboard
    */
  };

  const processImportedData = (data) => {
    try {
      // Procesamiento común para datos importados desde cualquier fuente

      // Estructura esperada para los datos estadísticos
      const statsData = {};

      // Procesar datos según la estructura
      data.forEach((row) => {
        // Si tenemos una fila con category y value
        if (row.category && row.value !== undefined) {
          statsData[row.category] = isNaN(parseFloat(row.value))
            ? row.value
            : parseFloat(row.value);
        }
        // Si tenemos datos en otro formato (clave-valor directo)
        else {
          Object.entries(row).forEach(([key, value]) => {
            if (key !== "" && value !== undefined && value !== null) {
              statsData[key] = isNaN(parseFloat(value))
                ? value
                : parseFloat(value);
            }
          });
        }
      });

      // Verificar si tenemos datos válidos
      if (Object.keys(statsData).length > 0) {
        // Llamar a la función de callback con los datos procesados
        onDataImported(statsData);
        setImportStatus(
          `Importación exitosa: ${
            Object.keys(statsData).length
          } registros cargados.`
        );
      } else {
        setImportStatus("No se encontraron datos válidos en el archivo.");
      }
    } catch (error) {
      setImportStatus(`Error al procesar los datos: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="import-container">
      <h3>Importar Datos</h3>
      <div className="import-form">
        <div className="file-input-container">
          <input
            type="file"
            id="file-upload"
            accept=".csv,.xlsx,.xls,.pdf"
            onChange={handleFileUpload}
            disabled={isImporting}
            className="file-input"
          />
          <label htmlFor="file-upload" className="file-label">
            {isImporting ? "Importando..." : "Seleccionar archivo"}
          </label>
          <span className="file-format-info">Formatos: CSV, Excel, PDF</span>
        </div>

        {importStatus && (
          <div className={`import-status ${isImporting ? "importing" : ""}`}>
            {importStatus}
          </div>
        )}

        <div className="import-info">
          <h4>Formato Esperado</h4>
          <p>
            El archivo debe contener columnas <code>category</code> y{" "}
            <code>value</code> o pares de clave-valor compatibles con las
            estadísticas del dashboard.
          </p>
          <p>
            Ejemplos de categorías: <code>current_students</code>,{" "}
            <code>total_graduates</code>, <code>employment_rate</code>, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportData;
