import { Button, Input } from 'antd';
import { Fragment, useRef, useState } from 'react';
import { DragHandleIcon, EditIcon, TrashIcon } from './TrashIcon';
import { DragPlaceholder, useDragSort } from './dragSort';

export function TextList({ items, onChange, onRemove, addLabel, onAdd, placeholder, onOptimize, optimizeLabel = 'AI 优化', matchOptimizeHeight = false, onReorder }) {
  const inputRefs = useRef([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const drag = useDragSort(onReorder);

  const handleAdd = () => {
    onAdd();
    setEditingIndex(0);
    requestAnimationFrame(() => inputRefs.current[0]?.focus());
  };

  return <div className="text-list" {...drag.listProps}>
    {items.map((item, index) => <Fragment key={index}>
      {drag.placeholderIndex === index && <DragPlaceholder height={drag.placeholderHeight} />}
      <div className={`line-edit${matchOptimizeHeight ? ' match-optimize-height' : ''}${drag.dragIndex === index ? ' is-dragging' : ''}`} {...drag.itemProps(index)}>
        {onReorder && <span className="drag-handle" aria-label="拖拽调整顺序" {...drag.handleProps(index)}><DragHandleIcon /></span>}
        <div className={`line-input-wrap${editingIndex === index ? ' is-editing' : ''}`}><Input.TextArea ref={input => { inputRefs.current[index] = input; }} rows={5} value={item} placeholder={placeholder} onBlur={() => setEditingIndex(null)} onChange={event => onChange(index, event.target.value)} /><div className="input-delete-mask"><Button className="edit-icon" icon={<EditIcon />} aria-label="编辑此项" onClick={() => { setEditingIndex(index); requestAnimationFrame(() => inputRefs.current[index]?.focus()); }} /><Button className="delete-icon" icon={<TrashIcon />} aria-label="删除此项" onClick={() => onRemove(index)} /></div></div>
        {onOptimize && <Button className="line-ai-action" onClick={() => onOptimize(index)}>{optimizeLabel}</Button>}
      </div>
    </Fragment>)}
    {drag.placeholderIndex === items.length && <DragPlaceholder height={drag.placeholderHeight} />}
    <Button onClick={handleAdd}>{addLabel}</Button>
  </div>;
}
