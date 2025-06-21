import puppeteer from 'puppeteer';
import fs from 'fs';
import PDFDocument from 'pdfkit';

async function scrapearYGenerarArchivos() {
  // 🟣 1. Scraping
  const navegador = await puppeteer.launch({ headless: true });
  const pagina = await navegador.newPage();
  await pagina.goto('https://hacks.mozilla.org/', { waitUntil: 'networkidle2' });

  const articulos = await pagina.evaluate(() => {
    const lista = [];
    const posts = document.querySelectorAll('article');

    posts.forEach(post => {
      const titulo = post.querySelector('h2 a')?.innerText.trim() || 'Sin título';
      const enlace = post.querySelector('h2 a')?.href || '';
      const fecha = post.querySelector('time')?.innerText.trim() || 'Sin fecha';
      const autor = post.querySelector('.author-name')?.innerText.trim() || 'Desconocido';
      const resumen = post.querySelector('p')?.innerText.trim() || 'Sin resumen';

      lista.push({ titulo, autor, fecha, enlace, resumen });
    });

    return lista;
  });

  await navegador.close();

  // 💾 Guardar JSON
  fs.writeFileSync('articulos.json', JSON.stringify(articulos, null, 2), 'utf8');
  console.log(`✅ articulos.json creado con ${articulos.length} artículos`);

  // 📝 2. Crear articulos.txt
  let textoPlano = '';
  articulos.forEach((articulo, i) => {
    textoPlano += `Artículo ${i + 1}:\n`;
    textoPlano += `Título: ${articulo.titulo}\n`;
    textoPlano += `Autor: ${articulo.autor}\n`;
    textoPlano += `Fecha: ${articulo.fecha}\n`;
    textoPlano += `Enlace: ${articulo.enlace}\n`;
    textoPlano += `Resumen: ${articulo.resumen}\n`;
    textoPlano += `-----------------------------\n\n`;
  });
  fs.writeFileSync('articulos.txt', textoPlano, 'utf8');
  console.log('✅ articulos.txt generado');

  // 📄 3. Crear articulos.pdf
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(fs.createWriteStream('articulos.pdf'));

  doc.fontSize(20).text('Artículos del Blog Mozilla Hacks', { align: 'center' });
  doc.moveDown();

  articulos.forEach((articulo, i) => {
    doc.fontSize(14).fillColor('black').text(`Artículo ${i + 1}`, { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Título: ${articulo.titulo}`);
    doc.text(`Autor: ${articulo.autor}`);
    doc.text(`Fecha: ${articulo.fecha}`);
    doc.text(`Enlace: ${articulo.enlace}`);
    doc.text(`Resumen: ${articulo.resumen}`);
    doc.moveDown(1.2);
  });

  doc.end();
  console.log('✅ articulos.pdf generado');
}

// Ejecutar todo
scrapearYGenerarArchivos();
