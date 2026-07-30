import { useId } from 'react';
import { Input } from 'antd';

export function Field({ label, value, onChange, multiline = false, placeholder, action, headerAction }) {
  const inputId = useId();
  const input = multiline
    ? <Input.TextArea id={inputId} rows={5} value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} />
    : <Input id={inputId} size="large" value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} />;
  return <div className="field"><div className="field-label"><label htmlFor={inputId}>{label}</label>{headerAction}</div>{action ? <div className="field-control">{input}{action}</div> : input}</div>;
}
