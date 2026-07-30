import { Button, Input, Modal, Popconfirm } from 'antd';
import { useState } from 'react';

export function ResumeListDialog({ open, workspace, onSelect, onCreate, onRename, onDelete, onClose }) {
  const [name, setName] = useState('');
  return <Modal open={open} title="简历列表" onCancel={onClose} footer={<Button onClick={onClose}>关闭</Button>}>
    <div className="resume-create"><Input value={name} placeholder="新简历名称" onChange={event => setName(event.target.value)} /><Button type="primary" onClick={() => { onCreate(name || '新建简历'); setName(''); }}>新建</Button></div>
    <div className="resume-list">{workspace.resumes.map(item => <div className={`resume-list-item${item.id === workspace.activeId ? ' active' : ''}`} key={item.id}><Button type="text" onClick={() => onSelect(item.id)}>{item.name}</Button><div><Button size="small" onClick={() => onRename(item.id, window.prompt('简历名称', item.name) || item.name)}>重命名</Button><Popconfirm title="删除这份简历？" disabled={workspace.resumes.length === 1} onConfirm={() => onDelete(item.id)}><Button size="small" danger disabled={workspace.resumes.length === 1}>删除</Button></Popconfirm></div></div>)}</div>
  </Modal>;
}
