export function exportPdf(data) {
  const previousTitle = document.title;
  const filename = [data.name, data.role, data.phone].join('_').replace(/[\\/:*?"<>|]/g, '-');
  const restoreTitle = () => {
    document.title = previousTitle;
    window.removeEventListener('afterprint', restoreTitle);
  };
  document.title = filename;
  window.addEventListener('afterprint', restoreTitle);
  window.print();
}
