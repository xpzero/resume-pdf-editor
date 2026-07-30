import { Button, Input } from 'antd';
import { useRef, useState } from 'react';
import { DragHandleIcon, EditIcon, TrashIcon } from './TrashIcon';

export function TextList({ items, onChange, onRemove, addLabel, onAdd, placeholder, onOptimize, optimizeLabel = 'AI 优化', matchOptimizeHeight = false, onReorder }) {
  const inputRefs = useRef([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  return <>
    {items.map((item, index) => <div className={`line-edit${matchOptimizeHeight ? ' match-optimize-height' : ''}${draggedIndex === index ? ' is-dragging' : ''}`} key={index} onDragOver={event => { if (onReorder) event.preventDefault(); }} onDrop={() => { if (onReorder && draggedIndex !== null && draggedIndex !== index) onReorder(draggedIndex, index); setDraggedIndex(null); }}>
      {onReorder && <span className="drag-handle" draggable aria-label="拖拽调整顺序" onDragStart={event => { event.dataTransfer.effectAllowed = 'move'; setDraggedIndex(index); }} onDragEnd={() => setDraggedIndex(null)}><DragHandleIcon /></span>}
      <div className={`line-input-wrap${editingIndex === index ? ' is-editing' : ''}`}><Input.TextArea ref={input => { inputRefs.current[index] = input; }} rows={5} value={item} placeholder={placeholder} onBlur={() => setEditingIndex(null)} onChange={event => onChange(index, event.target.value)} /><div className="input-delete-mask"><Button className="edit-icon" icon={<EditIcon />} aria-label="编辑此项" onClick={() => { setEditingIndex(index); requestAnimationFrame(() => inputRefs.current[index]?.focus()); }} /><Button className="delete-icon" icon={<TrashIcon />} aria-label="删除此项" onClick={() => onRemove(index)} /></div></div>
      {onOptimize && <Button className="line-ai-action" onClick={() => onOptimize(index)}>{optimizeLabel}</Button>}
    </div>)}
    <Button onClick={onAdd}>{addLabel}</Button>
  </>;
}
