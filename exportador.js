import fs from "fs";
import fsp from "fs/promises";
import { Parser } from "json2csv";
import XLSX from "xlsx";
import PDFDocument from "pdfkit";

export async function guardarArchivos(articulos) {

    const csvParser = new Parser();
    const csv = csvParser.parse(articulos);
    fs.writeFileSync('articulos.csv', csv);
    console.log("Archivo articulos.csv creado.");

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(articulos);
    XLSX.utils.book_append_sheet(wb, ws, 'Articulos');
    XLSX.writeFile(wb, 'articulos.xlsx');
    console.log("Archivo articulos.xlsx creado.");

    fs.writeFileSync('articulos.json', JSON.stringify(articulos, null, 2));
    console.log("Archivo articulos.json creado.");

    let txtContent = "";
    articulos.forEach((art, i) => {
        txtContent += `Artículo ${i + 1}\n`;
        txtContent += `Título: ${art.titulo}\n`;
        txtContent += `Autor: ${art.autor || "No disponible"}\n`;
        txtContent += `URL: ${art.URLArticulo}\n`;
        txtContent += `Fecha: ${art.fecha || "No disponible"}\n`;
        txtContent += `Resumen: ${art.resumen || "No disponible"}\n`;
        txtContent += `\n--------------------------------\n\n`;
    });
    await fsp.writeFile("articulos.txt", txtContent, "utf-8");
    console.log("Archivo articulos.txt creado.");

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    doc.pipe(fs.createWriteStream("articulos.pdf"));

    doc.fontSize(20).text("Artículos Recopilados", { align: "center" });
    doc.moveDown();

    articulos.forEach((art, i) => {
        doc.fontSize(14).text(`Artículo ${i + 1}`, { underline: true });
        doc.moveDown(0.2);

        doc.fontSize(12)
            .fillColor("blue")
            .text(art.titulo || "Sin título", { link: art.URLArticulo, underline: true });
        doc.fillColor("black");
        doc.text(`Autor: ${art.autor || "No disponible"}`);
        doc.text(`Fecha: ${art.fecha || "No disponible"}`);
        doc.moveDown(0.2);
        doc.text(art.resumen || "Sin resumen");
        doc.moveDown(2);
    });

    doc.end();
    console.log("Archivo articulos.pdf creado.");
}
