import puppeteer from "puppeteer"; 
import fs from 'fs';
import { Parser } from 'json2csv';
import XLSX from 'xlsx';

async function scrapingMozila() {
    const navegador = await puppeteer.launch({
        headless: false,
        slowMo: 500
    });

    const pagina = await navegador.newPage();
    await pagina.goto('https://hacks.mozilla.org/articles/');
    
    let btnSiguientePagina = true;
    let AllArticulos = [];
    let paginaActual = 1;

    while (btnSiguientePagina && paginaActual <= 5) {
        const datos = await pagina.evaluate(() => {
            const datosArreglo = [];
            const contenedorBlocks = document.querySelectorAll('li.list-item');
    
            contenedorBlocks.forEach(bloque => {
                const URLArticulo = bloque.querySelector("div>h3.post__title>a")?.getAttribute('href');
                
                if (URLArticulo) {
                    datosArreglo.push({ URLArticulo: URLArticulo });
                }
            });
            return datosArreglo;
        });

        AllArticulos = [...AllArticulos, ...datos];

        btnSiguientePagina = await pagina.evaluate(() => {
            const btnSiguiente = document.querySelector('span.nav-paging__next>a');
            return btnSiguiente ? true : false;
        });

        if (btnSiguientePagina && paginaActual < 2) {
            const btnSiguiente = await pagina.$('span.nav-paging__next>a');
            await btnSiguiente.click();
            await pagina.waitForNavigation({ waitUntil: 'networkidle0' });
            paginaActual++;
        } else {
            btnSiguientePagina = false;
        }
    }

    for (const articulo of AllArticulos) {
        const url = articulo.URLArticulo;

        const paginaArticulo = await navegador.newPage();
        await paginaArticulo.goto(url);

        const datosArticulo = await paginaArticulo.evaluate(() => {
            const titulo = document.querySelector('h1.post__title')?.innerText;
            const autor = document.querySelector('h3.post__author')?.innerText;
            const resumen = document.querySelector('article>p:nth-child(2)')?.innerText;

            

            return {
                titulo,
                autor,
                resumen
            };
        });

        articulo.datosArticulo = datosArticulo;
        await paginaArticulo.close();
    }

    console.log("Resultados obtenidos:", AllArticulos);

    const csvParser = new Parser();
    const csv = csvParser.parse(AllArticulos);
    fs.writeFileSync('articulos.csv', csv);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(AllArticulos);
    XLSX.utils.book_append_sheet(wb, ws, 'Articulos');
    XLSX.writeFile(wb, 'articulos.xlsx');

    await navegador.close();
}

scrapingMozila();
