import { Button, Dropdown } from 'antd';

export function WorkspaceHeader({ savedAt, previewOpen, onTogglePreview, onImport, onLlmConfig, onResumes, onHistory, onSnapshot, onOptimize, onExportMarkdown, onExportPdf }) {
  const exportMenu = { items: [{ key: 'markdown', label: '导出 Markdown' }], onClick: ({ key }) => { if (key === 'markdown') onExportMarkdown(); } };
  const moreMenu = { items: [{ key: 'import', label: '导入简历' }, { key: 'snapshot', label: '创建历史快照' }, { key: 'history', label: '历史版本' }, { key: 'resumes', label: '简历列表' }, { key: 'llm', label: 'LLM 配置' }], onClick: ({ key }) => { if (key === 'import') onImport(); if (key === 'snapshot') onSnapshot(); if (key === 'history') onHistory(); if (key === 'llm') onLlmConfig(); if (key === 'resumes') onResumes(); } };

  return <header className="workspace-header">
    <div className="workspace-brand"><span>CV</span><div><strong>简历工作台</strong><small>{savedAt || '修改内容会实时保存'}</small></div></div>
    <div className="actions"><Button className="header-preview" onClick={onTogglePreview}>{previewOpen ? '隐藏预览' : '显示预览'}</Button><Button onClick={onOptimize} type="primary">AI 优化</Button><Dropdown.Button className="header-export" menu={exportMenu} onClick={onExportPdf}>导出 PDF</Dropdown.Button><Dropdown menu={moreMenu}><Button className="header-more">更多</Button></Dropdown></div>
  </header>;
}
