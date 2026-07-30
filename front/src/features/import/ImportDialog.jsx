import { useState } from 'react';
import { Alert, Button, Modal, Upload } from 'antd';
import { importMarkdown } from './markdown';

export function ImportDialog({ templateId, onApply, onClose }) {
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const readFile = async file => {
    setError('');
    setLoading(true);
    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const { importPdf } = await import('./pdf');
        setDraft(await importPdf(file, templateId));
      } else {
        setDraft(importMarkdown(await file.text(), templateId));
      }
    } catch {
      setError('文件无法解析，请确认格式正确后重试。');
    } finally {
      setLoading(false);
    }
    return false;
  };

  return <Modal open title="导入简历" onCancel={onClose} footer={<><Button onClick={onClose}>取消</Button><Button type="primary" disabled={!draft} onClick={() => onApply(draft)}>应用草稿</Button></>}>
    <p>支持 Markdown 和可复制文字的 PDF。导入只生成草稿，确认后才会替换当前简历。</p>
    <Upload accept=".md,text/markdown,application/pdf" maxCount={1} showUploadList={false} beforeUpload={readFile}><Button loading={loading}>选择 Markdown 或 PDF 文件</Button></Upload>
    {loading && <p>正在解析文件...</p>}
    {error && <Alert type="error" showIcon message={error} />}
    {draft && <div className="import-preview"><b>{draft.name || '未识别姓名'}</b><span>技能 {draft.skills.length} 条，工作经历 {draft.jobs.length} 条，项目 {draft.projects.length} 个</span><p>请在应用后检查并补充识别结果，尤其是 PDF 内容。</p></div>}
  </Modal>;
}
