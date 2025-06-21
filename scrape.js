import puppeteer from "puppeteer";
import fs from "fs/promises";
import PDFDocument from "pdfkit";

async function scrapeMozillaHacks() {
  // Lanzar navegador
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Ir a la página
  await page.goto("https://hacks.mozilla.org/", { waitUntil: "networkidle2" });

  // Extraer datos de artículos
  const articles = await page.evaluate(() => {
    // Selector para artículos
    const articleNodes = document.querySelectorAll("article.post");
    const data = [];

    articleNodes.forEach((article) => {
      const titleEl = article.querySelector("h2 a");
      const title = titleEl ? titleEl.innerText.trim() : null;
      const url = titleEl ? titleEl.href : null;
      const dateEl = article.querySelector("time");
      const date = dateEl ? dateEl.getAttribute("datetime") : null;
      const summaryEl = article.querySelector(".post-content > p");
      const summary = summaryEl ? summaryEl.innerText.trim() : "";

      if (title && url) {
        data.push({ title, url, date, summary });
      }
    });

    return data;
  });

  await browser.close();

  // Guardar en TXT
  let txtContent = "";
  articles.forEach((art, i) => {
    txtContent += `Artículo ${i + 1}\n`;
    txtContent += `Título: ${art.title}\n`;
    txtContent += `URL: ${art.url}\n`;
    txtContent += `Fecha: ${art.date || "No disponible"}\n`;
    txtContent += `Resumen: ${art.summary}\n`;
    txtContent += `\n--------------------------------\n\n`;
  });

  await fs.writeFile("articulos.txt", txtContent, "utf-8");
  console.log("Archivo articulos.txt creado.");

  // Crear PDF con pdfkit
  const doc = new PDFDocument({ margin: 30, size: "A4" });
  doc.pipe(await fs.createWriteStream("articulos.pdf"));

  doc.fontSize(20).text("Artículos de Hacks Mozilla", { align: "center" });
  doc.moveDown();

  articles.forEach((art, i) => {
    doc.fontSize(14).text(`Artículo ${i + 1}`, { underline: true });
    doc.moveDown(0.2);

    doc.fontSize(12).fillColor("blue").text(art.title, { link: art.url, underline: true });
    doc.fillColor("black");
    doc.text(`Fecha: ${art.date || "No disponible"}`);
    doc.moveDown(0.2);
    doc.text(art.summary);
    doc.moveDown();
    doc.moveDown();
  });

  doc.end();

  console.log("Archivo articulos.pdf creado.");
}

scrapeMozillaHacks().catch(console.error);
