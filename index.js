const fs = require('fs');
const PDFDocument = require('pdf-lib').PDFDocument;

async function splitPdf(pathToPdf) {

    const docmentAsBytes = await fs.promises.readFile(pathToPdf);

    const pdfDoc = await PDFDocument.load(docmentAsBytes)

    const numberOfPages = pdfDoc.getPages().length;

    for (let i = 0; i < numberOfPages; i++) {

        const subDocument = await PDFDocument.create();
        const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
        subDocument.addPage(copiedPage);
        const pdfBytes = await subDocument.save()
        await writePdfBytesToFile(`file-${i + 1}.pdf`, pdfBytes);

    }
}

function writePdfBytesToFile(fileName, pdfBytes) {
    return fs.promises.writeFile(fileName, pdfBytes);
}

async function joinPdf(pdfPaths) {
    const arrayOfBytes = await Promise.all(pdfPaths.map((path) => fs.promises.readFile(path)));

    const pdfDocs = await Promise.all(arrayOfBytes.map((bytes) => PDFDocument.load(bytes)))

    const writePdf = await PDFDocument.create();

    for (let i = 0; i < pdfDocs.length; i++) {
        const [copiedPage] = await writePdf.copyPages(pdfDocs[i], [0])
        writePdf.addPage(copiedPage)
    }

    const pdfBytes = await writePdf.save()
    await writePdfBytesToFile('result.pdf', pdfBytes)
}

// (async () => {
//     await splitPdf("./doc.pdf");
// })();

// (async () => {
//     await joinPdf(["./file-1.pdf","./file-2.pdf","./file-3.pdf","./file-4.pdf","./file-5.pdf","./file-6.pdf","./file-7.pdf"]);
// })();

module.exports.splitPdf = splitPdf;
module.exports.joinPdf = joinPdf;