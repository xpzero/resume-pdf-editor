import { Button, Empty, Modal, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { ResumePreview } from '../resume/ResumePreview';

const formatTime = value => new Date(value).toLocaleString('zh-CN', { hour12: false });

export function ResumeHistoryDialog({ open, resume, onRestore, onDelete, onClose }) {
  const history = resume?.history || [];
  const [selectedId, setSelectedId] = useState(null);
  const selected = history.find(item => item.id === selectedId) || history[0];

  useEffect(() => {
    if (open) setSelectedId(history[0]?.id || null);
  }, [open, resume?.id]);

  return <Modal open={open} title={`${resume?.name || '简历'}的历史版本`} onCancel={onClose} width={1000} footer={<Button onClick={onClose}>关闭</Button>}>
    {!history.length ? <Empty description="暂无历史版本" /> : <div className="resume-history">
      <div className="resume-history-list">{history.map(item => <button type="button" className={`resume-history-item${item.id === selected?.id ? ' active' : ''}`} key={item.id} onClick={() => setSelectedId(item.id)}><strong>{item.label}</strong><span>{formatTime(item.createdAt)}</span></button>)}</div>
      <div className="resume-history-preview"><div className="resume-history-actions"><div><strong>{selected.label}</strong><span>{formatTime(selected.createdAt)}</span></div><div><Popconfirm title="恢复后将覆盖当前简历内容，是否继续？" okText="恢复" cancelText="取消" onConfirm={() => onRestore(selected.id)}><Button type="primary">恢复此版本</Button></Popconfirm><Popconfirm title="删除此历史版本？" okText="删除" cancelText="取消" onConfirm={() => onDelete(selected.id)}><Button danger>删除</Button></Popconfirm></div></div><div className="resume-history-document"><ResumePreview data={selected.data} /></div></div>
    </div>}
  </Modal>;
}
