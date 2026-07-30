import { Alert, Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { optimizeResume } from './client';

const scopes = [
  { value: 'all', label: '整份简历' },
  { value: 'skills', label: '相关技能' },
  { value: 'jobs', label: '工作经历' },
  { value: 'projects', label: '项目经历' },
  { value: 'evaluation', label: '个人评价' }
];

export function OptimizeDialog({ open, data, llmConfig, initialScope = 'all', targetIndex, targetField, targetPointIndex, onClose, onOptimized }) {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!llmConfig.baseUrl || !llmConfig.apiKey || !llmConfig.model) {
      setError('请先完成 LLM 配置。');
      return;
    }
    const values = await form.validateFields();
    setLoading(true);
    setError('');
    try {
      const result = await optimizeResume({ llmConfig, resume: data, targetIndex, targetField, targetPointIndex, ...values });
      onOptimized(result.resume, values.scope, result.meta);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return <Modal open={open} title="AI 优化简历" onCancel={onClose} footer={<><Button onClick={onClose}>取消</Button><Button type="primary" loading={loading} onClick={submit}>开始优化</Button></>}>
    <Form form={form} layout="vertical" initialValues={{ scope: initialScope, targetRole: data.role }}>
      <Form.Item label="优化范围" name="scope"><Select options={scopes} /></Form.Item>
      <Form.Item label="目标岗位" name="targetRole"><Input placeholder="例如：高级前端工程师" /></Form.Item>
      <Form.Item label="职位描述（JD）" name="jobDescription"><Input.TextArea rows={4} placeholder="可粘贴目标职位的职责和要求" /></Form.Item>
      <Form.Item label="补充描述" name="supplement" extra="可填写未覆盖的真实背景，或希望 AI 强调的方向；不会自动编造事实。"><Input.TextArea rows={4} placeholder="例如：突出 React、性能优化和跨团队协作经验。" /></Form.Item>
    </Form>
    {error && <Alert type="error" showIcon message={error} />}
  </Modal>;
}
