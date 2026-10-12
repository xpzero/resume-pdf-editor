import { useState } from 'react';

export function useDragSort(onReorder) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);

  const reset = () => {
    setDragIndex(null);
    setOverIndex(null);
    setPlaceholderHeight(0);
  };

  const commit = () => {
    if (dragIndex !== null && overIndex !== null && overIndex !== dragIndex && overIndex !== dragIndex + 1) {
      onReorder(dragIndex, overIndex > dragIndex ? overIndex - 1 : overIndex);
    }
    reset();
  };

  const itemProps = index => ({
    'data-sort-item': true,
    onDragOver: event => {
      if (dragIndex === null) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      const rect = event.currentTarget.getBoundingClientRect();
      const boundary = index + (event.clientY > rect.top + rect.height / 2 ? 1 : 0);
      const target = boundary === dragIndex || boundary === dragIndex + 1 ? dragIndex : boundary;
      if (target !== overIndex) setOverIndex(target);
    },
    onDrop: event => event.preventDefault()
  });

  const handleProps = index => ({
    draggable: true,
    onClick: event => event.stopPropagation(),
    onDragStart: event => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
      const item = event.currentTarget.closest('[data-sort-item]');
      if (item) setPlaceholderHeight(item.offsetHeight);
      setDragIndex(index);
      setOverIndex(index);
    },
    onDragEnd: reset
  });

  const showPlaceholder = dragIndex !== null && overIndex !== null && overIndex !== dragIndex && overIndex !== dragIndex + 1;
  return {
    dragIndex,
    placeholderIndex: showPlaceholder ? overIndex : null,
    placeholderHeight,
    itemProps,
    handleProps,
    listProps: { onDragOver: event => event.preventDefault(), onDrop: commit }
  };
}

export function DragPlaceholder({ height }) {
  return <div className="drag-placeholder" style={height ? { height: `${height}px` } : undefined} aria-hidden="true" />;
}
