import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf.mjs';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerUrl;

function emptyResume(templateId) {
  return { templateId, name: '', birth: '', phone: '', role: '', email: '', blog: '', school: '', education: '', major: '', educationDate: '', skills: [], jobs: [], projects: [], evaluation: '' };
}

export async function importPdf(file, templateId = 'classic') {
  const pdf = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(' '));
  }
  const text = pages.join('\n').replace(/\s+/g, ' ').trim();
  const data = emptyResume(templateId);
  data.name = text.match(/姓名[：:]?\s*([^\s，,；;]+)/)?.[1] || file.name.replace(/\.pdf$/i, '');
  data.phone = text.match(/(?:电话|手机)[：:]?\s*(1\d{10})/)?.[1] || '';
  data.email = text.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/)?.[0] || '';
  if (text) data.projects = [{ date: '', title: 'PDF 导入内容（待整理）', role: '', intro: text, points: [] }];
  return data;
}
