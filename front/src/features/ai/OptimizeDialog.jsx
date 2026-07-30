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

const technologyTerms = new Set(['accessibility', 'agile', 'ai', 'analytics', 'android', 'angular', 'api', 'architecture', 'aws', 'azure', 'backend', 'bootstrap', 'ci', 'cd', 'cloud', 'css', 'data', 'database', 'devops', 'docker', 'eslint', 'figma', 'frontend', 'git', 'github', 'go', 'graphql', 'html', 'ios', 'java', 'javascript', 'jenkins', 'jira', 'jquery', 'json', 'kubernetes', 'linux', 'mongodb', 'mysql', 'next', 'nextjs', 'nginx', 'node', 'nodejs', 'nosql', 'npm', 'php', 'postgresql', 'python', 'react', 'redis', 'rest', 'ruby', 'rust', 'scss', 'scrum', 'sql', 'svelte', 'swift', 'tailwind', 'terraform', 'testing', 'typescript', 'ui', 'ux', 'vue', 'webpack']);
const englishTerms = new Set(['communication', 'collaboration', 'design', 'engineering', 'leadership', 'management', 'optimization', 'performance', 'product', 'security']);

function getJdKeywords(jobDescription) {
  const seen = new Set();
  return (jobDescription.match(/[A-Za-z][A-Za-z0-9+#./-]*/g) || []).map(term => term.replace(/^[./-]+|[./-]+$/g, '')).filter(term => {
    const normalized = term.toLowerCase();
    return term.length > 1 && (technologyTerms.has(normalized) || englishTerms.has(normalized) || /^[A-Z]{2,}$/.test(term) || /[+#.]/.test(term));
  }).filter(term => {
    const normalized = term.toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  }).slice(0, 20);
}

export function OptimizeDialog({ open, data, llmConfig, initialScope = 'all', targetIndex, targetField, targetPointIndex, onClose, onOptimized }) {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const jobDescription = Form.useWatch('jobDescription', form) || '';
  const keywords = getJdKeywords(jobDescription);
  const resumeText = JSON.stringify(data).toLowerCase();
  const coveredKeywords = keywords.filter(keyword => resumeText.includes(keyword.toLowerCase()));
  const missingKeywords = keywords.filter(keyword => !resumeText.includes(keyword.toLowerCase()));
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
       {jobDescription && <Alert type="info" showIcon message={`JD 关键词覆盖：已覆盖 ${coveredKeywords.length}，待补充 ${missingKeywords.length}`} description={<div className="jd-keyword-coverage"><p>已覆盖：{coveredKeywords.length ? coveredKeywords.join('、') : '暂无'}</p><p>待补充：{missingKeywords.length ? missingKeywords.join('、') : '暂无'}</p><p>仅供手动核实和补充真实经历，不会自动写入简历或作为模型建议。</p></div>} />}
       <Form.Item label="补充描述" name="supplement" extra="可填写未覆盖的真实背景，或希望 AI 强调的方向；不会自动编造事实。"><Input.TextArea rows={4} placeholder="例如：突出 React、性能优化和跨团队协作经验。" /></Form.Item>
    </Form>
    {error && <Alert type="error" showIcon message={error} />}
  </Modal>;
}
