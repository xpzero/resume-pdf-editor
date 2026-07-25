import { Input } from 'antd';

export function Field({ label, value, onChange, multiline = false }) {
  const input = multiline
    ? <Input.TextArea rows={5} value={value} onChange={event => onChange(event.target.value)} />
    : <Input size="large" value={value} onChange={event => onChange(event.target.value)} />;
  return <label className="field"><span>{label}</span>{input}</label>;
}
