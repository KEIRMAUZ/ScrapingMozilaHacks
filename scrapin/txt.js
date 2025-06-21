import fsp from "fs/promises";

// Datos de prueba
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

async function generarTxt() {
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
}

generarTxt().catch(console.error);
