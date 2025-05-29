import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Función para exportar a CSV
export const downloadCSV = (
  estadisticas,
  filename = "dashboard_estadisticas"
) => {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Encabezado
  csvContent += "Sistema Integrado de Visibilidad y Vinculación Externa\n";
  csvContent +=
    "Programa de Ingeniería de Sistemas - Universidad Popular del Cesar\n\n";

  // Todas las estadísticas
  csvContent += "Categoría,Valor\n";
  estadisticas.forEach((stat) => {
    csvContent += `${stat.categoria},${stat.value}\n`;
  });

  // Crear el enlace de descarga
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Función para exportar a Excel
export const downloadExcel = (
  estadisticas,
  filename = "dashboard_estadisticas"
) => {
  const workbook = XLSX.utils.book_new();

  // Crear hoja principal con todas las estadísticas
  const allStatsData = estadisticas.map((stat) => [stat.categoria, stat.value]);
  const mainSheet = XLSX.utils.aoa_to_sheet([
    ["Categoría", "Valor"],
    ...allStatsData,
  ]);

  // Crear hojas por categorías
  const proyectosData = [
    [
      "Proyectos",
      estadisticas.find((s) => s.categoria === "Proyectos")?.value || 0,
    ],
    [
      "Eventos",
      estadisticas.find((s) => s.categoria === "Eventos")?.value || 0,
    ],
    [
      "Talleres",
      estadisticas.find((s) => s.categoria === "Talleres")?.value || 0,
    ],
    [
      "Charlas",
      estadisticas.find((s) => s.categoria === "Charlas")?.value || 0,
    ],
  ];
  const proyectosSheet = XLSX.utils.aoa_to_sheet([
    ["Actividad", "Cantidad"],
    ...proyectosData,
  ]);

  const participacionData = [
    [
      "Participantes",
      estadisticas.find((s) => s.categoria === "Participantes")?.value || 0,
    ],
    [
      "Beneficiarios",
      estadisticas.find((s) => s.categoria === "Beneficiarios")?.value || 0,
    ],
    [
      "Capacitados",
      estadisticas.find((s) => s.categoria === "Capacitados")?.value || 0,
    ],
    [
      "Jóvenes",
      estadisticas.find((s) => s.categoria === "Jovenes")?.value || 0,
    ],
    [
      "Adultos Mayores",
      estadisticas.find((s) => s.categoria === "AdultosMayores")?.value || 0,
    ],
    [
      "Voluntarios",
      estadisticas.find((s) => s.categoria === "Voluntarios")?.value || 0,
    ],
  ];
  const participacionSheet = XLSX.utils.aoa_to_sheet([
    ["Categoría", "Cantidad"],
    ...participacionData,
  ]);

  const alianzasData = [
    [
      "Alianzas",
      estadisticas.find((s) => s.categoria === "Alianzas")?.value || 0,
    ],
    [
      "Clientes",
      estadisticas.find((s) => s.categoria === "Clientes")?.value || 0,
    ],
    [
      "Patrocinadores",
      estadisticas.find((s) => s.categoria === "Patrocinadores")?.value || 0,
    ],
    ["Países", estadisticas.find((s) => s.categoria === "Países")?.value || 0],
    [
      "Consultorias",
      estadisticas.find((s) => s.categoria === "Consultorias")?.value || 0,
    ],
    [
      "Donaciones",
      estadisticas.find((s) => s.categoria === "Donaciones")?.value || 0,
    ],
  ];
  const alianzasSheet = XLSX.utils.aoa_to_sheet([
    ["Categoría", "Cantidad"],
    ...alianzasData,
  ]);

  const innovacionData = [
    [
      "Innovación",
      estadisticas.find((s) => s.categoria === "Innovacion")?.value || 0,
    ],
    [
      "Aplicaciones",
      estadisticas.find((s) => s.categoria === "Aplicaciones")?.value || 0,
    ],
    ["TICs", estadisticas.find((s) => s.categoria === "Tics")?.value || 0],
    [
      "Sostenibilidad",
      estadisticas.find((s) => s.categoria === "Sostenibilidad")?.value || 0,
    ],
    [
      "Publicaciones",
      estadisticas.find((s) => s.categoria === "Publicaciones")?.value || 0,
    ],
    [
      "Materiales",
      estadisticas.find((s) => s.categoria === "Materiales")?.value || 0,
    ],
  ];
  const innovacionSheet = XLSX.utils.aoa_to_sheet([
    ["Categoría", "Cantidad"],
    ...innovacionData,
  ]);

  // Añadir hojas al libro
  XLSX.utils.book_append_sheet(workbook, mainSheet, "Todas las Estadísticas");
  XLSX.utils.book_append_sheet(
    workbook,
    proyectosSheet,
    "Proyectos y Actividades"
  );
  XLSX.utils.book_append_sheet(workbook, participacionSheet, "Participación");
  XLSX.utils.book_append_sheet(workbook, alianzasSheet, "Alianzas");
  XLSX.utils.book_append_sheet(workbook, innovacionSheet, "Innovación");

  // Exportar a Excel
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Función para exportar a PDF
export const downloadPDF = (
  estadisticas,
  filename = "dashboard_estadisticas"
) => {
  try {
    const doc = new jsPDF();

    // Función helper para obtener valor por categoría
    const getValueByCategory = (categoria) => {
      const item = estadisticas.find((stat) => stat.categoria === categoria);
      return item ? parseInt(item.value) : 0;
    };

    // Configuración inicial
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Dashboard Analítico", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.text(
      "Sistema Integrado de Visibilidad y Vinculación Externa",
      105,
      30,
      { align: "center" }
    );

    doc.setFontSize(12);
    doc.text("Programa de Ingeniería de Sistemas", 105, 40, {
      align: "center",
    });
    doc.text("Universidad Popular del Cesar", 105, 50, { align: "center" });

    let yPos = 70;

    // ===== PÁGINA 1: ESTADÍSTICAS GENERALES =====
    doc.setFontSize(16);
    doc.setTextColor(76, 175, 80);
    doc.text("Estadísticas Generales", 14, yPos);
    yPos += 15;

    // Indicadores principales
    const mainIndicators = [
      ["Proyectos", getValueByCategory("Proyectos")],
      ["Beneficiarios", getValueByCategory("Beneficiarios").toLocaleString()],
      ["Satisfacción", getValueByCategory("Satisfacción") + "%"],
      ["Metas Cumplidas", getValueByCategory("Metas") + "%"],
      ["Horas de Formación", getValueByCategory("HorasFormación")],
      [
        "Financiamiento",
        "$" + getValueByCategory("Financiamiento").toLocaleString(),
      ],
    ];

    doc.autoTable({
      startY: yPos,
      head: [["Indicador", "Valor"]],
      body: mainIndicators,
      theme: "striped",
      headStyles: { fillColor: [76, 175, 80] },
      styles: { fontSize: 11 },
      margin: { left: 14 },
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // Actividades del programa
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Actividades del Programa", 14, yPos);
    yPos += 10;

    const actividadesData = [
      ["Proyectos", getValueByCategory("Proyectos")],
      ["Eventos", getValueByCategory("Eventos")],
      ["Talleres", getValueByCategory("Talleres")],
      ["Charlas", getValueByCategory("Charlas")],
    ];

    doc.autoTable({
      startY: yPos,
      head: [["Actividad", "Cantidad"]],
      body: actividadesData,
      theme: "grid",
      headStyles: { fillColor: [33, 150, 243] },
      styles: { fontSize: 10 },
      margin: { left: 14 },
    });

    // ===== PÁGINA 2: PARTICIPACIÓN =====
    doc.addPage();
    yPos = 20;

    doc.setFontSize(16);
    doc.setTextColor(76, 175, 80);
    doc.text("Participación y Demografía", 14, yPos);
    yPos += 15;

    const participacionData = [
      [
        "Total Participantes",
        getValueByCategory("Participantes").toLocaleString(),
      ],
      ["Capacitados", getValueByCategory("Capacitados")],
      ["Jóvenes", getValueByCategory("Jovenes").toLocaleString()],
      ["Adultos Mayores", getValueByCategory("AdultosMayores")],
      ["Voluntarios", getValueByCategory("Voluntarios")],
      ["Comunidades Apoyadas", getValueByCategory("Comunidades")],
    ];

    doc.autoTable({
      startY: yPos,
      head: [["Categoría", "Cantidad"]],
      body: participacionData,
      theme: "striped",
      headStyles: { fillColor: [76, 175, 80] },
      styles: { fontSize: 11 },
      margin: { left: 14 },
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // Distribución geográfica
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Distribución Geográfica", 14, yPos);
    yPos += 10;

    const geograficaData = [
      ["Zona Rural", getValueByCategory("Rural") + " proyectos"],
      ["Zona Urbana", getValueByCategory("Urbano") + " proyectos"],
      ["Modalidad Presencial", getValueByCategory("Presencial") + "%"],
      ["Modalidad Virtual", getValueByCategory("Virtual") + "%"],
      ["Modalidad Mixta", getValueByCategory("Mixto") + "%"],
    ];

    doc.autoTable({
      startY: yPos,
      head: [["Ubicación/Modalidad", "Valor"]],
      body: geograficaData,
      theme: "grid",
      headStyles: { fillColor: [255, 152, 0] },
      styles: { fontSize: 10 },
      margin: { left: 14 },
    });

    // ===== PÁGINA 3: ALIANZAS Y COLABORACIONES =====
    doc.addPage();
    yPos = 20;

    doc.setFontSize(16);
    doc.setTextColor(76, 175, 80);
    doc.text("Alianzas y Colaboraciones", 14, yPos);
    yPos += 15;

    const alianzasData = [
      ["Alianzas Estratégicas", getValueByCategory("Alianzas")],
      ["Empresas Clientes", getValueByCategory("Clientes")],
      ["Patrocinadores", getValueByCategory("Patrocinadores")],
      ["Presencia Internacional", getValueByCategory("Países") + " países"],
      ["Consultorias Brindadas", getValueByCategory("Consultorias")],
      ["Donaciones Recibidas", getValueByCategory("Donaciones")],
      ["Premios Obtenidos", getValueByCategory("Premios")],
    ];

    doc.autoTable({
      startY: yPos,
      head: [["Categoría", "Cantidad"]],
      body: alianzasData,
      theme: "striped",
      headStyles: { fillColor: [76, 175, 80] },
      styles: { fontSize: 11 },
      margin: { left: 14 },
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // Indicadores operativos
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Indicadores Operativos", 14, yPos);
    yPos += 10;

    const operativosData = [
      ["Reuniones Anuales", getValueByCategory("Reuniones")],
      ["Propuestas Presentadas", getValueByCategory("Propuestas")],
      ["Colaboradores", getValueByCategory("Colaboradores")],
      ["Estudios de Caso", getValueByCategory("EstudiosCaso")],
    ];

    doc.autoTable({
      startY: yPos,
      head: [["Indicador", "Cantidad"]],
      body: operativosData,
      theme: "grid",
      headStyles: { fillColor: [156, 39, 176] },
      styles: { fontSize: 10 },
      margin: { left: 14 },
    });

    // ===== PÁGINA 4: INNOVACIÓN Y TECNOLOGÍA =====
    doc.addPage();
    yPos = 20;

    doc.setFontSize(16);
    doc.setTextColor(76, 175, 80);
    doc.text("Innovación y Tecnología", 14, yPos);
    yPos += 15;

    const innovacionData = [
      ["Proyectos Innovadores", getValueByCategory("Innovacion")],
      ["Aplicaciones Desarrolladas", getValueByCategory("Aplicaciones")],
      ["Tecnologías Aplicadas", getValueByCategory("Tics")],
      ["Proyectos Sostenibles", getValueByCategory("Sostenibilidad")],
      ["Publicaciones", getValueByCategory("Publicaciones")],
      ["Materiales Educativos", getValueByCategory("Materiales")],
      ["Testimonios", getValueByCategory("Testimonios")],
    ];

    doc.autoTable({
      startY: yPos,
      head: [["Categoría", "Cantidad"]],
      body: innovacionData,
      theme: "striped",
      headStyles: { fillColor: [76, 175, 80] },
      styles: { fontSize: 11 },
      margin: { left: 14 },
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // Métricas de calidad
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Métricas de Calidad y Alcance", 14, yPos);
    yPos += 10;

    const calidadData = [
      ["Encuestas Realizadas", getValueByCategory("Encuestas")],
      ["Solicitudes Atendidas", getValueByCategory("Solicitudes")],
      ["Indicadores Monitoreados", getValueByCategory("Indicadores")],
      ["Visitas Web", getValueByCategory("VisitasWeb").toLocaleString()],
      [
        "Seguidores Redes Sociales",
        getValueByCategory("RedesSociales").toLocaleString(),
      ],
      ["Ferias Participadas", getValueByCategory("Ferias")],
      ["Diagnósticos Realizados", getValueByCategory("Diagnosticos")],
      ["Practicantes", getValueByCategory("Practicantes")],
    ];

    doc.autoTable({
      startY: yPos,
      head: [["Métrica", "Valor"]],
      body: calidadData,
      theme: "grid",
      headStyles: { fillColor: [33, 150, 243] },
      styles: { fontSize: 10 },
      margin: { left: 14 },
    });

    // Agregar fecha de generación y numeración
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const today = new Date();
      const dateStr = today.toLocaleDateString("es-ES");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Documento generado el ${dateStr} - Página ${i} de ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
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

// Función para importar datos desde CSV
export const importFromCSV = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split("\n");
    const importedData = [];

    // Buscar líneas que contengan datos válidos (formato: categoria,valor)
    lines.forEach((line) => {
      if (line.trim() && line.includes(",") && !line.includes("Categoría")) {
        const [categoria, value] = line.split(",");
        if (categoria && value && !isNaN(value.trim())) {
          importedData.push({
            categoria: categoria.trim(),
            value: parseInt(value.trim()) || 0,
          });
        }
      }
    });

    callback(importedData);
  };
  reader.readAsText(file);
};
