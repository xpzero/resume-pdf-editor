import { useState } from 'react';
import { Alert, Button, Divider, Input, Modal, Radio, Upload } from 'antd';
import { importMarkdown } from './markdown';
import { exportWorkspaceBackup, importWorkspaceBackup } from '../workspace/backup';

function downloadBackup() {
  const blob = new Blob([exportWorkspaceBackup()], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume-workspace-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function ImportDialog({ templateId, onApply, onClose }) {
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backupMode, setBackupMode] = useState('replace');
  const [pdfImport, setPdfImport] = useState(null);
  const [pdfDestination, setPdfDestination] = useState('project');
  const [customSectionTitle, setCustomSectionTitle] = useState('PDF 导入内容（待整理）');

  const mappedPdfDraft = pdfImport && {
    ...pdfImport.data,
    projects: pdfDestination === 'project' && pdfImport.text ? [{ date: '', title: 'PDF 导入内容（待整理）', role: '', intro: pdfImport.text, points: [] }] : [],
    customSections: pdfDestination === 'custom' && pdfImport.text ? [{ title: customSectionTitle || 'PDF 导入内容（待整理）', items: [pdfImport.text] }] : []
  };
  const activeDraft = mappedPdfDraft || draft;

  const readFile = async file => {
    setError('');
    setLoading(true);
    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const { importPdf } = await import('./pdf');
        setPdfImport(await importPdf(file, templateId));
        setDraft(null);
      } else {
        setPdfImport(null);
        setDraft(importMarkdown(await file.text(), templateId));
      }
    } catch {
      setError('文件无法解析，请确认格式正确后重试。');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const readBackup = async file => {
    setError('');
    setLoading(true);
    try {
      importWorkspaceBackup(await file.text(), backupMode);
      window.location.reload();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '工作区备份无法导入，请确认文件正确后重试。');
    } finally {
      setLoading(false);
    }
    return false;
  };

  return <Modal open title="导入与备份" onCancel={onClose} footer={<><Button onClick={onClose}>取消</Button><Button type="primary" disabled={!activeDraft} onClick={() => onApply(activeDraft)}>应用草稿</Button></>}>
    <p>支持 Markdown 和可复制文字的 PDF。导入只生成草稿，确认后才会替换当前简历。</p>
    <Upload accept=".md,text/markdown,application/pdf" maxCount={1} showUploadList={false} beforeUpload={readFile}><Button loading={loading}>选择 Markdown 或 PDF 文件</Button></Upload>
    <Divider />
    <p><b>工作区备份</b></p>
    <p>备份包含全部简历及其历史版本，不包含 LLM 配置或密钥。</p>
    <Radio.Group value={backupMode} onChange={event => setBackupMode(event.target.value)} options={[{ value: 'replace', label: '替换当前工作区' }, { value: 'merge', label: '合并到当前工作区' }]} />
    <div className="import-backup-actions"><Button onClick={downloadBackup}>导出工作区备份</Button><Upload accept=".json,application/json" maxCount={1} showUploadList={false} beforeUpload={readBackup}><Button loading={loading}>导入工作区备份</Button></Upload></div>
    {loading && <p>正在解析文件...</p>}
    {error && <Alert type="error" showIcon message={error} />}
    {pdfImport && <div className="import-preview"><b>PDF 文本手动映射</b><p>PDF 的文字顺序不代表简历结构。请选择一个去处，文本会原样保留，应用后请手动整理。</p><Radio.Group value={pdfDestination} onChange={event => setPdfDestination(event.target.value)} options={[{ value: 'project', label: '作为一个项目的项目描述' }, { value: 'custom', label: '作为自定义模块内容' }]} />{pdfDestination === 'custom' && <Input value={customSectionTitle} onChange={event => setCustomSectionTitle(event.target.value)} placeholder="自定义模块名称" />}<p>已提取 {pdfImport.text.length} 个字符。</p></div>}
    {activeDraft && <div className="import-preview"><b>{activeDraft.name || '未识别姓名'}</b><span>技能 {activeDraft.skills.length} 条，工作经历 {activeDraft.jobs.length} 条，项目 {activeDraft.projects.length} 个</span><p>请在应用后检查并补充识别结果，尤其是 PDF 内容。</p></div>}
  </Modal>;
}
