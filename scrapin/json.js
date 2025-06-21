import fs from 'fs';

const articulos = [
  // tu array de artículos aquí
];

// Guardar JSON
fs.writeFileSync('articulos.json', JSON.stringify(articulos, null, 2));
console.log('Archivo articulos.json creado.');
