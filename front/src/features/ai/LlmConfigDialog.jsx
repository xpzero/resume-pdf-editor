import { Button, Form, Input, Modal } from 'antd';
import { clearLlmConfig, loadLlmConfig, saveLlmConfig } from './llmConfig';

export function LlmConfigDialog({ open, onClose, onSaved }) {
  const [form] = Form.useForm();

  const save = () => {
    form.validateFields().then(values => {
      saveLlmConfig(values);
      onSaved(values);
      onClose();
    });
  };
  const clear = () => {
    clearLlmConfig();
    form.setFieldsValue({ baseUrl: '', apiKey: '', model: '' });
    onSaved({ baseUrl: '', apiKey: '', model: '' });
  };

  return <Modal open={open} title="LLM 配置" onCancel={onClose} afterOpenChange={visible => { if (visible) form.setFieldsValue(loadLlmConfig()); }} footer={<><Button onClick={clear}>清空配置</Button><Button onClick={onClose}>取消</Button><Button type="primary" onClick={save}>保存配置</Button></>}>
    <p className="dialog-help">配置仅保存在当前浏览器会话，API Key 只会发送给本地后端用于本次模型调用。接口地址可填写服务根地址（如 `https://api.openai.com/v1`）或完整的 `/chat/completions` 地址。</p>
    <Form form={form} layout="vertical">
      <Form.Item label="接口地址" name="baseUrl" rules={[{ required: true, message: '请输入接口地址' }, { type: 'url', message: '请输入有效 URL' }]}><Input placeholder="https://api.openai.com/v1" /></Form.Item>
      <Form.Item label="API Key" name="apiKey" rules={[{ required: true, message: '请输入 API Key' }]}><Input.Password placeholder="sk-..." /></Form.Item>
      <Form.Item label="模型名称" name="model" rules={[{ required: true, message: '请输入模型名称' }]}><Input placeholder="gpt-4.1-mini" /></Form.Item>
    </Form>
  </Modal>;
}
