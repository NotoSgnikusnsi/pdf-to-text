import pdfjsDist from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/+esm'

const { pdfjsLib } = globalThis;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.worker.mjs';

async function getPdfText(pdfFilePath) {
  const loadingTask = pdfjsLib.getDocument(pdfFilePath);

  const pdf = await loadingTask.promise;
  const maxPages = pdf.numPages;

  let pdfText = "";

  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent({ disableCombineTextItems: false, includeMarkedContent: false });
    const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join("\n");
    pdfText += pageText + "\n";
  }

  console.log(pdfText);

  return pdfText;
}


