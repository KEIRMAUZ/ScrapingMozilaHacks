// archivo: crearCsv.js
import { createObjectCsvWriter } from 'csv-writer';

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

const csvWriter = createObjectCsvWriter({
  path: 'articulos.csv',
  header: [
    {id: 'titulo', title: 'Título'},
    {id: 'resumen', title: 'Resumen'},
    {id: 'autor', title: 'Autor'},
    {id: 'fecha', title: 'Fecha'},
    {id: 'url', title: 'URL'},
    {id: 'imagen', title: 'Imagen'}
  ]
});

csvWriter.writeRecords(articulos)
  .then(() => {
    console.log('Archivo articulos.csv creado.');
  })
  .catch(err => {
    console.error('Error creando CSV:', err);
  });
