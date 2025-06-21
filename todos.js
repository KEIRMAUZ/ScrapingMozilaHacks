import fs from "fs";
import fsp from "fs/promises";
import PDFDocument from "pdfkit";

async function testWithMockData() {
  // Datos mock que simulan la estructura de los artículos scrapeados
  const articles = [
    {
      title: "Primer artículo de prueba",
      url: "https://ejemplo.com/articulo1",
      date: "2025-06-21",
      summary: "Este es un resumen de prueba del primer artículo.",
    },
    {
      title: "Segundo artículo de prueba",
      url: "https://ejemplo.com/articulo2",
      date: "2025-06-20",
      summary: "Resumen breve del segundo artículo de ejemplo.",
    },
  ];

  // Crear archivo TXT
  let txtContent = "";
  articles.forEach((art, i) => {
    txtContent += `Artículo ${i + 1}\n`;
    txtContent += `Título: ${art.title}\n`;
    txtContent += `URL: ${art.url}\n`;
    txtContent += `Fecha: ${art.date || "No disponible"}\n`;
    txtContent += `Resumen: ${art.summary}\n`;
    txtContent += `\n--------------------------------\n\n`;
  });

  await fsp.writeFile("articulos.txt", txtContent, "utf-8");
  console.log("Archivo articulos.txt creado.");

  // Crear PDF con pdfkit
  const doc = new PDFDocument({ margin: 30, size: "A4" });
  doc.pipe(fs.createWriteStream("articulos.pdf"));

  doc.fontSize(20).text("Artículos de Prueba", { align: "center" });
  doc.moveDown();

  articles.forEach((art, i) => {
    doc.fontSize(14).text(`Artículo ${i + 1}`, { underline: true });
    doc.moveDown(0.2);

    doc
      .fontSize(12)
      .fillColor("blue")
      .text(art.title, { link: art.url, underline: true });
    doc.fillColor("black");
    doc.text(`Fecha: ${art.date || "No disponible"}`);
    doc.moveDown(0.2);
    doc.text(art.summary);
    doc.moveDown(2);
  });

  doc.end();
  console.log("Archivo articulos.pdf creado.");
}

testWithMockData().catch(console.error);
