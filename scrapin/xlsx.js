// archivo: crearExcel.js
import ExcelJS from 'exceljs';

const articulos = [
  {
    titulo: "Artículo 1",
    resumen: "Resumen del artículo 1",
    autor: "Autor 1",
    fecha: "2025-06-20",
    url: "https://hacks.mozilla.org/articulo1",
    imagen: "https://hacks.mozilla.org/img1.jpg"
  },
  {
    titulo: "Artículo 2",
    resumen: "Resumen del artículo 2",
    autor: "Autor 2",
    fecha: "2025-06-19",
    url: "https://hacks.mozilla.org/articulo2",
    imagen: ""
  },
  // más artículos...
];

async function crearExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Artículos');

  worksheet.columns = [
    { header: 'Título', key: 'titulo', width: 30 },
    { header: 'Resumen', key: 'resumen', width: 50 },
    { header: 'Autor', key: 'autor', width: 20 },
    { header: 'Fecha', key: 'fecha', width: 15 },
    { header: 'URL', key: 'url', width: 30 },
    { header: 'Imagen', key: 'imagen', width: 30 }
  ];

  data.forEach(articulo => {
    worksheet.addRow(articulo);
  });

  await workbook.xlsx.writeFile('articulos.xlsx');
  console.log('Archivo articulos.xlsx creado.');
}

crearExcel(articulos).catch(console.error);
