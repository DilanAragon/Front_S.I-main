import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Función para exportar a CSV
export const downloadCSV = (data, filename) => {
  let csvContent = "data:text/csv;charset=utf-8,";

  csvContent += "Estadísticas Generales\n";
  // Corregido para usar statsData en lugar de stats
  Object.entries(data.statsData || {}).forEach(([key, value]) => {
    csvContent += `${key},${value}\n`;
  });

  csvContent += "\nDatos de Docentes\n";
  csvContent += "Categoría,Valor\n";
  (data.professorData || []).forEach((item) => {
    csvContent += `${item.name},${item.value}\n`;
  });

  csvContent += "\nProducción Académica\n";
  csvContent += "Categoría,Valor\n";
  (data.productionData || []).forEach((item) => {
    csvContent += `${item.name},${item.value}\n`;
  });

  csvContent += "\nEgresados por Año\n";
  csvContent += "Año,Cantidad\n";
  (data.graduatesPerYearData || []).forEach((item) => {
    csvContent += `${item.year},${item.value}\n`;
  });

  // Crear el enlace de descarga y simulamos un clic
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Función para exportar a Excel
export const downloadExcel = (data, filename) => {
  const workbook = XLSX.utils.book_new();

  // Datos para la hoja de estadísticas generales
  const statsData = Object.entries(data.statsData || {}).map(([key, value]) => [
    key,
    value,
  ]);
  const statsSheet = XLSX.utils.aoa_to_sheet([
    ["Indicador", "Valor"],
    ...statsData,
  ]);

  // Datos para la hoja de docentes
  const professorHeaders = ["Categoría", "Valor"];
  const professorRows = (data.professorData || []).map((item) => [
    item.name,
    item.value,
  ]);
  const professorSheet = XLSX.utils.aoa_to_sheet([
    professorHeaders,
    ...professorRows,
  ]);

  // Datos para la hoja de producción académica
  const productionHeaders = ["Categoría", "Valor"];
  const productionRows = (data.productionData || []).map((item) => [
    item.name,
    item.value,
  ]);
  const productionSheet = XLSX.utils.aoa_to_sheet([
    productionHeaders,
    ...productionRows,
  ]);

  // Datos para la hoja de egresados por año
  const graduatesHeaders = ["Año", "Cantidad"];
  const graduatesRows = (data.graduatesPerYearData || []).map((item) => [
    item.year,
    item.value,
  ]);
  const graduatesSheet = XLSX.utils.aoa_to_sheet([
    graduatesHeaders,
    ...graduatesRows,
  ]);

  // Añadir hojas al libro
  XLSX.utils.book_append_sheet(workbook, statsSheet, "Estadísticas Generales");
  XLSX.utils.book_append_sheet(workbook, professorSheet, "Docentes");
  XLSX.utils.book_append_sheet(
    workbook,
    productionSheet,
    "Producción Académica"
  );
  XLSX.utils.book_append_sheet(workbook, graduatesSheet, "Egresados por Año");

  // Exportar a Excel
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Nueva implementación de la función PDF
export const downloadPDF = (data, filename) => {
  try {
    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(16);
    doc.text("Estadísticas del Programa de Ingeniería de Sistemas", 14, 20);
    doc.setFontSize(12);
    doc.text("Universidad Popular del Cesar", 14, 30);

    // Variables para posicionamiento
    let yPos = 40;

    // ===== PÁGINA 1: ESTADÍSTICAS GENERALES =====
    doc.setFontSize(14);
    doc.text("Estadísticas Generales", 14, yPos);
    yPos += 10;

    // Dibujar tabla simple sin usar autoTable
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(41, 128, 185);
    doc.rect(14, yPos, 80, 8, "F");
    doc.rect(94, yPos, 30, 8, "F");
    doc.text("Indicador", 16, yPos + 5.5);
    doc.text("Valor", 96, yPos + 5.5);
    yPos += 8;

    // Filas de datos
    doc.setTextColor(0, 0, 0);
    let rowCount = 0;

    // Convertir labels a más legibles
    Object.entries(data.statsData || {}).forEach(([key, value]) => {
      let label = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Alternar colores de fondo para las filas
      if (rowCount % 2 === 0) {
        doc.setFillColor(240, 240, 240);
      } else {
        doc.setFillColor(255, 255, 255);
      }

      doc.rect(14, yPos, 80, 8, "F");
      doc.rect(94, yPos, 30, 8, "F");
      doc.text(label, 16, yPos + 5.5);
      doc.text(value.toString(), 96, yPos + 5.5);

      yPos += 8;
      rowCount++;

      // Si llegamos al final de la página, empezar una nueva
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });

    // ===== PÁGINA 2: DOCENTES =====
    doc.addPage();
    yPos = 20;

    doc.setFontSize(14);
    doc.text("Nivel Académico de Docentes", 14, yPos);
    yPos += 10;

    // Dibujar encabezado para docentes
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(41, 128, 185);
    doc.rect(14, yPos, 80, 8, "F");
    doc.rect(94, yPos, 30, 8, "F");
    doc.text("Categoría", 16, yPos + 5.5);
    doc.text("Cantidad", 96, yPos + 5.5);
    yPos += 8;

    // Filas de datos para docentes
    doc.setTextColor(0, 0, 0);
    rowCount = 0;

    (data.professorData || []).forEach((item) => {
      // Alternar colores de fondo
      if (rowCount % 2 === 0) {
        doc.setFillColor(240, 240, 240);
      } else {
        doc.setFillColor(255, 255, 255);
      }

      doc.rect(14, yPos, 80, 8, "F");
      doc.rect(94, yPos, 30, 8, "F");
      doc.text(item.name, 16, yPos + 5.5);
      doc.text(item.value.toString(), 96, yPos + 5.5);

      yPos += 8;
      rowCount++;
    });

    // ===== PÁGINA 3: PRODUCCIÓN ACADÉMICA =====
    doc.addPage();
    yPos = 20;

    doc.setFontSize(14);
    doc.text("Producción Académica", 14, yPos);
    yPos += 10;

    // Dibujar encabezado para producción
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(41, 128, 185);
    doc.rect(14, yPos, 80, 8, "F");
    doc.rect(94, yPos, 30, 8, "F");
    doc.text("Categoría", 16, yPos + 5.5);
    doc.text("Cantidad", 96, yPos + 5.5);
    yPos += 8;

    // Filas de datos para producción
    doc.setTextColor(0, 0, 0);
    rowCount = 0;

    (data.productionData || []).forEach((item) => {
      // Alternar colores de fondo
      if (rowCount % 2 === 0) {
        doc.setFillColor(240, 240, 240);
      } else {
        doc.setFillColor(255, 255, 255);
      }

      doc.rect(14, yPos, 80, 8, "F");
      doc.rect(94, yPos, 30, 8, "F");
      doc.text(item.name, 16, yPos + 5.5);
      doc.text(item.value.toString(), 96, yPos + 5.5);

      yPos += 8;
      rowCount++;
    });

    // ===== PÁGINA 4: EGRESADOS POR AÑO =====
    doc.addPage();
    yPos = 20;

    doc.setFontSize(14);
    doc.text("Egresados por Año", 14, yPos);
    yPos += 10;

    // Dibujar encabezado para egresados
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(41, 128, 185);
    doc.rect(14, yPos, 30, 8, "F");
    doc.rect(44, yPos, 30, 8, "F");
    doc.text("Año", 16, yPos + 5.5);
    doc.text("Cantidad", 46, yPos + 5.5);
    yPos += 8;

    // Filas de datos para egresados
    doc.setTextColor(0, 0, 0);
    rowCount = 0;

    (data.graduatesPerYearData || []).forEach((item) => {
      // Alternar colores de fondo
      if (rowCount % 2 === 0) {
        doc.setFillColor(240, 240, 240);
      } else {
        doc.setFillColor(255, 255, 255);
      }

      doc.rect(14, yPos, 30, 8, "F");
      doc.rect(44, yPos, 30, 8, "F");
      doc.text(item.year, 16, yPos + 5.5);
      doc.text(item.value.toString(), 46, yPos + 5.5);

      yPos += 8;
      rowCount++;
    });

    // Agregar fecha de generación en todas las páginas
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const today = new Date();
      const dateStr = today.toLocaleDateString();
      doc.setFontSize(10);
      doc.text(
        `Documento generado el ${dateStr} - Página ${i} de ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    // Guardar archivo
    doc.save(`${filename}.pdf`);
    console.log("PDF exportado correctamente");
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    alert(
      `Ha ocurrido un error al generar el PDF. Revise la consola para más detalles: ${error.message}`
    );
  }
};
