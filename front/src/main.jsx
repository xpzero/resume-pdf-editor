import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, Modal } from 'antd';
import { ResumeEditor } from './components/editor/ResumeEditor';
import { WorkspaceHeader } from './components/editor/WorkspaceHeader';
import { STORAGE_KEY, normalizeResume } from './data/resume';
import { exportMarkdown } from './features/export/markdown';
import { exportPdf } from './features/export/pdf';
import { LlmConfigDialog } from './features/ai/LlmConfigDialog';
import { OptimizeDialog } from './features/ai/OptimizeDialog';
import { OptimizeDiffDialog } from './features/ai/OptimizeDiffDialog';
import { loadLlmConfig } from './features/ai/llmConfig';
import { ResumeListDialog } from './components/editor/ResumeListDialog';
import { createResume, loadWorkspace, saveWorkspace } from './data/workspace';
import { getResumeChecks } from './features/quality/checks';
import 'antd/dist/reset.css';
import './style.css';

const ImportDialog = lazy(() => import('./features/import/ImportDialog').then(module => ({ default: module.ImportDialog })));
const loadResumePreview = () => import('./components/resume/ResumePreview');
const ResumePreview = lazy(() => loadResumePreview().then(module => ({ default: module.ResumePreview })));

function App() {
  const [workspace, setWorkspace] = useState(loadWorkspace);
  const [data, setData] = useState(() => workspace.resumes.find(item => item.id === workspace.activeId).data);
  const [savedAt, setSavedAt] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [previewMounted, setPreviewMounted] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [llmConfig, setLlmConfig] = useState(loadLlmConfig);
  const [llmConfigOpen, setLlmConfigOpen] = useState(false);
  const [optimizeOpen, setOptimizeOpen] = useState(false);
  const [optimizeScope, setOptimizeScope] = useState('all');
  const [optimizeIndex, setOptimizeIndex] = useState(null);
  const [optimizeField, setOptimizeField] = useState(null);
  const [optimizePointIndex, setOptimizePointIndex] = useState(null);
  const [aiDraft, setAiDraft] = useState(null);
  const [resumeListOpen, setResumeListOpen] = useState(false);
  const previewTimer = useRef();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setWorkspace(current => {
      const next = { ...current, resumes: current.resumes.map(item => item.id === current.activeId ? { ...item, data, updatedAt: new Date().toISOString() } : item) };
      saveWorkspace(next);
      return next;
    });
  }, [data]);
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
  const applyAiDraft = () => {
    setData(current => normalizeResume({ ...current, ...aiDraft.data }));
    setAiDraft(null);
    setSavedAt('已应用 AI 优化结果');
  };
  const openOptimize = (scope = 'all', index = null, targetField = null, targetPointIndex = null) => {
    if (!llmConfig.baseUrl || !llmConfig.apiKey || !llmConfig.model) {
      setLlmConfigOpen(true);
      return;
    }
    setOptimizeScope(scope);
    setOptimizeIndex(index);
    setOptimizeField(targetField);
    setOptimizePointIndex(targetPointIndex);
    setOptimizeOpen(true);
  };
  const confirmPdfExport = () => {
    const checks = getResumeChecks(data);
    if (!checks.length) return printResume();
    Modal.confirm({ title: '导出前请检查', content: <ul>{checks.map(item => <li key={item}>{item}</li>)}</ul>, okText: '仍然导出', cancelText: '返回修改', onOk: printResume });
  };
  const selectResume = id => {
    const resume = workspace.resumes.find(item => item.id === id);
    if (!resume) return;
    setWorkspace(current => { const next = { ...current, activeId: id }; saveWorkspace(next); return next; });
    setData(resume.data);
    setResumeListOpen(false);
  };
  const createNewResume = name => {
    const resume = createResume(name);
    setWorkspace(current => { const next = { activeId: resume.id, resumes: [...current.resumes, resume] }; saveWorkspace(next); return next; });
    setData(resume.data);
  };
  const renameResume = (id, name) => setWorkspace(current => { const next = { ...current, resumes: current.resumes.map(item => item.id === id ? { ...item, name } : item) }; saveWorkspace(next); return next; });
  const deleteResume = id => setWorkspace(current => { const resumes = current.resumes.filter(item => item.id !== id); const activeId = current.activeId === id ? resumes[0].id : current.activeId; const next = { activeId, resumes }; saveWorkspace(next); if (current.activeId === id) setData(resumes[0].data); return next; });

  return <main className={`app${previewMounted ? ' has-preview' : ''}`}>
    <WorkspaceHeader savedAt={savedAt} previewOpen={previewVisible} onTogglePreview={previewVisible ? hidePreview : showPreview} onImport={() => setImportOpen(true)} onLlmConfig={() => setLlmConfigOpen(true)} onResumes={() => setResumeListOpen(true)} onOptimize={() => openOptimize()} onExportMarkdown={() => { save(); exportMarkdown(data); }} onExportPdf={confirmPdfExport} />
    <ResumeEditor data={data} onChange={setData} onOptimize={openOptimize} />
    {previewMounted && <div className={`preview-panel${previewVisible ? ' is-visible' : ''}`}><Suspense fallback={<div className="preview-loading">正在加载预览...</div>}><ResumePreview data={data} /></Suspense></div>}
    {importOpen && <Suspense fallback={null}><ImportDialog templateId={data.templateId} onApply={applyImport} onClose={() => setImportOpen(false)} /></Suspense>}
    {llmConfigOpen && <LlmConfigDialog open onClose={() => setLlmConfigOpen(false)} onSaved={setLlmConfig} />}
    {optimizeOpen && <OptimizeDialog open data={data} llmConfig={llmConfig} initialScope={optimizeScope} targetIndex={optimizeIndex} targetField={optimizeField} targetPointIndex={optimizePointIndex} onClose={() => setOptimizeOpen(false)} onOptimized={(draft, scope, meta) => { setOptimizeOpen(false); setAiDraft({ data: draft, scope, meta, targetIndex: optimizeIndex }); }} />}
    <OptimizeDiffDialog original={data} draft={aiDraft?.data} scope={aiDraft?.scope} targetIndex={aiDraft?.targetIndex} onApply={applyAiDraft} onClose={() => setAiDraft(null)} />
    <ResumeListDialog open={resumeListOpen} workspace={workspace} onSelect={selectResume} onCreate={createNewResume} onRename={renameResume} onDelete={deleteResume} onClose={() => setResumeListOpen(false)} />
  </main>;
}

createRoot(document.getElementById('root')).render(<ConfigProvider theme={{ token: { colorPrimary: '#287ed1', borderRadius: 6 } }}><App /></ConfigProvider>);
