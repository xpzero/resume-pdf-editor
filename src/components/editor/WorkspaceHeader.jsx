import { Button } from 'antd';

export function WorkspaceHeader({ savedAt, previewOpen, onTogglePreview, onImport, onSave, onExportMarkdown, onExportPdf }) {
  return <header className="workspace-header">
    <div><strong>简历编辑器</strong><small>{savedAt || '修改内容会实时保存'}</small></div>
    <div className="actions"><Button onClick={onTogglePreview}>{previewOpen ? '隐藏预览' : '显示预览'}</Button><Button onClick={onImport}>导入</Button><Button onClick={onSave}>保存</Button><Button onClick={onExportMarkdown}>导出 Markdown</Button><Button type="primary" onClick={onExportPdf}>导出 PDF</Button></div>
  </header>;
}
