import pdfjsDist from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/+esm'

const { pdfjsLib } = globalThis;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.worker.mjs';

async function getPdfText(pdfFilePath) {
  try {
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

    return pdfText;

  } catch (error) {
    console.error("PDFの読み込みに失敗しました: ", error);
    throw error;
  }
}

document.getElementById("button").addEventListener("click", async (e) => {
  e.preventDefault();

  const textarea = document.getElementById("textarea");
  const file = document.getElementById("inputFile").files[0];

  if (file) {
    if (file.type !== "application/pdf") {
      alert("PDFファイルを指定してください");
      return;
    }
    const fileUrl = window.URL.createObjectURL(file);
    const text = await getPdfText(fileUrl);
    textarea.value = text;
  } else {
    alert("ファイルを指定してください");
    return;
  }

})

