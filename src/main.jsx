import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { ResumeEditor } from './components/editor/ResumeEditor';
import { WorkspaceHeader } from './components/editor/WorkspaceHeader';
import { STORAGE_KEY, loadResume, normalizeResume } from './data/resume';
import { exportMarkdown } from './features/export/markdown';
import { exportPdf } from './features/export/pdf';
import 'antd/dist/reset.css';
import './style.css';

const ImportDialog = lazy(() => import('./features/import/ImportDialog').then(module => ({ default: module.ImportDialog })));
const loadResumePreview = () => import('./components/resume/ResumePreview');
const ResumePreview = lazy(() => loadResumePreview().then(module => ({ default: module.ResumePreview })));

function App() {
  const [data, setData] = useState(loadResume);
  const [savedAt, setSavedAt] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [previewMounted, setPreviewMounted] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const previewTimer = useRef();

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => () => window.clearTimeout(previewTimer.current), []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSavedAt(`已保存 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`);
  };
  const applyImport = draft => {
    setData(normalizeResume(draft));
    setImportOpen(false);
    setSavedAt('已应用导入草稿，请检查内容后保存');
  };
  const printResume = () => {
    save();
    loadResumePreview().then(() => {
      showPreview();
      window.setTimeout(() => exportPdf(data), 260);
    });
  };
  const showPreview = () => {
    window.clearTimeout(previewTimer.current);
    setPreviewMounted(true);
    requestAnimationFrame(() => setPreviewVisible(true));
  };
  const hidePreview = () => {
    setPreviewVisible(false);
    previewTimer.current = window.setTimeout(() => setPreviewMounted(false), 240);
  };

  return <main className={`app${previewMounted ? ' has-preview' : ''}`}>
    <WorkspaceHeader savedAt={savedAt} previewOpen={previewVisible} onTogglePreview={previewVisible ? hidePreview : showPreview} onImport={() => setImportOpen(true)} onSave={save} onExportMarkdown={() => { save(); exportMarkdown(data); }} onExportPdf={printResume} />
    <ResumeEditor data={data} onChange={setData} />
    {previewMounted && <div className={`preview-panel${previewVisible ? ' is-visible' : ''}`}><Suspense fallback={<div className="preview-loading">正在加载预览...</div>}><ResumePreview data={data} /></Suspense></div>}
    {importOpen && <Suspense fallback={null}><ImportDialog templateId={data.templateId} onApply={applyImport} onClose={() => setImportOpen(false)} /></Suspense>}
  </main>;
}

createRoot(document.getElementById('root')).render(<ConfigProvider theme={{ token: { colorPrimary: '#287ed1', borderRadius: 6 } }}><App /></ConfigProvider>);
