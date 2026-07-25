import { Button, Input } from 'antd';

export function TextList({ items, onChange, onRemove, addLabel, onAdd }) {
  return <>
    {items.map((item, index) => <div className="line-edit" key={index}>
      <Input.TextArea rows={5} value={item} onChange={event => onChange(index, event.target.value)} />
      <Button danger onClick={() => onRemove(index)}>删除</Button>
    </div>)}
    <Button onClick={onAdd}>{addLabel}</Button>
  </>;
}
